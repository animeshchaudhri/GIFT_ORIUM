const Testimonial = require('../models/testimonial.model');

// Get all testimonials with optional filtering
exports.getTestimonials = async (req, res) => {
  try {
    const { featured, limit = 6, productId } = req.query;
    const query = {};

    if (featured) query.featured = featured === 'true';
    if (productId) {
      query.$or = [
        { productId: productId },
        { productIds: productId }
      ];
    }

    const testimonials = await Testimonial.find(query)
      .populate('user', 'name')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get featured testimonials
exports.getFeaturedTestimonials = async (req, res) => {
  try {
    const { limit = 3 } = req.query;
    const testimonials = await Testimonial.find({ featured: true })
      .populate('user', 'name')
      .limit(parseInt(limit))
      .sort({ rating: -1, createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get testimonial statistics
exports.getTestimonialStats = async (req, res) => {
  try {
    const stats = await Testimonial.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalTestimonials: { $sum: 1 },
          ratingDistribution: {
            $push: {
              rating: '$rating',
              count: 1
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          avgRating: { $round: ['$avgRating', 1] },
          totalTestimonials: 1,
          ratingDistribution: 1
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: stats[0] || {
        avgRating: 0,
        totalTestimonials: 0,
        ratingDistribution: []
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};