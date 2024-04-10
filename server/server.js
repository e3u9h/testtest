import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Account from './models/Account.js';
import Tweet from './models/Tweet.js';
import User from './models/User.js';
import Notification from './models/Notification.js';
import Tag from './models/Tag.js';
import Message from './models/Message.js';
import upload from './upload.js';
import conversationRoute from "./routes/conversations.js";
import messageRoute from "./routes/messages.js";

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'))
app.use('/img', express.static('img'))
app.use("/server/conversations", conversationRoute);
app.use("/server/messages", messageRoute);


//Connect to MongoDB
// const uri = "mongodb+srv://dufz2003:4321qwer@cluster0.tkqscce.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const url = "mongodb+srv://qwerty:qwer4321@cluster0.5gm5w78.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
console.log("Connecting to MongoDB\n");
mongoose.connect(uri) 
    .then(() => {
        console.log("Connected to MongoDB\n");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB\n\n", error);
      });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log("Connection is open...");
});
// 在这里添加后端各种function
/**********/
/* log in */
/**********/
app.post('/createuser', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const _username = req.body['username'];
    Account.findOne({ username: _username }).then((acc) => {
        if (acc) { console.log(acc); return res.status(401).send("The username has already been used. Please change a username."); }
        else {
            Account.create({
                username: req.body['newusername'],
                pwd: req.body['newpwd'],
                identity: 'user'
            }).then(() => {
                const default_portrait = "./img/defaultPortrait.jpg"
                let gender = ''
                if (req.body['gender'] !== 'NottoSpecify') {
                    gender = req.body['gender']
                }
                let user = {
                    username: req.body['newusername'],
                    gender: gender,
                    interest: [],
                    about: '',
                    follower_counter: 0,
                    following_counter: 0,
                    tweets: [],
                    follows: [],
                    followings: [],
                    tweets_reported: [],
                    users_reported: [],
                    users_blocked: [],
                    report_counter: 0,
                    tweets_liked: [],
                    tweets_disliked: [],
                    portrait: default_portrait
                }
                User.create(user).then((user) => {
                    console.log(user);
                    res.status(201).send("User created successfully");
                })
            }).catch((err) => {
                if (err.code === 11000) {
                    return res.status(401).send("The username has already existed. Please change a username.");
                }
                console.log(err);
                return res.status(400).send(err);
            });
        }
    });
});

app.post('/login/user', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const _username = req.body['username'];
    const _pwd = req.body['pwd'];
    Account.findOne({ username: _username }).then((val) => {
        if (!val) {
            res.status(404).send("Username does not exist.");
        }
        else {
            if (val.identity === 'user') {
                if (val && _pwd === val.pwd) {
                    res.status(201).send('Login As User Successfully!\n');
                }
                else {
                    console.log("incorrect");
                    res.status(401).send("Incorrect Username or Password.\n");
                }
            }
            if (val.identity === 'admin') {
                if (val && _pwd === val.pwd) {
                    res.status(200).send('Login As Admin Successfully!\n');
                }
                else {
                    res.status(401).send("Incorrect Username or Password.\n");
                }
            }
        }
    }).catch((err) => {
        res.send(err);
    });
});

