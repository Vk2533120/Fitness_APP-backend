const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  title: { type: String, required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  type: { type: String, required: true }, // yoga, strength, etc.
  duration: { type: Number, required: true }, // in minutes
  schedule: [{ date: Date, time: String }],
  description: String,
  capacity: Number
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
