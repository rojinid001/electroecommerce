const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: Array,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    default: 0,
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

