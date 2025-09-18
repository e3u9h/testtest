// 测试 Redis 连接的脚本
import './utils/redisClient.js';
import CacheService from './utils/cacheService.js';

console.log('Testing Redis connection...');

// 等待一秒让 Redis 连接完成
setTimeout(async () => {
    try {
        // 测试基本的 set/get 操作
        await CacheService.set('test_key', { message: 'Hello Redis!' }, 60);
        const result = await CacheService.get('test_key');
        
        if (result && result.message === 'Hello Redis!') {
            console.log('✅ Redis connection test passed!');
            console.log('Retrieved value:', result);
        } else {
            console.log('❌ Redis connection test failed - no data retrieved');
        }
        
        // 清理测试数据
        await CacheService.del('test_key');
        console.log('✅ Test cleanup completed');
        
    } catch (error) {
        console.error('❌ Redis connection test failed:', error);
    }
    
    process.exit(0);
}, 2000);
