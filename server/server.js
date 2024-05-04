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
import upload from './middlewares/upload.js';
import conversationRoute from "./routes/conversations.js";
import messageRoute from "./routes/messages.js";
import { createServer } from 'http';
import { Server as SocketIOServer} from 'socket.io';
import loginRoute from "./routes/login.js";
import registerRoute from "./routes/createuser.js";
import changepwdRoute from "./routes/changepwd.js";
import profileRoute from "./routes/profile.js";
import followinfoRote from "./routes/getfollowinfo.js";
import interactionRoute from "./routes/userinteraction.js";
import { mongoUrl } from './config.js';
import { expressjwt } from 'express-jwt';
import { jwtKey } from './config.js';
import bcryptjs from 'bcryptjs';

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.json());

// all the requests need to be authorized by the token except for login, creating user and accessing the files
// (maybe accessing files need to be authorized as well, but now I don't know how to do it
// because the files are directly accessed in the <img> tag,
// which cannot use axios's request interceptor to add token to the header, so I just let it not be authorized for now)
app.use(expressjwt({ secret: jwtKey, algorithms: ['HS256'] }).unless({ path: [/^\/login/, /^\/createuser/, /^\/uploads/, /^\/img/] }));

app.use('/uploads', express.static('uploads'))
app.use('/img', express.static('img'))
app.use("/server/conversations", conversationRoute);
app.use("/server/messages", messageRoute);
app.use("/login", loginRoute);
app.use('/createuser', registerRoute);
app.use('/changepwd', changepwdRoute);
app.use('/profile', profileRoute);
app.use('/followinfo', followinfoRote);
app.use('/interaction', interactionRoute);

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token');
        console.log(err);
    }
});


//Connect to MongoDB
// const uri = "mongodb+srv://dufz2003:4321qwer@cluster0.tkqscce.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const url = mongoUrl;
console.log("Connecting to MongoDB...");
mongoose.connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });


const server = new createServer(app);
/* -------------------------------------------------------------- */
/* ------------------------Connect to Socket.io------------------------*/
/* ---------------------------------------------------------------*/

const io = new SocketIOServer(server, {
    cors: {
        origin: "http://localhost:3000",
      },    
})

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      try {
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        });
    }
    catch (err) {
        console.log(err);
    }
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

// 在这里添加后端各种function

/***Main****/
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

// get recommended posts for the user
// display all the public posts for other users (not in the cuurrent user's list)
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

// like a post
app.put('/tweet/:tid/:username/like', async (req, res) => {
    try {
        res.set('Content-Type', 'text/plain');
        const tid = req.params['tid'];
        const username = req.params['username'];

        // Find the user
        const user = await User.findOne({ 'username': username });
        if (!user) {
            return res.status(404).send('User does not exist');
        }

        // Find the post
        const tweet = await Tweet.findById(tid).populate('poster').exec();
        if (!tweet) {
            return res.status(404).send('Post does not exist');
        }

        const time = new Date();

        // Check if the user has already liked the post
        const likedTweets = user.tweets_liked || [];
        if (likedTweets.includes(tid)) {
            return res.status(400).send('User has already liked this tweet');
        }

        user.tweets_liked.push(tweet._id);
        tweet.likes.push({ username: username, time: time });

        // Remove from the dislike list if disliked before
        if (user.tweets_disliked && user.tweets_disliked.includes(tweet._id)) {
            console.log(`Remove tweet ${tweet._id} from ${username} dislike list`);
            user.tweets_disliked.remove(tweet._id);
            tweet.dislike_counter--;
        }

        const ret = {
            "likeInfo": { "likeCount": tweet.likes.length, "bLikeByUser": user.tweets_liked.includes(tweet._id) },
            "dislikeInfo": { "dislikeCount": tweet.dislike_counter, "bDislikeByUser": user.tweets_disliked.includes(tweet._id) }
        };

        await user.save();
        await tweet.save();

        const noteobj = await Notification.create({
            username: tweet.poster.username,
            actor_id: user._id,
            action: "like",
            tid: tweet._id,
            time: new Date()
        });

        await Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } });

        console.log("Like successful");
        return res.status(201).send(ret);
    } catch (err) {
        console.log("-----Like Error--------");
        console.log(err);
        return res.status(500).send(err);
    }
});

