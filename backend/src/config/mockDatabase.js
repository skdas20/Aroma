// Mock database for testing when MongoDB is not available
class MockDatabase {
  constructor() {
    this.users = [];
    this.orders = [];
    this.supportTickets = [];
    this.products = [];
    this.initializeData();
  }

  initializeData() {
    // Mock users
    this.users = [
      {
        _id: '1',
        displayName: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date('2024-10-01'),
        orderCount: 5,
        totalSpent: 750
      },
      {
        _id: '2',
        displayName: 'Jane Smith',
        email: 'jane@example.com',
        createdAt: new Date('2024-11-15'),
        orderCount: 2,
        totalSpent: 320
      }
    ];

    // Mock orders
    this.orders = [
      {
        _id: '1',
        orderNumber: 'AR-20241217-001',
        userId: { _id: '1', displayName: 'John Doe', email: 'john@example.com' },
        items: [
          { name: 'Chanel No. 5', quantity: 1, price: 150 }
        ],
        totalAmount: 150,
        status: 'pending',
        paymentStatus: 'paid',
        orderDate: new Date('2024-12-17'),
        shippingAddress: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      }
    ];

    // Mock support tickets
    this.supportTickets = [
      {
        _id: '1',
        ticketNumber: 'SUP-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        subject: 'Order inquiry',
        message: 'I have a question about my recent order.',
        status: 'open',
        priority: 'medium',
        category: 'order-issue',
        createdAt: new Date('2024-12-17')
      }
    ];
  }

  // User methods
  async countUsers() {
    return this.users.length;
  }

  async findUsers(query = {}) {
    return this.users.filter(user => {
      if (query.search) {
        return user.displayName.toLowerCase().includes(query.search.toLowerCase()) ||
               user.email.toLowerCase().includes(query.search.toLowerCase());
      }
      return true;
    });
  }

  // Order methods
  async countOrders(query = {}) {
    return this.orders.filter(order => {
      if (query.status) return order.status === query.status;
      return true;
    }).length;
  }

  async findOrders(query = {}) {
    return this.orders.filter(order => {
      if (query.status) return order.status === query.status;
      if (query.search) {
        return order.orderNumber.toLowerCase().includes(query.search.toLowerCase()) ||
               order.userId.displayName.toLowerCase().includes(query.search.toLowerCase());
      }
      return true;
    }).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  }

  async updateOrder(id, updates) {
    const index = this.orders.findIndex(order => order._id === id);
    if (index !== -1) {
      this.orders[index] = { ...this.orders[index], ...updates };
      return this.orders[index];
    }
    return null;
  }

  async createOrder(orderData) {
    const order = {
      _id: (this.orders.length + 1).toString(),
      ...orderData,
      orderDate: new Date(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.push(order);
    return order;
  }

  async aggregateRevenue() {
    return this.orders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((total, order) => total + order.totalAmount, 0);
  }

  // Support ticket methods
  async countSupportTickets(query = {}) {
    return this.supportTickets.filter(ticket => {
      if (query.status) {
        if (Array.isArray(query.status)) {
          return query.status.includes(ticket.status);
        }
        return ticket.status === query.status;
      }
      return true;
    }).length;
  }

  async findSupportTickets(query = {}) {
    return this.supportTickets.filter(ticket => {
      if (query.status) {
        if (Array.isArray(query.status)) {
          return query.status.includes(ticket.status);
        }
        return ticket.status === query.status;
      }
      if (query.search) {
        return ticket.ticketNumber.toLowerCase().includes(query.search.toLowerCase()) ||
               ticket.subject.toLowerCase().includes(query.search.toLowerCase()) ||
               ticket.customerName.toLowerCase().includes(query.search.toLowerCase());
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async updateSupportTicket(id, updates) {
    const index = this.supportTickets.findIndex(ticket => ticket._id === id);
    if (index !== -1) {
      this.supportTickets[index] = { ...this.supportTickets[index], ...updates };
      return this.supportTickets[index];
    }
    return null;
  }

  // User authentication methods
  async findOrCreateUser(userData) {
    // Try to find existing user
    let user = this.users.find(u => 
      u.email === userData.email || 
      (userData.firebaseUid && u.firebaseUid === userData.firebaseUid)
    );

    if (user) {
      // Update existing user
      Object.assign(user, userData);
      user.lastLogin = new Date();
      return user;
    }

    // Create new user
    user = {
      _id: (this.users.length + 1).toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date()
    };

    this.users.push(user);
    return user;
  }
}

module.exports = new MockDatabase();
