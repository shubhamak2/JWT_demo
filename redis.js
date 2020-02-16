// Redis configuration
const redis = require("redis");
const client = redis.createClient();
 
client.on("error", function (err) {
  console.log("Error from redis side" + err);
});
 
client.on("connect", function() {
  // Here, we're checking if expiration working properly or not
  // Set a value
  // Redis expiration key doc: https://redis.io/commands/set
  // EX seconds -- Set the specified expire time, in seconds.
  // PX milliseconds -- Set the specified expire time, in milliseconds.
  client.set("tempKey", "Hello World", "EX", 2, function (err, reply) {
    console.log(reply.toString());
  });
  // Get a value
  setTimeout(() => {
    client.get("tempKey", function (err, reply) {
      // here, we will get the empty value because value have already expired after 2 seconds
      console.log(reply);
    });
  }, 3000);  
});

module.exports = client;
