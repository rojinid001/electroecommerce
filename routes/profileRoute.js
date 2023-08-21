
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Route for the profile page
router.get('/profile', profileController.ProfilePage);
router.post('/update-profile', profileController.updateProfile);
router.get('/address', profileController.address);
router.get('/address/fill', profileController.addressFill);
router.post('/submitaddress',profileController.submitAddress)
router.get('/address/edit/:id', profileController.renderEditAddressPage);
router.post('/address/edit/:id', profileController.editAddress);
router.post('/addressdel/delete/:id', profileController.deleteAddress);
module.exports = router;
