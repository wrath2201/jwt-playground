const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('✅ Redis connected');
  }
};

const disconnectRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
    console.log('🛑 Redis disconnected');
  }
};

module.exports = {
  redisClient,
  connectRedis,
  disconnectRedis,
};
