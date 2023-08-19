const Checkout = require('../models/checkout');
const Order=require('../models/checkout')

const orderStatus = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const updatedOrder = await Checkout.findByIdAndUpdate(
      orderId,
      { status: 'Shipped' },
      { new: true }
    );

    if (!updatedOrder) {
      req.flash('error', 'Order not found');
      return res.redirect(`/admin/orders/details/${orderId}`); // Use string interpolation
    }

    req.flash('success', 'Order marked as shipped');
    res.redirect(`/admin/orders/details/${orderId}`); // Use string interpolation
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error marking order as shipped');
    res.redirect(`/admin/orders/details/${orderId}`); // Use string interpolation
  }
};
const cancelOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const updatedOrder = await Checkout.findByIdAndUpdate(
      orderId,
      { status: 'Cancelled' },
      { new: true }
    );

    if (!updatedOrder) {
      req.flash('error', 'Order not found');
      return res.redirect(`/admin/orders/details/${orderId}`);
    }

    req.flash('success', 'Order cancelled successfully');
    res.redirect(`/admin/orders/details/${orderId}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error cancelling order');
    res.redirect(`/admin/orders/details/${orderId}`);
  }
};
const orderStatusClient = async (req, res) => {
  try {
    const loggedInUserId = req.session.user._id; // Assuming you have the user ID in the session
    console.log('Logged-in User ID:', loggedInUserId);

    const orders = await Checkout.find({ 'user': loggedInUserId }); // Fetch orders for the logged-in user
    console.log('Fetched Orders:', orders);

    res.render('orderStatus', { orders }); // Pass orders to the template
  } catch (error) {
    console.error('Error:', error);
    req.flash('error', 'Error fetching order status');
    res.redirect('/'); // Redirect to an error page or handle it in another way
  }
};

module.exports = {
  orderStatus,
  cancelOrder,
  orderStatusClient,
};
