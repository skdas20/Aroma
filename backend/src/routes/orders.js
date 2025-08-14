const express = require('express');
const { prisma } = require('../config/database');
const router = express.Router();

// Create new order (transactional with stock deduction and expenditure update)
router.post('/create', async (req, res) => {
  try {
    const { uid, userId, items } = req.body;

    if ((!uid && !userId) || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Customer uid/userId and items are required' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Resolve customer
      let customer = null;
      if (uid) {
        customer = await tx.customer.findUnique({ where: { cid: uid } });
      } else if (userId) {
        customer = await tx.customer.findUnique({ where: { cid: userId } });
      }
      if (!customer) throw new Error('Customer not found');

      // Fetch and validate products
      const productIds = items.map((i) => i.productId);
      const products = await tx.product.findMany({ where: { pid: { in: productIds } } });
      if (products.length !== productIds.length) throw new Error('Some products not found');

      // Validate stock and compute total
      let orderTotal = 0;
      const orderProductsData = [];
      
      for (const item of items) {
        const product = products.find((p) => p.pid === item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}. Available: ${product.stock}, Requested: ${item.quantity}`);
        }
        
        const lineTotal = product.price * item.quantity;
        orderTotal += Number(lineTotal);
        
        orderProductsData.push({
          productId: product.pid,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        });
      }

      // Create order
      const order = await tx.order.create({
        data: {
          customerId: customer.cid,
          total: orderTotal,
          orderProducts: { create: orderProductsData },
        },
        include: { 
          orderProducts: { include: { product: true } }, 
          customer: true 
        },
      });

      // Update customer's total expenditure (automation rule 1)
      await tx.customer.update({
        where: { cid: customer.cid },
        data: { totalExpenditure: { increment: orderTotal } },
      });

      // Deduct stock from products (automation rule 2)
      for (const item of items) {
        await tx.product.update({
          where: { pid: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return order;
    });

    res.status(201).json({ success: true, order: result, message: 'Order created successfully' });
  } catch (error) {
    console.error(' Order creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
});

// Get orders for a customer by uid
router.get('/user/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const customer = await prisma.customer.findUnique({ where: { cid: uid } });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

    const where = { customerId: customer.cid };
    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({ 
        where, 
        orderBy: { date: 'desc' }, 
        skip, 
        take, 
        include: { 
          orderProducts: { include: { product: true } } 
        } 
      }),
    ]);

    res.json({ 
      success: true, 
      orders, 
      pagination: { 
        page: parseInt(page), 
        limit: take, 
        totalOrders: total, 
        hasNext: skip + orders.length < total, 
        hasPrev: parseInt(page) > 1 
      } 
    });
  } catch (error) {
    console.error(' Orders fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
});

// Get specific order
router.get('/:orderId', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ 
      where: { orderId: req.params.orderId }, 
      include: { 
        orderProducts: { include: { product: true } }, 
        customer: true 
      } 
    });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    console.error(' Order fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order', error: error.message });
  }
});

// Get all orders (admin)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const [total, orders] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        orderBy: { date: 'desc' },
        skip,
        take,
        include: {
          customer: true,
          orderProducts: { include: { product: true } }
        }
      })
    ]);

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: take,
        totalOrders: total,
        hasNext: skip + orders.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error(' Orders fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
});

module.exports = router;
