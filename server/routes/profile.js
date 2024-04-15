import express from 'express';
const router = express.Router();
import User from "../models/User.js";
import upload from '../middlewares/upload.js';
router.use('/uploads', express.static('uploads'))

router.get('/portrait/:username', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const username = req.params['username'];
    User.findOne({ 'username': username }, 'portrait -_id').exec().then((user) => {
        console.log(user);
        if (user) {
            console.log(user['portrait']);
            res.send(user['portrait']);
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

router.get('/:username', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const username = req.params['username'];
    User.findOne({ 'username': username }).populate('tweets').exec().then((user) => {
        let userObj = null;
        if (user != null && user != '') {
            userObj = {
                'uid': user['_id'],
                'username': user['username'],
                'gender': user['gender'],
                'follower_counter': user['follower_counter'],
                'following_counter': user['following_counter'],
                'users_blocked': user['users_blocked'],
                'users_reported': user['users_reported'],
                'about': user['about'],
                'portrait': user['portrait']
            }
        }
        res.send(userObj);
    }).catch((err) => {
        console.log(err);
        res.send(err);
    });
});

router.get('/:username/actioninfo', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let username = req.params['username'];
    User.findOne({ 'username': username }).then((user) => {
        let userObj = {
            'uid': user['_id'],
            'username': user['username'],
            'followings': user['followings'],
            'users_blocked': user['users_blocked'],
            'users_reported': user['users_reported']
        }
        res.send(userObj);
    }).catch((err) => {
        console.log(err);
        res.send(err);
    });
});

// edit profile
router.put('/:username', upload.single('portrait'), (req, res) => {
    res.set('Content-Type', 'text/plain');
    const username = req.params['username'];
    const updateGender = req.body.gender;
    const updatePortrait = req.file ? req.file.path : '';
    const updateAbout = req.body.about;

    User.findOne({ 'username': username }).then((user) => {
        if (updateGender != '')
            user.gender = updateGender;
        if (updatePortrait != '')
            user.portrait = updatePortrait;
        if (updateAbout != '')
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

// get tweets posted (user mode)
router.get('/:self/:target/tweets', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let self_ = req.params['self'];
    let target = req.params['target'];
    let retTweets = [];
    if (self_ != null && self_ != '' && self_ == target) {
        User.findOne({ 'username': self_ }).populate({ path: 'tweets' }).exec().then((self) => {
            console.log('self found');
            self.tweets.forEach(tweet => {
                let isReported = false;
                let isLiked = false;
                let isDisliked = false;
                if (self.tweets_liked.includes(tweet._id)) {
                    isLiked = true;
                }
                if (self.tweets_disliked.includes(tweet._id)) {
                    isDisliked = true;
                }
                if (self.tweets_reported.includes(tweet._id)) {
                    isReported = true;
                }
                let tweetObj = {
                    "tid": tweet['_id'],
                    "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": isLiked },
                    "dislikeInfo": { "dislikeCount": tweet['dislike_counter'], "bDislikeByUser": isDisliked },
                    "user": { "uid": self['_id'], 'username': self['username'] },
                    "content": tweet['tweet_content'],
                    "files": tweet['files'],
                    "commentCount": tweet['comments'].length,
                    "retweetCount": tweet['retweets'].length,
                    "isReported": isReported,
                    "time": tweet['post_time'],
                    "portraitUrl": self['portrait'],
                    "tags": tweet['tags'],
                    'private': tweet['private']
                }
                retTweets.push(tweetObj);
                // console.log(tweetObj)
            });

            console.log('get self tweets success')
            return res.status(200).send(retTweets);
        }).catch((err) => {
            return res.send(err);
        })
    }
    else if (self_ != null && self_ != '' && self_ != target) {
        User.findOne({ 'username': target }).populate({ path: 'tweets', match: { 'private': 'false' } }).exec().then((user) => {
            user.tweets.forEach(tweet => {
                let isReported = false;
                let isLiked = false;
                let isDisliked = false;
                if (user.tweets_liked.includes(tweet._id)) {
                    isLiked = true;
                }
                if (user.tweets_disliked.includes(tweet._id)) {
                    isDisliked = true;
                }
                if (user.tweets_reported.includes(tweet._id)) {
                    isReported = true;
                }
                let tweetObj = {
                    "tid": tweet['_id'],
                    "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": isLiked },
                    "dislikeInfo": { "dislikeCount": tweet['dislike_counter'], "bDislikeByUser": isDisliked },
                    "user": { "uid": user['_id'], 'username': user['username'] },
                    "content": tweet['tweet_content'],
                    "files": tweet['files'],
                    "commentCount": tweet['comments'].length,
                    "retweetCount": tweet['retweets'].length,
                    "isReported": isReported,
                    "time": tweet['post_time'],
                    "portraitUrl": user['portrait'],
                    "tags": tweet['tags'],
                    'private': tweet['private']
                }
                retTweets.push(tweetObj);
            });
            console.log('get other tweets success')
            return res.status(200).send(retTweets);
        }).catch((err) => {
            return res.send(err);
        })
    }
});

// get tweets posted (admin mode)
router.get('/:target/tweets', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let target = req.params['target'];
    User.findOne({ 'username': target }).populate('tweets').exec().then((user) => {
        let retTweets = [];
        if (user != null && user != '') {
            user.tweets.forEach(tweet => {
                let tweetObj = {
                    "tid": tweet['_id'],
                    "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": false },
                    "dislikeInfo": { "dislikeCount": tweet['dislike_counter'], "bDislikeByUser": false },
                    "user": { "uid": user['_id'], 'username': user['username'] },
                    "content": tweet['tweet_content'],
                    "files": tweet['files'],
                    "commentCount": tweet['comments'].length,
                    "retweetCount": tweet['retweets'].length,
                    "isReported": false,
                    "time": tweet['post_time'],
                    "portraitUrl": user['portrait'],
                    "tags": tweet['tags']
                }
                retTweets.push(tweetObj);
            });
            res.send(retTweets);
        }
    }).catch((err) => {
        console.log(err);
        res.send(err);
    });
});

// get tweets liked
router.get('/:username/likes', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let username = req.params['username'];
    User.findOne({ 'username': username }).populate({ path: 'tweets_liked', populate: { path: 'poster' } }).exec().then((user) => {
        let retLikes = []
        user.tweets_liked.forEach(tweet => {
            if (tweet['poster'] == null) {
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
        // sort according to the post time
        retLikes.sort((a, b) => {
            let time1 = new Date(a.time);
            let time2 = new Date(b.time);
            return time2 - time1;
        });

        res.send(retLikes);
    }).catch((err) => {
        console.log(err);
        res.send(err);
    });
});

export default router;