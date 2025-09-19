import express from 'express';
import User from '../models/User.js';
import Tweet from '../models/Tweet.js';
import Tag from '../models/Tag.js';
import CacheService from '../utils/cacheService.js';

const router = express.Router();

// Search users by username
router.get('/users/:currentUser/:searchUsername', async (req, res) => {
    try {
        const { currentUser, searchUsername } = req.params;

        const currentUserDoc = await User.findOne({ username: currentUser });
        if (!currentUserDoc) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        const matchedUsers = await User.find({ 
            username: { $regex: searchUsername, $options: 'i' } 
        }).select('-password');

        const userList = matchedUsers.map((user) => ({
            username: user.username,
            uid: user._id,
            about: user.about,
            following: user.followings.length,
            follower: user.followers.length,
            isFollowing: user.followers.includes(currentUserDoc._id),
            portraitUrl: user.portrait,
        }));
        
        res.json(userList);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search user by ID
router.get('/users/byid/:currentUser/:targetUserId', async (req, res) => {
    try {
        const { currentUser, targetUserId } = req.params;

        const currentUserDoc = await User.findOne({ username: currentUser });
        if (!currentUserDoc) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        const targetUserDoc = await User.findById(targetUserId).select('-password');
        if (!targetUserDoc) {
            return res.status(404).json({ error: 'Target user not found' });
        }

        const userInfo = {
            username: targetUserDoc.username,
            uid: targetUserDoc._id,
            about: targetUserDoc.about,
            following: targetUserDoc.followings.length,
            follower: targetUserDoc.followers.length,
            isFollowing: targetUserDoc.followers.includes(currentUserDoc._id),
            portraitUrl: targetUserDoc.portrait,
        };
        
        res.json([userInfo]);
    } catch (error) {
        console.error('Error finding target user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search tweets by tag
router.get('/tweets/bytag/:tag/:currentUser', async (req, res) => {
    try {
        const { tag, currentUser } = req.params;

        const currentUserDoc = await User.findOne({ username: currentUser });
        if (!currentUserDoc) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        // 尝试从缓存获取
        const cacheKey = `search_tag_${tag}_${currentUser}`;
        const cachedResults = await CacheService.get(cacheKey);
        if (cachedResults) {
            console.log('Tag search cache hit');
            return res.json(cachedResults);
        }

        const tweets = await Tweet.find({ tags: tag, private: false })
            .populate('poster')
            .exec();

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
            portraitUrl: tweet.poster.portrait,
            tags: tweet.tags,
            private: tweet.private,
        }));

        // 缓存搜索结果
        await CacheService.set(cacheKey, tweetList, 300); // 缓存5分钟
        console.log('Tag search results cached');

        res.json(tweetList);
    } catch (error) {
        console.error('Error searching tweets by tag:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search tweets by keyword
router.get('/tweets/bykeyword/:keyword/:currentUser', async (req, res) => {
    try {
        const { keyword, currentUser } = req.params;

        const currentUserDoc = await User.findOne({ username: currentUser });
        if (!currentUserDoc) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        // 尝试从缓存获取
        const cacheKey = `search_keyword_${keyword}_${currentUser}`;
        const cachedResults = await CacheService.get(cacheKey);
        if (cachedResults) {
            console.log('Keyword search cache hit');
            return res.json(cachedResults);
        }

        const tweets = await Tweet.find({
            tweet_content: { $regex: keyword, $options: 'i' },
            private: false,
        })
        .populate('poster', 'username portrait')
        .exec();

        const filteredTweets = tweets.filter((tweet) => tweet.poster !== null);

        const searchResults = filteredTweets.map((tweet) => ({
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
            portraitUrl: tweet.poster.portrait,
            tags: tweet.tags,
            private: tweet.private,
        }));

        // 缓存搜索结果
        await CacheService.set(cacheKey, searchResults, 300); // 缓存5分钟
        console.log('Keyword search results cached');

        res.json(searchResults);
    } catch (error) {
        console.error('Error searching tweets by keyword:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get trending topics/tags
router.get('/trends', async (req, res) => {
    try {
        // 尝试从缓存获取
        const cachedTrends = await CacheService.get('trending_topics');
        if (cachedTrends) {
            console.log('Trending topics cache hit');
            return res.json(cachedTrends);
        }

        const trendingTags = await Tag.aggregate([
            { $project: { tag: 1, tweetCount: { $size: '$tid' } } },
            { $sort: { tweetCount: -1 } },
            { $limit: 10 }
        ]);

        if (trendingTags.length === 0) {
            return res.status(404).json({ error: 'No trending tags found' });
        }

        // 缓存热门话题
        await CacheService.set('trending_topics', trendingTags, 1800); // 缓存30分钟
        console.log('Trending topics cached');
        
        res.json(trendingTags);
    } catch (error) {
        console.error('Error retrieving trending topics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Advanced search - combined search
router.get('/advanced', async (req, res) => {
    try {
        const { query, type, currentUser } = req.query;

        if (!query || !currentUser) {
            return res.status(400).json({ error: 'Query and currentUser are required' });
        }

        const currentUserDoc = await User.findOne({ username: currentUser });
        if (!currentUserDoc) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        let results = {};

        // 如果未指定类型或指定为all，则搜索所有类型
        if (!type || type === 'all') {
            // 搜索用户
            const users = await User.find({ 
                username: { $regex: query, $options: 'i' } 
            }).select('-password').limit(5);

            // 搜索推文
            const tweets = await Tweet.find({
                tweet_content: { $regex: query, $options: 'i' },
                private: false,
            })
            .populate('poster', 'username portrait')
            .limit(10);

            // 搜索标签
            const tags = await Tag.find({
                tag: { $regex: query, $options: 'i' }
            }).limit(5);

            results = {
                users: users.map(user => ({
                    username: user.username,
                    uid: user._id,
                    about: user.about,
                    portraitUrl: user.portrait
                })),
                tweets: tweets.filter(tweet => tweet.poster).map(tweet => ({
                    tid: tweet._id,
                    content: tweet.tweet_content,
                    username: tweet.poster.username,
                    portraitUrl: tweet.poster.portrait,
                    time: tweet.post_time,
                    tags: tweet.tags
                })),
                tags: tags.map(tag => ({
                    tag: tag.tag,
                    tweetCount: tag.tid ? tag.tid.length : 0
                }))
            };
        } else {
            // 根据指定类型搜索
            switch (type) {
                case 'users':
                    const users = await User.find({ 
                        username: { $regex: query, $options: 'i' } 
                    }).select('-password').limit(10);
                    results.users = users.map(user => ({
                        username: user.username,
                        uid: user._id,
                        about: user.about,
                        portraitUrl: user.portrait
                    }));
                    break;
                
                case 'tweets':
                    const tweets = await Tweet.find({
                        tweet_content: { $regex: query, $options: 'i' },
                        private: false,
                    })
                    .populate('poster', 'username portrait')
                    .limit(20);
                    results.tweets = tweets.filter(tweet => tweet.poster).map(tweet => ({
                        tid: tweet._id,
                        content: tweet.tweet_content,
                        username: tweet.poster.username,
                        portraitUrl: tweet.poster.portrait,
                        time: tweet.post_time,
                        tags: tweet.tags
                    }));
                    break;
                
                case 'tags':
                    const tags = await Tag.find({
                        tag: { $regex: query, $options: 'i' }
                    }).limit(10);
                    results.tags = tags.map(tag => ({
                        tag: tag.tag,
                        tweetCount: tag.tid ? tag.tid.length : 0
                    }));
                    break;
            }
        }

        res.json(results);
    } catch (error) {
        console.error('Error in advanced search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
