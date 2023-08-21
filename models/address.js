const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
  pincode: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  colony: {
    type: String,
    required: true
  },
  landmark: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  }
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
