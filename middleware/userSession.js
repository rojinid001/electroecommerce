const requireLogin = (req, res) => {
    if (!req.session.userId) {
      // User is not logged in, redirect to the login page
      res.redirect('/login');

    }
  };
  
  