
const jwt = require("jsonwebtoken");
const { prependListener } = require("../models/user");
require("dotenv");
const User= require("../models/user");
const redisClient = require("../config/redis");


const userMiddleware = async (req,res,next)=>{

    try{

       const {token} = req.cookies;

       if(!token){
        throw new Error("Token is not present");

       }

    const payload = jwt.verify(token,process.env.JWT_SECRET_KEY);

    const {_id}=payload;

    if(!_id){

        throw new Error("Id is missing");

    }

    const result = await User.findById(_id);

    if(!result){
        throw new Error("User does not exist");

    }

    // Now it might be present in redis ke blocklist 

    const IsBlocked= await redisClient.exists(`token:${token}`);

    if(IsBlocked){
        throw new Error ("Invalid Token");
    }

      req.result = result;

      next();



    }

    catch(err){

        res.send("Error:"+err.message);
    }


}


module.exports = userMiddleware;