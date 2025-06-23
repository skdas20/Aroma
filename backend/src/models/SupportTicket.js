const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['order-issue', 'product-inquiry', 'shipping', 'refund', 'technical', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  assignedTo: {
    type: String,
    default: null
  },
  responses: [{
    id: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  }],
  orderReference: {
    type: String,
    default: null
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
supportTicketSchema.index({ userId: 1 });
// supportTicketSchema.index({ ticketNumber: 1 }); // Removed - already unique
supportTicketSchema.index({ status: 1 });
supportTicketSchema.index({ priority: 1 });
supportTicketSchema.index({ createdAt: -1 });

// Generate unique ticket number
supportTicketSchema.statics.generateTicketNumber = function() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `SUP-${timestamp.slice(-8)}-${random}`;
};

// Method to add response
supportTicketSchema.methods.addResponse = function(message, author, isAdmin = false) {
  const response = {
    id: Date.now().toString(),
    message,
    author,
    timestamp: new Date(),
    isAdmin
  };
  
  this.responses.push(response);
  this.updatedAt = new Date();
  
  if (isAdmin && this.status === 'open') {
    this.status = 'in-progress';
  }
  
  return this.save();
};

// Method to update status
supportTicketSchema.methods.updateStatus = function(newStatus, assignedTo = null) {
  this.status = newStatus;
  if (assignedTo) {
    this.assignedTo = assignedTo;
  }
  this.updatedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