// cancel like a post
app.put('/tweet/:tid/:username/cancel-like', async (req, res) => {
    try {
        res.set('Content-Type', 'text/plain');
        const tid = req.params['tid'];
        const username = req.params['username'];
        // search user
        const user = await User.findOne({ 'username': username });
        if (!user) {
            return res.status(404).send('User does not exist');
        }
        // search post
        const tweet = await Tweet.findById(tid);
        if (!tweet) {
            return res.status(404).send('Tweet does not exist');
        }

        if (!user.tweets_liked?.includes(tid) || !tweet.likes?.some(like => like.username === username)) {
            return res.status(400).send('User has not liked this tweet');
        }

        user.tweets_liked.remove(tweet._id);
        tweet.likes = tweet.likes.filter(like => like.username !== username);

        const ret = {
            "likeInfo": { "likeCount": tweet.likes.length, "bLikeByUser": user.tweets_liked.includes(tweet._id) },
            "dislikeInfo": { "dislikeCount": tweet.dislike_counter, "bDislikeByUser": user.tweets_disliked.includes(tweet._id) }
        };

        await user.save();
        await tweet.save();

        console.log("Cancel like successfully");
        return res.status(201).send(ret);
    } catch (err) {
        console.log("-----Cancel Like Error--------");
        console.log(err);
        return res.status(500).send(err);
    }
});

// dislike a post
app.put('/tweet/:tid/:username/dislike', async (req, res) => {
    try {
        res.set('Content-Type', 'text/plain');
        const tid = req.params['tid'];
        const username = req.params['username'];

        const user = await User.findOne({ 'username': username });
        if (!user) {
            return res.status(404).send('User does not exist');
        }

        const tweet = await Tweet.findById(tid);
        if (!tweet) {
            return res.status(404).send('Tweet does not exist');
        }

        if (!user.tweets_disliked) {
            user.tweets_disliked = [];
        }

        if (user.tweets_disliked.includes(tid)) {
            return res.status(400).send('User has already disliked this tweet');
        }

        if (user.tweets_liked && user.tweets_liked.includes(tweet._id)) {
            console.log(`Remove tweet ${tweet._id} from ${username} like list`);
            user.tweets_liked.remove(tweet._id);
            tweet.likes = tweet.likes.filter(item => item.username !== username);
        }

        user.tweets_disliked.push(tweet._id);
        tweet.dislike_counter++;

        const ret = {
            "likeInfo": { "likeCount": tweet.likes.length, "bLikeByUser": user.tweets_liked.includes(tweet._id) },
            "dislikeInfo": { "dislikeCount": tweet.dislike_counter, "bDislikeByUser": user.tweets_disliked.includes(tweet._id) }
        };

        await user.save();
        await tweet.save();

        console.log("Dislike successful");
        return res.status(201).send(ret);
    } catch (err) {
        console.log("-----Dislike Error--------");
        console.log(err);
        return res.status(500).send(err);
    }
});

// cancel dislike a post
app.put('/tweet/:tid/:username/cancel-dislike', async (req, res) => {
    try {
        res.set('Content-Type', 'text/plain');
        const tid = req.params['tid'];
        const username = req.params['username'];

        const user = await User.findOne({ 'username': username });
        if (!user) {
            return res.status(404).send('User does not exist');
        }

        const tweet = await Tweet.findById(tid);
        if (!tweet) {
            return res.status(404).send('Post does not exist');
        }

        if (!user.tweets_disliked || !user.tweets_disliked.includes(tid)) {
            return res.status(400).send('User has not disliked this post');
        }

        user.tweets_disliked.remove(tweet._id);
        tweet.dislike_counter--;

        await user.save();
        await tweet.save();

        const ret = {
            "likeInfo": { "likeCount": tweet.likes.length, "bLikeByUser": user.tweets_liked.includes(tweet._id) },
            "dislikeInfo": { "dislikeCount": tweet.dislike_counter, "bDislikeByUser": user.tweets_disliked.includes(tweet._id) }
        };

        console.log("Cancel dislike successfully");
        return res.status(201).send(ret);
    } catch (err) {
        console.log("-----Cancel dislike Error--------");
        console.log(err);
        return res.status(500).send(err);
    }
});

