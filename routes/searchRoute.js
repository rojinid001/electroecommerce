const express = require('express');
const router = express.Router();
const Category=require('../models/category')
const Product = require('../models/product');
const getAllProducts = async () => {
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    throw new Error('Error fetching all products');
  }
};

// Backend function for search
const searchProducts = async (query) => {
  try {
    // Use MongoDB's $regex to perform a case-insensitive search
    const products = await Product.find({ name: { $regex: query, $options: 'i' } });
    return products;
  } catch (error) {
    throw new Error('Internal Server Error');
  }
};

// Route for the home page
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    let products;

    if (query) {
      // If a search query is provided, fetch only the matching products
      products = await searchProducts(query);
    } else {
      // If no search query, fetch all products
      // You may have an existing function to get all products from your database
      // Replace 'getAllProducts' with the actual function name if it exists
      products = await getAllProducts();
    }

    const isAuthenticated = req.isAuthenticated(); // Assuming you are using Passport.js or a similar authentication middleware

    res.render('home', { products, isAuthenticated }); // Assuming your home page template is 'home.ejs'
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Backend API endpoint for getting products by category
router.get('/api/products/:category', async (req, res) => {
  try {
    const { category } = req.params;

    // Find the Category document with the given name
    const categoryObject = await Category.findOne({ name: category });

    if (!categoryObject) {
      // If the category doesn't exist, return an empty array or an error message
      return res.render('home', { products: [] });
      // Alternatively, you can return an error message:
      // return res.status(404).json({ message: 'Category not found' });
    }
    const isAuthenticated = req.isAuthenticated()

    // Use the categoryObject's ObjectId to perform the search for products
    const products = await Product.find({ category: categoryObject._id });

    res.render('home', { products,isAuthenticated }); // Assuming your home page template is 'home.ejs'
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

  

module.exports = router;

