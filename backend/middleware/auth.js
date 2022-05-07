const ErrorHandler = require("../utils/error_handler");
const catchasyncerror = require("./catchasyncerror");
const jwt = require('jsonwebtoken');
const user_models = require("../models/user_models");
const User = require('../models/user_models')


exports.isAuthentactedUser = catchasyncerror(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler('Please login to access this resource',401));
    }
    const decodedData = jwt.verify(token,process.env.JWT_SECRET)

    req.user = await User.findById(decodedData.id);
    next();
})

exports.authorizedRoles = (...roles)=>{
    
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role : ${req.user.role} is not allowed to access this resource`,403));
        }
        next();
    }
}