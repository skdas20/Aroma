const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

// Get or create a cart for a user (ensures Customer exists)
const getOrCreateCart = async (customerId) => {
  // Ensure the customer exists to satisfy FK constraints
  await prisma.customer.upsert({
    where: { cid: customerId },
    update: {},
    create: {
      cid: customerId,
      email: `${customerId}@demo.local`,
      name: 'Demo User',
    },
  });

  let cart = await prisma.cart.findUnique({
    where: { customerId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { customerId },
    });
  }
  return cart;
};

// Get cart for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await prisma.cart.findUnique({
      where: { customerId: userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return res.json({ success: true, cart: { items: [], summary: { subtotal: 0, shipping: 0, tax: 0, total: 0, itemCount: 0 } } });
    }

    const subtotal = cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    const shipping = subtotal > 8300 ? 0 : 830;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      success: true,
      cart: {
        items: cart.items.map(item => ({ id: item.product.numericId, ...item.product, quantity: item.quantity, cartItemId: item.id })),
        summary: {
          subtotal: parseFloat(subtotal.toFixed(2)),
          shipping: parseFloat(shipping.toFixed(2)),
          tax: parseFloat(tax.toFixed(2)),
          total: parseFloat(total.toFixed(2)),
          itemCount,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching cart', error: error.message });
  }
});

// Add item to cart
router.post('/:userId/add', async (req, res) => {
  try {
    const { userId } = req.params;
    let { productId, quantity = 1 } = req.body;

    const cart = await getOrCreateCart(userId);

    // Resolve product using either pid (string UUID) or numericId (number or numeric string)
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { pid: typeof productId === 'string' ? productId : '' },
          { numericId: Number(productId) || -1 },
        ],
      },
      select: { pid: true },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Ensure we use pid for the CartItem relation
    productId = product.pid;

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: { increment: quantity } },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    res.json({ success: true, message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding item to cart', error: error.message });
  }
});

// Update cart item quantity
router.put('/:userId/update/:cartItemId', async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: cartItemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });
    }

    res.json({ success: true, message: 'Cart updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating cart', error: error.message });
  }
});

// Remove item from cart
router.delete('/:userId/remove/:cartItemId', async (req, res) => {
  try {
    const { cartItemId } = req.params;
    await prisma.cartItem.delete({ where: { id: cartItemId } });
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing item from cart', error: error.message });
  }
});

// Clear cart
router.delete('/:userId/clear', async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await prisma.cart.findUnique({ where: { customerId: userId } });

    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    res.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error clearing cart', error: error.message });
  }
});

module.exports = router;