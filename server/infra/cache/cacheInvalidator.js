const { client: redis, fallbackCache } = require('../../redis');

module.exports = async function invalidate(key) {
    const cache = redis.status === 'ready' ? redis : fallbackCache;
    await cache.del(key).catch(console.error);

};