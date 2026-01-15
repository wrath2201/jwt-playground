const jwt= require('jsonwebtoken');

//---ACCESS TOKEN----

const generateAccessToken =(payload)=>{
    return jwt.sign(
        payload,
        process.env.JWT_Secret,
        {expiresIn:'15m'}
    );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

//---REFRESH TOKEN-------
const generateRefreshToken=(Token)=>{
    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRRET,
        { expiresIn :'7d'}
    );
};

const verifyRefreshToken=(Token)=>{
    return jwt.verify(Token,process.env.JWT_REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};