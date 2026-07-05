const express=require('express');
const validator= require("../utils/validator");
const {register,login,logout,adminRegister,deleteProfile}= require('../controllers/userAuthenticate');
const userMiddleware= require("../middleware/userMiddleware");
const adminMiddleware= require("../middleware/adminMiddleware");
const authRouter = express.Router();

// Register
authRouter.post("/register",register);
//login
authRouter.post('/login',login);
authRouter.post('/logout',userMiddleware,logout);
authRouter.post('/admin/register',adminMiddleware,adminRegister);
authRouter.post('/deleteProfile',userMiddleware,deleteProfile);
//authRouter.get('getProfile',getProfile);

module.exports= authRouter;

//logout
//GetProfile