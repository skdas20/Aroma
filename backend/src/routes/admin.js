const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const SupportTicket = require('../models/SupportTicket');
const mockDB = require('../config/mockDatabase');
const router = express.Router();

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    if (global.useMockDatabase) {
      // Use mock data
      const totalOrders = await mockDB.countOrders();
      const pendingOrders = await mockDB.countOrders({ status: 'pending' });
      const completedOrders = await mockDB.countOrders({ status: 'delivered' });
      const totalCustomers = await mockDB.countUsers();
      const supportTickets = await mockDB.countSupportTickets({ status: ['open', 'in-progress'] });
      const revenue = await mockDB.aggregateRevenue();

      res.json({
        success: true,
        stats: {
          totalOrders,
          pendingOrders,
          completedOrders,
          totalCustomers,
          supportTickets,
          revenue: Math.round(revenue * 100) / 100
        }
      });
    } else {
      // Use MongoDB
      const totalOrders = await Order.countDocuments();
      const pendingOrders = await Order.countDocuments({ status: 'pending' });
      const completedOrders = await Order.countDocuments({ status: 'delivered' });
      const totalCustomers = await User.countDocuments();
      const supportTickets = await SupportTicket.countDocuments({ status: { $in: ['open', 'in-progress'] } });
      
      const revenueResult = await Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
      ]);
      const revenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

      res.json({
        success: true,
        stats: {
          totalOrders,
          pendingOrders,
          completedOrders,
          totalCustomers,
          supportTickets,
          revenue: Math.round(revenue * 100) / 100
        }
      });
    }
  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

// Get recent orders for dashboard
router.get('/recent-orders', async (req, res) => {
  try {
    if (global.useMockDatabase) {
      const recentOrders = await mockDB.findOrders();
      res.json({
        success: true,
        orders: recentOrders.slice(0, 5)
      });
    } else {
      const recentOrders = await Order.find()
        .populate('userId', 'displayName email')
        .sort({ orderDate: -1 })
        .limit(5)
        .select('orderNumber totalAmount status orderDate userId');

      res.json({
        success: true,
        orders: recentOrders
      });
    }
  } catch (error) {
    console.error('❌ Recent orders fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent orders',
      error: error.message
    });
  }
});

