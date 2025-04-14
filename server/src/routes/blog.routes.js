const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { uploadBlog } = require('../config/cloudinary');
const Blog = require('../models/blog.model');

// Public routes
router.get('/', blogController.getBlogPosts);
router.get('/featured', blogController.getFeaturedPosts);
router.get('/tags', blogController.getBlogTags);
router.get('/all', protect, restrictTo('admin'), blogController.getAllBlogPosts);
router.get('/:id', blogController.getBlogPostById);
router.get('/:slug', blogController.getBlogPost);

// Protected routes (Admin only)


router.post('/', 
  protect, 
  restrictTo('admin'),
  uploadBlog.fields([
    { name: 'featuredImage', maxCount: 1 },
    { name: 'contentImages', maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      // Ensure featured image exists
      if (!req.files?.featuredImage?.[0]) {
        return res.status(400).json({
          status: 'error',
          message: 'Please upload a featured image'
        });
      }

      // Validate required fields
      const requiredFields = ['title', 'content', 'summary'];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({
            status: 'error',
            message: `${field} is required`
          });
        }
      }

      // Process uploaded images
      const blogData = {
        ...req.body,
        author: req.user._id,
        featuredImage: req.files.featuredImage[0].path,
        imageUrl: req.files.featuredImage[0].path, // For backward compatibility
        status: req.body.status || 'draft',
        featured: req.body.featured === 'true',
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
      };
      
      // Handle content images
      if (req.files?.contentImages) {
        blogData.images = req.files.contentImages.map(file => file.path);
      }
      
      const blog = new Blog(blogData);
      await blog.save();
      
      res.status(201).json({
        status: 'success',
        data: blog
      });
    } catch (error) {
      console.error('Blog creation error:', error);
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
);

router.patch('/:id', 
  protect, 
  restrictTo('admin'),
  uploadBlog.fields([
    { name: 'featuredImage', maxCount: 1 },
    { name: 'contentImages', maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      const currentBlog = await Blog.findById(req.params.id);
      if (!currentBlog) {
        return res.status(404).json({
          status: 'error',
          message: 'Blog post not found'
        });
      }

      const updateData = { 
        ...req.body,
        featured: req.body.featured === 'true',
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : currentBlog.tags
      };
      
      // Handle featured image
      if (req.files?.featuredImage?.[0]) {
        updateData.featuredImage = req.files.featuredImage[0].path;
        updateData.imageUrl = req.files.featuredImage[0].path; // For backward compatibility
      }
      
      // Handle content images
      if (req.files?.contentImages) {
        const newImages = req.files.contentImages.map(file => file.path);
        
        // If replacing all images
        if (req.body.replaceImages === 'true') {
          if (newImages.length === 0) {
            return res.status(400).json({
              status: 'error',
              message: 'Please provide at least one content image when replacing all images'
            });
          }
          updateData.images = newImages;
        } else {
          // Append new images to existing ones
          updateData.images = [...(currentBlog.images || []), ...newImages];
        }
      }
      
      const blog = await Blog.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('author', 'name');
      
      res.status(200).json({
        status: 'success',
        data: blog
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
);

router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;