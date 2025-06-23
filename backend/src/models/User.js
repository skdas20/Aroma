const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true // Allow null for test users
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  photoURL: {
    type: String,
    default: null
  },
  phoneNumber: {
    type: String,
    default: null
  },  authProvider: {
    type: String,
    enum: ['google', 'phone', 'test', 'admin'],
    required: true
  },  isTestUser: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  profile: {
    preferences: {
      fragranceTypes: [String], // woody, floral, citrus, etc.
      priceRange: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 1000 }
      }
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

// Indexes for better performance
// userSchema.index({ email: 1 }); // Removed - already unique
// userSchema.index({ firebaseUid: 1 }); // Removed - already unique
userSchema.index({ authProvider: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.displayName;
});

// Method to update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Static method to find or create user
userSchema.statics.findOrCreate = async function(userData) {
  const { email, firebaseUid, authProvider } = userData;
  
  // Try to find existing user by email or firebaseUid
  let user = await this.findOne({
    $or: [
      { email: email },
      ...(firebaseUid ? [{ firebaseUid: firebaseUid }] : [])
    ]
  });
  
  if (user) {
    // Update existing user with new information
    Object.assign(user, userData);
    user.lastLogin = new Date();
    await user.save();
    return user;
  }
  
  // Create new user
  user = new this(userData);
  await user.save();
  return user;
};

module.exports = mongoose.model('User', userSchema);