app.get('/portrait/:username', (req, res) => {
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

app.get('/profile/:username', (req, res) => {
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

app.get('/profile/:username/actioninfo', (req, res) => {
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
        // console.log(userObj);
        res.send(userObj);
    }).catch((err) => {
        console.log(err);
        res.send(err);
    });
});

app.put('/profile/:username', upload.single('portrait'), (req, res) => {
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
app.get('/profile/:self/:target/tweets', (req, res) => {
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
app.get('/profile/:target/tweets', (req, res) => {
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
app.get('/profile/:username/likes', (req, res) => {
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

/***********/
/***Main****/
/***********/




//get a user
app.get("/auser/:userId", async (req, res) => {
    const userId = req.params.userId; 
    try {
      const user = await User.findById(userId);
      if (user) {
        const { password, ...other } = user._doc;
        res.status(200).json(other);
      } else {
        res.status(600).json({ message: "User not foundddddd" });
      }
    } catch (err) {
      res.status(500).json(err); 
    }
  });


// get all tweets
app.get('/tweets', (req, res) => {
    res.set('Content-Type', 'text/plain');
    Tweet.find().then((tweets) => {
        res.send(tweets);
    }).catch((err) => {
        res.send(err);
    });
});

// get all users
app.get('/users', (req, res) => {
    res.set('Content-Type', 'text/plain');
    User.find().then((users) => {
        res.send(users);
    }).catch((err) => {
        res.send(err);
    });
});

// get all users except for current user
app.get('/users/:username', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let username = req.params['username'];
    User.find({ 'username': { $ne: username } }).then((users) => {
        User.findOne({ 'username': username }).then((currUser) => {
            let retUsers = users.map(user => {
                return {
                    "username": user['username'],
                    "uid": user['_id'],
                    "following": user['followings'].length,
                    "follower": user['followers'].length,
                    "isFollowing": currUser['followings'].includes(user['_id']),
                    "portraitUrl": user['portrait']
                }
            });
            retUsers = retUsers.filter(user => {
                return user.isFollowing === false;
            });
            console.log("Get recommended users");
            res.status(200).send(retUsers);
        });
    }).catch((err) => {
        res.status(404).send(err);
    });
});

// get recommended tweets for the user
app.get('/tweets/:username', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let username = req.params['username'];
    // find all the tweets except for the user's tweets
    // sort tweets by post time (newest first)
    Tweet.find({ 'private': 'false' }).sort({ post_time: 'desc' }).populate(
        { path: "poster", model: "User", select: "username portrait" }).then((tweets) => {
            tweets = tweets.filter((tweet) => {
                return tweet.poster != null && tweet.poster.username !== username;
            });
            User.findOne({ "username": username }).then((user) => {
                let retTweets = tweets.map(tweet => {
                    return {
                        "tid": tweet['_id'],
                        "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": user['tweets_liked'].includes(tweet['_id']) },
                        "dislikeInfo": { "dislikeCount": tweet['dislike_counter'], "bDislikeByUser": user['tweets_disliked'].includes(tweet['_id']) },
                        "isReported": user['tweets_reported'].includes(tweet['_id']),
                        "user": { "uid": tweet['poster']['_id'], 'username': tweet['poster']['username'] },
                        "content": tweet['tweet_content'],
                        "files": tweet['files'],
                        "commentCount": tweet['comments'].length,
                        "retweetCount": tweet['retweets'].length,
                        "time": tweet['post_time'],
                        "portraitUrl": tweet['poster']['portrait'],
                        "tags": tweet['tags'],
                        "private": tweet['private']
                    }
                });
                console.log("---Get recommended tweets---");
                res.status(200).send(retTweets);
            });
        }).catch((err) => {
            console.log("---Recommended tweets error---");
            console.log(err);
            return res.status(404).send(err);
        });
});

// get all the followings' tweets of the user (including the own posts)
app.get('/followings/:username', (req, res) => {
    res.set('Content-Type', 'text/plain');
    // consecutive populate: first find the user, then populate the following field, then populate the tweet field
    User.findOne({ 'username': req.params['username'] })
        .populate({
            path: 'followings',
            populate: {
                path: 'tweets',
                model: 'Tweet',
                match: { 'private': 'false' },
                populate: {
                    path: 'poster',
                    model: 'User',
                    select: 'username portrait'
                }
            }
        })
        .populate({
            path: 'tweets',
            match: { 'private': false },
            populate: {
                path: 'poster',
                model: 'User',
                select: 'username portrait'
            }
        }).exec().then((user) => {
            let following = user.followings;
            let tweets = [];
            for (let i = 0; i < following.length; i++) {
                if (following[i].tweets) {
                    tweets = [...tweets, ...following[i].tweets];
                }
            }
            tweets = [...tweets, ...user.tweets]
            let tweetsInfo = tweets.map((tweet) => {
                return {
                    "tid": tweet['_id'],
                    "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": user.tweets_liked.includes(tweet['_id']) },
                    "dislikeInfo": { "dislikeCount": tweet['dislike_counter'], "bDislikeByUser": user.tweets_disliked.includes(tweet['_id']) },
                    "isReported": user.tweets_reported.includes(tweet['_id']),
                    "user": { "uid": tweet['poster']['_id'], 'username': tweet['poster']['username'] },
                    "content": tweet['tweet_content'],
                    "files": tweet['files'],
                    "commentCount": tweet['comments'].length,
                    "retweetCount": tweet['retweets'].length,
                    "time": tweet['post_time'],
                    "portraitUrl": tweet['poster']['portrait'],
                    "tags": tweet['tags'],
                    "private": tweet['private']
                }
            });
            // sort tweets by post time (newest first)
            tweetsInfo.sort((a, b) => {
                // convert time to date
                let time1 = new Date(a.time);
                let time2 = new Date(b.time);
                return time2 - time1;
            });
            console.log("----Get Followings Tweets------");
            return res.status(200).send(tweetsInfo);
        }).catch((err) => {
            console.log("---Followings Tweets Error---");
            console.log(err);
            res.status(404).send(err);
        });
});

// create a new tweet
app.post('/new-tweet', upload.array('files'), (req, res) => {
    res.set('Content-Type', 'text/plain');
    // find the user
    User.findOne({ 'username': req.body['username'] }).then((user) => {
        if (!user) { return res.send('User does not exist').status(404); }
        console.log(req.body);
        let uid = user._id;
        // create a new tweet
        let time = new Date();
        const filesPaths = req.files.map(file => file.path);
        let tweet = {
            poster: uid,
            tweet_content: req.body.tweet_content,
            files: filesPaths,
            tags: req.body.tags,
            dislike_counter: 0,
            report_counter: 0,
            post_time: time,
            likes: [],
            comments: [],
            retweets: [],
            private: req.body.private
        }
        console.log("here" + req.files.map(file => file.filename));

        // find all the tags in the tweet
        let tags = req.body.tags;
        Tag.find({ 'tag': { $in: tags } }).then((tagList) => {
            Tweet.create(tweet).then((tweet) => {
                // add the tweet to the user's tweets
                // for each tag, add the tweet to the tag's tweets
                user.tweets.push(tweet._id);
                tagList.forEach((tag) => {
                    tag.tid.push(tweet._id);
                    tag.save();
                });
                console.log("Save tweet to tags");
                user.save();
                return res.sendStatus(201);
            }).catch((err) => {
                return res.status().send(err);
            });
        }).catch((err) => {
            console.log(err);
            return res.status(400).send(err);
        });
    });
});

// like a tweet
app.put('/tweet/:tid/:username/like', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let tid = req.params['tid'];
    let username = req.params['username'];
    // find the user
    User.findOne({ 'username': username }).then((user) => {
        if (!user) { return res.send('User does not exist').status(404); }
        Tweet.findById(tid).populate('poster').exec().then((tweet) => {
            if (!tweet) { return res.send('Tweet does not exist').status(404); }
            let time = new Date();
            if (user.tweets_liked == null) { user.tweets_liked = []; }
            if (tweet.likes == null) { tweet.likes = []; }
            // check if the user has liked the tweet
            let likedTweets = user.tweets_liked;
            if (likedTweets.includes(tid)) {
                return res.status(400).send('User have already liked this tweet');
            }
            user.tweets_liked.push(tweet._id);
            tweet.likes.push({ username: username, time: time });
            // remove from the dislike list
            if (user.tweets_disliked && user.tweets_disliked.includes(tweet._id)) {
                console.log("Remove tweet {" + tweet._id + "} from " + username + " dislike list");
                user.tweets_disliked.remove(tweet._id);
                tweet.dislike_counter--;
            }
            let ret = {
                "likeInfo": { "likeCount": tweet.likes.length, "bLikeByUser": user.tweets_liked.includes(tweet._id) },
                "dislikeInfo": { "dislikeCount": tweet.dislike_counter, "bDislikeByUser": user.tweets_disliked.includes(tweet._id) }
            }
            user.save();
            tweet.save();
            Notification.create({
                username: tweet.poster.username,
                actor_id: user._id,
                action: "like",
                tid: tweet._id,
                time: new Date()
            }).then((noteobj) => {
                Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                    console.log(c);
                });
            });
            console.log("Like successfully");
            return res.status(201).send(ret);
        });
    }).catch((err) => {
        console.log("-----Like Error--------");
        console.log(err);
        return res.status(500).send(err);
    });
});

// cancel like a tweet
app.put('/tweet/:tid/:username/cancel-like', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let tid = req.params['tid'];
    let username = req.params['username'];
    User.findOne({ 'username': username }).then((user) => {
        if (!user) { return res.send('User does not exist').status(404); }
        Tweet.findById(tid).then((tweet) => {
            if (!tweet) { return res.send('Tweet does not exist').status(404); }
            if (user.tweets_liked == null || !user.tweets_liked.includes(tid) || tweet.likes == null || tweet.likes.includes(username)) {
                return res.status(400).send('User have not liked this tweet');
            }
            user.tweets_liked.remove(tweet._id);
            tweet.likes = tweet.likes.filter(item => item.username !== username);
            let ret = {
                "likeInfo": { "likeCount": tweet.likes.length, "bLikeByUser": user.tweets_liked.includes(tweet._id) },
                "dislikeInfo": { "dislikeCount": tweet.dislike_counter, "bDislikeByUser": user.tweets_disliked.includes(tweet._id) }
            }
            user.save();
            tweet.save();
            console.log("Cancel like successfully");
            return res.status(201).send(ret);
        });
    }).catch((err) => {
        console.log("-----Cancel Like Error--------");
        console.log(err);
        return res.status(500).send(err);
    });
});

// dislike a tweet
app.put('/tweet/:tid/:username/dislike', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let tid = req.params['tid'];
    let username = req.params['username'];
    User.findOne({ 'username': username }).then((user) => {
        if (!user) { return res.send('User does not exist').status(404); }
        Tweet.findById(tid).then((tweet) => {
            if (!tweet) { return res.send('Tweet does not exist').status(404); }
            if (user.tweets_disliked == null) { user.tweets_disliked = []; }
            // check if the user has disliked the tweet
            let dislikedTweets = user.tweets_disliked;
            if (dislikedTweets.includes(tid)) {
                return res.status(400).send('User have already disliked this tweet');
            }
            // if the user has liked the tweet, remove it from the liked list
            if (user.tweets_liked && user.tweets_liked.includes(tweet._id)) {
                console.log("Remove tweet {" + tweet._id + "} from " + username + " like list");
                user.tweets_liked.remove(tweet._id);
                tweet.likes = tweet.likes.filter(item => item.username !== username);
            }
            user.tweets_disliked.push(tweet._id);
            tweet.dislike_counter++;
            let ret = {
                "likeInfo": { "likeCount": tweet.likes.length, "bLikeByUser": user.tweets_liked.includes(tweet._id) },
                "dislikeInfo": { "dislikeCount": tweet.dislike_counter, "bDislikeByUser": user.tweets_disliked.includes(tweet._id) }
            }
            user.save();
            tweet.save();
            console.log("Dislike successfully");
            return res.status(201).send(ret);
        });
    }).catch((err) => {
        console.log("-----Dislike Error--------");
        console.log(err);
        return res.status(500).send(err);
    });
});

// cancel dislike a tweet
app.put('/tweet/:tid/:username/cancel-dislike', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let tid = req.params['tid'];
    let username = req.params['username'];
    User.findOne({ 'username': username }).then((user) => {
        if (!user) { return res.send('User does not exist').status(404); }
        Tweet.findById(tid).then((tweet) => {
            if (!tweet) { return res.send('Tweet does not exist').status(404); }
            if (user.tweets_disliked == null || !user.tweets_disliked.includes(tid)) {
                return res.status(400).send('User have not disliked this tweet');
            }
            user.tweets_disliked.remove(tweet._id);
            tweet.dislike_counter--;
            user.save();
            tweet.save();
            let ret = {
                "likeInfo": { "likeCount": tweet.likes.length, "bLikeByUser": user.tweets_liked.includes(tweet._id) },
                "dislikeInfo": { "dislikeCount": tweet.dislike_counter, "bDislikeByUser": user.tweets_disliked.includes(tweet._id) }
            }
            console.log("Cancel dislike successfully");
            return res.status(201).send(ret);
        });
    }).catch((err) => {
        console.log("-----Cancel dislike Error--------");
        console.log(err);
        return res.status(500).send(err);
    });
});

