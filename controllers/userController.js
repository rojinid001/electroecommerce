const bcrypt = require('bcrypt');

const User = require('../models/User');
const productModel = require('../models/product');
const nodemailer = require('nodemailer');
const randomstring=require('randomstring')
require('dotenv').config();


const homepage = async (req, res) => {
  try {
    const isAuthenticated = req.session.user || req.user;
    const products = await productModel.find();

    res.render('home', { isAuthenticated, products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};



const login = (req, res) => {
  const errorMessages = req.flash('error');
  const successMessage = req.flash('success');
  const isAuthenticated = req.session.user || req.user;

  res.render('login', { errorMessages, successMessage, isAuthenticated });
};





const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const signup = async (req, res) => {
  try {
    res.render('signup', { error: null });
  } catch (error) {
    console.error(error);
    res.render('signup', { error: 'Error rendering signup page' });
  }
};

const register = async (req, res) => {
  const { name, email, phone, password, confirmpassword } = req.body;

  try {
    if (password !== confirmpassword) {
      req.flash('error', 'Passwords do not match');
      return res.render('signup', { error: 'Passwords do not match' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      confirmpassword: hashedPassword,
    });

    // Store the user data in the session
    
    req.flash('success', 'User created successfully. Please log in.');
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.render('signup', { error: 'Error registering user' });
  }
};


const checkout = async (req, res) => {
  res.render('checkout');
};
const authenticate = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    if (user.isBlocked) {
      req.flash('error', 'User is blocked. Please contact the administrator.');
      return res.redirect('/login');
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    // Store the user data in the session
    if (user && user._id && user.email && user.name) {
      req.session.user = {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        // Other user data...
      };
    } else {
      console.error('Invalid user data. Unable to set user in the session.');
    }
    

    req.flash('success', 'Logged in successfully');
    res.redirect('/'); // Redirect to the home page
  } catch (error) {
    console.error(error);
    req.flash('error', 'Authentication failed. Please try again.');
    res.redirect('/login');
  }
};
const forgotPassword = async (req, res) => {
  const errorMessages = req.flash('error'); // Get the error messages from flash
  const successMessages = req.flash('success'); // Get the success messages from flash
  res.render('forgotPassword', { errorMessages, successMessages }); // Pass errorMessages and successMessages to the view
};


const sendMail = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Email address not found.');
      return res.redirect('/forgotPassword');
    }

    // Generate a random reset token
    const resetToken = randomstring.generate({
      length: 20,
      charset: 'alphanumeric'
    });

    // Save the reset token in your database or cache for later verification

    // Construct the reset link
    const resetLink = `http://localhost:${3000}/reset-password?email=${email}&token=${resetToken}`;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service provider here
      auth: {
        user: process.env.Email, // Your email address
        pass: process.env.Password // Your app-specific password
      }
    });

    // Compose the email
    const mailOptions = {
      from: 'www.rojindevadaso2@gmail.com ', // Your email address
      to: email,
      subject: 'Password Reset Link',
      html: `Click <a href="${resetLink}">here</a> to reset your password.`
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);

    req.flash('success', 'Password reset link sent. Check your inbox.');
    res.redirect('/forgotPassword');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error sending reset password email.');
    res.redirect('/forgotPassword');
  }
};


const resetPassword = (req, res) => {
  try {
    const { email, token } = req.query;
    res.render('resetpassword', { email, token, error: null });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
const updatePassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    if (newPassword !== confirmPassword) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect(`/reset-password?email=${email}`);
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect(`/reset-password?email=${email}`);
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    console.log('Password updated successfully');
    req.flash('success', 'Password updated successfully.');
    res.redirect('/login'); 
  } catch (error) {
    console.error('Error updating password:', error);
    req.flash('error', 'Error updating password.');
    res.redirect(`/reset-password?email=${email}`);
  }
};

module.exports = {
  updatePassword
};

module.exports = {
  homepage,
  login,
  signup,
  register,
  checkout,
  authenticate,
  logout,
  forgotPassword,
  sendMail,
  resetPassword,
  updatePassword
};


