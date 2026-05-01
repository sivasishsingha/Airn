import express from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { db } from '../utils/database.js';

const router = express.Router();

// Get all inventions (with pagination and filters)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, status, page = 1, limit = 12 } = req.query;
    
    const filters = {};
    if (category) filters.category = category;
    if (status) filters.status = status;

    const inventions = await db.getInventions(filters);
    
    // Pagination
    const startIdx = (page - 1) * limit;
    const endIdx = startIdx + parseInt(limit);
    const paginatedInventions = inventions.slice(startIdx, endIdx);

    res.json({
      total: inventions.length,
      page: parseInt(page),
      limit: parseInt(limit),
      data: paginatedInventions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get single invention
router.get('/:inventionId', optionalAuth, async (req, res) => {
  try {
    const invention = await db.getInventionById(req.params.inventionId);
    
    if (!invention) {
      return res.status(404).json({ error: 'Invention not found' });
    }

    // Get reviews
    const reviews = await db.getReviewsByInvention(req.params.inventionId);

    res.json({
      ...invention,
      reviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Create new invention
router.post('/',
  authenticateToken,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, category, price, images, features, specifications } = req.body;

      const invention = await db.createInvention({
        id: uuidv4(),
        user_id: req.user.id,
        title,
        description,
        category,
        price: parseFloat(price),
        images: images || [],
        features: features || [],
        specifications: specifications || {},
        status: 'published',
        created_at: new Date(),
        updated_at: new Date()
      });

      res.status(201).json({
        message: 'Invention created successfully',
        invention
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Update invention
router.put('/:inventionId',
  authenticateToken,
  async (req, res) => {
    try {
      const invention = await db.getInventionById(req.params.inventionId);

      if (!invention) {
        return res.status(404).json({ error: 'Invention not found' });
      }

      if (invention.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to update this invention' });
      }

      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      const updatedInvention = await db.updateInvention(req.params.inventionId, updateData);

      res.json({
        message: 'Invention updated successfully',
        invention: updatedInvention
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete invention
router.delete('/:inventionId', authenticateToken, async (req, res) => {
  try {
    const invention = await db.getInventionById(req.params.inventionId);

    if (!invention) {
      return res.status(404).json({ error: 'Invention not found' });
    }

    if (invention.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this invention' });
    }

    await db.deleteInvention(req.params.inventionId);

    res.json({ message: 'Invention deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Add review to invention
router.post('/:inventionId/reviews',
  authenticateToken,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { rating, comment } = req.body;

      const review = await db.createReview({
        id: uuidv4(),
        invention_id: req.params.inventionId,
        user_id: req.user.id,
        rating,
        comment: comment || '',
        created_at: new Date()
      });

      res.status(201).json({
        message: 'Review added successfully',
        review
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Search inventions
router.get('/search/query', optionalAuth, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const inventions = await db.getInventions({});
    
    // Simple client-side search (in production, use full-text search in database)
    const results = inventions.filter(inv =>
      inv.title.toLowerCase().includes(q.toLowerCase()) ||
      inv.description.toLowerCase().includes(q.toLowerCase())
    );

    res.json({
      query: q,
      results
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