// report a tweet
app.put('/tweet/:tid/:username/report', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let tid = req.params['tid'];
    let username = req.params['username'];
    User.findOne({ 'username': username }).then((user) => {
        if (!user) { return res.send('User does not exist').status(404); }
        Tweet.findById(tid).then((tweet) => {
            if (!tweet) { return res.send('Tweet does not exist').status(404); }
            if (user.tweets_reported == null) { user.tweets_reported = []; }
            // check if the user has reported the tweet
            let reportedTweets = user.tweets_reported;
            if (reportedTweets.includes(tid)) {
                return res.status(400).send('User have already reported this tweet');
            }
            user.tweets_reported.push(tweet._id);
            tweet.report_counter++;
            user.save();
            tweet.save();
            console.log(username + " report " + tid + " successfully");
            return res.status(201).send('Report successfully');
        });
    }).catch((err) => {
        console.log("-----Report Error--------");
        console.log(err);
        return res.status(500).send(err);
    });
});

// get all the tags
app.get('/tags', (req, res) => {
    res.set('Content-Type', 'text/plain');
    Tag.find().then((tags) => {
        return res.status(200).send(tags);
    }).catch((err) => {
        console.log(err);
        return res.status(404).send(err);
    });
});

// check if the tag exists
app.get('/tag/:tagname', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let tagname = req.params['tagname'];
    Tag.find({ 'tag': tagname }).then((tag) => {
        if (tag.length == 0) {
            return res.status(404).send('Tag does not exist');

        }
        return res.status(200).send('Tag exists');
    }).catch((err) => {
        console.log(err);
    });
});

