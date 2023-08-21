
const User = require('../models/User');
const Address=require('../models/address')



const ProfilePage = async(req, res) => {
    try {
        
        const userId = req.session.user._id;
        
       
        const user = await User.findById(userId).select('name email gender phonenumber ');
    
        
        res.render('profile', { user });
      } catch (error) {
      
        console.error(error);
        res.status(500).send('An error occurred while fetching user details.');
      }
  };
  const updateProfile = async (req, res) => {
    try {
      // Get the updated mobile number and gender from the form submission
      const { phonenumber, gender } = req.body;
  
      // Find the user by ID and update the fields
      const userId = req.session.user._id;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { phonenumber, gender },
        { new: true } // Return the updated user object
      );
  
      if (!updatedUser) {
        return res.status(404).send('User not found.');
      }
  
      // Redirect the user back to the profile page after successful update
      res.redirect('/profile');
    } catch (error) {
      // Handle any errors that occur during the update
      console.error(error);
      res.status(500).send('An error occurred while updating user details.');
    }
  };
  const address = async (req, res) => {
    try {
      // Fetch all addresses from the database
      const addresses = await Address.find();
  
      // Get the flash message from req.flash
      const successMessage = req.flash('success');
  
      res.render('address', { addresses, successMessage });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching addresses.');
    }
  };
  
  
  
  // addressFill.js

  const addressFill = (req, res) => {
    // Pass the flash object to the view when rendering the addressFill page
  
    res.render('addressFill');
  };
  
  const submitAddress = async (req, res) => {
    try {
      const { pincode, firstName, lastName, address, colony, landmark, city, state, mobile } = req.body;
  
      // Create a new address object based on the address schema
      const newAddress = new Address({
        pincode,
        firstName,
        lastName,
        address,
        colony,
        landmark,
        city,
        state,
        mobile
      });

      const savedAddress = await newAddress.save();
  
      
      const userId = req.session.user._id;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send('User not found.');
      }
      user.address = savedAddress._id;
      await user.save();
      req.flash('success', 'Address added successfully.');
      res.redirect('/address');
    } catch (error) {
      console.error(error);
      req.flash('error', 'An error occurred while saving the address.');
      res.redirect('/address/fill'); // Redirect to the addressFill page with an error flash message
    }
  };
  
  
  

// Function to edit an address
const editAddress = async (req, res) => {
  const addressId = req.params.id;
  const {
    pincode,
    firstName,
    lastName,
    address,
    colony,
    landmark,
    city,
    state,
    mobile,
  } = req.body;

  try {
    // Find the address in the database and update the fields
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      {
        pincode,
        firstName,
        lastName,
        address,
        colony,
        landmark,
        city,
        state,
        mobile,
      },
      { new: true } // Return the updated address after the update
    );

    if (!updatedAddress) {
      return res.status(404).send('Address not found.');
    }

    res.redirect('/address'); // Redirect to the address list page or any other desired page after successful edit
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while updating the address.');
  }
};
const deleteAddressFromDatabase = async (addressId) => {
  try {
    // Find the address by ID and delete it from the database
    const deletedAddressDoc = await Address.findByIdAndDelete(addressId);
    return deletedAddressDoc;
  } catch (error) {
    throw new Error('Failed to delete address from the database.');
  }
};

const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    // Call the function to delete the address from the database
    const deletedAddressDoc = await deleteAddressFromDatabase(addressId);
    res.status(200).json({ message: 'Address successfully deleted', deletedAddressDoc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const renderEditAddressPage = async (req, res) => {
  try {
    const addressId = req.params.id;
    // Fetch the address from the database
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).send('Address not found.');
    }
    res.render('editAddress', { address }); // Pass the fetched address data to the view
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the address data.');
  }
};




  
module.exports = {
     ProfilePage,
     updateProfile,
     address,
     addressFill,
     submitAddress,
     deleteAddress,
     editAddress,
     renderEditAddressPage
    };