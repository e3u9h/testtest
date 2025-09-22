import express from 'express';
const router = express.Router();
import User from "../models/User.js";
import upload from '../middlewares/upload.js';
import Account from '../models/Account.js';
import CacheService from "../utils/cacheService.js";
router.use('/uploads', express.static('uploads'))

// get the portrait of the user
router.get('/portrait/:username', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const username = req.params['username'];
    User.findOne({ 'username': username }, 'portrait -_id').exec().then((user) => {
        console.log(user);
        if (user) {
            console.log(user['portrait']);
            // 转换Windows路径为URL友好格式
            const portraitPath = user['portrait'] ? user['portrait'].replace(/\\/g, '/') : '';
            res.send(portraitPath);
        }
        else {
            console.log("no such user");
            res.sendStatus(404);
        }
    }).catch((err) => {
        console.log(err);
        res.send(err);
    });
});

// get the information of the target user
router.get('/:username', async (req, res) => {
    res.set('Content-Type', 'text/plain');
    const username = req.params['username'];
    
    try {
        // 先尝试从缓存中获取用户信息
        const cachedUser = await CacheService.getUserProfile(username);
        if (cachedUser) {
            console.log(`User profile cache hit: ${username}`);
            // 确保返回的头像路径使用正斜杠
            if (cachedUser.portrait) {
                cachedUser.portrait = cachedUser.portrait.replace(/\\/g, '/');
            }
            return res.send(cachedUser);
        }
        
        // 缓存未命中，从数据库查询
        const user = await User.findOne({ 'username': username });
        if (user) {
            // 转换头像路径为URL友好格式
            if (user.portrait) {
                user.portrait = user.portrait.replace(/\\/g, '/');
            }
            
            // 将用户信息存入缓存
            await CacheService.setUserProfile(username, user, 1800); // 缓存30分钟
            console.log(`User profile cached: ${username}`);
        }
        res.send(user);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

// get the action information about the relationship between self and the target user
router.get('/:username/:targetname/actioninfo', (req, res) => {
    res.set('Content-Type', 'text/plain');
    User.findOne({ 'username': req.params['username'] }).then((user) => {
        User.findOne({ 'username': req.params['targetname'] }).then((target) => {
            const isFollowing = user.followings.includes(target._id);
            const isBlocking = user.users_blocked.includes(target._id);
            const isBlocked = target.users_blocked.includes(user._id);
            const hasReported = user.users_reported.includes(target._id);
            const actionInfo = {
                "_id": user._id,
                "isFollowing": isFollowing,
                "isBlocking": isBlocking,
                "isBlocked": isBlocked,
                "hasReported": hasReported
            }
            res.send(actionInfo);
        });
    }).catch((err) => {
        console.log(err);
        res.send(err);
    });
});

// edit profile; use the "upload" middleware to upload the portrait first, which returns the path of the saved portrait;
// save the path to the database
router.put('/:username', upload.single('portrait'), (req, res) => {
    res.set('Content-Type', 'text/plain');
    const username = req.params['username'];
    const updateGender = req.body.gender;
    // 将 Windows 路径的反斜杠转换为正斜杠，确保URL兼容性
    const updatePortrait = req.file ? req.file.path.replace(/\\/g, '/') : '';
    const updateAbout = req.body.about;

    User.findOne({ 'username': username }).then((user) => {
        user.gender = updateGender;
        if (updatePortrait !== '')
            user.portrait = updatePortrait;
        if (updateAbout !== '')
            user.about = updateAbout;
        user.save();
        res.status(200).send(JSON.stringify(user));
    }).catch((err) => {
        console.log(err);
        res.send(err);
    });
});
/**************/
/****Tweets****/
/**************/

// get tweets posted
router.get('/:self/:target/tweets', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let self = req.params['self'];
    let target = req.params['target'];
    let retTweets = [];
    // if the self and target are the same, return all tweets; otherwise, return only public tweets
    let matchCondition = (self === target) ? {} : { 'private': 'false' };
    if (self !== target) {
        // if the self is different from the target but self is an admin, return all tweets as well
        Account.findOne({ username: self }).then((acc) => {
            if(acc.identity === 'admin') matchCondition = {};
        });
    }
    User.findOne({ 'username': target }).populate({ path: 'tweets', match: matchCondition }).exec().then((target) => {
        User.findOne({ 'username': self }).then((user) => {
            target.tweets.forEach(tweet => {
                console.log(user)
                // if the user is not found in User Database, it indicates that the user is an admin,
                // so isLiked and isDisliked are set false; 
                // otherwise, check if the user has liked or disliked this tweet
                let isLiked = false;
                let isDisliked = false;
                if (user !== null) {
                    isLiked = user.tweets_liked.includes(tweet._id);
                    isDisliked = user.tweets_disliked.includes(tweet._id)
                }
                let tweetObj = {
                    "tid": tweet['_id'],
                    "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": isLiked },
                    "dislikeInfo": { "dislikeCount": tweet['dislike_counter'], "bDislikeByUser": isDisliked },
                    "user": { "uid": target['_id'], 'username': target['username'] },
                    "content": tweet['tweet_content'],
                    "files": tweet['files'],
                    "commentCount": tweet['comments'].length,
                    "retweetCount": tweet['retweets'].length,
                    "time": tweet['post_time'],
                    "portraitUrl": target['portrait'],
                    "tags": tweet['tags'],
                    'private': tweet['private']
                }
                console.log("here", tweetObj)
                retTweets.push(tweetObj);
            });
            console.log('hereget posted tweets success')
            console.log(retTweets)
            return res.status(200).send(retTweets);
        });
    }).catch((err) => {
        console.log(err);
        return res.send(err);
    })
});


// get tweets liked
router.get('/:username/likes', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let username = req.params['username'];
    User.findOne({ 'username': username }).populate({ path: 'tweets_liked', populate: { path: 'poster' } }).exec().then((user) => {
        let retLikes = []
        user.tweets_liked.forEach(tweet => {
            if (tweet['poster'] === null) {
                console.log("Warning: tweet with id " + tweet['_id'] + " has no poster");
                return;
            }
            let isReported = false;
            if (user.tweets_reported.includes(tweet._id)) {
                isReported = true;
            }
            let tweetObj = {
                "tid": tweet['_id'],
                "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": true },
                "dislikeInfo": { "dislikeCount": tweet['dislike_counter'], "bDislikeByUser": false },
                "user": { "uid": tweet['poster']['_id'], 'username': tweet['poster']['username'] },
                "content": tweet['tweet_content'],
                "files": tweet['files'],
                "commentCount": tweet['comments'].length,
                "retweetCount": tweet['retweets'].length,
                "isReported": isReported,
                "time": tweet['post_time'],
                "portraitUrl": tweet['poster']['portrait'],
                "tags": tweet['tags']
            }
            // console.log(tweetObj);
            retLikes.push(tweetObj);
        });
        res.send(retLikes);
    }).catch((err) => {
        console.log(err);
        res.send(err);
    });
});

export default router;