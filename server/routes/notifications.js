import express from 'express';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import CacheService from '../utils/cacheService.js';

const router = express.Router();

// Get notifications for a user
router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { page = 1, limit = 20 } = req.query;

        // Try to get from cache first
        const cacheKey = `notifications_${username}_${page}_${limit}`;
        const cachedNotifications = await CacheService.get(cacheKey);
        if (cachedNotifications) {
            console.log('Notifications cache hit');
            return res.json(cachedNotifications);
        }

        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ username })
            .sort({ time: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('actor_id', 'username portrait')
            .populate('tid', 'tweet_content')
            .exec();

        const formattedNotifications = notifications.map(note => {
            if (note.action !== 'follow') {
                // For tweet-related notifications
                const content = note.tid && note.tid.tweet_content 
                    ? note.tid.tweet_content.slice(0, 30) 
                    : 'Content not available';
                
                return {
                    _id: note._id,
                    tid: note.tid ? note.tid._id : null,
                    action: note.action,
                    name: note.actor_id ? note.actor_id.username : 'Unknown user',
                    portrait: note.actor_id ? note.actor_id.portrait : null,
                    time: note.time,
                    content: content,
                };
            } else {
                // For follow notifications
                return {
                    _id: note._id,
                    tid: null,
                    action: note.action,
                    name: note.actor_id ? note.actor_id.username : 'Unknown user',
                    portrait: note.actor_id ? note.actor_id.portrait : null,
                    time: note.time,
                    content: null,
                };
            }
        });

        // Get total count for pagination
        const totalNotifications = await Notification.countDocuments({ username });

        const response = {
            notifications: formattedNotifications,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalNotifications / limit),
                totalNotifications,
                limit: parseInt(limit)
            }
        };

        // Cache the results
        await CacheService.set(cacheKey, response, 300); // Cache for 5 minutes
        console.log('Notifications cached');

        res.json(response);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get unread notifications count
router.get('/:username/unread-count', async (req, res) => {
    try {
        const { username } = req.params;

        // Try to get from cache first
        const cacheKey = `unread_count_${username}`;
        const cachedCount = await CacheService.get(cacheKey);
        if (cachedCount !== null) {
            console.log('Unread count cache hit');
            return res.json({ unreadCount: cachedCount });
        }

        // Assuming you have a 'read' field in notifications
        // If not, you might need to add this field to track read status
        const unreadCount = await Notification.countDocuments({ 
            username,
            read: { $ne: true } // or read: false if you prefer explicit false values
        });

        // Cache the count
        await CacheService.set(cacheKey, unreadCount, 60); // Cache for 1 minute
        console.log('Unread count cached');

        res.json({ unreadCount });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Mark notification as read
router.put('/:notificationId/read', async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Clear related caches
        const username = notification.username;
        await CacheService.del(`unread_count_${username}`);
        // Clear notification list caches for this user
        const cachePattern = `notifications_${username}_*`;
        // Note: You might need to implement a method to delete by pattern
        // or clear specific cache keys

        res.json({ message: 'Notification marked as read', notification });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Mark all notifications as read for a user
router.put('/:username/read-all', async (req, res) => {
    try {
        const { username } = req.params;

        const result = await Notification.updateMany(
            { username, read: { $ne: true } },
            { read: true }
        );

        // Clear related caches
        await CacheService.del(`unread_count_${username}`);
        // Clear all notification caches for this user
        // You might want to implement a method to clear cache by pattern

        res.json({ 
            message: 'All notifications marked as read', 
            modifiedCount: result.modifiedCount 
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a notification
router.delete('/:notificationId', async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findByIdAndDelete(notificationId);

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Clear related caches
        const username = notification.username;
        await CacheService.del(`unread_count_${username}`);

        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new notification (internal use)
router.post('/', async (req, res) => {
    try {
        const { username, actor_id, action, tid, message } = req.body;

        if (!username || !actor_id || !action) {
            return res.status(400).json({ 
                error: 'Username, actor_id, and action are required' 
            });
        }

        const notification = await Notification.create({
            username,
            actor_id,
            action,
            tid: tid || null,
            message: message || null,
            time: new Date(),
            read: false
        });

        // Clear related caches
        await CacheService.del(`unread_count_${username}`);

        console.log('Notification created:', notification._id);
        res.status(201).json({ 
            message: 'Notification created successfully', 
            notification 
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get notification statistics for a user
router.get('/:username/stats', async (req, res) => {
    try {
        const { username } = req.params;

        // Try to get from cache first
        const cacheKey = `notification_stats_${username}`;
        const cachedStats = await CacheService.get(cacheKey);
        if (cachedStats) {
            console.log('Notification stats cache hit');
            return res.json(cachedStats);
        }

        const [
            totalNotifications,
            unreadNotifications,
            likesCount,
            commentsCount,
            retweetsCount,
            followsCount
        ] = await Promise.all([
            Notification.countDocuments({ username }),
            Notification.countDocuments({ username, read: { $ne: true } }),
            Notification.countDocuments({ username, action: 'like' }),
            Notification.countDocuments({ username, action: 'comment' }),
            Notification.countDocuments({ username, action: 'retweet' }),
            Notification.countDocuments({ username, action: 'follow' })
        ]);

        const stats = {
            totalNotifications,
            unreadNotifications,
            readNotifications: totalNotifications - unreadNotifications,
            actionBreakdown: {
                likes: likesCount,
                comments: commentsCount,
                retweets: retweetsCount,
                follows: followsCount
            }
        };

        // Cache the stats
        await CacheService.set(cacheKey, stats, 600); // Cache for 10 minutes
        console.log('Notification stats cached');

        res.json(stats);
    } catch (error) {
        console.error('Error getting notification stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
