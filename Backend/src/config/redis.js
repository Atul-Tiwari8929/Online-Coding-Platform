const {createClient}= require("redis");
require("dotenv").config();
const redisClient = createClient({
    username: 'default',
    password:process.env.REDIS_PASSWORD,
    socket: {
        host: 'team-health-turboneat-16806.db.redis.io',
        port: 16502
    }
});


module.exports= redisClient;


