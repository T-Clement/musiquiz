const { client: redis, fallbackCache } = require("../redis");

// this middleware returns cached data if available
// otherwise it create a method to save the response to cache, and calls the next middleware
module.exports = (keyBuilder = "musiquiz", duration = 3600) => {
  return async (req, res, next) => {

    if(process.env.NODE_ENV === "test") next();

    // if keybuilder is a function, call with req, if not, take default value
    const key = typeof keyBuilder === 'function'
      ? keyBuilder(req)
      // : `_${keyBuilder}_${req.originalUrl || req.url}`;
      : `_${keyBuilder}_`;

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
      // store original express .json() method to use it afterwards
      // (call in controller method who )
    res.originalJson = res.json;
    
    // replace original .json express function by custom
      // but call original .json afterwards with the key originalJson
    res.json = (body) => {
        // put in cache without blocking the response
        if (body) {
          const source = redis.status === "ready" ? "Redis" : "Memory";
          console.log(`Cache set for ${key} (${source})`);
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