// create new tag
app.post('/new-tag', (req, res) => {
    res.set('Content-Type', 'text/plain');
    console.log("Create new tag");
    console.log(req.body);
    Tag.create({ tag: req.body.tag }).then((tag) => {
        console.log("tag created");
        return res.status(201).send(tag);
    }).catch((err) => {
        // check if it is the duplicate key error
        if (err.code === 11000) {
            console.log("tag exists");
            return res.status(400).send('Tag already exists');
        } else {
            console.log("error in creating tag");
            console.log(err);
            return res.status(401).send(err);
        }
    });
});

/********************************/
/*** Comment and tweet detail ***/
/********************************/
//add a new comment
app.post('/tweet/comment', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let tid = req.body.tid;
    let username = req.body.username;
    // find the user
    User.findOne({ 'username': username }).then((user) => {
        if (!user) { return res.send('User does not exist').status(404); }
        else { console.log('User found') }
        Tweet.findById(tid).populate('poster').exec().then((tweet) => {
            if (!tweet) { return res.send('Tweet does not exist').status(404); }
            // console.log(tweet);
            let time = new Date();
            let floor_num;
            if (tweet.comments == null) { tweet.comments = []; floor_num = 1; }
            else { floor_num = tweet.comments.length + 1; }
            // get user info
            let new_comment = {
                user: user._id,
                portrait: user.portrait,
                content: req.body.content,
                time: time,
                floor: floor_num
            };
            let new_comment_res = {
                username: user.username,
                portrait: user.portrait,
                content: req.body.content,
                time: time,
                floor: floor_num
            };
            console.log(new_comment)
            tweet.comments.push(new_comment);
            tweet.save();
            Notification.create({
                username: tweet.poster.username,
                actor_id: user._id,
                action: "comment",
                tid: tweet._id,
                time: new Date()
            }).then((noteobj) => {
                console.log(noteobj._id);
                Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                    console.log(c);
                });
            });
            console.log("comment successfully");
            return res.status(201).send(JSON.stringify(new_comment_res));
        });
    }).catch((err) => {
        console.log("-----Comment Error--------");
        console.log(err);
        return res.status(500).send(err);
    });
});

