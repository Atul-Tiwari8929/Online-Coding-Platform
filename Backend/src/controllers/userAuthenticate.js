const User = require("../models/user");
const validate = require("../utils/validator");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require("bcrypt");
const redisClient = require("../config/redis");
const Submission = require("../models/submission")


const register = async (req, res) => {

    try {

        // validate the data
        validate(req.body);
        const { firstName, emailId, password } = req.body;

        // Also we can ensure to check whether the email already exitsts or not but 
        // here it not needed as User.Create already checks that 
        // User.exists({emailId:});

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'user';

        // Now here we have two ways to access the profile
        // first one is either we can provide the access token just after registering
        // second one is to provide the access token after login even if we have already registering


        const user = await User.create(req.body);
        const token = jwt.sign({ _id: user._id, emailId: emailId, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: 3600 });
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
        res.status(201).send("User Registered Successfully");


    }
    catch (err) {
        res.status(400).send("Error" + err.message);
    }


}

const login = async (req, res) => {

    try {

        const { emailId, password } = req.body;

        if (!emailId) {

            throw new Error("Invalid Credentials");

        }

        if (!password) {
            throw new Error("Invalid Credentials");
        }

        const user = await User.findOne({ emailId });

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            throw new Error("Invalid Credentials");

        }

        const token = jwt.sign({ _id: user._id, emailId: emailId, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: 3600 });
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });

        res.status(200).send("Logged in Successfully");


    }
    catch (err) {

        res.status(401).send("Error:" + err.message);

    }
}

const logout = async (req, res) => {

    try {

        const { token } = req.cookies;

        const payload = jwt.decode(token);


        await redisClient.set(`token:${token}`, `Blocked`);
        await redisClient.expireAt(`token:${token}`, payload.exp);

        res.cookie("token", null, { expires: new Date(Date.now()) });
        res.send("Logged out Successfully");
        // Token will be added into the reddis db
        // Cookies ko clear karna hai



    }
    catch (err) {
        res.status(503).send("Error:" + err.message);

    }



}

const adminRegister = async (req, res) => {

    try {

        // validate the data
        // if(req.result.role!="admin"){
        //     throw new Error("Invalid Token")
        // }

        validate(req.body);
        const { firstName, emailId, password } = req.body;


        req.body.password = await bcrypt.hash(password, 10);
        

        // Now here we have two ways to access the profile
        // first one is either we can provide the access token just after registering
        // second one is to provide the access token after login even if we already have registered


        const user = await User.create(req.body);
        const token = jwt.sign({ _id: user._id, emailId: emailId, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: 3600 });
        res.cookie('token', token, { maxAge: 60 * 60 * 1000 });
        res.status(201).send("User Registered Successfully");


    }
    catch (err) {
        res.status(400).send("Error" + err.message);
    }

}

const deleteProfile = async (req,res)=>{

    try{
     
        const userId = req.result._id;

        // delete from userSchema 
        await User.findByIdAndDelete(userId);

        // Must delete from submission schema

        // await Submission.deleteMany({userId});

        res.status(200).send("Deleted Successfully");


    }
   catch(err){

    res.status(500).send("Internal Server Error");


   }

}

module.exports = { register, login, logout,adminRegister,deleteProfile };