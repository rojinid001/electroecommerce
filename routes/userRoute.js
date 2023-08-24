const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const otpController=require('../controllers/otpController')
const orderController=require('../controllers/orderController')
const passport = require('../middleware/passportConfig');
const productController=require('../controllers/productController')
const passportauthenticate = passport.authenticate('local', {
    successRedirect: '/', // Redirect to the home page on successful login
    failureRedirect: '/login', // Redirect to the login page on failure
    failureFlash: true, // Enable flash messages for authentication errors
  });
router.get('/', userController.homepage);
router.get('/login', userController.login);
router.post('/login',userController.authenticate,passportauthenticate); // Add this line for the POST request to '/login'
router.get('/signup', userController.signup);
router.post('/signup', userController.register);
router.get('/cart', productController.getCart);
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
