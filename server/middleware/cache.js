const redis = require("../redis");

// this middleware returns cached data if available
// otherwise it create a method to save the response to cache, and calls the next middleware
module.exports = (prefix = "musiquiz", duration = 3600) => {
  return async (req, res, next) => {
    const key = `_${prefix}_${req.originalUrl || req.url}`;
    let cachedBody;
    try {
      cachedBody = await redis.get(key);
    } catch (error) {
      console.error(`Cache retrieval error for ${key}:`, error);
      // Continue without cache if Redis fails
      cachedBody = null;
    }

    // if data is cached, return it
    if (cachedBody) {
      res.setHeader("Content-Type", "application/json");
      console.log(`Cache hit for ${key}`);
      return res.status(200).json(JSON.parse(cachedBody));
    }

    // save method to be used and call in controller / route
    res.originalJson = res.json;
    res.json = (body) => {
      // put in cache
      try {
        redis.set(key, JSON.stringify(body), "EX", duration);
        console.log(`Cache set for ${key}`);
      } catch (error) {
        console.error(`Cache storage error for ${key}:`, error);
      }
      // call original res.json
      return res.originalJson(body);
    };

    next();
  };
};
