const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: '50ml'
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true, default: 'USA' }
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  estimatedDelivery: {
    type: Date
  },
  trackingNumber: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ userId: 1 });
// orderSchema.index({ orderNumber: 1 }); // Removed - already unique
orderSchema.index({ status: 1 });
orderSchema.index({ orderDate: -1 });

// Generate unique order number
orderSchema.statics.generateOrderNumber = function() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `AR-${timestamp.slice(-8)}-${random}`;
};

// Calculate estimated delivery (7-14 business days)
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.estimatedDelivery) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 10); // 10 days default
    this.estimatedDelivery = deliveryDate;
  }
  next();
});

// Virtual for order total items
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, trackingNumber = null) {
  this.status = newStatus;
  if (trackingNumber) {
    this.trackingNumber = trackingNumber;
  }
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);
