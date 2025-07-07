const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6
    },
    role: {
      type: String,
      enum: ['user', 'trainer'],
      default: 'user'
    },

    // 👤 User profile
    userProfile: {
      age: Number,
      gender: { type: String, enum: ['male', 'female', 'other'] },
      fitnessGoals: String
    },

    // 🧑‍🏫 Trainer profile
    trainerProfile: {
      bio: String,
      experience: String,
      specialties: [String],
      socialLinks: {
        instagram: String,
        linkedin: String,
        website: String
      }
    }
  },
  {
    timestamps: true
  }
);

// 🔐 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔐 Compare passwords during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
