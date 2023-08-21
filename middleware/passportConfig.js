const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // Replace with the correct path to your User model

// Configure the local strategy for passport
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // Assuming email is used for login
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Check if the password is correct
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Authentication successful
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user for session storage
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session storage
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;



