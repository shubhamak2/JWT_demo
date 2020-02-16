const jwt = require('jsonwebtoken');
const moment = require('moment');
const client = require('./redis');

const blackList = {
  addTokenInBlackList: (token) => {
    return new Promise((resolve, reject) => {
      // Decoding the JWT token
      const jwtData = jwt.decode(token);
      // Fetch the toke expiry time
      const expirationTime = jwtData.payload.exp;
      const tokenExpiryDate = moment(expirationTime);
      const currentDate = moment();
      // Calculating the difference between tokenExpiry and currentTime
      const seconds = tokenExpiryDate.diff(currentDate, 'seconds');
      const jwtUniqueTokenId = jwtData.payload.jti;
      // Setting the redis key as jti and its value is userId
      // It will expire in calculated seconds
      client.set(jwtUniqueTokenId, jwtData.payload.userId, "EX", seconds, function (err, reply) {
        console.log(reply.toString());
      });     
    });
  }
};

module.exports = blackList;
