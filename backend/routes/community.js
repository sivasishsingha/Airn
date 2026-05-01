import express from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { db } from '../utils/database.js';

const router = express.Router();

// Get community posts
router.get('/posts', optionalAuth, async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    
    const filters = {};
    if (category) filters.category = category;

    const posts = await db.getCommunityPosts(filters);
    
    // Pagination
    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + parseInt(limit);
    const paginatedPosts = posts.slice(startIdx, endIdx);

    res.json({
      total: posts.length,
      page: parseInt(page),
      limit: parseInt(limit),
      data: paginatedPosts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Create community post
router.post('/posts',
  authenticateToken,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, content, category, tags } = req.body;

      const post = await db.createCommunityPost({
        id: uuidv4(),
        user_id: req.user.id,
        title,
        content,
        category,
        tags: tags || [],
        likes: 0,
        created_at: new Date(),
        updated_at: new Date()
      });

      res.status(201).json({
        message: 'Post created successfully',
        post
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Get featured discussions/resources
router.get('/featured', optionalAuth, async (req, res) => {
  try {
    const posts = await db.getCommunityPosts({});
    
    // Return top posts (in production, use database sorting)
    const featured = posts.slice(0, 5);

    res.json({
      featured
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
