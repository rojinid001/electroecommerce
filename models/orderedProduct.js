const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderedProductSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});
const OrderedProducts = mongoose.model('OrderedProducts',orderedProductSchema);

module.exports =OrderedProducts;
