const Checkout = require('../models/checkout');
const User = require('../models/User');

const submitCheckout = async (req, res) => {
  try {
    const userId = req.session.user._id;
    console.log("User ID:", userId);
    console.log("Form Data Received:", req.body);

    // Check if the "shiping-address" checkbox is checked
    const isDifferentAddress = req.body['shiping-address'] === 'on';
    console.log("Is Different Address:", isDifferentAddress);

    // Server-side validation
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.address ||
      !req.body.city ||
      !req.body.country ||
      !req.body.zipCode ||
      !req.body.telephone
    ) {
      return res.status(400).send('Please fill in all required fields');
    }

    const user = await User.findById(userId).populate('cart.items.product');
    if (!user) {
      return res.status(404).send('User not found');
    }

    const checkout = new Checkout({
      user: userId,
      billing: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        country: req.body.country,
        zipCode: req.body.zipCode,
        telephone: req.body.telephone
      },
      shipping: {
        isDifferentAddress: isDifferentAddress,
        firstName: isDifferentAddress ? req.body.ship_firstname : req.body.firstName,
        lastName: isDifferentAddress ? req.body.ship_lastname : req.body.lastName,
        email: isDifferentAddress ? req.body.ship_email : req.body.email,
        address: isDifferentAddress ? req.body.ship_address : req.body.address,
        city: isDifferentAddress ? req.body.ship_city : req.body.city,
        country: isDifferentAddress ? req.body.ship_country : req.body.country,
        zipCode: isDifferentAddress ? req.body.ship_zipcode : req.body.zipCode,
        telephone: isDifferentAddress ? req.body.ship_telephone : req.body.telephone
      },
    });
    console.log("endi:", req.body);

    // Save checkout details
    checkout.status = 'Pending';
    await checkout.save();
    console.log("Checkout saved successfully!");

    res.status(200).send();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send('Internal Server Error');
  }
};


module.exports = {
  submitCheckout
};
