if(process.env.NODE_ENV!=="PRODUCTION")
 require('dotenv').config({path:"config/config.env"});

const cloudinary = require("cloudinary");

const app = require('./app');
const connectDatabase = require("./config/database");

process.on('uncaughtException',(err)=>{
    console.log('Error',`${err.message}`);
    console.log('Shutting down the server due to unhandled Exception');
    process.exit(1); 
})


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const server = app.listen(process.env.PORT,()=>{
    console.log('server is loaded on Port : ',`${process.env.PORT}`);
})

// Unhandled Promise Rejection
process.on('unhandledRejection',(err)=>{
    console.log('Error',`${err.message}`);
    console.log('Shutting down the server due to unhandled Promise Rejection');

    server.close(()=>{
        process.exit(1);
    })
})