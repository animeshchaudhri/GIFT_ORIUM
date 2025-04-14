const Blog = require('../models/blog.model');

// Get all blog posts with optional filtering
exports.getBlogPosts = async (req, res) => {
  try {
    const { featured, status = 'published', limit = 6 } = req.query;
    const query = { status };

    if (featured) query.featured = featured === 'true';

    const posts = await Blog.find(query)
      .populate('author', 'name')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
exports.getAllBlogPosts = async (req, res) => {
  try {
    const posts = await Blog.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get featured blog posts
exports.getFeaturedPosts = async (req, res) => {
  try {
    const { limit = 3 } = req.query;
    const posts = await Blog.find({ featured: true, status: 'published' })
      .populate('author', 'name')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get single blog post by slug
exports.getBlogPost = async (req, res) => {
  try {
    const post = await Blog.findOne({ 
      slug: req.params.slug,
      status: 'published'
    }).populate('author', 'name');
    
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: post
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get blog post tags
exports.getBlogTags = async (req, res) => {
  try {
    const tags = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          tag: '$_id',
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      status: 'success',
      results: tags.length,
      data: tags
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getBlogPostById = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Ur mom not found'
      });

    } 
    res.status(200).json({
      status:'success',
      data: post 
    })
  } 
  catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    }); 
  }
}