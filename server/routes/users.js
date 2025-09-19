import express from 'express';
import User from '../models/User.js';
import CacheService from '../utils/cacheService.js';

const router = express.Router();

// Get a user by ID
router.get("/:userId", async (req, res) => {
    const userId = req.params.userId; 
    try {
        const user = await User.findById(userId);
        if (user) {
            const { password, ...other } = user._doc;
            res.status(200).json(other);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json(err); 
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        // 尝试从缓存获取
        const cachedUsers = await CacheService.get('all_users');
        if (cachedUsers) {
            console.log('Users cache hit');
            return res.json(cachedUsers);
        }

        const users = await User.find().select('-password');
        
        // 缓存用户列表
        await CacheService.set('all_users', users, 300); // 缓存5分钟
        console.log('Users cached');
        
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all users except for current user (recommended users)
router.get('/recommended/:username', async (req, res) => {
    try {
        const username = req.params.username;
        
        const users = await User.find({ 'username': { $ne: username } }).select('-password');
        const currUser = await User.findOne({ 'username': username });
        
        if (!currUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        let retUsers = users.map(user => {
            return {
                "username": user.username,
                "uid": user._id,
                "about": user.about,
                "following": user.followings.length,
                "follower": user.followers.length,
                "isFollowing": currUser.followings.includes(user._id),
                "portraitUrl": user.portrait
            }
        });
        
        retUsers = retUsers.filter(user => {
            return user.isFollowing === false;
        });
        
        console.log("Get recommended users");
        res.status(200).json(retUsers);
    } catch (err) {
        console.error('Error getting recommended users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search for users by username keywords
router.get('/search/:currentUser/:searchUsername', async (req, res) => {
    try {
        const currentUser = req.params.currentUser;
        const searchUsername = req.params.searchUsername;

        const currentUserDoc = await User.findOne({ username: currentUser });
        if (!currentUserDoc) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        const matchedUsers = await User.find({ 
            username: { $regex: searchUsername, $options: 'i' } 
        }).select('-password');

        const userList = matchedUsers.map((user) => ({
            username: user.username,
            uid: user._id,
            about: user.about,
            following: user.followings.length,
            follower: user.followers.length,
            isFollowing: user.followers.includes(currentUserDoc._id),
            portraitUrl: user.portrait,
        }));
        
        res.json(userList);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search user by ID
router.get('/searchbyid/:currentUser/:targetUserId', async (req, res) => {
    try {
        const currentUser = req.params.currentUser;
        const targetUserId = req.params.targetUserId;

        const currentUserDoc = await User.findOne({ username: currentUser });
        if (!currentUserDoc) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        const targetUserDoc = await User.findById(targetUserId).select('-password');
        if (!targetUserDoc) {
            return res.status(404).json({ error: 'Target user not found' });
        }

        const userInfo = {
            username: targetUserDoc.username,
            uid: targetUserDoc._id,
            about: targetUserDoc.about,
            following: targetUserDoc.followings.length,
            follower: targetUserDoc.followers.length,
            isFollowing: targetUserDoc.followers.includes(currentUserDoc._id),
            portraitUrl: targetUserDoc.portrait,
        };
        
        res.json([userInfo]);
    } catch (error) {
        console.error('Error finding target user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
