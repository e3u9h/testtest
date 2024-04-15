import express from 'express';
const router = express.Router();
import User from "../models/User.js";

// get followings or followers (user mode)
router.get('/:self/:target/:option', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const self = req.params['self'];
    const target = req.params['target'];
    const option = req.params['option'];
    User.findOne({ 'username': self }).then((self) => {
        User.findOne({ 'username': target }).populate(option).exec().then((user) => {
            let retUsers = []
            if (option === 'followings') {
                user.followings.forEach(innerUser => {
                    let isFollowing = false;
                    if (innerUser.followers.includes(self._id)) {
                        isFollowing = true;
                    }
                    let userObj = {
                        "username": innerUser['username'],
                        "uid": innerUser['_id'],
                        "following": innerUser['following_counter'],
                        "follower": innerUser['follower_counter'],
                        "isFollowing": isFollowing,
                        "portraitUrl": innerUser['portrait']
                    };
                    retUsers.push(userObj);
                });
            }
            else {
                user.followers.forEach(innerUser => {
                    let isFollowing = false;
                    if (innerUser.followers.includes(self._id)) {
                        isFollowing = true;
                    }
                    let userObj = {
                        "username": innerUser['username'],
                        "uid": innerUser['_id'],
                        "following": innerUser['following_counter'],
                        "follower": innerUser['follower_counter'],
                        "isFollowing": isFollowing,
                        "portraitUrl": innerUser['portrait']
                    };
                    retUsers.push(userObj);
                    console.log(userObj);
                });
            }
            res.send(retUsers);
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    });
});

// get followings or followers (admin mode)
router.get('/:target/:option', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const target = req.params['target'];
    const option = req.params['option'];
    User.findOne({ 'username': target }).populate(option).exec().then((user) => {
        let retUsers = []
        if (option === 'followings') {
            user.followings.forEach(innerUser => {
                let userObj = {
                    "username": innerUser['username'],
                    "uid": innerUser['_id'],
                    "following": innerUser['following_counter'],
                    "follower": innerUser['follower_counter'],
                    "isFollowing": false,
                    "portraitUrl": innerUser['portrait']
                };
                retUsers.push(userObj);
            });
        }
        else {
            user.followers.forEach(innerUser => {
                let userObj = {
                    "username": innerUser['username'],
                    "uid": innerUser['_id'],
                    "following": innerUser['following_counter'],
                    "follower": innerUser['follower_counter'],
                    "isFollowing": false,
                    "portraitUrl": innerUser['portrait']
                };
                retUsers.push(userObj);
            });
        }
        res.send(retUsers);
    }).catch((err) => {
        console.log(err);
        res.send(err);
    });
});

export default router;