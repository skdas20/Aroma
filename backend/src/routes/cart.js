const express = require('express');
const router = express.Router();
const perfumes = require('../data/perfumes');

// In-memory cart storage (in production, use database)
let carts = {};

// Get cart items
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const cart = carts[userId] || [];
    
    // Calculate cart totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    res.json({
      success: true,
      cart: {
        items: cart,
        summary: {
          subtotal: parseFloat(subtotal.toFixed(2)),
          shipping: parseFloat(shipping.toFixed(2)),
          tax: parseFloat(tax.toFixed(2)),
          total: parseFloat(total.toFixed(2)),
          itemCount: cart.reduce((count, item) => count + item.quantity, 0)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
});

// Add item to cart
router.post('/:userId/add', (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity = 1 } = req.body;

    // Find the product
    const product = perfumes.find(p => p.id === parseInt(productId));
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Initialize cart if doesn't exist
    if (!carts[userId]) {
      carts[userId] = [];
    }

    // Check if item already exists in cart
    const existingItemIndex = carts[userId].findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
      // Update quantity
      carts[userId][existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      carts[userId].push({
        ...product,
        quantity,
        addedAt: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      message: 'Item added to cart',
      cartItemCount: carts[userId].reduce((count, item) => count + item.quantity, 0)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
});

// Update cart item quantity
router.put('/:userId/update/:itemId', (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;

    if (!carts[userId]) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = carts[userId].findIndex(item => item.id === parseInt(itemId));
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      carts[userId].splice(itemIndex, 1);
    } else {
      // Update quantity
      carts[userId][itemIndex].quantity = quantity;
    }

    res.json({
      success: true,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
});

// Remove item from cart
router.delete('/:userId/remove/:itemId', (req, res) => {
  try {
    const { userId, itemId } = req.params;

    if (!carts[userId]) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = carts[userId].findIndex(item => item.id === parseInt(itemId));
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    carts[userId].splice(itemIndex, 1);

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
});

// Clear cart
router.delete('/:userId/clear', (req, res) => {
  try {
    const { userId } = req.params;
    carts[userId] = [];

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
});

module.exports = router;