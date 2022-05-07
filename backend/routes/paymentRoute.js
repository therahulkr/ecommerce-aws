const express = require("express");
const { processPayment, sendStripeApiKey } = require("../controller/paymentController");
const router = express.Router();


const { isAuthentactedUser } = require("../middleware/auth");


router.route("/payment/process").post(isAuthentactedUser, processPayment);

router.route("/stripeapikey").get(isAuthentactedUser, sendStripeApiKey);

module.exports = router;