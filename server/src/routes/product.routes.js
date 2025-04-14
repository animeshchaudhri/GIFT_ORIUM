const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { uploadProduct } = require('../config/cloudinary');

// Get all products with filtering and sorting
router.get('/', async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const products = await query;
    res.json({
      results: products.length,
      page,
      data: products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload product images (Admin only)
router.post('/upload',
  protect,
  restrictTo('admin'),
  uploadProduct.single('images'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload an image' });
      }
      
      res.status(200).json({
        message: 'Image uploaded successfully',
        imageUrl: req.file.path
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Create new product (Admin only) with image upload
router.post('/', 
  protect, 
  restrictTo('admin'),
  uploadProduct.array('images', 5), // Allow up to 5 images per product
  async (req, res) => {
    try {
      // Ensure files array exists and has at least one file
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Please upload at least one image' });
      }

      // Validate other required fields
      const requiredFields = ['name', 'description', 'price', 'category', 'stock'];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ message: `${field} is required` });
        }
      }

      const productData = {
        ...req.body,
        price: parseFloat(req.body.price),
        stock: parseInt(req.body.stock),
        discountPrice: req.body.discountPrice ? parseFloat(req.body.discountPrice) : undefined,
        featured: req.body.featured === 'true',
        images: req.files.map(file => file.path),
        imageUrl: req.files[0].path // Set the first image as the main image
      };
      
      const product = new Product(productData);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      console.error('Product creation error:', error);
      res.status(400).json({ message: error.message });
    }
});

// Update product (Admin only)
router.patch('/:id', 
  protect, 
  restrictTo('admin'),
  uploadProduct.array('images', 5),
  async (req, res) => {
    try {
      const updateData = { ...req.body };
      const currentProduct = await Product.findById(req.params.id);
      
      if (!currentProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Handle image updates
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => file.path);
        
        // If replacing all images
        if (req.body.replaceImages === 'true') {
          if (newImages.length === 0) {
            return res.status(400).json({ message: 'Please provide at least one image' });
          }
          updateData.images = newImages;
          updateData.imageUrl = newImages[0];
        } else {
          // Append new images
          updateData.images = [...currentProduct.images, ...newImages];
        }
      }
      
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

// Delete product (Admin only)
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search products
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } }
      ]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;