const express = require('express');
const router = express.Router();
const perfumes = require('../data/perfumes');

// Get all products with optional filtering
router.get('/', (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    let filteredPerfumes = [...perfumes];

    // Filter by category
    if (category && category !== 'All') {
      filteredPerfumes = filteredPerfumes.filter(
        perfume => perfume.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Search by name or brand
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredPerfumes = filteredPerfumes.filter(
        perfume => 
          perfume.name.toLowerCase().includes(searchTerm) ||
          perfume.brand.toLowerCase().includes(searchTerm) ||
          perfume.description.toLowerCase().includes(searchTerm)
      );
    }

    // Price range filter
    if (minPrice) {
      filteredPerfumes = filteredPerfumes.filter(perfume => perfume.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filteredPerfumes = filteredPerfumes.filter(perfume => perfume.price <= parseFloat(maxPrice));
    }

    // Sort products
    if (sort) {
      switch (sort) {
        case 'price-low':
          filteredPerfumes.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredPerfumes.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredPerfumes.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          filteredPerfumes.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
    }

    res.json({
      success: true,
      products: filteredPerfumes,
      total: filteredPerfumes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get single product by ID
router.get('/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = perfumes.find(p => p.id === productId);

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
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// Get product categories
router.get('/categories/list', (req, res) => {
  try {
    const categories = [...new Set(perfumes.map(p => p.category))];
    res.json({
      success: true,
      categories: ['All', ...categories]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

module.exports = router;