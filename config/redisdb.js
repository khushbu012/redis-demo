// const { createClient } = require("redis");

// const redisClient = createClient({
//     url:"redis-14808.c323.us-east-1-2.ec2.redns.redis-cloud.com:14808"
// });

// redisClient.on("error", (err) => console.log("Redis Client Error", err));

// redisClient.connect();

// module.exports = redisClient;
const { createClient } = require('redis');

const redisClient = createClient({
  url: 'redis://redis-14808.c323.us-east-1-2.ec2.redns.redis-cloud.com:14808',
  password: 'ia0Vl6D88xDCaSetJHzkrgYdp81uuDHr',
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis server.');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

module.exports = redisClient;
