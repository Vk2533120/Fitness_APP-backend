const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String, // e.g., Yoga, Cardio
  duration: Number,
  date: String, // format: YYYY-MM-DD
  startTime: String, // format: HH:mm
  endTime: String,
  capacity: Number,
  spotsLeft: Number,
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Class', classSchema);
