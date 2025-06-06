const { client: redis, fallbackCache } = require('../../redis');

module.exports = async function invalidate(key) {
    const cache = redis.status === 'ready' ? redis : fallbackCache;
    try {
        await cache.del(key);
        console.log(`Cache invalidated for key: ${key}`);
        return true;
    } catch (error) {
        console.error(`Failed to invalidate cache for key ${key}:`, error);
        return false;
    }
};