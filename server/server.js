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

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log("Connection is open...");
});
// 在这里添加后端各种function
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