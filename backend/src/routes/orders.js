const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const mockDB = require('../config/mockDatabase');
const router = express.Router();

// Create new order
router.post('/create', async (req, res) => {
  try {
    const { 
      userId, 
      items, 
      totalAmount, 
      shippingAddress 
    } = req.body;

    // Validate required fields
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User ID and items are required'
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid total amount is required'
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.email) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }    console.log('🔍 Debugging order creation:');
    console.log('- useMockDatabase:', global.useMockDatabase);
    console.log('- userId:', userId);
    console.log('- totalAmount:', totalAmount);

    // Verify user exists
    let user;
    if (global.useMockDatabase) {
      console.log('📋 Using mock database to find user');
      user = mockDB.users.find(u => u._id === userId);
      console.log('- Found user:', user ? user.displayName : 'null');    } else {
      console.log('🗄️ Using MongoDB to find user');
      // Try to find user by Firebase UID first
      user = await User.findOne({ firebaseUid: userId });
      
      // If not found and the userId looks like a MongoDB ObjectId, try by _id
      if (!user && /^[0-9a-fA-F]{24}$/.test(userId)) {
        user = await User.findById(userId);
      }
      
      console.log('- Found user:', user ? user.displayName : 'null');
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate unique order number
    let orderNumber;
    if (global.useMockDatabase) {
      orderNumber = `AR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(mockDB.orders.length + 1).padStart(3, '0')}`;
    } else {
      orderNumber = Order.generateOrderNumber();
    }    // Create order
    const orderData = {
      userId: user._id, // Use MongoDB ObjectId, not Firebase UID
      orderNumber,
      items,
      totalAmount,
      shippingAddress,
      status: 'pending',
      paymentStatus: 'pending'
    };let order;
    if (global.useMockDatabase) {
      console.log('📋 Creating order in mock database');      order = {
        _id: (mockDB.orders.length + 1).toString(),
        ...orderData,
        orderDate: new Date(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        userId: { _id: user._id, displayName: user.displayName, email: user.email }
      };      mockDB.orders.push(order);
      console.log('✅ Order added to mock database:', order.orderNumber);
    } else {
      console.log('🗄️ Creating order in MongoDB');
      order = new Order(orderData);
      await order.save();
      console.log('✅ Order saved to MongoDB');
    }

    console.log(`✅ Order created: ${orderNumber} for user ${user.email}`);

    res.status(201).json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        orderDate: order.orderDate,
        estimatedDelivery: order.estimatedDelivery
      },
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('❌ Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    // Build query
    const query = { userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'displayName email');

    const totalOrders = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / parseInt(limit)),
        totalOrders,
        hasNext: skip + orders.length < totalOrders,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('❌ Orders fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Get specific order
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('userId', 'displayName email photoURL');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('❌ Order fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

// Update order status (admin)
router.put('/:orderId/status', async (req, res) => {
  try {
    const { status, trackingNumber, paymentStatus } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'displayName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log(`✅ Order ${order.orderNumber} status updated to ${status}`);

    res.json({
      success: true,
      order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('❌ Order status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

// Cancel order
router.put('/:orderId/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled. Current status: ${order.status}`
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      order,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('❌ Order cancellation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
});

// Get order statistics for user
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Order.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          totalItems: { $sum: { $sum: '$items.quantity' } },
          statusCounts: {
            $push: '$status'
          }
        }
      }
    ]);

    const statusBreakdown = stats[0]?.statusCounts.reduce((acc, status) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {}) || {};

    res.json({
      success: true,
      stats: {
        totalOrders: stats[0]?.totalOrders || 0,
        totalSpent: stats[0]?.totalSpent || 0,
        totalItems: stats[0]?.totalItems || 0,
        statusBreakdown
      }
    });
  } catch (error) {
    console.error('❌ Order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics',
      error: error.message
    });
  }
});

module.exports = router;