//get detail tweet
app.get('/fetchtweet/:tid/:username', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let tid = req.params['tid'];
    console.log(tid);
    Tweet.findById(tid).populate('poster').exec().then((tweet) => {
        if (!tweet) { return res.send('Tweet does not exist').status(404); }
        console.log('tweet found');
        User.findOne({ 'username': req.params['username'] }).then((user) => {
            if (!user) { return res.send('User does not exist').status(404); }
            else { console.log('User found') }
            let tweet_info = {
                tid: tweet._id,
                likeInfo: { likeCount: tweet.likes.length, bLikeByUser: user.tweets_liked.includes(tweet._id) },
                dislikeInfo: { dislikeCount: tweet.dislike_counter, bDislikeByUser: user.tweets_disliked.includes(tweet._id) },
                user: { uid: tweet.poster._id, username: tweet.poster.username },
                content: tweet.tweet_content,
                files: tweet.files,
                commentCount: tweet.comments.length,
                retweetCount: tweet.retweets.length,
                time: tweet.post_time,
                portraitUrl: tweet.poster.portrait,
                tags: tweet.tags,
            }
            console.log('get tweet successfully');
            // console.log(tweet_info)
            return res.status(201).send(JSON.stringify(tweet_info));
        });
    }).catch((err) => {
        console.log("-----Get Tweet Error--------");
        console.log(err);
        return res.status(500).send(err);
    });
});

