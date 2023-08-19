const mongoose = require('mongoose');
const { Schema } = mongoose;
const OrderedProduct = require('../models/orderedProduct')

const checkoutSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    
  },
  orderedProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'OrderedProduct', // Reference to the OrderedProduct model
      
    }
  ],
  billing: {
    firstName: {
      type: String,
      
    },
    lastName: {
      type: String,
      
    },
    email: {
      type: String,
      
    },
    address: {
      type: String,
      
    },
    city: {
      type: String,
      
    },
    country: {
      type: String,
      
    },
    zipCode: {
      type: String,
      
    },
    telephone: {
      type: String,
      
    }
  },
  shipping: {
    isDifferentAddress: {
      type: Boolean,
      default: true
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String
    },
    address: {
      type: String
    },
    city: {
      type: String
    },
    country: {
      type: String
    },
    zipCode: {
      type: String
    },
    telephone: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now,
    
  },
  status: {
    type: String,
    enum: ['Pending', 'Cancelled', 'Shipped', 'Delivered'],
    default: 'Pending',
  },
});

const Checkout = mongoose.model('Checkout', checkoutSchema);

module.exports = Checkout;
