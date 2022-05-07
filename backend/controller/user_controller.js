const ErrorHandler = require('../utils/error_handler');
const catchAsyncError = require('../middleware/catchasyncerror');
const User = require('../models/user_models');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail.js')
const crypto = require('crypto');
const { hash } = require('bcryptjs');
const cloudinary = require("cloudinary");

//Register a User
exports.registerUser = catchAsyncError( async(req,res,next)=>{
    const {name ,email ,password} = req.body;

    // console.log(req.body.avatar)
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder : "avatars",
        width: 150,
        crop: "scale",
      });
      console.log(myCloud)

    const user = await User.create({
        name,email,password,
        avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
        },
    })

    sendToken(user,200,res);

});

    //log in user 
    
    exports.loginUser = catchAsyncError(async(req,res,next)=>{
        const {email,password} = req.body;
        //checking if user has given pass and email

        if(!email||!password){
            return next(new ErrorHandler("Please Enter Email and Password",400));
        }

        const user = await User.findOne({email}).select("+password");
        if(!user){
            return next(new ErrorHandler('Invalid email or password',401));
        }
        
        const isPassMatched = await user.comparePassword(password);
        
        if(!isPassMatched){
            
            return next(new ErrorHandler('Invalid email or password',401));
        }

        sendToken(user,201,res);
    });

    // Log Out a User
    exports.logoutUser = catchAsyncError(async(req,res,next)=>{

        // const user = await User.findById(req.user.id);
        res.cookie('token',null,{
            expires : new Date(Date.now()),
            httpOnly : true,
        })

        res.status(200).json({
            sucess : true,
            message : `Logged Out Sucessfully ${req.user.email}`
        })
    })

    //forgot password
    exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
            const user = await User.findOne({email:req.body.email});

            if(!user){
                return next(new ErrorHandler('user not found',404));
            }

            //get reset pass token
            const resetToken = user.getResetPasswordToken();

            await user.save({validateBeforeSave : false});

            const resetPasswordURL = `${req.protocol}://${req.get(
                'host'
            )}/password/reset/${resetToken}`;
            const message = `Your password reset token is:- \n\n ${resetPasswordURL} \n if you have not requested this email please ignore it`;

            try {
                await sendEmail({
                    email : user.email,
                    subject : 'Ecommerce Password Recovery',
                    message,
                });

                res.status(200).json({
                    sucess: true,
                    message : `Email sent to ${user.email} successfully`,

                })
            } catch (error) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;

                await user.save({validateBeforeSave : false});
                //change the value as undefined and save them

                return next(new ErrorHandler(error.message,500));
            }
        }
    )


    exports.resetPassword = catchAsyncError(async(req,res,next)=>{
        
        // creating token hash
        const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire : {$gt : Date.now() },
        })

        if(!user){
            return next(new ErrorHandler('Reset password token is invalid must have been expired',404));
        }

        if(req.body.password !== req.body.confirmPassword){
            return next(new ErrorHandler("Password does'not matched confirm pass"))
        }
        // console.log(req.body.password)
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        sendToken(user,200,res);
    })

//get user details
exports.getUserDetails = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        sucess:true,
        user,
    })
})

//update users password
exports.updatePassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const isPassMatched = await user.comparePassword(req.body.oldPassword);
        
        if(!isPassMatched){
            return next(new ErrorHandler('Old password is incorrect',401));
        }

        if(req.body.newPassword !== req.body.confirmPassword){
            return next(new ErrorHandler('Password does not match',401));
        }

        user.password = req.body.newPassword;
        await user.save();

    sendToken(user,200,res);
})

//update users profile
exports.updateProfile = catchAsyncError(async(req,res,next)=>{
    
    const newUserData = {
        name : req.body.name,
        email : req.body.email,
    }
    // console.log(req.body.avatar);
    if (req.body.avatar !== "undefined") {
        const user = await User.findById(req.user.id);
        
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
        console.log(imageId);
        console.log("req.body.avatar")
    
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
        
    
        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new : true,
        runValidators : true,
        useFindAndModify : false,
    })
    
    res.status(200).json({
        success : true,
        // users,
    })
    
})

//get all users for admin
exports.getAllUsers = catchAsyncError(async(req,res,next)=>{
    
    const users = await User.find();

    res.status(200).json({
        success : true,
        users,
    }
    )
})

//get single user access by(admin)
exports.getOneUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not exist with id : ${req.params.id}`));
    }
    res.status(200).json({
        success : true,
        user,
    }
    )
})

//update users role -- Admin
exports.updateUserRole = catchAsyncError(async(req,res,next)=>{
    const newUserData = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new : true,
        runValidators : true,
        useFindAndModify : false,
    })

    res.status(200).json({
        success:true,
        user
    })
})

//delete a users -- Admin
exports.deleteUser = catchAsyncError(async(req,res,next)=>{

    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not exist with id : ${req.params.id}`))
    }
    await user.remove();
    res.status(200).json({
        success:true,
        message : "user deleted successfully"
    })
})

