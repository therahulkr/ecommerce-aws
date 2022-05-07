const Order = require('../models/order_models');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/error_handler');
const catchAsyncError = require('../middleware/catchasyncerror');


// Create new Order
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
   console.log(req.body)
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });
  
    res.status(201).json({
      success: true,
      order,
    });
  });

// get single order 
exports.getOneOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)
    .populate("user",
    "name email");

    if(!order){
        return next(new ErrorHandler("order not found with this Id",404));
    }

    res.status(200).json({
        success:true,
        order,
    })
})

// get logged in user orders
exports.myOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find({user:req.user.id});
    res.status(200).json({
        success:true,
        orders,
    })
})

// get all orders -- admin
exports.getAllOrders = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find();

    let totalamount = 0;
    orders.forEach(order=>{
        totalamount += order.totalPrice;
    });

    res.status(200).json({
        success:true,
        totalamount,
        orders,
    })
})

// update order status -- admin
exports.updateOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("order not found with this Id",404));
    }
    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("You have delivered this order",404))
    }
    
    order.orderItems.forEach(async(odr)=>{
        await updateStock(odr.product,odr.quantity);
    })

    order.orderStatus = req.body.status;
    
    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
        message : "your order delivered successfully"
    })
})

async function updateStock(id,quantity){
    const product = await Product.findById(id);

    product.Stock -= quantity;
    await product.save({validateBeforeSave:false});
}

// delete an order
exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("order not found with this Id",404));
    }

    await order.remove();
    res.status(200).json({
        success:true,
        message : "Requested order has been deleted",
    })
})
