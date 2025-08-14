const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

// Get all products with filtering, searching, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;
    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;
    
    let where = {};
    let orderBy = {};

    // Search by name or description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filter by category
    if (category && category.toLowerCase() !== 'all') {
      where.category = {
        equals: category, 
        mode: 'insensitive'
      };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Sort products
    switch (sort) {
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'name-asc':
        orderBy = { name: 'asc' };
        break;
      case 'name-desc':
        orderBy = { name: 'desc' };
        break;
      default:
        orderBy = { numericId: 'asc' }; // Default sort by original order
        break;
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take
      })
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        hasNext: skip + products.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error(' Products fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get single product by ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { pid: req.params.pid }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error(' Product fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// Create new product (for admin purposes)
router.post('/', async (req, res) => {
  try {
    const { numericId, name, brand, category, description, price, originalPrice, image, images, notes, size, stock, rating, reviews } = req.body;

    // Basic validation
    if (!numericId || !name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Numeric ID, Name and Price are required'
      });
    }

    const product = await prisma.product.create({
      data: {
        numericId,
        name,
        brand,
        category,
        description,
        price,
        originalPrice,
        image,
        images,
        notes,
        size,
        stock,
        rating,
        reviews
      }
    });

    res.status(201).json({
      success: true,
      product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error(' Product creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// Update product (for admin purposes)
router.put('/:pid', async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { pid: req.params.pid },
      data: req.body // Allows updating any field provided in the body
    });

    res.json({
      success: true,
      product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error(' Product update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// Delete product (for admin purposes)
router.delete('/:pid', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { pid: req.params.pid }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error(' Product deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

module.exports = router;