// get all the tags
app.get('/tags', async (req, res) => {
    try {
        res.set('Content-Type', 'text/plain');
        const tags = await Tag.find();
        // Find all tags
        return res.status(200).send(tags);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
});

// check if the tag exists
app.get('/tag/:tagname', async (req, res) => {
    try {
        res.set('Content-Type', 'text/plain');
        const tagname = req.params['tagname'];
        // Find the tag
        const tag = await Tag.findOne({ 'tag': tagname });
        if (!tag) {
            return res.status(404).send('Tag does not exist');
        }
        return res.status(200).send('Tag exists');
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
});

// create new tag
app.post('/new-tag', async (req, res) => {
    try {
        res.set('Content-Type', 'text/plain');
        console.log("Create new tag");
        console.log(req.body);
        const tag = await Tag.create({ tag: req.body.tag });
        // Create a new tag
        console.log("Tag created");
        return res.status(201).send(tag);
    } catch (err) {
        if (err.code === 11000) {
            console.log("Tag exists");
            return res.status(202).send('Tag already exists');
        } else {
            console.log("Error in creating tag");
            console.log(err);
            return res.status(402).send(err);
        }
    }
});

//Comment and tweet detail
//add a new comment
app.post('/tweet/comment', async (req, res) => {
    try {
        res.set('Content-Type', 'text/plain');
        const tid = req.body.tid;
        const username = req.body.username;

        // Find user
        const user = await User.findOne({ 'username': username });
        if (!user) {
            return res.status(404).send('User does not exist');
        }
        console.log('User found');

        // Find post
        const tweet = await Tweet.findById(tid).populate('poster');
        if (!tweet) {
            return res.status(404).send('Tweet does not exist');
        }

        // Check if the user is blocked by the poster or block poster
        if (tweet.poster.users_blocked.includes(user._id)) {
            return res.status(403).send('You have been blocked by the poster');
        }
        if (user.users_blocked.includes(tweet.poster._id)) {
            return res.status(403).send('You have blocked the poster');
        }

        const time = new Date();
        let floor_num;
        if (!tweet.comments) {
            tweet.comments = [];
            floor_num = 1;
        } else {
            floor_num = tweet.comments.length + 1;
        }

        // Create the new comment
        const new_comment = {
            user: user._id,
            portrait: user.portrait,
            content: req.body.content,
            time: time,
            floor: floor_num
        };
        const new_comment_res = {
            username: user.username,
            portrait: user.portrait,
            content: req.body.content,
            time: time,
            floor: floor_num
        };

        // Add the new comment to the tweet and save it
        tweet.comments.push(new_comment);
        await tweet.save();

        // Create a new notification and associate it with the tweet and user
        const noteobj = await Notification.create({
            username: tweet.poster.username,
            actor_id: user._id,
            action: "comment",
            tid: tweet._id,
            time: new Date()
        });
        console.log(noteobj._id);

        // Update the notification list for the poster
        await Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } });
        console.log("Comment successfully");
        return res.status(201).send(JSON.stringify(new_comment_res));
    } catch (err) {
        console.log("-----Comment Error--------");
        console.log(err);
        return res.status(500).send(err);
    }
});

//get detail post
app.get('/fetchtweet/:tid/:username', async (req, res) => {
    try {
        res.set('Content-Type', 'text/plain');
        const tid = req.params['tid'];
        console.log(tid);

        // Find the post
        const tweet = await Tweet.findById(tid).populate('poster');
        if (!tweet) {
            return res.status(404).send('Tweet does not exist');
        }
        console.log('Tweet found');

        const username = req.params['username'];

        // Find the user
        const user = await User.findOne({ 'username': username });

        // set admin to all false
        let isLiked = false;
        let isDisliked = false;
        if (user) {
            console.log('User found');
            isLiked = user.tweets_liked.includes(tweet._id);
            isDisliked = user.tweets_disliked.includes(tweet._id);
        }

        const tweet_info = {
            tid: tweet._id,
            likeInfo: { likeCount: tweet.likes.length, bLikeByUser: isLiked },
            dislikeInfo: { dislikeCount: tweet.dislike_counter, bDislikeByUser: isDisliked },
            user: { uid: tweet.poster._id, username: tweet.poster.username },
            content: tweet.tweet_content,
            files: tweet.files,
            commentCount: tweet.comments.length,
            retweetCount: tweet.retweets.length,
            time: tweet.post_time,
            portraitUrl: tweet.poster.portrait,
            tags: tweet.tags,
        };

        console.log('Get tweet successfully');
        return res.status(201).send(JSON.stringify(tweet_info));
    } catch (err) {
        console.log("-----Get Tweet Error--------");
        console.log(err);
        return res.status(500).send(err);
    }
});

