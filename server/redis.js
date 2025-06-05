const Redis = require("ioredis");

// get Redis connection details from env variables
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false, // Prevent commands from being queued while disconnected
  retryStrategy(times) {
    // limit of retry until fallback to in-memory cache
    if (times > 3) {
      console.warn(`Redis retry attempt ${times} failed, switching to fallback cache`);
      return false; // stops retrying
    }
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
};

// fallback in-memory cache for when Redis is unavailable
class FallbackCache {
  constructor() {
    this.cache = new Map();
    console.warn('WARNING - Using fallback in-memory cache - do not use in production! - WARNING');
  }

  async get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key, value, expType, duration) {
    const expiry = expType === 'EX' ? Date.now() + (duration * 1000) : null;
    this.cache.set(key, { value, expiry });
    return 'OK';
  }

  on() {
    return this;
  }

  // add status property to match Redis interface
  get status() {
    return 'ready';
  }
}

// singleton instance of FallbackCache
const fallbackCache = new FallbackCache();

// ----------------------------------------------------------
let client;
try {
  client = process.env.REDIS_URL 
    ? new Redis(process.env.REDIS_URL)
    : new Redis(redisConfig);
  console.log('Redis client initialized with config:', redisConfig);

  let hasSwitchedToFallback = false;

  client.on('error', (err) => {
    console.error('Redis connection error:', err);
    if (!hasSwitchedToFallback) {
      console.warn('Switching to fallback in-memory cache');
      client = fallbackCache;
      hasSwitchedToFallback = true;
    }
  });

  client.on('end', () => {
    console.warn('Redis connection ended');
    if (!hasSwitchedToFallback) {
      console.warn('Switching to fallback in-memory cache');
      client = fallbackCache;
      hasSwitchedToFallback = true;
    }
  });

  client.on('connect', () => {
    if (hasSwitchedToFallback) {
      console.log('Redis reconnected, but staying with fallback cache for consistency');
    } else {
      console.log('Successfully connected to Redis');
    }
  });

  client.on('ready', () => {
    if (!hasSwitchedToFallback) {
      console.log('Redis client is ready to handle requests');
    }
  });

} catch (err) {
  console.error('Failed to initialize Redis:', err);
  console.warn('Using fallback in-memory cache');
  client = fallbackCache;
}

// export Redis client and fallback cache
module.exports = { 
  client,
  fallbackCache 
};
