const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'rzp_test_uvvHRGgyCyvVaY',
  key_secret: 'Jb5MuVJG8dtEgvkAJmyImUFW',
});
const createPaymentRequest = async (req, res) => {
    try {
      const { amount, currency, receipt, notes } = req.body; // Assuming you send these details in the request body
  
      // Create a payment order
      const order = await razorpay.orders.create({
        amount,
        currency,
        receipt,
        notes,
      });
  
      // Send the order ID back to the client for further processing
      res.status(200).json({ orderId: order.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create payment request' });
    }
  };
  
  // Function to handle payment success callback
  const handlePaymentSuccess = (req, res) => {
    try {
      // Verify the payment signature
      const { order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
      const text = `${order_id}|${razorpay_payment_id}`;
      const secret = 'YOUR_RAZORPAY_KEY_SECRET';
      const generatedSignature = crypto.createHmac('sha256', secret).update(text).digest('hex');
  
      if (generatedSignature === razorpay_signature) {
        // Payment verification successful
        // Update the payment status in your database and perform other necessary actions
        res.status(200).json({ message: 'Payment success' });
      } else {
        // Payment verification failed
        res.status(400).json({ error: 'Invalid signature' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Payment verification failed' });
    }
  };
  
  // Export the functions to use in other parts of your application
  module.exports = {
    createPaymentRequest,
    handlePaymentSuccess,
  };
  
  
  
  
  
  
  
 
  
  
  
  
  