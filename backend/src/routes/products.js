const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

// Get all products with filtering, searching, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, sex, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;
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
    if (typeof category === 'string' && category.length > 0 && category.toLowerCase() !== 'all') {
      where.category = {
        equals: category,
        mode: 'insensitive'
      };
    }

    // Filter by sex (Men, Women, Unisex)
    if (typeof sex === 'string' && sex.length > 0 && sex.toLowerCase() !== 'all') {
      where.sex = {
        equals: sex,
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
    console.log('Sort parameter received:', sort);
    switch (sort) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'name':
        orderBy = { name: 'asc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      default:
        orderBy = { numericId: 'asc' }; // Default sort by original order
        break;
    }
    console.log('OrderBy set to:', orderBy);

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
      products: products.map(p => ({ id: p.numericId, ...p })),
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
      product: { id: product.numericId, ...product }
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
    console.error(' Product update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

// Get products by sex (Men, Women, Unisex)
router.get('/sex/:sex', async (req, res) => {
  try {
    const { sex } = req.params;
    const { page = 1, limit = 20, sort } = req.query;
    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;
    
    let orderBy = {};

    // Sort products
    console.log('Sex route - Sort parameter received:', sort);
    switch (sort) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'name':
        orderBy = { name: 'asc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      default:
        orderBy = { numericId: 'asc' };
        break;
    }
    console.log('Sex route - OrderBy set to:', orderBy);

    const [total, products] = await Promise.all([
      prisma.product.count({ 
        where: { 
          sex: { equals: sex, mode: 'insensitive' } 
        } 
      }),
      prisma.product.findMany({
        where: { 
          sex: { equals: sex, mode: 'insensitive' } 
        },
        orderBy,
        skip,
        take
      })
    ]);

    res.json({
      success: true,
      products: products.map(p => ({ id: p.numericId, ...p })),
      pagination: {
        page: parseInt(page),
        limit: take,
        total,
        hasNext: skip + products.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Products by sex fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by sex',
      error: error.message
    });
  }
});

module.exports = router;