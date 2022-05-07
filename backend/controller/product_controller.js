const Product = require('../models/productModel');
const ErrorHandler = require('../utils/error_handler');
const catchAsyncError = require('../middleware/catchasyncerror');
const ApiFeatures = require('../utils/api_features')
const cloudinary = require("cloudinary");

//create Product == admin
exports.createProduct = catchAsyncError(async(req,res,next)=>{
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
    const imagesLinks = [];
    console.log(images.length)
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
  
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.images = imagesLinks;


        req.body.user = req.user.id;
          console.log(req.body);
        const product = await Product.create(req.body);
    
        res.status(201).json({
            success:true,
            product
        });
});



//see all products
exports.getAllProducts = catchAsyncError(async(req,res,next)=>{
    // return next(new ErrorHandler('product not found',404) );
    const resultPerPage = 8;
    const productCount = await Product.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
    
    const product = await apiFeatures.query;
    return res.status(200).json({
        success:true,
        product,
        productCount,
        resultPerPage
    })
});


//update product --> admin 
exports.updateProduct = catchAsyncError(async(req,res,next)=>{
    console.log('aagya')
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler('product not found',404));
    }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators : true,
        useFindAndModify : false
    });
    res.status(200).json({ 
        success:true,
        product
    })
})

//Delete Product --> admin

exports.deleteProduct = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler('product not found',404));
    }

     // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }
    await product.remove();

    res.status(200).json({
        success:true,
        message:"Product Delete successfully"
    })
})

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });


//get product details
exports.getProductDetails = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler('product not found',404));
    }
    res.status(200).json({
        success:true,
        product
    })
});

//create a new review or update the review
exports.createProductReview = catchAsyncError(async(req,res,next)=>{
    const {rating ,comment,productId} = req.body;
    
    const review = {
        user : req.user._id,
        name : req.user.name,
        rating : Number(rating),
        comment,
    }

    const product = await Product.findById(productId);
    
    const isReviewed = product.reviews.find(
        (rev)=>rev.user.toString()===req.user._id.toString()
    );
    
    // if a user review already exist then update that review
    if(isReviewed){
        product.reviews.forEach(rev=>{
            if(rev.user.toString()==req.user._id.toString()){
                rev.rating = rating,
                rev.comment = comment
            }
        })
    }
    else{
        product.reviews.push(review);
        product.numofReviews = product.reviews.length
    }
    let avg = 0;
    product.reviews.forEach(rev=>{
        avg += rev.rating;
    })
    
    product.ratings = avg/product.reviews.length;

    await product.save({validateBeforeSave : false});

    res.status(200).json({
        success : true,
    })
})

//get all reviews of a product
exports.getProductReviews = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success : true,
        reviews : product.reviews,
    })
})

// Delete Review 
exports.deleteReviews = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    
    //below review will contain all the review
    const reviews = product.reviews
    .filter(rev=>rev._id.toString()!=req.query.id.toString()
    );

    let avg = 0;
    reviews.forEach(rev=>{
        avg += rev.ratings;
    })
    const ratings=0;
    if(reviews.length!=0){
        ratings = avg/reviews.length;
    }
    const numofReviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productId,
        {
            reviews,
            ratings,
            numofReviews,
        },
        {
            new : true,
            runValidators : true,
            useFindAndModify:false,
        })

    res.status(200).json({
        success : true,
        message : "Review deleted Successfully"
    })
})