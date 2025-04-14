const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  name: {
    type: String,
    required: [true, 'Please provide customer name'],
    trim: true
  },
  role: {
    type: String,
    default: 'Customer',
    enum: ['Customer', 'Admin']
  },
  content: {
    type: String,
    required: [true, 'Please provide testimonial content'],
    maxlength: [500, 'Testimonial cannot be longer than 500 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Please provide rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  // Single product reference
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  // Multiple products reference
  productIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  imageUrl: {
    type: String,
    default: '/placeholder-user.jpg'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Validate that either productId or productIds is provided
testimonialSchema.pre('save', function(next) {
  if (!this.productId && (!this.productIds || this.productIds.length === 0)) {
    next(new Error('At least one product must be associated with the testimonial'));
  } else {
    this.updatedAt = Date.now();
    next();
  }
});

// Add indexes for better query performance
testimonialSchema.index({ featured: 1 });
testimonialSchema.index({ rating: -1 });
testimonialSchema.index({ orderId: 1 }, { sparse: true });
testimonialSchema.index({ productId: 1 }, { sparse: true });
testimonialSchema.index({ productIds: 1 }, { sparse: true });
// Add compound index for product rating queries
testimonialSchema.index({ 
  productId: 1, 
  productIds: 1, 
  rating: 1 
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;