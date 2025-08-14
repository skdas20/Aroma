const express = require('express');
const { prisma } = require('../config/database');
const router = express.Router();

// Login/Register: upsert customer by cid/email
router.post('/login', async (req, res) => {
  try {
    const { email, displayName, phoneNumber } = req.body;
    if (!email || !displayName) {
      return res.status(400).json({ success: false, message: 'email and displayName are required' });
    }

    const customer = await prisma.customer.upsert({
      where: { email },
      update: { name: displayName, phoneNo: phoneNumber || null },
      create: { email, name: displayName, phoneNo: phoneNumber || null },
    });

    res.json({
      success: true,
      user: { cid: customer.cid, email: customer.email, displayName: customer.name },
      token: `aroma-token-${customer.cid}`,
      message: 'Login successful',
    });
  } catch (error) {
    console.error(' Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

// Get profile by uid
router.get('/profile/:uid', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({ where: { cid: req.params.uid } });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, user: customer });
  } catch (error) {
    console.error(' Profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
  }
});

// Update profile by uid
router.put('/profile/:uid', async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await prisma.customer.update({
      where: { cid: req.params.uid },
      data: { name: name || undefined, phoneNo: phone || undefined, address: address || undefined },
    });
    res.json({ success: true, user, message: 'Profile updated successfully' });
  } catch (error) {
    console.error(' Profile update error:', error);
    res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
  }
});

// List users (limited)
router.get('/users', async (_req, res) => {
  try {
    const users = await prisma.customer.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    console.error(' Users fetch error:', error);
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
});

// Admin login (simple placeholder)
router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username === 'Admin' && password === 'temporary') {
      return res.json({ success: true, message: 'Admin login successful', user: { email: 'admin@amaraa.com', displayName: 'Admin', isAdmin: true } });
    }
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  } catch (error) {
    console.error(' Admin login error:', error);
    res.status(500).json({ success: false, message: 'Admin login failed', error: error.message });
  }
});

module.exports = router;