// get comment list
app.get('/tweet/:tid/comment', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let tid = req.params['tid'];
    Tweet.findById(tid).populate({ path: 'comments', populate: { path: "user" } }).exec().then((tweet) => {
        if (!tweet) { return res.send('Tweet does not exist').status(404); }
        let comment_list = tweet.comments;
        let comments_res = [];
        comment_list.forEach((comment) => {
            let comment_tmp = {
                username: comment.user.username,
                portrait: comment.user.portrait,
                content: comment.content,
                time: comment.time,
                floor: comment.floor
            };
            comments_res.push(comment_tmp);
        });
        console.log(comments_res);
        console.log('get comment successfully');
        res.send(comments_res);
    }).catch((err) => {
        console.log("-----Get Comment Error--------");
        console.log(err);
        return res.status(500).send(err);
    });
});

// reply to a comment
app.post('/tweet/reply', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let tid = req.body.tid;
    let username = req.body.username;
    let floor_reply = req.body.floor_reply;
    Tweet.findById(tid).populate('poster').populate({ path: 'comments', populate: { path: 'user' } }).exec().then((tweet) => {
        if (!tweet) { return res.send('Tweet does not exist').status(404); }
        let floor_num = tweet.comments.length + 1;
        let time = new Date();
        User.findOne({ 'username': username }).then((user) => {
            if (!user) { return res.send('User does not exist').status(404); }
            let content = "Re Floor " + floor_reply + ": " + req.body.content;
            let new_reply = {
                user: user._id,
                portrait: user.portrait,
                content: content,
                time: time,
                floor: floor_num
            }
            tweet.comments.push(new_reply);
            let new_reply_res = {
                username: user.username,
                portrait: user.portrait,
                content: content,
                time: time,
                floor: floor_num
            }
            tweet.save();
            Notification.create({
                username: tweet.poster.username,
                actor_id: user._id,
                action: "comment",
                tid: tweet._id,
                time: new Date()
            }).then((noteobj) => {
                console.log(noteobj._id);
                Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                    console.log(c);
                });
            });
            Notification.create({
                username: tweet.comments[floor_reply - 1].user._id,
                actor_id: user._id,
                action: "reply",
                tid: tweet._id,
                time: new Date()
            }).then((noteobj) => {
                console.log(noteobj._id);
                Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                    console.log(c);
                });
            });
            console.log(new_reply)
            console.log("reply successfully");
            return res.status(201).send(JSON.stringify(new_reply_res));
        });
    }).catch((err) => {
        console.log("-----Reply Error--------");
        console.log(err);
        return res.status(500).send(err);
    });
});

