 
const express    = require('express');        
const bodyParser = require('body-parser');

const routes = require('./routes');
const app = express();

// Register middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// REGISTER ROUTES
app.use('/', routes);

// START THE SERVER
app.listen(5000, function() {
  console.log('Server accepting requests on port 5000......');
});
