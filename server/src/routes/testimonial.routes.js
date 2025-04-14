const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonial.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const Order = require('../models/order.model');
const Testimonial = require('../models/testimonial.model');
const Product = require('../models/product.model');

// Public routes
router.get('/', testimonialController.getTestimonials);
router.get('/featured', testimonialController.getFeaturedTestimonials);
router.get('/stats', testimonialController.getTestimonialStats);

// Protected routes - Both admin and users can add testimonials
router.post('/', protect, async (req, res) => {
  try {
    let customerName = req.body.name;
    
    // If orderId is provided, verify it's a delivered order and belongs to the user
    if (req.body.orderId) {
      const order = await Order.findOne({
        _id: req.body.orderId,
        user: req.user._id,
        status: 'delivered'
      }).populate('user', 'name');
      
      if (!order) {
        return res.status(403).json({
          status: 'error',
          message: 'You can only review delivered orders that belong to you'
        });
      }

      // Use customer name from order if not explicitly provided
      if (!customerName && order.user) {
        customerName = order.user.name;
      }
    }

    // If still no name, use the authenticated user's name or the provided name
    customerName = customerName || req.user.name;

    const testimonial = new Testimonial({
      ...req.body,
      user: req.user._id,
      name: customerName,
      role: req.user.role === 'admin' ? 'Admin' : 'Customer'
    });

    await testimonial.save();

    // Update product ratings if productId is provided
    if (req.body.productId) {
      // Handle single product
      await updateProductRating(req.body.productId);
    } 
    // Handle multiple products if they were reviewed together
    else if (req.body.productIds && Array.isArray(req.body.productIds)) {
      await Promise.all(req.body.productIds.map(productId => updateProductRating(productId)));
    }

    res.status(201).json({
      status: 'success',
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Helper function to update product rating
async function updateProductRating(productId) {
  // Get all testimonials for this product
  const testimonials = await Testimonial.find({ 
    $or: [
      { productId: productId },
      { productIds: productId }
    ]
  });

  // Calculate new average rating
  const totalRating = testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0);
  const averageRating = testimonials.length > 0 ? totalRating / testimonials.length : 0;

  // Update product
  await Product.findByIdAndUpdate(productId, {
    rating: Number(averageRating.toFixed(1)),
    numReviews: testimonials.length
  });
}

// Admin only routes
router.patch('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        status: 'error',
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        status: 'error',
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;