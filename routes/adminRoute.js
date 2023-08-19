const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')
const orderController=require('../controllers/orderController');
const upload=require('../middleware/multer')


// Route for admin login page
router.get('/adminlogin', adminController.adminlogin);

// Route for admin login form submission
router.post('/adminlogin',adminController.authenticateAdmin);
// Route for admin logout
router.get('/admin/logout', adminController.adminLogout);

router.use('/admin/dashboard', adminController.adminAuthMiddleware);
// Route for admin dashboard
router.get('/admin/dashboard', adminController.adminDashboard);

// Route for admin product page
router.use('/admin/product', adminController.adminAuthMiddleware);
router.get('/admin/product', adminController.adminProduct);
router.use('/admin/product/add', adminController.adminAuthMiddleware);
router.post('/admin/product/add',upload, adminController.postProduct);
router.use('/admin/category', adminController.adminAuthMiddleware);
router.get('/admin/category', adminController.adminCategoryPage);

// Route for adding a new category
router.use('/admin/category/add', adminController.adminAuthMiddleware);
router.post('/admin/category/add', adminController.addCategory);

// Route for editing a category
router.get('/admin/category/edit/:id', adminController.editCategory);

router.post('/admin/category/update/:id', adminController.updateCategory);


// Route for deleting a category
router.post('/admin/category/delete/:id', adminController.deleteCategory);
// Route for deleting a product
router.post('/admin/product/delete/:id', adminController.deleteProduct);
// Add the following route for editing a product
router.get('/admin/product/edit/:id', adminController.editProduct);
router.post('/admin/product/update/:id', upload, adminController.updateProduct);

router.get('/users', adminController.adminUsers); 
router.post('/admin/user/block/:id', adminController.blockUser);
router.post('/admin/user/unblock/:id', adminController.unblockUser);
router.get('/admin/orders', adminController.adminOrders);
router.get('/admin/orders/details/:orderId', adminController.adminOrderdetails);
router.post('/shipped/:orderId',orderController.orderStatus)
router.post('/cancel/:orderId',orderController.cancelOrder)
router.post('/admin/orders/delete/:orderId',adminController.deleteOrder)



module.exports = router;