// retweet
app.post('/retweet', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let parent_tid = req.body.tid;
    // find the user
    User.findOne({ 'username': req.body['username'] }).then((user) => {
        if (!user) { return res.send('User does not exist').status(404); }
        console.log('user found')
        Tweet.findById(parent_tid).populate('poster').exec().then((tweet) => {
            // create a new tweet
            let time = new Date();
            let new_tweet = {
                poster: user._id,
                tweet_content: req.body.tweet_content + " RT @" + tweet.poster.username + ": " + tweet.tweet_content,
                tags: req.body.tags,
                dislike_counter: 0,
                report_counter: 0,
                post_time: time,
                likes: [],
                comments: [],
                retweets: [],
                private: req.body.private,
            }

            Tweet.create(new_tweet).then((new_tweet_) => {
                console.log(new_tweet_);
                // update the user
                user.tweets.push(new_tweet_._id);
                user.save();
                // update the parent tweet
                tweet.retweets.push(new_tweet_._id);
                tweet.save();
                // create a notification
                Notification.create({
                    username: tweet.poster.username,
                    actor_id: user._id,
                    action: "retweet",
                    tid: parent_tid,
                    time: new Date()
                }).then((noteobj) => {
                    console.log(noteobj._id);
                    Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                        console.log(c);
                    });
                });
                res.sendStatus(201);
            })
        })
    }).catch((err) => {
        res.send(err);
    });
});


