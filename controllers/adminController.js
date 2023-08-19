const { Admin } = require('../models/admin');
const bcrypt = require('bcrypt');
const productModel = require('../models/product');
const Category = require('../models/category');
const User = require('../models/User');
const Order = require('../models/checkout');
const Cart =require('../models/cart')
const Checkout=require('../models/checkout')
const { body, validationResult } = require('express-validator');





const Product = require('../models/product');

// const flash = require('express-flash');
// const session = require('express-session');

// const { Types } = require('mongoose');

const adminlogin = async (req, res) => {
  try {
    // Fetch admin data from the database
    const admin = await Admin.findOne({ email: 'rojinid99@gmail.com' }); // Adjust the query criteria as needed

    if (admin) {
      const initialEmail = admin.email;
      const initialPassword = admin.password; // Fetch the password too

      res.render('adminlogin', {
        initialEmail,
        initialPassword, // Pass the initial password to the template
        errorMessages: req.flash('error'),
        successMessages: req.flash('success')
      });
    } else {
      res.render('adminlogin', { errorMessages: req.flash('error'), successMessages: req.flash('success') });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const adminloginSubmit = async (req, res) => {
  try {
    const { email, password } = req.body;
   

    // Validate input using Express Validator
    await body('email', 'Please enter a valid email').isEmail().run(req);
    await body('password', 'Password is required').notEmpty().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      req.flash('error', errorMessages);
      return res.redirect('/adminlogin');
    }

    const admin = await Admin.findOne({ email });

    if (!admin || admin.password !== password) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/adminlogin');
    }

    req.session.adminId = admin._id;
    req.flash('success', 'Logged in successfully');
    res.render('adminDashboard', { totalProducts, totalUsers, totalOrders });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Internal Server Error');
    res.redirect('/adminlogin');
  }
};


const adminDashboard = async (req, res) => {
  try {
    // Check if the admin is authenticated
    if (!req.session.admin || !req.session.admin._id) {
      req.flash('error', 'You must be logged in as an admin to access this page.');
      return res.redirect('/adminlogin');
    }

    // Fetch statistics (e.g., totalProducts, totalUsers, totalOrders)
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Checkout.countDocuments();

    // Render the adminDashboard view with statistics
    res.render('adminDashboard', { totalProducts, totalUsers, totalOrders });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


const adminProduct = async (req, res) => {
  try {
    
    const products = await productModel.find();
    const categories = await Category.find(); 
    res.render('adminProduct', { products, categories }); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};






const postProduct = async (req, res) => {
  try {
    const { name, price, description, quantity, brand, category } = req.body;
    const images = req.files.map((file) => file.filename);

    const product = new productModel({
      name,
      price,
      description,
      quantity,
      brand,
      category: new Category(),
      image: images,
    });
    console.log(product);

    await product.save();

    res.redirect('/admin/product');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    
    if (!product) {
      return res.redirect('/admin/product');
    }

    const categories = await Category.find(); 

    res.render('editProduct', { product, productId: id, categories });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, quantity, brand, category } = req.body;
    const images = req.files.map((file) => file.filename);

    const product = await productModel.findById(id);
    if (!product) {
     e
      return res.redirect('/admin/product');
    }
    product.name = name;
    product.price = price;
    product.description = description;
    product.quantity = quantity;
    product.brand = brand;
    product.category = category;
    product.image = images;

    await product.save();

    res.redirect('/admin/product');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};



const adminCategoryPage = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('adminCategory', { categories });
  } catch (error) {
    console.error(error);
  }
};
const addCategory = async (req, res) => {
  try {
    const {  name } = req.body;

    const newcategory = new Category({
      name:name
    });

    await newcategory.save();
    res.redirect('/admin/category');
  } catch (error) {
    console.error(error);
    
  }
};

const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
sage
      return res.redirect('/admin/category');
    }

    res.render('editCategory', { category });
  } catch (error) {
    console.error(error);
   
  }
};
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByIdAndUpdate(id, { name }, { new: true });

    if (!category) {
      return res.redirect('/admin/category');
    }

    res.redirect('/admin/category');
  } catch (error) {
    console.error(error);
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await Category.findByIdAndDelete(id);

   

    res.redirect('/admin/category');
  } catch (error) {
    console.error(error);
   
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.findByIdAndDelete(id);
    res.redirect('/admin/product');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('back');
    }

    user.isBlocked = true;
    await user.save();

    req.flash('success', 'User blocked successfully');
    res.redirect('back');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Internal Server Error');
    res.redirect('back');
  }
};

