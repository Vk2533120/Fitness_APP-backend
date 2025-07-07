const User = require('../models/User');

// Get current profile
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

// Update profile
exports.updateProfile = async (req, res) => {
  const updates = req.user.role === 'trainer'
    ? { trainerProfile: req.body }
    : { userProfile: req.body };

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $set: updates },
    { new: true }
  ).select('-password');

  res.json(updatedUser);
};
