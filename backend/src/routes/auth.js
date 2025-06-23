const express = require('express');
const User = require('../models/User');
const mockDB = require('../config/mockDatabase');
const router = express.Router();

// Login/Register endpoint - handles both Google and phone auth
router.post('/login', async (req, res) => {
  try {
    const { 
      email, 
      displayName, 
      photoURL, 
      firebaseUid, 
      phoneNumber, 
      authProvider 
    } = req.body;

    // Validate required fields
    if (!email || !displayName || !authProvider) {
      return res.status(400).json({
        success: false,
        message: 'Email, display name, and auth provider are required'
      });
    }

    // Create user data object
    const userData = {
      email,
      displayName,
      photoURL: photoURL || null,
      phoneNumber: phoneNumber || null,
      authProvider,
      isTestUser: authProvider === 'test',
      lastLogin: new Date()
    };

    // Add firebaseUid for Google auth
    if (firebaseUid && authProvider === 'google') {
      userData.firebaseUid = firebaseUid;
    }    // Find or create user
    let user;
    if (global.useMockDatabase) {
      // Use mock database
      user = await mockDB.findOrCreateUser(userData);
    } else {
      // Use MongoDB
      user = await User.findOrCreate(userData);
    }

    console.log(`✅ User logged in: ${user.email} (${user.authProvider})`);

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        authProvider: user.authProvider,
        isTestUser: user.isTestUser,
        createdAt: user.createdAt
      },
      token: `aroma-token-${user._id}`,
      message: user.createdAt.getTime() === user.updatedAt.getTime() ? 
        'Account created successfully!' : 
        'Welcome back!'
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    let user;
    if (global.useMockDatabase) {
      user = mockDB.users.find(u => u._id === req.params.userId);
    } else {
      user = await User.findById(req.params.userId).select('-firebaseUid');
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        authProvider: user.authProvider,
        isTestUser: user.isTestUser,
        profile: user.profile,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile/:userId', async (req, res) => {
  try {
    const { preferences, address } = req.body;
    
    const updateData = {};
    if (preferences) updateData['profile.preferences'] = preferences;
    if (address) updateData['profile.address'] = address;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-firebaseUid');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('❌ Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// Get all users (admin only - for debugging)
router.get('/users', async (req, res) => {
  try {
    let users;
    if (global.useMockDatabase) {
      users = mockDB.users.map(user => ({
        ...user,
        firebaseUid: undefined // Remove sensitive data
      }));
    } else {
      users = await User.find({})
        .select('-firebaseUid')
        .sort({ createdAt: -1 })
        .limit(50);
    }

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('❌ Users fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Admin login endpoint
router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate credentials (in production, use proper password hashing)
    if (username === 'Admin' && password === 'temporary') {
      // Create admin user in database if not exists
      let adminUser;
      
      if (global.useMockDatabase) {
        // Check if admin exists in mock DB
        adminUser = mockDB.users.find(u => u.email === 'admin@amaraa.com');
        if (!adminUser) {
          adminUser = {
            _id: 'admin-001',
            email: 'admin@amaraa.com',
            displayName: 'Admin',
            authProvider: 'admin',
            isAdmin: true,
            createdAt: new Date(),
            lastLogin: new Date()
          };
          mockDB.users.push(adminUser);
        }
      } else {
        // Check if admin exists in MongoDB
        adminUser = await User.findOne({ email: 'admin@amaraa.com' });
        if (!adminUser) {
          adminUser = new User({
            email: 'admin@amaraa.com',
            displayName: 'Admin',
            authProvider: 'admin',
            isAdmin: true,
            lastLogin: new Date()
          });
          await adminUser.save();
        } else {
          adminUser.lastLogin = new Date();
          await adminUser.save();
        }
      }

      res.json({
        success: true,
        message: 'Admin login successful',
        user: {
          id: adminUser._id,
          email: adminUser.email,
          displayName: adminUser.displayName,
          isAdmin: true
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Admin login failed',
      error: error.message
    });
  }
});

module.exports = router;