import express from 'express';
import Tag from '../models/Tag.js';
import Tweet from '../models/Tweet.js';
import User from '../models/User.js';
import CacheService from '../utils/cacheService.js';

const router = express.Router();

// Helper function to normalize file paths for URLs
const normalizePathForUrl = (path) => {
    return path ? path.replace(/\\/g, '/') : '';
};

// Get all tags
router.get('/', async (req, res) => {
    try {
        // 尝试从缓存获取
        const cachedTags = await CacheService.get('all_tags');
        if (cachedTags) {
            console.log('Tags cache hit');
            return res.json(cachedTags);
        }

        const tags = await Tag.find();
        
        // 缓存标签列表
        await CacheService.set('all_tags', tags, 600); // 缓存10分钟
        console.log('Tags cached');
        
        res.json(tags);
    } catch (err) {
        console.error('Error fetching tags:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Check if tag exists
router.get('/:tagname', async (req, res) => {
    try {
        const tagname = req.params.tagname;
        
        const tag = await Tag.findOne({ tag: tagname });
        if (!tag) {
            return res.status(404).json({ error: 'Tag does not exist' });
        }
        
        res.json({ message: 'Tag exists', tag: tag });
    } catch (err) {
        console.error('Error checking tag:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new tag
router.post('/', async (req, res) => {
    try {
        const { tag: tagName } = req.body;
        
        if (!tagName) {
            return res.status(400).json({ error: 'Tag name is required' });
        }

        const tag = await Tag.create({ tag: tagName });
        
        // 清除标签缓存
        await CacheService.del('all_tags');
        
        console.log("Tag created successfully");
        res.status(201).json({ message: 'Tag created successfully', tag: tag });
    } catch (err) {
        if (err.code === 11000) {
            console.log("Tag already exists");
            return res.status(409).json({ error: 'Tag already exists' });
        } else {
            console.error("Error creating tag:", err);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Search tweets by tag
router.get('/:tag/tweets/:currentUser', async (req, res) => {
    try {
        const { tag, currentUser } = req.params;

        const currentUserDoc = await User.findOne({ username: currentUser });
        if (!currentUserDoc) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        // 尝试从缓存获取标签相关的推文
        const cacheKey = `tag_tweets_${tag}`;
        const cachedTweets = await CacheService.get(cacheKey);
        
        let tweets;
        if (cachedTweets) {
            console.log('Tag tweets cache hit');
            tweets = cachedTweets;
        } else {
            tweets = await Tweet.find({ tags: tag, private: false })
                .populate('poster')
                .exec();
            
            // 缓存标签推文
            await CacheService.set(cacheKey, tweets, 300); // 缓存5分钟
            console.log('Tag tweets cached');
        }

        const filteredTweets = tweets.filter((tweet) => tweet.poster !== null);

        if (filteredTweets.length === 0) {
            return res.status(404).json({ error: 'No tweets found for this tag' });
        }

        const tweetList = filteredTweets.map((tweet) => ({
            tid: tweet._id,
            likeInfo: {
                likeCount: tweet.likes.length,
                bLikeByUser: currentUserDoc.tweets_liked.includes(tweet._id),
            },
            dislikeInfo: {
                dislikeCount: tweet.dislike_counter,
                bDislikeByUser: currentUserDoc.tweets_disliked.includes(tweet._id),
            },
            user: {
                uid: tweet.poster._id,
                username: tweet.poster.username,
            },
            content: tweet.tweet_content,
            files: tweet.files,
            commentCount: tweet.comments.length,
            retweetCount: tweet.retweets.length,
            time: tweet.post_time,
            portraitUrl: normalizePathForUrl(tweet.poster.portrait),
            tags: tweet.tags,
            private: tweet.private,
        }));

        res.json(tweetList);
    } catch (error) {
        console.error('Error searching tweets by tag:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get tag statistics
router.get('/:tagname/stats', async (req, res) => {
    try {
        const tagname = req.params.tagname;
        
        const tag = await Tag.findOne({ tag: tagname });
        if (!tag) {
            return res.status(404).json({ error: 'Tag does not exist' });
        }

        const tweetCount = await Tweet.countDocuments({ tags: tagname, private: false });
        
        const stats = {
            tagName: tag.tag,
            totalTweets: tweetCount,
            createdAt: tag.createdAt,
            linkedTweets: tag.tid ? tag.tid.length : 0
        };

        res.json(stats);
    } catch (err) {
        console.error('Error getting tag stats:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get trending tags
router.get('/trending/list', async (req, res) => {
    try {
        // 尝试从缓存获取热门标签
        const cachedTrending = await CacheService.get('trending_tags');
        if (cachedTrending) {
            console.log('Trending tags cache hit');
            return res.json(cachedTrending);
        }

        // 获取所有标签并计算推文数量
        const tags = await Tag.find();
        const tagStats = await Promise.all(
            tags.map(async (tag) => {
                const tweetCount = await Tweet.countDocuments({ 
                    tags: tag.tag, 
                    private: false,
                    post_time: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // 最近7天
                });
                return {
                    tag: tag.tag,
                    tweetCount: tweetCount,
                    totalLinked: tag.tid ? tag.tid.length : 0
                };
            })
        );

        // 按推文数量排序，取前10个
        const trendingTags = tagStats
            .sort((a, b) => b.tweetCount - a.tweetCount)
            .slice(0, 10);

        // 缓存热门标签
        await CacheService.set('trending_tags', trendingTags, 1800); // 缓存30分钟
        console.log('Trending tags cached');

        res.json(trendingTags);
    } catch (err) {
        console.error('Error getting trending tags:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
