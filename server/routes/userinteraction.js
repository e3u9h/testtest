import express from 'express';
const router = express.Router();
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// follow
router.put('/:username/:target/follow', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let username = req.params['username'];
    let target = req.params['target'];
    User.findOne({ 'username': username }).then((user) => {
        User.findOne({ 'username': target }).then((target) => {
            if (target.users_blocked.includes(user._id)) {
                return res.status(403).send('You have been blocked by this user.');
            }
            if (user.users_blocked.includes(target._id)) {
                return res.status(403).send('You have blocked this user.');
            }
            user.followings.push(target._id);
            target.followers.push(user._id);
            user.following_counter += 1;
            target.follower_counter += 1;
            user.save();
            target.save();
            Notification.create({
                username: target.username,
                actor_id: user._id,
                action: "follow",
                time: new Date()
            }).then((noteobj) => {
                Notification.updateOne({ nid: noteobj.nid }, { $push: { notification: noteobj._id } }).then(c => {
                    console.log(c);
                });
            });
            return res.sendStatus(200);

        });
    }).catch((err) => {
        res.send(err);
    })
});

// unfollow
router.put('/:username/:target/unfollow', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let username = req.params['username'];
    let target = req.params['target'];
    User.findOne({ 'username': username }).then((user) => {
        User.findOne({ 'username': target }).then((target) => {
            user.followings.remove(target._id);
            target.followers.remove(user._id);
            user.following_counter -= 1;
            target.follower_counter -= 1;
            user.save();
            target.save();
        });
    }).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        res.send(err);
    })
});

// block
router.put('/:username/:target/block', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let username = req.params['username'];
    let target = req.params['target'];
    User.findOne({ 'username': username }).then((user) => {
        User.findOne({ 'username': target }).then((target) => {
            user.users_blocked.push(target._id);
            user.save();
        });
    }).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        res.send(err);
    })
});

// unblock
router.put('/:username/:target/unblock', (req, res) => {
    res.set('Content-Type', 'text/plain');
    let username = req.params['username'];
    let target = req.params['target'];
    User.findOne({ 'username': username }).then((user) => {
        User.findOne({ 'username': target }).then((target) => {
            user.users_blocked.remove(target._id);
            user.save();
        });
    }).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        res.send(err);
    })
});

// report
router.put('/:username/:target/report', async (req, res) => {
    res.set('Content-Type', 'text/plain');
    const { username, target } = req.params;

    try {
        //report
        let user = await User.findOne({ 'username': username });
        if (!user) {
            return res.status(404).send(`User ${username} not found.`);
        }
        // be reported
        let targetUser = await User.findOne({ 'username': target });
        if (!targetUser) {
            return res.status(404).send(`Target user ${target} not found.`);
        }

        user.users_reported.push(targetUser._id);
        targetUser.report_counter += 1;

        await user.save();
        await targetUser.save();
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while reporting the user.');
    }
});

export default router;