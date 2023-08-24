const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // Import your User model

// Configure Passport to use a local strategy for authentication
passport.use(new LocalStrategy(
  {
    usernameField: 'email', // Specify the field name for the email input
    passwordField: 'password', // Specify the field name for the password input
  },
  async (email, password, done) => {
    try {
      // Find the user by their email in your MongoDB
      const user = await User.findOne({ email });

      // If the user is not found, return an error message
      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Check if the provided password matches the user's hashed password
      const isPasswordMatch = await user.comparePassword(password);

      // If the password doesn't match, return an error message
      if (!isPasswordMatch) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // If the user exists and the password is correct, return the user
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    
    done(null, user);
  } catch (error) {
    
    done(error, null);
  }
});
console.log("passport authentication done successfully")

module.exports = passport;



