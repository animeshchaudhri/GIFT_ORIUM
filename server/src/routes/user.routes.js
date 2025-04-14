const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { uploadAvatar } = require('../config/cloudinary');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user profile
router.patch('/profile', protect, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'address'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Change password
router.patch('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update profile avatar
router.patch('/profile/avatar', 
  protect,
  uploadAvatar.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload an image' });
      }

      const user = await User.findById(req.user._id);
      user.avatar = req.file.path;
      await user.save();
      
      res.json({ 
        message: 'Avatar updated successfully',
        avatar: user.avatar 
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Admin: Get all users
router.get('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update user avatar
router.patch('/:id/avatar', 
  protect, 
  restrictTo('admin'),
  uploadAvatar.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload an image' });
      }

      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      user.avatar = req.file.path;
      await user.save();
      
      res.json({ 
        message: 'User avatar updated successfully',
        avatar: user.avatar 
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Admin: Update user
router.patch('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'role', 'address'];
    const isValidOperation = updates.every(update => 
      allowedUpdates.includes(update) || 
      update.startsWith('address.')
    );

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    updates.forEach(update => {
      if (update.startsWith('address.')) {
        const addressField = update.split('.')[1];
        if (!user.address) user.address = {};
        user.address[addressField] = req.body[update];
      } else {
        user[update] = req.body[update];
      }
    });
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Delete user
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Validate token endpoint
router.get('/validate-token', protect, async (req, res) => {
  try {
    // Set cache control headers to prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    
    // If the protect middleware passes, the token is valid
    res.status(200).json({
      valid: true,
      user: req.user
    });
  } catch (error) {
    res.status(401).json({ 
      valid: false,
      message: 'Invalid token' 
    });
  }
});

module.exports = router;