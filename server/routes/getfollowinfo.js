import express from 'express';
const router = express.Router();
import User from "../models/User.js";

// get followings or followers of the target user
router.get('/:self/:target/:option', (req, res) => {
    res.set('Content-Type', 'text/plain');
    const self = req.params['self'];
    const target = req.params['target'];
    const option = req.params['option'];
    User.findOne({ 'username': self }).then((self) => {
        User.findOne({ 'username': target }).populate(option).exec().then((user) => {
            let retUsers = []
            user[option].forEach(innerUser => {
                // if self is null, it indicates that the user is an admin,
                // so isFollowing is always false;
                // otherwise, check if self is following the target user
                let isFollowing = false;
                if (self !== null && innerUser.followers.includes(self._id)) {
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
            res.send(retUsers);
        }).catch((err) => {
            console.log(err);
            res.send(err);
        });
    });
});

export default router;