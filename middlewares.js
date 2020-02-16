const jwt = require('jsonwebtoken');
const config = require('./config');

// Validating the token
const validateToken = async (req, res, next) => {
  const authorization = req.headers.authorization;
  const payload = authorization && authorization.split('Bearer ');
  
  if (!payload || !payload.length || !payload[1].length)
  {
    return next('Invalid token');
  }

  jwt.verify(payload[1], config.jwtSecret, (error, response) => {
    if (error) {
      return next('Invalid token');   
    }
    req.body['decoded_token'] = jwt.decode(payload[1]);
    next()
  });
};

module.exports.validateToken = validateToken;
