import redisClient from './redisClient.js';

class CacheService {
    // 检查 Redis 是否可用
    static async isRedisAvailable() {
        try {
            await redisClient.ping();
            return true;
        } catch (error) {
            return false;
        }
    }

    // 设置缓存
    static async set(key, value, expirationInSeconds = 3600) {
        try {
            if (!await this.isRedisAvailable()) {
                console.warn('Redis unavailable, skipping cache set');
                return;
            }
            
            const serializedValue = JSON.stringify(value);
            await redisClient.setEx(key, expirationInSeconds, serializedValue);
            console.log(`Cache set: ${key}`);
        } catch (error) {
            console.error('Cache set error:', error);
        }
    }

    // 获取缓存
    static async get(key) {
        try {
            if (!await this.isRedisAvailable()) {
                console.warn('Redis unavailable, skipping cache get');
                return null;
            }
            
            const value = await redisClient.get(key);
            if (value) {
                console.log(`Cache hit: ${key}`);
                return JSON.parse(value);
            }
            console.log(`Cache miss: ${key}`);
            return null;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    // 删除缓存
    static async del(key) {
        try {
            await redisClient.del(key);
            console.log(`Cache deleted: ${key}`);
        } catch (error) {
            console.error('Cache delete error:', error);
        }
    }

    // 删除多个缓存（支持模式匹配）
    static async delPattern(pattern) {
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(keys);
                console.log(`Cache deleted pattern: ${pattern}, ${keys.length} keys`);
            }
        } catch (error) {
            console.error('Cache delete pattern error:', error);
        }
    }

    // 检查缓存是否存在
    static async exists(key) {
        try {
            return await redisClient.exists(key);
        } catch (error) {
            console.error('Cache exists error:', error);
            return false;
        }
    }

    // 设置会话缓存
    static async setSession(token, userInfo, expirationInSeconds = 86400) { // 24小时
        await this.set(`session:${token}`, userInfo, expirationInSeconds);
    }

    // 获取会话缓存
    static async getSession(token) {
        return await this.get(`session:${token}`);
    }

    // 删除会话缓存
    static async delSession(token) {
        await this.del(`session:${token}`);
    }

    // 用户资料缓存
    static async setUserProfile(username, userProfile, expirationInSeconds = 1800) { // 30分钟
        await this.set(`user_profile:${username}`, userProfile, expirationInSeconds);
    }

    static async getUserProfile(username) {
        return await this.get(`user_profile:${username}`);
    }

    static async delUserProfile(username) {
        await this.del(`user_profile:${username}`);
    }

    // 热门推文缓存
    static async setHotTweets(tweets, expirationInSeconds = 600) { // 10分钟
        await this.set('hot_tweets', tweets, expirationInSeconds);
    }

    static async getHotTweets() {
        return await this.get('hot_tweets');
    }

    // 用户关注列表缓存
    static async setUserFollows(username, type, follows, expirationInSeconds = 900) { // 15分钟
        await this.set(`user_${type}:${username}`, follows, expirationInSeconds);
    }

    static async getUserFollows(username, type) {
        return await this.get(`user_${type}:${username}`);
    }
}

export default CacheService;
