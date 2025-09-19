import express from 'express';
import bcryptjs from 'bcryptjs';
import Account from '../models/Account.js';
import User from '../models/User.js';
import Tweet from '../models/Tweet.js';
import Notification from '../models/Notification.js';
import CacheService from '../utils/cacheService.js';

const router = express.Router();

// Middleware to check if user is admin (you may want to implement proper admin authentication)
const isAdmin = async (req, res, next) => {
    try {
        // This is a basic implementation - you should implement proper admin verification
        const { auth } = req;
        if (!auth || !auth.username) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        // You can add admin role checking logic here
        // For now, assuming certain usernames or checking admin flag in user model
        const user = await User.findOne({ username: auth.username });
        if (!user || !user.isAdmin) { // Assuming you have an isAdmin field
            return res.status(403).json({ error: 'Admin access required' });
        }
        
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Change user password (admin only)
router.put('/change-password', isAdmin, async (req, res) => {
    try {
        const { username, newpwd } = req.body;

        if (!newpwd) {
            return res.status(400).json({ error: 'Please provide a valid new password' });
        }

        const acc = await Account.findOne({ username: username });
        
        if (!acc) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(`Admin changing password for user: ${username}`);
        acc.pwd = bcryptjs.hashSync(newpwd, 10);
        await acc.save();

        // Clear any cached user data
        await CacheService.del(`user_${username}`);

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ error: 'An error occurred while updating the password' });
    }
});

