const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  weekday: {
    type: String,
    required: true,
  },
  start: String,
  end: String,
});

module.exports = mongoose.model('Availability', availabilitySchema);