//search for users by user name keywords
app.get('/searchuser/:selfname/:targetname', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let self = req.params['selfname'];
    let target = req.params['targetname'];
    User.findOne({ 'username': self }).then((self) => {
        User.find({ 'username': { $regex: target } }).then((user) => {
            let retUsers = [];
            user.forEach(innerUser => {
                let isFollowing = false;
                if (innerUser.followers.includes(self._id)) {
                    isFollowing = true;
                }
                let userObj = {
                    "username": innerUser['username'],
                    "uid": innerUser['_id'],
                    "following": innerUser['followings'].length,
                    "follower": innerUser['followers'].length,
                    "isFollowing": isFollowing,
                    "portraitUrl": innerUser['portrait']
                };
                retUsers.push(userObj);
            });
            res.send(retUsers);
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    });
});

//search for users by uid
app.get('/searchuserbyid/:selfname/:targetname', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let self = req.params['selfname'];
    let target = req.params['targetname'];
    var o_id = new ObjectId(target);
    console.log(target)
    User.findOne({ 'username': self }).then((self) => {
        User.find({ '_id': o_id }).then((user) => {
            console.log(user);
            let retUsers = [];
            user.forEach(innerUser => {
                let isFollowing = false;
                if (innerUser.followers.includes(self._id)) {
                    isFollowing = true;
                }
                let userObj = {
                    "username": innerUser['username'],
                    "uid": innerUser['_id'],
                    "following": innerUser['followings'].length,
                    "follower": innerUser['followers'].length,
                    "isFollowing": isFollowing,
                    "portraitUrl": innerUser['portrait']
                };
                retUsers.push(userObj);
            });
            res.send(retUsers);
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    });
});

//search for posts with specified tag    
app.get('/searchtag/:tag', (req, res) => {
    res.set('Content-Type', 'text/plain');
    Tweet.find({ 'tags': { $all: [req.params['tag']] }, private: 'false' }).populate('poster').exec().then((tweet) => {
        tweet = tweet.filter((tweet) => {
            return tweet.poster != null;
        });
        let obj = [];
        if (!tweet) {
            console.log("no such tweet");
            res.sendStatus(404);
        }
        else {
            tweet.forEach(tweet => {
                let tweetObj = {
                    "tid": tweet['_id'],
                    "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": false },
                    "dislikeInfo": { "dislikeCount": tweet['dislike_counter'] },
                    "user": { "uid": tweet.poster['_id'], 'username': tweet.poster['username'] },
                    "content": tweet.tweet_content,
                    "commentCount": tweet['comments'].length,
                    "retweetCount": tweet['retweets'].length,
                    "time": tweet['post_time'],
                    "portraitUrl": tweet.poster['portrait'],
                    "tags": tweet['tags'],
                    'private': tweet['private']
                }
                obj.push(tweetObj);
            });
            console.log(obj);
            res.send(obj);
        }
    }).catch((err) => {
        res.send(err);
    });
})

// search for posts by keyword
app.get('/searchtweet/:keyword', (req, res) => {
    res.set('Content-Type', 'application/json');
    const keyword = req.params.keyword;

    Tweet.find({
        tweet_content: { $regex: new RegExp(keyword, 'i') },
        private: false
    })
        .populate('poster', 'username portrait')
        .exec()
        .then(tweets => {
            tweets = tweets.filter(tweet => tweet.poster);

            let searchResults = tweets.map(tweet => ({
                tid: tweet._id,
                likeInfo: { likeCount: tweet.likes.length, bLikeByUser: false },
                dislikeInfo: { dislikeCount: tweet.dislike_counter },
                user: { uid: tweet.poster._id, username: tweet.poster.username },
                content: tweet.tweet_content,
                files: tweet.files,
                commentCount: tweet.comments.length,
                retweetCount: tweet.retweets.length,
                time: tweet.post_time,
                portraitUrl: tweet.poster.portrait,
                tags: tweet.tags,
                private: tweet.private
            }));

            console.log(searchResults);
            res.json(searchResults);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send(err);
        });
});

// recommendation part: get the most used tag (limitation 10)
app.get('/search/trend', (req, res) => {
    res.set('Content-Type', 'text/plain');
    Tag.aggregate([
        { $project: { "tag": "$tag", cnt: { $size: '$tid' } } },
        { $sort: { cnt: -1 } },
        { $limit: 10 }]).then((tweets) => {
            if (!tweets) {
                console.log("no tags");
                res, send(404);
            }
            else {
                console.log(tweets);
                res.send(tweets)
            }
        }).catch((err) => {
            res.send(err);
        })
})
    ;


//-------Admin User-------
//update: change password by admin
app.put('/adminupdate', async (req, res) => {
    res.set('Content-Type', 'text/plain');
    const { username, newpwd } = req.body;
  
    if (!newpwd) {
      return res.status(400).send('Please input a valid new password.');
    }
  
    try {
      const acc = await Account.findOne({ username: username });
      
      if (!acc) {
        return res.status(404).send("No such user.");
      }
      console.log(`Changing password for user: ${username}`);
      acc.pwd = newpwd;
      await acc.save();
      return res.status(200).send("Update Successfully!");
    } catch (err) {
      console.error(err);
      return res.status(500).send('An error occurred while updating the password.');
    }
  });

//delete user by admin
app.delete('/user/:username', async (req, res) => {
    res.set('Content-Type', 'text/plain');
    const { username } = req.params;

    try {
        //delete user
        const accResult = await Account.deleteOne({ username: username });
        if (accResult.deletedCount === 0) {
            return res.status(404).send('User does not exist in Account db.');
        }
        console.log(`Successfully deleted user ${username} in Account db`);
        const userResult = await User.deleteOne({ username: username });
        if (userResult.deletedCount === 0) {
            return res.status(404).send('User does not exist in User db.');
        }
        console.log(`Successfully deleted user ${username} in User db`);
        // delete all posts of the user
        const tweetResult = await Tweet.deleteMany({ poster: userResult._id });
        console.log(`Deleted tweets count: ${tweetResult.deletedCount}`);
        console.log(`Successfully deleted user ${username}'s tweets`);
        return res.status(204).send(`Successfully deleted user ${username}`);
    } catch (err) {
        console.error(err);
        return res.status(500).send('An error occurred while deleting the user.');
    }
});

//get all users sorted by report_counter
app.get('/reportusers', (req, res) => {
    res.set('Content-Type', 'text/plain');
    User.find().sort({ "report_counter": -1 }).then((users) => {
        res.send(users);
    }).catch((err) => {
        res.send(err);
    });
});

//get all users sorted by name
app.get('/listusers', (req, res) => {
    res.set('Content-Type', 'text/plain');
    User.find().collation({ locale: 'en', strength: 2 }).sort({ username: 1 }).then((users) => {
        res.send(users);
    }).catch((err) => {
        res.send(err);
    });
});


// ------启动server------
const server = app.listen(8000);