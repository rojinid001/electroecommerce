const checkAuth = (req, res, next) => {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }
    next();
  };
  
  module.exports = checkAuth;
  