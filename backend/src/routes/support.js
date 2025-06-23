const express = require('express');
const SupportTicket = require('../models/SupportTicket');
const User = require('../models/User');
const router = express.Router();

// Create new support ticket
router.post('/create', async (req, res) => {
  try {
    const { 
      userId, 
      subject, 
      message, 
      category, 
      priority,
      orderReference 
    } = req.body;

    // Validate required fields
    if (!userId || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'User ID, subject, and message are required'
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate unique ticket number
    const ticketNumber = SupportTicket.generateTicketNumber();

    // Create support ticket
    const ticket = new SupportTicket({
      ticketNumber,
      userId,
      customerName: user.displayName,
      customerEmail: user.email,
      subject,
      message,
      category: category || 'other',
      priority: priority || 'medium',
      orderReference
    });

    await ticket.save();

    console.log(`✅ Support ticket created: ${ticketNumber} for user ${user.email}`);

    res.status(201).json({
      success: true,
      ticket: {
        id: ticket._id,
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.createdAt
      },
      message: 'Support ticket created successfully'
    });
  } catch (error) {
    console.error('❌ Support ticket creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create support ticket',
      error: error.message
    });
  }
});

// Get all support tickets (admin)
router.get('/all', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority, category } = req.query;

    // Build query
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (category && category !== 'all') query.category = category;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tickets = await SupportTicket.find(query)
      .populate('userId', 'displayName email photoURL')
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
  } catch (error) {
    console.error('❌ Support tickets fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support tickets',
      error: error.message
    });
  }
});

// Get tickets by user email
router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`📧 Fetching tickets for email: ${email}`);
    
    // Get user's tickets by customerEmail (more reliable than joining with userId)
    const tickets = await SupportTicket.find({ customerEmail: email })
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${tickets.length} tickets for user ${email}`);

    res.json({
      success: true,
      tickets
    });
  } catch (error) {
    console.error('❌ User tickets fetch error:', error);
    res.status(500).json({
      success: false,      message: 'Failed to fetch user tickets',
      error: error.message
    });
  }
});

// Add response to ticket
router.post('/:ticketId/respond', async (req, res) => {
  try {
    const { message, author, isAdmin = false } = req.body;

    if (!message || !author) {
      return res.status(400).json({
        success: false,
        message: 'Message and author are required'
      });
    }

    const ticket = await SupportTicket.findById(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    await ticket.addResponse(message, author, isAdmin);

    console.log(`✅ Response added to ticket ${ticket.ticketNumber}`);

    res.json({
      success: true,
      ticket,
      message: 'Response added successfully'
    });
  } catch (error) {
    console.error('❌ Response add error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add response',
      error: error.message
    });
  }
});

// Get single ticket by ID
router.get('/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    const ticket = await SupportTicket.findById(ticketId)
      .populate('userId', 'displayName email photoURL');
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    res.json({
      success: true,
      ticket
    });
  } catch (error) {
    console.error('❌ Single ticket fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket',
      error: error.message
    });
  }
});

// Update ticket status (admin)
router.put('/:ticketId/status', async (req, res) => {
  try {
    const { status, assignedTo } = req.body;

    const ticket = await SupportTicket.findById(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    await ticket.updateStatus(status, assignedTo);

    console.log(`✅ Ticket ${ticket.ticketNumber} status updated to ${status}`);

    res.json({
      success: true,
      ticket,
      message: 'Ticket status updated successfully'    });
  } catch (error) {
    console.error('❌ Ticket status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update ticket status',
      error: error.message
    });
  }
});

module.exports = router;
