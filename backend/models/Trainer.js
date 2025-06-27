const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: String,
  specialties: [String],
  experience: String,
  photo: String,
  introVideo: String,
  ratings: [{ user: String, comment: String, stars: Number }]
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);
