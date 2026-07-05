const {createClient}= require("redis");
require("dotenv").config();
const redisClient = createClient({
    username: 'default',
    password:process.env.REDIS_PASSWORD,
    socket: {
        host: 'hands-microfresh-motion-32934.db.redis.io',
        port: 14159
    }
});


module.exports= redisClient;