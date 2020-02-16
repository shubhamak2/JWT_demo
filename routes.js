const express = require('express');
const jwt = require('jsonwebtoken');

// UUID
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');

const blackList = require('./blackList');

// Middlewares
const validateToken = require('./middlewares').validateToken;
const isTokenBlackListed = require('./middlewares').isTokenBlackListed;

// Helper methods
const helperMethods = require('./helper');

// Configuration
const config = require('./config');

// setup router
const router = express.Router();

// Instead of database, We're using array for storing the users data for this blog
const users = [];

// Home page
router.get('/', function (req, res) {
  res.send('Welcome to JWT tutorial!!');
})

// Home page
router.post('/register', function (req, res) {  
  const {username, password} = req.body;

  // Validate fields
  const {error, message} = helperMethods.validateFields(username, password, users);
  if (error) {
    return res.status(400).send({
      message,
      error: true
    });  
  }

  // push the usersData into users array
  const userId = uuidv1();
  users.push({id: userId, username, password});

  // create JWT token with 1 day expiration period
  const token = jwt.sign({
    username,
    id: userId,
    // jwt id
    jwtid: uuidv4(),
  }, config.jwtSecret, {'expiresIn': '1d'});
  
  res.status(200).send({
    message: 'Login successful!!',
    data: {token}
  });
})

// Protected route 1
router.get('/protected_route_1', validateToken, isTokenBlackListed, (req, res) => {
  res.status(200).send({
    message: 'Response sent by protected route!!'
  });
});

// logout route
router.post('/logout', validateToken, isTokenBlackListed, async (req, res) => {
  // Adding the token into blackList
  try {
    await blackList.addToken(req.body.decoded_token);  
  } catch(error) {
    return res.status(500).send({
      message: 'Internal server error!!',
      error: true
    });
  }
  
  res.status(200).send({
    message: 'User has been successfully logged out!!',
    error: true
  });  
});

module.exports = router;
