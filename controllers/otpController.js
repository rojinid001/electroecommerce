// const twilio = require('twilio');
// require('dotenv').config();

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

// const client = twilio(accountSid, authToken);

// const User = require('../models/User');


// const OTPLogin = (req, res) => {
//   const errorMessages = req.flash('error'); 
//   res.render('otpLogin', { errorMessages }); 
// };

// const sendOTP = async (req, res) => {
//   try {
//     const { phoneNumber } = req.body;
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const message = await client.messages.create({
//       body: `Your OTP is: ${otp}`,
//       from: '+14849898444',
//       to: phoneNumber,
//       timeout: 60000,
//     });

//     if (message && message.sid) {
//       req.session.otp = otp;
//       req.session.phoneNumber = phoneNumber; 
//       res.render('otpVerification', { error: null }); 
//     } else {
//       req.flash('error', 'Failed to send OTP'); 
//       res.redirect('/otpLogin'); 
//     }
//   } catch (error) {
//     console.error(error);
//     req.flash('error', 'Error sending OTP');
//     res.redirect('/otpLogin'); 
//   }
// };


// const verifyOTP = async (req, res) => {
//   try {
//     const { otp } = req.body;
//     if (req.session.otp && String(req.session.otp) === String(otp)) {
     
//       delete req.session.otp; 
//       const phoneNumber = req.session.phoneNumber; 
//       const user = await User.findOne({ phonenumber: phoneNumber });

//       console.log('session phone number:', phoneNumber);
    
//       console.log('database phone number:', user);

//       if (user) {
//         // Store the user data in the session
//         if (user && user._id && user.email && user.name) {
//           req.session.user = {
//             _id: user._id.toString(),
//             email: user.email,
//             name: user.name,
//             // Other user data...
//           };
//         } else {
//           console.error('Invalid user data. Unable to set user in the session.');
//         }
        
//         req.flash('success', 'Logged in successfully.');
//         console.log('OTP is verified successfully');
//         res.redirect('/'); 
//       } else {
//         req.flash('info', 'Phone number not found. Please enter your details.');
//         res.redirect('/'); 
//       }
//     } else {
//       console.log('Invalid OTP');
//       res.render('otpVerification', { error: 'Invalid OTP' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// };



// module.exports = {
//   sendOTP,
//   verifyOTP,
//   OTPLogin
// };


