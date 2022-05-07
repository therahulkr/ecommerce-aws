const express = require('express');
const router = express.Router();
const { newOrder, getOneOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require('../controller/order_controller');
const { isAuthentactedUser,authorizedRoles } = require('../middleware/auth');


router.route('/order/new')
.post(isAuthentactedUser,newOrder);

router.route('/order/me')
.get(isAuthentactedUser,myOrders)

router.route('/order/:id')
.get(isAuthentactedUser,getOneOrder);

router.route('/admin/orders')
.get(isAuthentactedUser,authorizedRoles('admin'),getAllOrders);

router.route('/admin/order/:id')
.put(isAuthentactedUser,authorizedRoles('admin'),updateOrder)
.delete(isAuthentactedUser,authorizedRoles('admin'),deleteOrder);

module.exports = router;
