const dns= require('node:dns/promises');
dns.setServers(["1.1.1.1","8.8.8.8"]);
const mongoose = require("mongoose");
require('dotenv').config();

async function  main() {
  
  // console.log(process.env.DB_CONNECTION_STRING);
   await mongoose.connect(process.env.DB_CONNECTION_STRING);
    
}

module.exports = main;