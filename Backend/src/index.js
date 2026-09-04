


const express = require('express');
const main = require('./config/db');
const app = express();
require('dotenv').config();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/userAuth")
const problemRouter= require("./routes/problemCreator")
const submitRouter = require("./routes/submit")
const aiRouter = require("./routes/aiChatting")
const cors = require('cors')

app.use(cors({
 origin: 'https://online-coding-platform-vwjv.vercel.app',
 credentials:true

}))  



app.use(express.json());
app.use(cookieParser());
app.use('/user', authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use("/ai",aiRouter);

const redisClient=require("./config/redis");


const InitializeConnection = async () => {

    try {

        await Promise.all([redisClient.connect(), main()]) // to execute parallely
        console.log("DB connected");

        app.listen(process.env.PORT, () => {

            console.log("Listening at port 3000");
        })


    }

    catch (err) {

        console.log(err.message);


    }
}


InitializeConnection();

// main().then(async ()=>{

// app.listen(process.env.PORT,()=>{
//     console.log("Server Started");
// })

// })
// .catch((err)=>{
//     console.log("Error:"+ err.message);
// })