// Get recent support tickets for dashboard
router.get('/recent-tickets', async (req, res) => {
  try {
    if (global.useMockDatabase) {
      const recentTickets = await mockDB.findSupportTickets({ status: ['open', 'in-progress'] });
      res.json({
        success: true,
        tickets: recentTickets.slice(0, 5)
      });
    } else {
      const recentTickets = await SupportTicket.find({ status: { $in: ['open', 'in-progress'] } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('ticketNumber subject status priority createdAt');

      res.json({
        success: true,
        tickets: recentTickets
      });
    }
  } catch (error) {
    console.error('❌ Recent tickets fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent tickets',
      error: error.message
    });
  }
});

// Get all orders for admin management
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    if (global.useMockDatabase) {
      const query = {};
      if (status && status !== 'all') query.status = status;
      if (search) query.search = search;
      
      const orders = await mockDB.findOrders(query);
      
      res.json({
        success: true,
        orders,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalOrders: orders.length,
          hasNext: false,
          hasPrev: false
        }
      });
    } else {
      // Build query
      const query = {};
      if (status && status !== 'all') {
        query.status = status;
      }

      // Search functionality
      if (search) {
        query.$or = [
          { orderNumber: { $regex: search, $options: 'i' } },
          { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
          { 'shippingAddress.email': { $regex: search, $options: 'i' } }
        ];
      }

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const orders = await Order.find(query)
        .populate('userId', 'displayName email')
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(parseInt(limit));

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
    }
  } catch (error) {
    console.error('❌ Admin orders fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// Update order status (admin only)
router.put('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    if (global.useMockDatabase) {
      const updateData = { status };
      if (trackingNumber) updateData.trackingNumber = trackingNumber;
      
      const order = await mockDB.updateOrder(orderId, updateData);
      
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
    } else {
      const updateData = { status };
      if (trackingNumber) {
        updateData.trackingNumber = trackingNumber;
      }

      const order = await Order.findByIdAndUpdate(
        orderId, 
        updateData,
        { new: true }
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
    }
  } catch (error) {
    console.error('❌ Order status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
});

// Get all support tickets for admin management
router.get('/support-tickets', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority, search } = req.query;

    if (global.useMockDatabase) {
      const query = {};
      if (status && status !== 'all') query.status = status;
      if (priority && priority !== 'all') query.priority = priority;
      if (search) query.search = search;
      
      const tickets = await mockDB.findSupportTickets(query);
      
      res.json({
        success: true,
        tickets,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalTickets: tickets.length,
          hasNext: false,
          hasPrev: false
        }
      });
    } else {
      // Build query
      const query = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      if (priority && priority !== 'all') {
        query.priority = priority;
      }

      // Search functionality
      if (search) {
        query.$or = [
          { ticketNumber: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { customerName: { $regex: search, $options: 'i' } },
          { customerEmail: { $regex: search, $options: 'i' } }
        ];
      }

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const tickets = await SupportTicket.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const totalTickets = await SupportTicket.countDocuments(query);

      res.json({
        success: true,
        tickets,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalTickets / parseInt(limit)),
          totalTickets,
          hasNext: skip + tickets.length < totalTickets,
          hasPrev: parseInt(page) > 1
        }
      });
    }
  } catch (error) {
    console.error('❌ Admin support tickets fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support tickets',
      error: error.message
    });
  }
});

// Update support ticket status (admin only)
router.put('/support-tickets/:ticketId/status', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, adminResponse } = req.body;

    // Validate status
    const validStatuses = ['open', 'in-progress', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    if (global.useMockDatabase) {
      const updateData = { status };
      if (adminResponse) {
        updateData.adminResponse = adminResponse;
        updateData.responseDate = new Date();
      }

      const ticket = await mockDB.updateSupportTicket(ticketId, updateData);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Support ticket not found'
        });
      }

      console.log(`✅ Support ticket ${ticket.ticketNumber} status updated to ${status}`);

      res.json({
        success: true,
        ticket,
        message: 'Support ticket status updated successfully'
      });
    } else {
      const updateData = { status };
      if (adminResponse) {
        updateData.adminResponse = adminResponse;
        updateData.responseDate = new Date();
      }

      const ticket = await SupportTicket.findByIdAndUpdate(
        ticketId, 
        updateData,
        { new: true }
      );

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Support ticket not found'
        });
      }

      console.log(`✅ Support ticket ${ticket.ticketNumber} status updated to ${status}`);

      res.json({
        success: true,
        ticket,
        message: 'Support ticket status updated successfully'
      });
    }
  } catch (error) {
    console.error('❌ Support ticket status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update support ticket status',
      error: error.message
    });
  }
});

// Get all customers for admin management
router.get('/customers', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    if (global.useMockDatabase) {
      const query = {};
      if (search) query.search = search;
      
      const customers = await mockDB.findUsers(query);
      
      res.json({
        success: true,
        customers,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalUsers: customers.length,
          hasNext: false,
          hasPrev: false
        }
      });
    } else {
      // Build query
      const query = {};
      
      // Search functionality
      if (search) {
        query.$or = [
          { displayName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const users = await User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('displayName email createdAt lastLogin orderCount totalSpent');

      const totalUsers = await User.countDocuments(query);

      res.json({
        success: true,
        customers: users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / parseInt(limit)),
          totalUsers,
          hasNext: skip + users.length < totalUsers,
          hasPrev: parseInt(page) > 1
        }
      });
    }
  } catch (error) {
    console.error('❌ Admin customers fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      error: error.message
    });
  }
});

module.exports = router;
