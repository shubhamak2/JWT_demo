const jwt = require('jsonwebtoken');
const client = require('./redis');
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

// Check if user token exist on redis blackList
const isTokenBlackListed = async (req, res, next) => {
  const decodedToken = req.body['decoded_token'];
  client.get(decodedToken.jwtid, (err, reply) => {
    if (err) {
      next('Internal server error'); 
    } else {
      if (reply) {
        return res.status(403).send({
          message: 'You have been already logged out!!',
          error: true
        });  
      }
      next()
    }
  });
};

module.exports.validateToken = validateToken;
module.exports.isTokenBlackListed = isTokenBlackListed;
