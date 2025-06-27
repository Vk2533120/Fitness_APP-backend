const Trainer = require('../models/Trainer');
const User = require('../models/User');

exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().populate('user', 'name email');
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createOrUpdateTrainer = async (req, res) => {
  const { bio, specialties, experience, photo, introVideo } = req.body;
  try {
    const existing = await Trainer.findOne({ user: req.user._id });
    if (existing) {
      Object.assign(existing, { bio, specialties, experience, photo, introVideo });
      await existing.save();
      return res.json(existing);
    }

    const trainer = new Trainer({
      user: req.user._id,
      bio,
      specialties,
      experience,
      photo,
      introVideo
    });

    await trainer.save();
    res.status(201).json(trainer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