// get comment list
app.get('/tweet/:tid/comment', async (req, res) => {
    try {
        res.set('Content-Type', 'text/plain');
        const tid = req.params['tid'];

        // Find the tweet and populate the comments with user information
        const tweet = await Tweet.findById(tid).populate({ path: 'comments', populate: { path: "user" } }).exec();
        if (!tweet) {
            return res.status(404).send('Post does not exist');
        }

        const comment_list = tweet.comments;
        const comments_res = comment_list.map((comment) => {
            return {
                username: comment.user.username,
                portrait: comment.user.portrait,
                content: comment.content,
                time: comment.time,
                floor: comment.floor
            };
        });

        console.log(comments_res);
        console.log('Get comments successfully');
        res.send(comments_res);
    } catch (err) {
        console.log("-----Get Comment Error--------");
        console.log(err);
        return res.status(500).send(err);
    }
});

// reply to a comment
app.post('/tweet/reply', async (req, res) => {
    try {
        res.set('Content-Type', 'text/plain');
        const tid = req.body.tid;
        const username = req.body.username;
        const floor_reply = req.body.floor_reply;
        const tweet = await Tweet.findById(tid).populate('poster').populate({ path: 'comments', populate: { path: 'user' } }).exec();
        if (!tweet) {
            return res.status(404).send('Tweet does not exist');
        }
        // Find the user
        const user = await User.findOne({ 'username': username });
        if (!user) {
            return res.status(404).send('User does not exist');
        }

        // Check if the user is blocked by the poster or has blocked the poster
        if (tweet.poster.users_blocked.includes(user._id)) {
            return res.status(403).send('You have been blocked by the poster');
        }
        if (user.users_blocked.includes(tweet.poster._id)) {
            return res.status(403).send('You have blocked the poster');
        }

        const floor_num = tweet.comments.length + 1;
        const time = new Date();
        const content = "Re Floor " + floor_reply + ": " + req.body.content;
        const new_reply = {
            user: user._id,
            portrait: user.portrait,
            content: content,
            time: time,
            floor: floor_num
        };
        tweet.comments.push(new_reply);

        const new_reply_res = {
            username: user.username,
            portrait: user.portrait,
            content: content,
            time: time,
            floor: floor_num
        };

        await tweet.save();

        // Create a notification for the user
        await Notification.create({
            username: tweet.poster.username,
            actor_id: user._id,
            action: "comment",
            tid: tweet._id,
            time: new Date()
        });

        // Create a notification for the user being replied to
        await Notification.create({
            username: tweet.comments[floor_reply - 1].user._id,
            actor_id: user._id,
            action: "reply",
            tid: tweet._id,
            time: new Date()
        });

        console.log(new_reply);
        console.log("Reply successfully");
        return res.status(201).send(JSON.stringify(new_reply_res));
    } catch (err) {
        console.log("-----Reply Error--------");
        console.log(err);
        return res.status(500).send(err);
    }
});

