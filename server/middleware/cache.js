const redis = require("../redis");

// this middleware returns cached data if available
// otherwise it create a method to save the response to cache, and calls the next middleware
module.exports = (prefix = "", duration = 3600) => {
  return async (req, res, next) => {
    const key = `__musiquiz__${req.originalUrl || req.url}`;
    const cachedBody = await redis.get(key);

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
      redis.set(key, JSON.stringify(body), "EX", 60 * 60); // Cache for 1 hour
      // call original res.json
      res.originalJson(body);
      console.log(`Cache set for ${key}`);
    };

    next();
  };
};
