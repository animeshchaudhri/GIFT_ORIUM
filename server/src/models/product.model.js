const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: ['Tech Gifts', 'Eco Gifts', 'Beauty Gifts', 'Premium Gifts', 'Other']
  },
  // Main product image
  imageUrl: {
    type: String,
    required: [true, 'Please provide at least one product image']
  },
  // Additional product images
  images: [{
    type: String,
    required: [true, 'Please provide at least one product image']
  }],
  stock: {
    type: Number,
    required: [true, 'Please provide product stock'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be below 0'],
    max: [5, 'Rating cannot be above 5']
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set the first image as the imageUrl if not already set
  if (this.images && this.images.length > 0 && (!this.imageUrl || this.imageUrl === '/placeholder.svg')) {
    this.imageUrl = this.images[0];
  }
  
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;