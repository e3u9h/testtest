import { createClient } from 'redis';

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

// 连接到 Redis - 使用 IIFE 避免顶层 await
(async () => {
    try {
        await client.connect();
        console.log('Redis client initialized successfully');
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
})();

export default client;
