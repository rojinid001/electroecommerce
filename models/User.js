const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart',
  },
  orderedProducts:{
    type: Schema.Types.ObjectId,
    ref:'OrderedProducts'
  },
  password: {
    type: String,
    required: true
  },
  confirmpassword: { 
    type: String,
    required: true
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  phonenumber:{
    type:String
  },
  gender:{
    type:String
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address' // Use the string name "Address" to reference the Address model
  },
  wishlist: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product' // Use the string name "Product" to reference the Product model
    },
    
    quantity: {
      type: Number,
      default: 1
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: Array,
      required:true
    },
    name: {
      type: String,
    },
    category: String, 
  }]
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
