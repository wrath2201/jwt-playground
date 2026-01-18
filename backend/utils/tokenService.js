const jwt = require('jsonwebtoken');

// ---- ACCESS TOKEN ----
const generateAccessToken = (payload) => {
  return jwt.sign(
    { ...payload, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.type !== 'access') {
    throw new Error('Invalid access token');
  }

  return decoded;
};

// ---- REFRESH TOKEN ----
const generateRefreshToken = (payload) => {
  return jwt.sign(
    { ...payload, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  if (decoded.type !== 'refresh') {
    throw new Error('Invalid refresh token');
  }

  return decoded;
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
