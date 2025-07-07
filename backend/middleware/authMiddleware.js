// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      // console.log('Authorization Header:', req.headers.authorization); // You can remove or comment these console logs in production
      // console.log('Decoded Token:', decoded); // You can remove or comment these console logs in production

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return next(); // ✅ success
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({ message: 'Not authorized, token failed' }); // ✅ return
    }
  } else {
    return res.status(401).json({ message: 'No token provided' }); // ✅ return
  }
};

// New: Middleware to check for specific roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Ensure req.user exists (it should if 'protect' middleware ran successfully before this)
    if (!req.user) {
      return res.status(403).json({ message: 'User not authenticated for role check' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route. Required roles: ${roles.join(', ')}`
      });
    }
    next();
  };
};