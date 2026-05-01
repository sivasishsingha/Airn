// Frontend integration example for AIRN backend
// Add this to your main2.js or create a new api.js file

const API_BASE = 'http://localhost:5000/api';

// ============ Helper Functions ============

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('airn_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ============ Authentication ============

async function signUp(name, email, password) {
  const data = await apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
  
  if (data.token) {
    localStorage.setItem('airn_token', data.token);
    localStorage.setItem('airn_user', JSON.stringify(data.user));
  }
  
  return data;
}

async function login(email, password) {
  const data = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  if (data.token) {
    localStorage.setItem('airn_token', data.token);
    localStorage.setItem('airn_user', JSON.stringify(data.user));
  }
  
  return data;
}

async function googleAuth(token, email, name, picture) {
  const data = await apiCall('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ token, email, name, picture })
  });
  
  if (data.token) {
    localStorage.setItem('airn_token', data.token);
    localStorage.setItem('airn_user', JSON.stringify(data.user));
  }
  
  return data;
}

function logout() {
  localStorage.removeItem('airn_token');
  localStorage.removeItem('airn_user');
}

function getCurrentUser() {
  const user = localStorage.getItem('airn_user');
  return user ? JSON.parse(user) : null;
}

// ============ Users ============

async function getUser(userId) {
  return apiCall(`/users/${userId}`);
}

async function getCurrentUserProfile() {
  return apiCall('/users');
}

async function updateUserProfile(data) {
  const result = await apiCall('/users', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  
  // Update local storage
  if (result.user) {
    localStorage.setItem('airn_user', JSON.stringify(result.user));
  }
  
  return result;
}

async function getUserInventions(userId) {
  return apiCall(`/users/${userId}/inventions`);
}

async function getUserStats(userId) {
  return apiCall(`/users/${userId}/stats`);
}

// ============ Inventions ============

async function getInventions(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.status) params.append('status', filters.status);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  
  const queryString = params.toString();
  return apiCall(`/inventions${queryString ? '?' + queryString : ''}`);
}

async function getInvention(inventionId) {
  return apiCall(`/inventions/${inventionId}`);
}

async function createInvention(inventionData) {
  return apiCall('/inventions', {
    method: 'POST',
    body: JSON.stringify(inventionData)
  });
}

async function updateInvention(inventionId, data) {
  return apiCall(`/inventions/${inventionId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteInvention(inventionId) {
  return apiCall(`/inventions/${inventionId}`, {
    method: 'DELETE'
  });
}

async function addReview(inventionId, rating, comment) {
  return apiCall(`/inventions/${inventionId}/reviews`, {
    method: 'POST',
    body: JSON.stringify({ rating, comment })
  });
}

async function searchInventions(query) {
  const params = new URLSearchParams({ q: query });
  return apiCall(`/inventions/search/query?${params}`);
}

// ============ Community ============

async function getCommunityPosts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  
  const queryString = params.toString();
  return apiCall(`/community/posts${queryString ? '?' + queryString : ''}`);
}

async function createCommunityPost(postData) {
  return apiCall('/community/posts', {
    method: 'POST',
    body: JSON.stringify(postData)
  });
}

async function getFeaturedPosts() {
  return apiCall('/community/featured');
}

// ============ Usage Examples ============

/*

// Sign up
signUp('John Inventor', 'john@example.com', 'password123')
  .then(data => console.log('Account created!', data))
  .catch(error => console.error('Sign up failed:', error));

// Login
login('john@example.com', 'password123')
  .then(data => console.log('Logged in!', data))
  .catch(error => console.error('Login failed:', error));

// Get inventions for marketplace
getInventions({ category: 'robotics', page: 1, limit: 12 })
  .then(data => {
    console.log('Total inventions:', data.total);
    renderInventions(data.data);
  })
  .catch(error => console.error('Failed to load inventions:', error));

// Create new invention
createInvention({
  title: 'AI Robot Assistant',
  description: 'Advanced AI robot for home automation',
  category: 'robotics',
  price: 1299.99,
  images: ['https://...'],
  features: ['AI Learning', 'Voice Control'],
  specifications: { weight: '25kg' }
})
  .then(data => console.log('Invention created!', data))
  .catch(error => console.error('Failed to create invention:', error));

// Get user profile
getCurrentUserProfile()
  .then(user => console.log('Current user:', user))
  .catch(error => console.error('Failed to load profile:', error));

// Update user profile
updateUserProfile({ name: 'John Updated', bio: 'AI Enthusiast' })
  .then(data => console.log('Profile updated!', data))
  .catch(error => console.error('Failed to update profile:', error));

// Add review
addReview('invention-uuid', 5, 'Amazing product!')
  .then(data => console.log('Review added!', data))
  .catch(error => console.error('Failed to add review:', error));

// Get community posts
getCommunityPosts({ category: 'discussion' })
  .then(data => renderCommunityPosts(data.data))
  .catch(error => console.error('Failed to load posts:', error));

// Create community post
createCommunityPost({
  title: 'How to build AI robots',
  content: 'Step-by-step guide...',
  category: 'tutorial',
  tags: ['ai', 'robotics']
})
  .then(data => console.log('Post created!', data))
  .catch(error => console.error('Failed to create post:', error));

// Logout
logout();

*/

export {
  apiCall,
  signUp,
  login,
  googleAuth,
  logout,
  getCurrentUser,
  getUser,
  getCurrentUserProfile,
  updateUserProfile,
  getUserInventions,
  getUserStats,
  getInventions,
  getInvention,
  createInvention,
  updateInvention,
  deleteInvention,
  addReview,
  searchInventions,
  getCommunityPosts,
  createCommunityPost,
  getFeaturedPosts
};
