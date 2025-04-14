const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Get dashboard statistics
router.get('/dashboard', protect, restrictTo('admin'), async (req, res) => {
  try {
    // Get total sales
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort('-createdAt')
      .limit(5);

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    // Get user statistics
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    // Get order statistics
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalSales: totalSales[0]?.total || 0,
      recentOrders,
      topProducts,
      userStats: {
        total: totalUsers,
        newUsersLastMonth: newUsers
      },
      orderStats: Object.fromEntries(
        orderStats.map(stat => [stat._id, stat.count])
      )
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get monthly sales data
router.get('/sales/monthly', protect, restrictTo('admin'), async (req, res) => {
  try {
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json(monthlySales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;