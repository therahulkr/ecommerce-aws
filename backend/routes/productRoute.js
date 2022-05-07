const express = require('express');
const { getAllProducts,createProduct, 
        updateProduct, deleteProduct, 
        getProductDetails, createProductReview, 
        getProductReviews, deleteReviews,
        getAdminProducts 
      } = require('../controller/product_controller');

const { isAuthentactedUser, authorizedRoles } = require('../middleware/auth');

const router = express.Router();

router
.route('/products')
.get(getAllProducts);

router
  .route("/admin/products")
  .get(isAuthentactedUser, authorizedRoles("admin"), getAdminProducts);


router
.route('/admin/product/new')
.post(isAuthentactedUser,authorizedRoles('admin'),createProduct);

router.route('/admin/products/:id')
.put(isAuthentactedUser,authorizedRoles('admin'),updateProduct)
.delete(isAuthentactedUser,authorizedRoles('admin'),deleteProduct)

router
.route('/product/:id')
.get(getProductDetails);

router.route("/review")
.put(isAuthentactedUser,createProductReview)

router.route("/reviews")
.get(getProductReviews)
.delete(isAuthentactedUser,deleteReviews);

module.exports = router;