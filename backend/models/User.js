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
    qualifications: { // e.g., certifications, degrees
        type: [String], // Array of strings (e.g., ["Certified Personal Trainer", "Nutrition Specialist"])
        default: [],
      },
      expertise: { // e.g., strength training, yoga, cardio, weight loss
        type: [String], // Array of strings
        default: [],
      },
      specializations: { // more specific areas
        type: [String], // Array of strings
        default: [],
      },
      bio: { // A longer introductory message
        type: String,
        maxlength: 1000, // Limit bio length
      },
      profilePicture: { // URL to the uploaded profile picture
        type: String,
        default: '/uploads/default-avatar.png', // A default image
      },
      videoIntro: { // URL to an introductory video
        type: String,
      },
      // This will store average rating and count for reviews
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      reviewCount: {
        type: Number,
        default: 0,
        min: 0,
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
