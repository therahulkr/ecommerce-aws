const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name :{
        type : String,
        required : [true,"Please Enter your Name"],
        maxlength : [30,"name can'not excess 40 characters"],
        minlength : [4,"name should have more than 4 characters"]
    },
    email : {
        type : String,
        required : [true,"Please Enter your Email"],
        unique : true,
        validate : [validator.isEmail, 'Please fill a valid email address']
    },
    password : {
        type : String,
        required : [true,"Please enter your Password"],
        minlength : [8,"password should have more than 8 characters"],
        select : false
    },
    avatar : {
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String, 
            required:true 
        }
    },
    role : {
        type : String,
        default : "user",

    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,
    createdAt: {
        type: Date,
        default: Date.now,
      },
});

// we will not use =>funcn cz then we can'not use this
userSchema.pre('save',async function(next){
//this if else condition use for updation of profile
    // console.log('aagya encryption me')
      if(!this.isModified("password")){
          next();
      }
        
      this.password = await bcrypt.hash(this.password,10);//10 is power
});

//JWT TOKEN
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPRIES,
    });
}

userSchema.methods.comparePassword = async function(enteredPassword){
    // console.log(this.password)
     return await bcrypt.compare(enteredPassword,this.password);
}

//generating Password reset token
userSchema.methods.getResetPasswordToken = function(){
    //generating the token
    const resetToken = crypto.randomBytes(20).toString('hex')

    //hashing and adding to the userSchema
    this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    this.resetPasswordExpire = Date.now() + 15*60*1000;
    return resetToken;
}

module.exports = mongoose.model('User',userSchema);