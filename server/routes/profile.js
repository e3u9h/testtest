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


export default router;