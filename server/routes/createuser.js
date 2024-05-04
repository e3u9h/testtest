import express from 'express';
const router = express.Router();
import Account from "../models/Account.js";
import User from "../models/User.js";
import bcryptjs from 'bcryptjs';

// reference: https://github.com/lucashaozh/Chirpin/blob/main/chirpin/server/server.js

// create a new user (used for both user registration and admin "add user" function)
router.post('/', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const _username = req.body['username'];
    // check whether the username already exists
    Account.findOne({ username: _username }).then((acc) => {
        if (acc) { console.log(acc); return res.status(403).send("The username has already been used. Please change a username."); }
        else {
            // if the username does not exist, first, create an Account record in the database
            Account.create({
                username: req.body['newusername'],
                // bcryptjs is for encrypting the password
                pwd: bcryptjs.hashSync(req.body['newpwd'], 10),
                identity: 'user'
            }).then(() => {
                // then, create a User record in the database
                const default_portrait = "./img/defaultPortrait.jpg"
                const gender = req.body['gender']
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