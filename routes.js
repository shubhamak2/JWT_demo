const express = require('express');
const jwt = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');

const router = express.Router();

const users = [];
const secret = "abc123555@";

// Home page
router.get('/', function (req, res) {
  res.send('Welcome to JWT tutorial!!');
})

// Home page
router.post('/register', function (req, res) {  
  const {username, password} = req.body;

  // username validation
  if (!(username && username.trim && username.trim()))
  {
    return res.status(400).send({
      message: 'username is required field and should be \'string\' type',
      error: true
    });
  } 

  // password validation
  if (!(password && password.trim && password.trim()))
  {
    return res.status(400).send({
      message: 'password is required field and should be \'string\' type',
      error: true
    });
  }

  // to check if user already exists
  const isUserAlreadyExist = users.find((userData) => userData.username.toLowerCase() == username.toLowerCase())
  
  if (isUserAlreadyExist) {
    return res.status(400).send({
      message: 'Username already exist!!',
      error: true
    });  
  }

  // push the usersData into users array
  users.push({
    id: uuidv1(),
    username, 
    password
  });

  // create JWT token with 1 day expiration period
  const token = jwt.sign({username}, secret, {'expiresIn': '1d'});
  
  res.status(200).send({
    message: 'Login successful!!',
    data: {token}
  });
})

// Validating the token
const validateToken = async function(req, res, next) {
  const authorization = req.headers.authorization;
  const payload = authorization.split('Bearer ');
  
  if (!payload.length || !payload[1].length)
  {
    return next('Invalid token');
  }

  jwt.verify(payload[1], secret, function(error, response) {
    if (error) {
      return next('Invalid token');   
    }
    next()
  });
};

// Protected route 1
router.get('/protected_route_1', validateToken, function (req, res) {
  res.status(200).send({
    message: 'Response sent by protected route!!'
  });
});

module.exports = router;
