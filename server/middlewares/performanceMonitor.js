import CacheService from '../utils/cacheService.js';

// 性能监控中间件
const performanceMonitor = (req, res, next) => {
    const start = Date.now();
    
    // 记录请求信息
    const requestInfo = {
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent'),
        ip: req.ip
    };
    
    // 响应结束时记录性能数据
    res.on('finish', async () => {
        const duration = Date.now() - start;
        const responseInfo = {
            ...requestInfo,
            statusCode: res.statusCode,
            duration: duration
        };
        
        // 记录慢查询（超过1秒的请求）
        if (duration > 1000) {
            console.warn(`Slow query detected: ${req.method} ${req.url} took ${duration}ms`);
            
            // 将慢查询记录到 Redis
            try {
                const slowQueries = await CacheService.get('slow_queries') || [];
                slowQueries.push(responseInfo);
                
                // 只保留最近100条慢查询记录
                if (slowQueries.length > 100) {
                    slowQueries.shift();
                }
                
                await CacheService.set('slow_queries', slowQueries, 86400); // 缓存24小时
            } catch (error) {
                console.error('Failed to log slow query:', error);
            }
        }
        
        // 记录API调用统计
        try {
            const statsKey = `api_stats:${req.method}:${req.route?.path || req.url}`;
            const stats = await CacheService.get(statsKey) || {
                count: 0,
                totalDuration: 0,
                avgDuration: 0
            };
            
            stats.count += 1;
            stats.totalDuration += duration;
            stats.avgDuration = Math.round(stats.totalDuration / stats.count);
            
            await CacheService.set(statsKey, stats, 86400);
        } catch (error) {
            console.error('Failed to record API stats:', error);
        }
    });
    
    next();
};

export default performanceMonitor;
