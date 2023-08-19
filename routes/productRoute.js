const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const checkoutController = require('../controllers/checkoutController');
const profileController = require('../controllers/profileController'); // Import the address controller

router.get('/product/:id', productController.getProductById);
router.get('/cart', productController.getCart);
router.post('/product/:id/add-to-cart', productController.addToCart);
router.post('/cart/:id/remove', productController.removeFromCart); 

router.post('/checkout', productController.renderCheckoutPage);
router.post('/checkoutsubmit', checkoutController.submitCheckout);

// Add routes for editing and deleting addresses
router.get('/address/edit/:id', profileController.renderEditAddressPage);
router.post('/address/edit/:id', profileController.editAddress);
router.post('/address/delete/:id', profileController.deleteAddress);
router.get('/wishlist', productController.renderWishlist);
router.post('/product/:id/add-to-wishlist', productController.addToWishlist);
router.delete('/api/wishlist/:itemId', productController.deleteWishlist);
module.exports = router;
