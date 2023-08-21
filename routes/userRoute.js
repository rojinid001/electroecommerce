const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const otpController=require('../controllers/otpController')
const orderController=require('../controllers/orderController')

router.get('/', userController.homepage);
router.get('/login', userController.login);
router.post('/login', userController.authenticate); // Add this line for the POST request to '/login'
router.get('/signup', userController.signup);
router.post('/signup', userController.register);
router.get('/cart', userController.checkout);
router.get('/otplogin', otpController.OTPLogin);
router.get('/logout', userController.logout);
router.get('/forgotPassword',userController.forgotPassword)
router.post('/send-otp',otpController.sendOTP)
router.post('/sendmail',userController.sendMail)
router.get('/reset-password', userController.resetPassword);
router.post('/updatePassword',userController.updatePassword)
router.post('/verify-otp',otpController.verifyOTP)
router.get('/ordersClient',orderController.orderStatusClient)
module.exports = router;
