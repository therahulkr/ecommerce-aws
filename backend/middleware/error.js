const ErrorHandler = require('../utils/error_handler');


module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode||500;
    err.message = err.message || 'Internal Server Error';
    
    //wrong Mongodb Id error
    if(err.name === 'CastError'){
        const msg = `Resource not found. Invalid : ${err.path}`;
        err = new ErrorHandler(msg,400);
    }
    
    //Mongoose duplicate key error
    if(err.code === 11000){
        const msg = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(msg,400);
    }

    //wrong JWT TOKEN
    if(err.name === "JsonWebTokenError"){
        const msg = `Json Web Token is Invalid try again`;
        err = new ErrorHandler(msg,400);
    }

    //wrong JWT expire error
    if(err.name === "JsonExpiredError"){
        const msg = `Json Web Token is Expired try again`;
        err = new ErrorHandler(msg,400);
    }

    res.status(err.statusCode).json({
        success : false,
        message : err.message,
    })
}

