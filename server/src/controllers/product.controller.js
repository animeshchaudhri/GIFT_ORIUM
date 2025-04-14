const Product = require('../models/product.model');

// Get all products with optional filtering
exports.getProducts = async (req, res) => {
  try {
    const { featured, category, limit = 8 } = req.query;
    const query = {};

    if (featured) query.featured = featured === 'true';
    if (category) query.category = category;

    const products = await Product.find(query)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    const products = await Product.find({ featured: true })
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get product categories with counts
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          imageUrl: { $first: '$imageUrl' }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          imageUrl: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get single product by ID
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};