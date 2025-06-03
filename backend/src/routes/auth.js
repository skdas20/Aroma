const express = require('express');
const router = express.Router();

// Mock user storage (in production, use database)
let users = [
  {
    id: 1,
    email: 'demo@aroma.com',
    name: 'Demo User',
    avatar: null
  }
];

// Simple auth endpoint for demo
router.post('/login', (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    
    // Find or create user
    let user = users.find(u => u.email === email);
    if (!user) {
      user = {
        id: users.length + 1,
        email,
        name,
        avatar
      };
      users.push(user);
    }

    res.json({
      success: true,
      user,
      token: `demo-token-${user.id}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Get user profile
router.get('/profile/:userId', (req, res) => {
  try {
    const user = users.find(u => u.id === parseInt(req.params.userId));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
});

module.exports = router;