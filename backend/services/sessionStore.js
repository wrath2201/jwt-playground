const { redisClient } = require('../utils/redisClient');
const crypto = require('crypto');

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const saveRefreshToken = async (userId, token) => {
  await redisClient.set(
    `refresh:${userId}`,
    hashToken(token),
    { EX: 7 * 24 * 60 * 60 }
  );
};

const verifyRefreshToken = async (userId, token) => {
  const stored = await redisClient.get(`refresh:${userId}`);
  return stored === hashToken(token);
};

const invalidateRefreshToken = async (userId) => {
  await redisClient.del(`refresh:${userId}`);
};

module.exports = {
  saveRefreshToken,
  verifyRefreshToken,
  invalidateRefreshToken,
};
