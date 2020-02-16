const jwt = require('jsonwebtoken');
const moment = require('moment');
const client = require('./redis');

const blackList = {
  addToken: (payload) => {
    return new Promise((resolve, reject) => {
      // Fetch the toke expiry time
      const tokenExpiryTime = moment(new Date(payload.exp * 1000));
      
      // Calculating the difference between the token expired time and current time in seconds 
      const seconds = tokenExpiryTime.diff(moment(), 'seconds');

      // Setting the redis key as jti and its value as id of the user
      // It will expire in calculated seconds
      client.set(payload.jwtid, payload.id, "EX", seconds, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          console.log('Stored key', payload.jwtid);
          resolve(reply);  
        }
      });     
    });
  }
};

module.exports = blackList;
