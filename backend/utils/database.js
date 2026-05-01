import { supabase } from '../server.js';

// Database utility functions for common operations

export const db = {
  // Users
  async getUserById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUser(userId, userData) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Inventions
  async getInventions(filters = {}) {
    let query = supabase.from('inventions').select('*, users!inner(id, name, picture)');
    
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.userId) query = query.eq('user_id', filters.userId);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getInventionById(inventionId) {
    const { data, error } = await supabase
      .from('inventions')
      .select('*, users!inner(id, name, picture, email)')
      .eq('id', inventionId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createInvention(inventionData) {
    const { data, error } = await supabase
      .from('inventions')
      .insert([inventionData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateInvention(inventionId, inventionData) {
    const { data, error } = await supabase
      .from('inventions')
      .update(inventionData)
      .eq('id', inventionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteInvention(inventionId) {
    const { error } = await supabase
      .from('inventions')
      .delete()
      .eq('id', inventionId);
    
    if (error) throw error;
    return true;
  },

  // Reviews & Ratings
  async createReview(reviewData) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getReviewsByInvention(inventionId) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, users!inner(id, name, picture)')
      .eq('invention_id', inventionId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Community Posts
  async getCommunityPosts(filters = {}) {
    let query = supabase.from('community_posts').select('*, users!inner(id, name, picture)');
    
    if (filters.category) query = query.eq('category', filters.category);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createCommunityPost(postData) {
    const { data, error } = await supabase
      .from('community_posts')
      .insert([postData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Transactions
  async createTransaction(transactionData) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserTransactions(userId) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};
