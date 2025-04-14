const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide blog title'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Please provide blog content']
  },
  summary: {
    type: String,
    required: [true, 'Please provide blog summary'],
    maxlength: [200, 'Summary cannot be longer than 200 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide blog author']
  },
  // For backwards compatibility
  imageUrl: {
    type: String,
    default: '/placeholder.jpg'
  },
  // New field for Cloudinary image
  featuredImage: {
    type: String,
    default: '/placeholder.jpg'
  },
  // Supporting multiple images in the content
  images: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
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

// Generate slug from title before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  // Keep backward compatibility with imageUrl
  if (this.featuredImage && this.featuredImage !== '/placeholder.jpg' && (!this.imageUrl || this.imageUrl === '/placeholder.jpg')) {
    this.imageUrl = this.featuredImage;
  }
  
  this.updatedAt = Date.now();
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;