// repost
app.post('/retweet', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let parent_tid = req.body.tid;
    // find the user
    User.findOne({ 'username': req.body['username'] }).then((user) => {
        if (!user) { return res.send('User does not exist').status(404); }
        console.log('user found')
        Tweet.findById(parent_tid).populate('poster').exec().then((tweet) => {
            if (tweet.poster.users_blocked.includes(user._id)) {
                return res.status(403).send('You have been blocked by the poster');
            }
            if (user.users_blocked.includes(tweet.poster._id)) {
                return res.status(403).send('You have blocked the poster');
            }
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
app.get('/searchtag/:tag/:selfname', (req, res) => {
    res.set('Content-Type', 'text/plain');
    User.findOne({ 'username': req.params['selfname'] }).then((self) => {
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
                    const beLiked = self["tweets_liked"].includes(tweet['_id']);
                    const beDisliked = self["tweets_disliked"].includes(tweet['_id']);
                    let tweetObj = {
                        "tid": tweet['_id'],
                        "likeInfo": { "likeCount": tweet['likes'].length, "bLikeByUser": beLiked },
                        "dislikeInfo": { "dislikeCount": tweet['dislike_counter'], "bDislikeByUser": beDisliked },
                        "user": { "uid": tweet.poster['_id'], 'username': tweet.poster['username'] },
                        "content": tweet.tweet_content,
                        "files": tweet.files,
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
    }).catch((err) => {
        res.send(err);
    });
})

// search for posts by keyword
app.get('/searchtweet/:keyword/:self', (req, res) => {
    res.set('Content-Type', 'application/json');
    const keyword = req.params.keyword;
    User.findOne({ 'username': req.params.self }).then((self) => {
        Tweet.find({
            tweet_content: { $regex: new RegExp(keyword, 'i') },
            private: false
        })
            .populate('poster', 'username portrait')
            .exec()
            .then(
                tweets => {
                    tweets = tweets.filter(tweet => tweet.poster);
                    let searchResults = tweets.map(tweet => {
                        const beLiked = self["tweets_liked"].includes(tweet["_id"]);
                        const beDisliked = self["tweets_disliked"].includes(tweet["_id"]);
                        return {
                            tid: tweet._id,
                            likeInfo: { likeCount: tweet.likes.length, bLikeByUser: beLiked },
                            dislikeInfo: { dislikeCount: tweet.dislike_counter, bDislikeByUser: beDisliked },
                            user: { uid: tweet.poster._id, username: tweet.poster.username },
                            content: tweet.tweet_content,
                            files: tweet.files,
                            commentCount: tweet.comments.length,
                            retweetCount: tweet.retweets.length,
                            time: tweet.post_time,
                            portraitUrl: tweet.poster.portrait,
                            tags: tweet.tags,
                            private: tweet.private
                        };
                    });

                    console.log(searchResults);
                    res.json(searchResults);
                })
    }).catch(err => {
            console.error(err);
            res.status(500).send(err);
        });
});

// hottest topic recommendation part: get the most used tag (limitation 10)
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
app.put('/adminchangepwd', async (req, res) => {
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
        acc.pwd = bcryptjs.hashSync(newpwd, 10);
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
        // update the followings and followers info of all the followings and followers of the target user
        const targetUser = await User.findOne({ username: username }).populate('followings').populate('followers');
        if (!targetUser) {
            return res.status(404).send('User does not exist.');
        }
        targetUser.followings.forEach(async (following) => {
            following.followers.remove(targetUser._id);
            following.follower_counter--;
            await following.save();
        });
        targetUser.followers.forEach(async (follower) => {
            follower.followings.remove(targetUser._id);
            follower.following_counter--;
            await follower.save();
        });
        //delete the user
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
        // delete all the notifications of the user
        const noteResult = await Notification.deleteMany({ actor_id: userResult._id });
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

// get notificaqtions
app.get('/notification/:username', (req, res) => {
    res.set('Content-Type', 'text/plain');
    console.log('before')
    console.log(req.params)
    Notification.find({ 'username': req.params['username'] }).sort({ 'time': -1 }).populate('actor_id').populate('tid').exec().then((notes) => {
        console.log('notifications found');
        console.log(req.params['username'])
        console.log(notes)
        let notification_list = [];
        notes.forEach(note => {
            console.log("for each note")
            console.log(note);
            if (note.action !== 'follow') {
                const content_len = note.tid.tweet_content.length > 30 ? 30 : note.tid.tweet_content.length;
                const notification = {
                    "icon": note.action,
                    "tid": note.tid._id,
                    "action": note.action,
                    "name": note.actor_id.username,
                    "portrait": note.actor_id.portrait,
                    "time": note.time,
                    "content": note.tid.tweet_content.slice(0, content_len),
                }
                console.log(notification);
                notification_list.push(notification);
            }
            else {
                const notification = {
                    "icon": note.action,
                    "tid": null,
                    "action": note.action,
                    "name": note.actor_id.username,
                    "portrait": note.actor_id.portrait,
                    "time": note.time,
                    "content": null
                }
                notification_list.push(notification);
            }
            console.log(notification_list);
        });
        console.log(notification_list);
        res.status(201).send(JSON.stringify(notification_list));
    }).catch((err) => {
        console.log("-----Get Notification Error--------");
        console.log(err);
        return res.status(500).send(err);
    })
});


// ------启动server------
server.listen(8000, ()=>{
    console.log("Server is running on Port 8000");
});