const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('back');
    }

    user.isBlocked = false;
    await user.save();

    req.flash('success', 'User unblocked successfully');
    res.redirect('back');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Internal Server Error');
    res.redirect('back');
  }
};
const adminUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render('adminUsers', { users, successMessages: req.flash('success'), errorMessages: req.flash('error') });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
const adminOrders = async (req, res) => {
  try {
    // Fetch orders from the database
    const orders = await Order.find();

    // Assuming you have defined successMessage and errorMessage somewhere in your code
    const successMessage=req.flash('success');  // Replace with your actual success message
    const errorMessage =req.flash('error'); // Replace with your actual error message

    res.render('adminOrders', { orders, successMessage, errorMessage });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


const adminOrderdetails = async (req, res) => {
  try {
    const orderId = req.params.orderId; 
    const order = await Order.findById(orderId);

    if (!order) {
      req.flash('error', 'Order not found');
      return res.status(404).redirect('/admin/orders'); 
    }
    const cart = await Cart.findOne({ user: order.user }).populate('items.product');
    let totalAmount = 0;
    cart.items.forEach(item => {
      totalAmount += item.quantity * item.price;
    });
    order.total = totalAmount;
    const successMessages = req.flash('success');
    const errorMessages = req.flash('error');
    console.log('Cart Items:', cart.items);
    console.log('Product Details:', cart.items[0].product);

    res.render('adminOrderdetails', { order, cart, orderId, successMessages, errorMessages }); 
  } catch (error) {
    console.error(error); 
    res.status(500).redirect('/admin/orders/details/:orderId'); 
  }
};

const deleteOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Find the order by ID and delete it
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    
    if (!deletedOrder) {
      req.flash('error', 'Order not found');
      return res.status(404).redirect('/admin/orders');
    }

    req.flash('success', 'Order deleted successfully'); // Set success message
    res.redirect('/admin/orders');
  } catch (error) {
    console.error(error);
    req.flash('error', 'An error occurred'); // Set error message
    res.status(500).redirect('/admin/orders');
  }
};
const authenticateAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Checkout.countDocuments();

    if (!admin) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/adminlogin');
    }

    if (admin.isBlocked) {
      req.flash('error', 'Admin is blocked. Please contact the administrator.');
      return res.redirect('/adminlogin');
    }

    if (admin.password !== password) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/adminlogin');
    }

    // Store the admin data in the session
    req.session.admin = {
      _id: admin._id.toString(),
      email: admin.email,
      // Other admin data...
    };

    

    req.flash('success', 'Logged in successfully');
    res.render('adminDashboard',{totalOrders,totalProducts,totalUsers}); // Redirect to the admin dashboard
  } catch (error) {
    console.error(error);
    req.flash('error', 'Authentication failed. Please try again.');
    res.redirect('/adminlogin');
  }
};
const adminLogout = (req, res) => {
  try {
    // Destroy the admin session
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying admin session:', err);
      }
      // Redirect to the admin login page
      res.redirect('/adminlogin');
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const adminAuthMiddleware = (req, res, next) => {
  if (req.session.admin && req.session.admin._id) {
    console.log('Admin data found in session:', req.session.admin);
    // Admin is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    console.log('Admin data not found in session');
    // Admin is not authenticated, return a 404 error
    res.status(404).send('Page not found');
  }
};




const forgotPassword = async (req, res) => {
  const errorMessages = req.flash('error'); // Get the error messages from flash
  const successMessages = req.flash('success'); // Get the success messages from flash
  res.render('forgotPassword', { errorMessages, successMessages }); // Pass errorMessages and successMessages to the view
};





module.exports = {
  adminlogin,
  adminloginSubmit,
  adminProduct,
  adminDashboard,
  postProduct,
  adminCategoryPage,
  addCategory,
  editCategory,
  deleteCategory,
  updateCategory,
  deleteProduct,
  editProduct,
  updateProduct,
  adminUsers,
  blockUser,
  unblockUser,
  adminOrders,
  adminOrderdetails,
  deleteOrder,
  authenticateAdmin,
  adminLogout,

  adminAuthMiddleware,
};
