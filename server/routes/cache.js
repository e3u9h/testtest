import express from 'express';
import CacheService from '../utils/cacheService.js';
import redisClient from '../utils/redisClient.js';

const router = express.Router();

// 获取缓存统计信息
router.get('/stats', async (req, res) => {
    try {
        const info = await redisClient.info();
        const memoryInfo = await redisClient.info('memory');
        const stats = {
            uptime: await redisClient.get('uptime'),
            totalKeys: await redisClient.dbSize(),
            memoryUsage: memoryInfo,
            serverInfo: info
        };
        res.json(stats);
    } catch (error) {
        console.error('Cache stats error:', error);
        res.status(500).json({ error: 'Failed to get cache stats' });
    }
});

// 清理所有缓存
router.delete('/clear', async (req, res) => {
    try {
        await redisClient.flushDb();
        res.json({ message: 'All cache cleared successfully' });
    } catch (error) {
        console.error('Cache clear error:', error);
        res.status(500).json({ error: 'Failed to clear cache' });
    }
});

// 清理用户相关缓存
router.delete('/clear/user/:username', async (req, res) => {
    try {
        const username = req.params.username;
        await CacheService.delUserProfile(username);
        await CacheService.delPattern(`user_*:${username}`);
        res.json({ message: `User cache cleared for ${username}` });
    } catch (error) {
        console.error('User cache clear error:', error);
        res.status(500).json({ error: 'Failed to clear user cache' });
    }
});

// 清理热门推文缓存
router.delete('/clear/tweets', async (req, res) => {
    try {
        await CacheService.del('hot_tweets');
        res.json({ message: 'Hot tweets cache cleared' });
    } catch (error) {
        console.error('Tweets cache clear error:', error);
        res.status(500).json({ error: 'Failed to clear tweets cache' });
    }
});

// 手动设置缓存
router.post('/set', async (req, res) => {
    try {
        const { key, value, ttl = 3600 } = req.body;
        await CacheService.set(key, value, ttl);
        res.json({ message: `Cache set for key: ${key}` });
    } catch (error) {
        console.error('Cache set error:', error);
        res.status(500).json({ error: 'Failed to set cache' });
    }
});

// 获取特定缓存
router.get('/get/:key', async (req, res) => {
    try {
        const key = req.params.key;
        const value = await CacheService.get(key);
        res.json({ key, value, found: value !== null });
    } catch (error) {
        console.error('Cache get error:', error);
        res.status(500).json({ error: 'Failed to get cache' });
    }
});

export default router;
