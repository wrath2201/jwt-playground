const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== 'access') {
      return res.status(401).json({ msg: 'Invalid access token' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    if(err.name=='TokenExpiredError'){
      return res.status(401).json({code:'TOKEN_EXPIRED'});
    }
    if(err.name=='JsonWebTokenError'){
      return res.status(401).json({code:'INVAID_TOKEN'})
    }
    return res.status(401).json({code:'AUTH_FAILED'})
  }
};

module.exports = authMiddleware;
