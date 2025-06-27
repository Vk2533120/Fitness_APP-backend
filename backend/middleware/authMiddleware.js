const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      console.log('Authorization Header:', req.headers.authorization);
      console.log('Decoded Token:', decoded);
      
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
