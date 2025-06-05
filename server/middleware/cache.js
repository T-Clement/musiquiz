const { client: redis, fallbackCache } = require("../redis");

// this middleware returns cached data if available
// otherwise it create a method to save the response to cache, and calls the next middleware
module.exports = (prefix = "musiquiz", duration = 3600) => {
  return async (req, res, next) => {
    const key = `_${prefix}_${req.originalUrl || req.url}`;

    // get cache instance used
    const cache = redis.status === "ready" ? redis : fallbackCache;

    try {
      // try to get from cache
      const cachedBody = await cache.get(key);

      if (cachedBody) {
        res.setHeader("Content-Type", "application/json");
        const source = redis.status === "ready" ? "Redis" : "Memory";
        console.log(`Cache hit for ${key} (${source})`);
        return res.status(200).json(JSON.parse(cachedBody));
    }
    
    // modify response to cache the result
    res.originalJson = res.json;
    res.json = (body) => {
        // put in cache without blocking the response
        if (body) {
          console.log(`Cache set for ${key}`);
          cache.set(key, JSON.stringify(body), "EX", duration)
            .catch(err => console.error('Failed to set cache:', err));
        }

        // always return original response
        return res.originalJson(body);
      };

      next();
    } catch (err) {
      console.error("Cache middleware error:", err);
      next();
    }
  };
};
