const productModel = require('../models/product');
const Cart = require('../models/cart');
const mongoose = require('mongoose');
const User = require('../models/User');
const OrderedProduct=require('../models/orderedProduct')

const { Types } = require('mongoose');
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('productView', { product });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const getCart = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      req.flash('error', 'please login to continue');
      return res.redirect('/login');
    }
    const userId = req.session.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart) {
      req.flash('error', 'Your cart is empty.');
      return res.redirect('/cart'); // Redirect to the cart page
    }

    res.render('cart', { cart });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};



const addToCart = async (req, res) => {
  const productId = req.params.id;

  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    const userId = req.session.user._id;
    const user = await User.findById(userId).populate('cart');

    if (!user) {
      return res.status(404).send('User not found');
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    let cart = user.cart;
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const cartItem = cart.items.find((item) => item.product.toString() === productId);

    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      const cartProduct = {
        product: productId,
        quantity: 1,
        price: product.price,
        image: product.image,
      };
      cart.items.push(cartProduct);
    }

    cart.subtotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    cart.total = cart.subtotal; 

    await cart.save();
    user.cart = cart;
    await user.save();

    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
const removeFromCart = async (req, res) => {
  const productId = req.params.id;

  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate('cart');

    if (!user) {
      return res.status(404).send('User not found');
    }

    let cart = user.cart;
    if (!cart) {
      return res.status(404).send('Cart not found');
    }
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId.toString());
    cart.items.splice(itemIndex, 1);

    // Recalculate the subtotal and total
    cart.subtotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    cart.total = cart.subtotal;

    await cart.save();
    user.cart = cart;
    await user.save();

    res.redirect('/cart');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
const renderWishlist = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      req.flash('error', 'please login to continue');
      return res.redirect('/login');
    }
    const userId = req.session.user._id;
    const user = await User.findById(userId).populate('wishlist');
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/');
    }
    const wishlist = user.wishlist;
    if (wishlist.length === 0) {
      req.flash('info', 'Your wishlist is empty.');
    }
    res.render('wishlist', { wishlist, messages: req.flash() });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Internal Server Error');
    res.redirect('/');
  }
};


const addToWishlist = async (req, res) => {
  const productId = req.params.id;
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }
    const existingItemIndex = user.wishlist.findIndex(
      (item) => item.product.toString() === productId.toString()
    );
    if (existingItemIndex !== -1) {
      user.wishlist[existingItemIndex].quantity += 1;
    } else {
      const product = await productModel
        .findById(productId)
        .populate('category', 'name');

      if (!product) {
        return res.status(404).send('Product not found');
      }
      const newWishlistItem = {
        product: productId,
        quantity: 1,
        price: product.price,
        image: product.image,
        name: product.name,
        category: product.category ? product.category.name : 'Uncategorized',
      };
      user.wishlist.push(newWishlistItem);
    }
    const savedUser = await user.save();
    console.log(savedUser);

    res.redirect('/wishlist');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const deleteWishlist = async (req, res) => {
  const itemId = req.params.itemId;
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const itemIndex = user.wishlist.findIndex((item) => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }
    const deletedItem = user.wishlist.splice(itemIndex, 1)[0];
    await user.save();
    req.flash('success', `Product deleted successfully from wishlist`);

    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const renderCheckoutPage = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.redirect('/cart'); 
    }
    let totalAmount = 0;
     cart.items.forEach((item) => {
      if (item.product && item.quantity) {
        totalAmount += item.product.price * item.quantity;
      }
    });
    const orderedProducts = cart.items.map(item => ({
      user:userId,
      productId: item.product._id.toString(), 
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price
    }));
    const orderedProductDocs = await OrderedProduct.create(orderedProducts);
    
   
    res.render('checkout', {
      cartItems: cart.items,
      totalAmount,
      userId: userId,
    });
     // Add this line to log cartItems
    
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};







module.exports = {
  getProductById,
  getCart,
  addToCart,
  removeFromCart,
  renderWishlist,
  addToWishlist,
  deleteWishlist,
  renderCheckoutPage,

};


