const redisClient = require("../config/redisdb");

exports.cacheMiddleware = (keyInitial) => {
  return async (req, res, next) => {
    try {
      const key = `${keyInitial}`;
      // let data = await redisClient.hGet("allUsers", key);
      // const data = await redisClient.hGetAll(`user:${email}`);
      // let data = JSON.parse(await redisClient.get(key));
      let data = JSON.parse(await redisClient.json.GET(key));
      // let data = await redisClient.HGETALL(key, "users");

      if (data) {
        console.log("cache hitted");
        res.json({ response: true, user: data });
      } else {
        req.key = key;
        // console.log(req.key);
        console.log("cache not hitted");
        next();
      }
    } catch (error) {
      console.log("Error in Cache Middleware: ", error);
      next(error);
    }
  };
};
