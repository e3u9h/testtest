import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
// import conversationRoute from "./routes/conversations.js";
// import messageRoute from "./routes/messages.js";

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'))
app.use('/img', express.static('img'))

//Connect to MongoDB
const uri = "mongodb+srv://dufz2003:21qwer@cluster0.tkqscce.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri) 
    .then(() => {
        console.log("Connected to MongoDB\n");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB\n\n", error);
      });


const AccountSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 4, maxlength: 20 },
    pwd: { type: String, required: true },
    identity: { type: String, required: true }
});

const TweetSchema = mongoose.Schema({
    poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tweet_content: { type: String },
    files: [{ type: String }],
    tags: [{ type: String, required: true }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        portrait: { type: String },
        content: { type: String },
        floor: { type: Number },
        time: { type: Date }
    }],
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
    likes: [{
        time: { type: Date, required: true },
        username: { type: String, required: true },
    }],
    dislike_counter: { type: Number, required: true },
    report_counter: { type: Number, required: true },
    retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
    post_time: { type: Date, required: true },
    private: { type: Boolean, required: true },
});

const UserSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 4, maxlength: 20 },
    gender: { type: String },
    interests: [{ type: String }],
    about: { type: String },
    follower_counter: { type: Number },
    following_counter: { type: Number },
    tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tweets_reported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
    users_reported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    users_blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    report_counter: { type: Number },
    tweets_liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
    tweets_disliked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
    portrait: { type: String }
});

const NotificationSchema = mongoose.Schema({
    username: { type: String, required: true }, //who is receiving this notifications
    actor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who is sending this notification
    action: { type: String, required: true }, // follow, like, comment, retweet
    tid: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }, // which tweet is involved, null for follow action
    time: { type: Date, required: true }
});

const TagSchema = mongoose.Schema({
    tag: { type: String, required: true, unique: true },
    tid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }] // the tweets that contain the tag
});

const messageSchema = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    content: { type: String, required: true },
    time: { type: Date, default: Date.now }
});

const Account = mongoose.model('Account', AccountSchema);
const Tweet = mongoose.model('Tweet', TweetSchema);
const User = mongoose.model('User', UserSchema);
const Notification = mongoose.model('Notification', NotificationSchema);
const Tag = mongoose.model('Tag', TagSchema);
const Message = mongoose.model('Message', messageSchema);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log("Connection is open...");
});
// 在这里添加后端各种function
app.post('/createuser', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let _username = req.body['username'];
    Account.findOne({ username: _username }).then((acc) => {
        if (acc) { console.log(acc); return res.status(401).send("The username has already been used. Please change a username."); }
        else {
            Account.create({
                username: req.body['newusername'],
                pwd: req.body['newpwd'],
                identity: 'user'
            }).then(() => {
                let default_portrait = "./img/defaultPortrait.jpg"
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
    let _username = req.body['username'];
    let _pwd = req.body['pwd'];
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
                'interests': user['interests'],
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

/* ----------------------------------------------------------------*/
/* --------------------LI Peiran Search----------------------------*/
/* ----------------------------------------------------------------*/

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

// ------启动server------
const server = app.listen(8000);


