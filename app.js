const express = require('express');
const path = require('path');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const app = express();
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const productRoute = require('./routes/productRoute');
const profileRoute=require('./routes/profileRoute')
const searchRoute=require('./routes/searchRoute')
const paymentRoute=require('./routes/paymentRoute')
const passportConfig = require('./middleware/passportConfig');
const flash = require('connect-flash');
require('dotenv').config();
const PORT=process.env.PORT||3000

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer();
app.use(upload.none());
// Set the view engine
app.set('view engine', 'ejs');

// Define the views path
const viewsPath = path.join(__dirname, 'views');
app.set('views', viewsPath);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Handling session
app.use(session({
  secret: process.env.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000, // Set session duration to 1 hour
    secure: false, // Set to true if using HTTPS
    httpOnly: true, // Prevent client-side access to cookies
  },
})); 
app.use(flash());
console.log('hello everyone how do you do')

// Set up middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passportConfig.initialize());
app.use(passportConfig.session());
app.use(upload.none());

// Parse JSON bodies
app.use(bodyParser.json());

// User route
app.use('/', userRoute);

// Admin route
app.use('/', adminRoute);

// Product route
app.use('/', productRoute);

//Search routen
app.use('/', searchRoute);
// Profile route
app.use('/', profileRoute);
// Profile route
app.use('/', paymentRoute);


app.listen(PORT, () => {
  console.log('Server is running');
});




