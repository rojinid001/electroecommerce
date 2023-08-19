const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route for creating a payment request
router.post('/create-payment', paymentController.createPaymentRequest);

// Route for handling payment success callback
router.post('/payment-success', paymentController.handlePaymentSuccess);

module.exports = router;
