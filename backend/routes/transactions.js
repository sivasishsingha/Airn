import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../utils/database.js';

const router = express.Router();

// Get transaction history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const transactions = await db.getUserTransactions(req.user.id);
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get transaction details
router.get('/:transactionId', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', req.params.transactionId)
      .single();

    if (error) throw error;

    // Verify user is involved in transaction
    if (data.buyer_id !== req.user.id && data.seller_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
