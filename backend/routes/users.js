import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../utils/database.js';

const router = express.Router();

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await db.getUserById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove sensitive data
    delete user.password_hash;

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get current user profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    delete user.password_hash;

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/', 
  authenticateToken,
  body('name').optional().trim().notEmpty(),
  body('bio').optional().trim(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, bio, picture } = req.body;
      const updateData = {};

      if (name) updateData.name = name;
      if (bio !== undefined) updateData.bio = bio;
      if (picture) updateData.picture = picture;

      const updatedUser = await db.updateUser(req.user.id, updateData);

      delete updatedUser.password_hash;

      res.json({
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Get user's inventions
router.get('/:userId/inventions', async (req, res) => {
  try {
    const inventions = await db.getInventions({ userId: req.params.userId });
    res.json(inventions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's statistics
router.get('/:userId/stats', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get inventions count
    const inventions = await db.getInventions({ userId });
    
    // In production, calculate from database
    const stats = {
      inventionsCount: inventions.length,
      totalSales: 0,
      avgRating: 0,
      joinDate: new Date()
    };

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
