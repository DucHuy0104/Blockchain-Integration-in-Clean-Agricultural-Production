const redis = require('redis');

// Redis configuration - supports both Docker and Cloud
const redisConfig = process.env.REDIS_URL
    ? {
        // URL format (Docker or cloud URL)
        url: process.env.REDIS_URL,
        socket: {
            reconnectStrategy: (retries) => {
                if (retries > 10) {
                    console.error('❌ Redis: Too many reconnection attempts');
                    return new Error('Redis reconnection failed');
                }
                return retries * 100;
            }
        }
    }
    : process.env.REDIS_HOST
        ? {
            // Redis Cloud format (username/password/host/port)
            username: process.env.REDIS_USERNAME || 'default',
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT || '6379'),
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        console.error('❌ Redis: Too many reconnection attempts');
                        return new Error('Redis reconnection failed');
                    }
                    return retries * 100;
                }
            }
        }
        : {
            // Default: Docker Redis
            url: 'redis://redis:6379',
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        console.error('❌ Redis: Too many reconnection attempts');
                        return new Error('Redis reconnection failed');
                    }
                    return retries * 100;
                }
            }
        };

// Create Redis client
const client = redis.createClient(redisConfig);

// Error handling
client.on('error', (err) => {
    console.error('❌ Redis Client Error:', err.message);
});

client.on('connect', () => {
    console.log('✅ Redis Connected');
});

client.on('ready', () => {
    console.log('✅ Redis Ready');
});

// Connect to Redis
const connectRedis = async () => {
    try {
        await client.connect();
    } catch (error) {
        console.error('❌ Redis Connection Error:', error.message);
        console.log('⚠️  Continuing without Redis cache...');
    }
};

/**
 * Get cached data
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} - Cached data or null
 */
const getCache = async (key) => {
    try {
        if (!client.isOpen) return null;
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Redis GET error for key "${key}":`, error.message);
        return null;
    }
};

/**
 * Set cache data
 * @param {string} key - Cache key
 * @param {any} value - Data to cache
 * @param {number} ttl - Time to live in seconds (default: 300 = 5 minutes)
 */
const setCache = async (key, value, ttl = 300) => {
    try {
        if (!client.isOpen) return;
        await client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
        console.error(`Redis SET error for key "${key}":`, error.message);
    }
};

/**
 * Delete cache by key or pattern
 * @param {string} keyOrPattern - Cache key or pattern (e.g., 'products:*')
 */
const deleteCache = async (keyOrPattern) => {
    try {
        if (!client.isOpen) return;

        if (keyOrPattern.includes('*')) {
            // Delete by pattern
            const keys = await client.keys(keyOrPattern);
            if (keys.length > 0) {
                await client.del(keys);
                console.log(`🗑️  Deleted ${keys.length} cache keys matching "${keyOrPattern}"`);
            }
        } else {
            // Delete single key
            await client.del(keyOrPattern);
        }
    } catch (error) {
        console.error(`Redis DELETE error for "${keyOrPattern}":`, error.message);
    }
};

/**
 * Cache middleware for Express routes
 * @param {number} ttl - Time to live in seconds
 * @returns {Function} Express middleware
 */
const cacheMiddleware = (ttl = 300) => {
    return async (req, res, next) => {
        if (!client.isOpen) return next();

        const key = `cache:${req.originalUrl}`;

        try {
            const cachedData = await getCache(key);
            if (cachedData) {
                console.log(`✅ Cache HIT: ${key}`);
                return res.json(cachedData);
            }

            console.log(`❌ Cache MISS: ${key}`);

            // Override res.json to cache the response
            const originalJson = res.json.bind(res);
            res.json = (data) => {
                setCache(key, data, ttl);
                return originalJson(data);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error.message);
            next();
        }
    };
};

module.exports = {
    client,
    connectRedis,
    getCache,
    setCache,
    deleteCache,
    cacheMiddleware
};
