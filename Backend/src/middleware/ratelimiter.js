const redisClient = require('../config/redis');

const submitCodeRateLimiter = async(req,res,next)=>{

    const userId = req.result._id;
    const redisKey= `submit_cooldown:${userId}`;

    try{
        // Check if user has a recent submission
        const exists = await redisClient.exists(redisKey);

        if(exists){

            return res.status(429).json({
                error :'Please wait 10 seconds before submitting again'
            });
        }

        // Set cooldown Period 

        await redisClient.set(redisKey,'cooldown_active',{
            EX:10, // EXPIRE After 10 Seconds
            NX:true // Only set if not exists
        })

        next();
    }

    catch(err){
 
        console.error('Rate Limiter error:', err);
        res.status(500).json({error:"Internal Server Error"});

    };
};

module.exports = submitCodeRateLimiter;