// Delete user (admin only)
router.delete('/users/:username', isAdmin, async (req, res) => {
    try {
        const { username } = req.params;

        // Find the target user with populated followings and followers
        const targetUser = await User.findOne({ username: username })
            .populate('followings')
            .populate('followers');
            
        if (!targetUser) {
            return res.status(404).json({ error: 'User does not exist' });
        }

        // Update followings and followers relationships
        for (const following of targetUser.followings) {
            following.followers.remove(targetUser._id);
            following.follower_counter = Math.max(0, following.follower_counter - 1);
            await following.save();
        }

        for (const follower of targetUser.followers) {
            follower.followings.remove(targetUser._id);
            follower.following_counter = Math.max(0, follower.following_counter - 1);
            await follower.save();
        }

        // Delete user from Account collection
        const accResult = await Account.deleteOne({ username: username });
        if (accResult.deletedCount === 0) {
            console.warn(`User ${username} not found in Account collection`);
        }

        // Delete all user's tweets
        const tweetResult = await Tweet.deleteMany({ poster: targetUser._id });
        console.log(`Deleted ${tweetResult.deletedCount} tweets for user ${username}`);

        // Delete all notifications related to the user
        await Notification.deleteMany({ actor_id: targetUser._id });
        await Notification.deleteMany({ username: username });

        // Delete user from User collection
        const userResult = await User.deleteOne({ username: username });
        if (userResult.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found in User collection' });
        }

        // Clear related caches
        await CacheService.del(`user_${username}`);
        await CacheService.del('all_users');
        await CacheService.clearHotTweets();

        console.log(`Successfully deleted user ${username}`);
        res.status(200).json({ message: `Successfully deleted user ${username}` });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
});

// Get users sorted by report count (admin only)
router.get('/reported-users', isAdmin, async (req, res) => {
    try {
        // Try to get from cache first
        const cachedReportedUsers = await CacheService.get('reported_users');
        if (cachedReportedUsers) {
            console.log('Reported users cache hit');
            return res.json(cachedReportedUsers);
        }

        const users = await User.find()
            .sort({ report_counter: -1 })
            .select('-password')
            .lean();

        // Filter users with reports
        const reportedUsers = users.filter(user => user.report_counter > 0);

        // Cache the results
        await CacheService.set('reported_users', reportedUsers, 600); // Cache for 10 minutes
        console.log('Reported users cached');

        res.json(reportedUsers);
    } catch (err) {
        console.error('Error fetching reported users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all users sorted by username (admin only)
router.get('/users', isAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20, sortBy = 'username', order = 'asc' } = req.query;
        
        const sortOrder = order === 'desc' ? -1 : 1;
        const sortCriteria = {};
        sortCriteria[sortBy] = sortOrder;

        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password')
            .collation({ locale: 'en', strength: 2 })
            .sort(sortCriteria)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const totalUsers = await User.countDocuments();

        const response = {
            users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalUsers / limit),
                totalUsers,
                limit: parseInt(limit)
            }
        };

        res.json(response);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user statistics (admin only)
router.get('/stats/users', isAdmin, async (req, res) => {
    try {
        // Try to get from cache first
        const cachedStats = await CacheService.get('admin_user_stats');
        if (cachedStats) {
            console.log('User stats cache hit');
            return res.json(cachedStats);
        }

        const [
            totalUsers,
            activeUsers, // Users who posted in last 30 days
            reportedUsers,
            newUsersThisWeek
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({
                tweets: { $exists: true, $not: { $size: 0 } },
                // You might want to add a lastActive field to track user activity
            }),
            User.countDocuments({ report_counter: { $gt: 0 } }),
            User.countDocuments({
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            })
        ]);

        const stats = {
            totalUsers,
            activeUsers,
            reportedUsers,
            newUsersThisWeek,
            inactiveUsers: totalUsers - activeUsers
        };

        // Cache the stats
        await CacheService.set('admin_user_stats', stats, 1800); // Cache for 30 minutes
        console.log('User stats cached');

        res.json(stats);
    } catch (err) {
        console.error('Error fetching user statistics:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get tweet statistics (admin only)
router.get('/stats/tweets', isAdmin, async (req, res) => {
    try {
        const cachedStats = await CacheService.get('admin_tweet_stats');
        if (cachedStats) {
            console.log('Tweet stats cache hit');
            return res.json(cachedStats);
        }

        const [
            totalTweets,
            publicTweets,
            privateTweets,
            reportedTweets,
            tweetsThisWeek
        ] = await Promise.all([
            Tweet.countDocuments(),
            Tweet.countDocuments({ private: false }),
            Tweet.countDocuments({ private: true }),
            Tweet.countDocuments({ report_counter: { $gt: 0 } }),
            Tweet.countDocuments({
                post_time: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            })
        ]);

        const stats = {
            totalTweets,
            publicTweets,
            privateTweets,
            reportedTweets,
            tweetsThisWeek
        };

        await CacheService.set('admin_tweet_stats', stats, 1800);
        console.log('Tweet stats cached');

        res.json(stats);
    } catch (err) {
        console.error('Error fetching tweet statistics:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get system statistics (admin only)
router.get('/stats/system', isAdmin, async (req, res) => {
    try {
        const cachedStats = await CacheService.get('admin_system_stats');
        if (cachedStats) {
            console.log('System stats cache hit');
            return res.json(cachedStats);
        }

        const [
            totalNotifications,
            totalTags,
            recentNotifications
        ] = await Promise.all([
            Notification.countDocuments(),
            require('../models/Tag.js').countDocuments(),
            Notification.countDocuments({
                time: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            })
        ]);

        const stats = {
            totalNotifications,
            totalTags,
            recentNotifications,
            serverUptime: process.uptime(),
            nodeVersion: process.version,
            memoryUsage: process.memoryUsage()
        };

        await CacheService.set('admin_system_stats', stats, 1800);
        console.log('System stats cached');

        res.json(stats);
    } catch (err) {
        console.error('Error fetching system statistics:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search users (admin only)
router.get('/search/users', isAdmin, async (req, res) => {
    try {
        const { query, filter } = req.query;
        
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        let searchCriteria = {
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { about: { $regex: query, $options: 'i' } }
            ]
        };

        // Apply filters
        if (filter === 'reported') {
            searchCriteria.report_counter = { $gt: 0 };
        } else if (filter === 'inactive') {
            // Users with no tweets or very old last activity
            searchCriteria.tweets = { $size: 0 };
        }

        const users = await User.find(searchCriteria)
            .select('-password')
            .limit(50)
            .lean();

        res.json(users);
    } catch (err) {
        console.error('Error searching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
