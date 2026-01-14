const jwt = require('jsonwebtoken');
const redisClient = require('../utils/redisClient');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader || req.headers.token;


  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

 try {
    const isBlacklisted = await redisClient.get(token);
    if (isBlacklisted) {
      return res.status(401).json({ msg: 'Token is blacklisted. Please login again.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;

