import express from 'express';
import Tweet from '../models/Tweet.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Tag from '../models/Tag.js';
import upload from '../middlewares/upload.js';
import CacheService from '../utils/cacheService.js';

const router = express.Router();

// Get all tweets (with caching)
router.get('/', async (req, res) => {
    try {
        // 先尝试从缓存中获取热门推文
        const cachedTweets = await CacheService.getHotTweets();
        if (cachedTweets) {
            console.log('Hot tweets cache hit');
            return res.json(cachedTweets);
        }
        
        // 缓存未命中，从数据库查询
        const tweets = await Tweet.find()
            .populate('poster', 'username portrait')
            .sort({ createdAt: -1 }) // 按创建时间倒序
            .limit(50); // 限制50条
            
        // 将推文存入缓存
        await CacheService.setHotTweets(tweets, 600); // 缓存10分钟
        console.log('Hot tweets cached');
        
        res.json(tweets);
    } catch (err) {
        console.error('Error fetching tweets:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get tweets for a specific user (recommended tweets)
router.get('/user/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const tweets = await Tweet.find({ private: false })
            .sort({ post_time: 'desc' })
            .populate({ path: 'poster', model: 'User', select: 'username portrait' });

        const filteredTweets = tweets.filter(tweet => tweet.poster && tweet.poster.username !== username);

        const recommendedTweets = filteredTweets.map(tweet => ({
            tid: tweet._id,
            likeInfo: {
                likeCount: tweet.likes.length,
                bLikeByUser: user.tweets_liked.includes(tweet._id),
            },
            dislikeInfo: {
                dislikeCount: tweet.dislike_counter,
                bDislikeByUser: user.tweets_disliked.includes(tweet._id),
            },
            retweetInfo: {
                retweetCount: tweet.retweets.length,
            },
            commentInfo: {
                commentCount: tweet.comments.length,
            },
            tweetContent: tweet.tweet_content,
            files: tweet.files,
            postTime: tweet.post_time,
            username: tweet.poster.username,
            portraitUrl: tweet.poster.portrait,
            tags: tweet.tags,
            reportCounter: tweet.report_counter,
        }));

        res.json(recommendedTweets);
    } catch (err) {
        console.error('Error fetching user tweets:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new tweet
router.post('/', upload.array('files'), async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(404).json({ error: 'User does not exist' });
        }

        const uid = user._id;
        const time = new Date();
        const filesPaths = req.files ? req.files.map(file => file.path) : [];
        
        const tweet = {
            poster: uid,
            tweet_content: req.body.tweet_content,
            files: filesPaths,
            tags: req.body.tags || [],
            dislike_counter: 0,
            report_counter: 0,
            post_time: time,
            likes: [],
            comments: [],
            retweets: [],
            private: req.body.private || false
        };

        const tags = req.body.tags || [];
        const tagList = await Tag.find({ tag: { $in: tags } });
        const createdTweet = await Tweet.create(tweet);
        
        user.tweets.push(createdTweet._id);
        
        tagList.forEach(tag => {
            tag.tid.push(createdTweet._id);
            tag.save();
        });
        
        await user.save();
        
        // 清除相关缓存
        await CacheService.clearHotTweets();
        
        console.log("New tweet created successfully");
        res.status(201).json({ message: 'Tweet created successfully', tweetId: createdTweet._id });
    } catch (err) {
        console.error('Error creating tweet:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get tweet details
router.get('/:tid/:username', async (req, res) => {
    try {
        const tid = req.params.tid;
        const username = req.params.username;

        const tweet = await Tweet.findById(tid).populate('poster');
        if (!tweet) {
            return res.status(404).json({ error: 'Tweet not found' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const tweetDetail = {
            tid: tweet._id,
            likeInfo: {
                likeCount: tweet.likes.length,
                bLikeByUser: user.tweets_liked.includes(tweet._id),
            },
            dislikeInfo: {
                dislikeCount: tweet.dislike_counter,
                bDislikeByUser: user.tweets_disliked.includes(tweet._id),
            },
            retweetInfo: {
                retweetCount: tweet.retweets.length,
            },
            commentInfo: {
                commentCount: tweet.comments.length,
            },
            tweetContent: tweet.tweet_content,
            files: tweet.files,
            postTime: tweet.post_time,
            username: tweet.poster.username,
            portraitUrl: tweet.poster.portrait,
            tags: tweet.tags,
            reportCounter: tweet.report_counter,
        };

        res.json(tweetDetail);
    } catch (err) {
        console.error('Error fetching tweet details:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Like a tweet
router.put('/:tid/:username/like', async (req, res) => {
    try {
        const tid = req.params.tid;
        const username = req.params.username;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User does not exist' });
        }

        const tweet = await Tweet.findById(tid).populate('poster').exec();
        if (!tweet) {
            return res.status(404).json({ error: 'Tweet does not exist' });
        }

        const time = new Date();

        // Check if the user has already liked the tweet
        const likedTweets = user.tweets_liked || [];
        if (likedTweets.includes(tid)) {
            return res.status(400).json({ error: 'User has already liked this tweet' });
        }

        user.tweets_liked.push(tweet._id);
        tweet.likes.push({ username: username, time: time });

        // Remove from the dislike list if disliked before
        if (user.tweets_disliked && user.tweets_disliked.includes(tweet._id)) {
            user.tweets_disliked.remove(tweet._id);
            tweet.dislike_counter--;
        }

        const ret = {
            likeInfo: { 
                likeCount: tweet.likes.length, 
                bLikeByUser: user.tweets_liked.includes(tweet._id) 
            },
            dislikeInfo: { 
                dislikeCount: tweet.dislike_counter, 
                bDislikeByUser: user.tweets_disliked.includes(tweet._id) 
            }
        };

        await user.save();
        await tweet.save();

        // Create notification
        await Notification.create({
            username: tweet.poster.username,
            actor_id: user._id,
            action: "like",
            tid: tweet._id,
            time: new Date()
        });

        res.status(200).json(ret);
    } catch (err) {
        console.error('Error liking tweet:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Cancel like a tweet
router.put('/:tid/:username/cancel-like', async (req, res) => {
    try {
        const tid = req.params.tid;
        const username = req.params.username;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User does not exist' });
        }

        const tweet = await Tweet.findById(tid);
        if (!tweet) {
            return res.status(404).json({ error: 'Tweet does not exist' });
        }

        // Check if user has liked the tweet
        if (!user.tweets_liked.includes(tid)) {
            return res.status(400).json({ error: 'User has not liked this tweet' });
        }

        user.tweets_liked.remove(tid);
        tweet.likes = tweet.likes.filter(like => like.username !== username);

        const ret = {
            likeInfo: { 
                likeCount: tweet.likes.length, 
                bLikeByUser: user.tweets_liked.includes(tweet._id) 
            },
            dislikeInfo: { 
                dislikeCount: tweet.dislike_counter, 
                bDislikeByUser: user.tweets_disliked.includes(tweet._id) 
            }
        };

        await user.save();
        await tweet.save();

        res.status(200).json(ret);
    } catch (err) {
        console.error('Error canceling like:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Dislike a tweet
router.put('/:tid/:username/dislike', async (req, res) => {
    try {
        const tid = req.params.tid;
        const username = req.params.username;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User does not exist' });
        }

        const tweet = await Tweet.findById(tid);
        if (!tweet) {
            return res.status(404).json({ error: 'Tweet does not exist' });
        }

        // Check if user has already disliked
        if (user.tweets_disliked && user.tweets_disliked.includes(tid)) {
            return res.status(400).json({ error: 'User has already disliked this tweet' });
        }

        // Initialize disliked array if doesn't exist
        if (!user.tweets_disliked) {
            user.tweets_disliked = [];
        }

        user.tweets_disliked.push(tweet._id);
        tweet.dislike_counter++;

        // Remove from like list if liked before
        if (user.tweets_liked.includes(tweet._id)) {
            user.tweets_liked.remove(tweet._id);
            tweet.likes = tweet.likes.filter(like => like.username !== username);
        }

        const ret = {
            likeInfo: { 
                likeCount: tweet.likes.length, 
                bLikeByUser: user.tweets_liked.includes(tweet._id) 
            },
            dislikeInfo: { 
                dislikeCount: tweet.dislike_counter, 
                bDislikeByUser: user.tweets_disliked.includes(tweet._id) 
            }
        };

        await user.save();
        await tweet.save();

        res.status(200).json(ret);
    } catch (err) {
        console.error('Error disliking tweet:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Cancel dislike a tweet
router.put('/:tid/:username/cancel-dislike', async (req, res) => {
    try {
        const tid = req.params.tid;
        const username = req.params.username;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User does not exist' });
        }

        const tweet = await Tweet.findById(tid);
        if (!tweet) {
            return res.status(404).json({ error: 'Tweet does not exist' });
        }

        // Check if user has disliked the tweet
        if (!user.tweets_disliked || !user.tweets_disliked.includes(tid)) {
            return res.status(400).json({ error: 'User has not disliked this tweet' });
        }

        user.tweets_disliked.remove(tid);
        tweet.dislike_counter--;

        const ret = {
            likeInfo: { 
                likeCount: tweet.likes.length, 
                bLikeByUser: user.tweets_liked.includes(tweet._id) 
            },
            dislikeInfo: { 
                dislikeCount: tweet.dislike_counter, 
                bDislikeByUser: user.tweets_disliked.includes(tweet._id) 
            }
        };

        await user.save();
        await tweet.save();

        res.status(200).json(ret);
    } catch (err) {
        console.error('Error canceling dislike:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add comment to tweet
router.post('/comment', async (req, res) => {
    try {
        const { tid, username, content } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User does not exist' });
        }

        const tweet = await Tweet.findById(tid).populate('poster');
        if (!tweet) {
            return res.status(404).json({ error: 'Tweet does not exist' });
        }

        // Check if the user is blocked by the poster or blocks poster
        if (tweet.poster.users_blocked && tweet.poster.users_blocked.includes(user._id)) {
            return res.status(403).json({ error: 'You have been blocked by the poster' });
        }
        if (user.users_blocked && user.users_blocked.includes(tweet.poster._id)) {
            return res.status(403).json({ error: 'You have blocked the poster' });
        }

        const time = new Date();
        const floor_num = tweet.comments ? tweet.comments.length + 1 : 1;

        const new_comment = {
            user: user._id,
            portrait: user.portrait,
            content: content,
            time: time,
            floor: floor_num
        };

        const new_comment_res = {
            username: user.username,
            portrait: user.portrait,
            content: content,
            time: time,
            floor: floor_num
        };

        if (!tweet.comments) {
            tweet.comments = [];
        }
        tweet.comments.push(new_comment);
        await tweet.save();

        // Create notification
        await Notification.create({
            username: tweet.poster.username,
            actor_id: user._id,
            action: "comment",
            tid: tweet._id,
            time: new Date()
        });

        res.status(201).json(new_comment_res);
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get comments for a tweet
router.get('/:tid/comments', async (req, res) => {
    try {
        const tid = req.params.tid;

        const tweet = await Tweet.findById(tid).populate({
            path: 'comments.user',
            select: 'username portrait'
        });

        if (!tweet) {
            return res.status(404).json({ error: 'Tweet not found' });
        }

        const comments = tweet.comments.map(comment => ({
            username: comment.user.username,
            portrait: comment.user.portrait,
            content: comment.content,
            time: comment.time,
            floor: comment.floor
        }));

        res.json(comments);
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Retweet
router.post('/retweet', async (req, res) => {
    try {
        const { tid: parent_tid, username, tweet_content, tags, private: isPrivate } = req.body;
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User does not exist' });
        }

        const tweet = await Tweet.findById(parent_tid).populate('poster').exec();
        if (!tweet) {
            return res.status(404).json({ error: 'Original tweet not found' });
        }

        // Check if blocked
        if (tweet.poster.users_blocked && tweet.poster.users_blocked.includes(user._id)) {
            return res.status(403).json({ error: 'You have been blocked by the poster' });
        }
        if (user.users_blocked && user.users_blocked.includes(tweet.poster._id)) {
            return res.status(403).json({ error: 'You have blocked the poster' });
        }

        const time = new Date();
        const new_tweet = {
            poster: user._id,
            tweet_content: `${tweet_content} RT @${tweet.poster.username}:${tweet.tweet_content}`,
            tags: tags || [],
            dislike_counter: 0,
            report_counter: 0,
            post_time: time,
            likes: [],
            comments: [],
            retweets: [],
            private: isPrivate || false,
        };

        const new_tweet_ = await Tweet.create(new_tweet);

        user.tweets.push(new_tweet_._id);
        await user.save();
        
        tweet.retweets.push(new_tweet_._id);
        await tweet.save();

        // Create notification
        await Notification.create({
            username: tweet.poster.username,
            actor_id: user._id,
            action: 'retweet',
            tid: parent_tid,
            time: new Date(),
        });

        // Clear cache
        await CacheService.clearHotTweets();

        res.status(201).json({ message: 'Retweet successful', tweetId: new_tweet_._id });
    } catch (err) {
        console.error('Error retweeting:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
