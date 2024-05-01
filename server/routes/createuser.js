import express from 'express';
const router = express.Router();
import Account from "../models/Account.js";
import User from "../models/User.js";

router.post('/', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const _username = req.body['username'];
    Account.findOne({ username: _username }).then((acc) => {
        if (acc) { console.log(acc); return res.status(403).send("The username has already been used. Please change a username."); }
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
                    return res.status(403).send("The username has already existed. Please change a username.");
                }
                console.log(err);
                return res.status(400).send(err);
            });
        }
    });
});
export default router;