# AIRN Backend Setup Guide

A Node.js/Express backend for the AIRN (AI & Robotics Network) marketplace platform with Supabase PostgreSQL database integration.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (https://supabase.com)

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_DB_PASSWORD=your-database-password

JWT_SECRET=your-super-secret-jwt-key-change-this

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Set Up Supabase Database

1. Go to https://supabase.com and create a new project
2. In the Supabase dashboard, go to SQL Editor
3. Create a new query and paste the contents of `schema.sql`
4. Execute the query to create all tables

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Google OAuth login

### Users
- `GET /api/users/:userId` - Get user profile
- `GET /api/users` - Get current user (requires auth)
- `PUT /api/users` - Update profile (requires auth)
- `GET /api/users/:userId/inventions` - Get user's inventions
- `GET /api/users/:userId/stats` - Get user statistics

### Inventions
- `GET /api/inventions` - Get all inventions (with pagination & filters)
- `GET /api/inventions/:inventionId` - Get single invention with reviews
- `POST /api/inventions` - Create invention (requires auth)
- `PUT /api/inventions/:inventionId` - Update invention (requires auth)
- `DELETE /api/inventions/:inventionId` - Delete invention (requires auth)
- `POST /api/inventions/:inventionId/reviews` - Add review (requires auth)
- `GET /api/inventions/search/query?q=search` - Search inventions

### Community
- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create post (requires auth)
- `GET /api/community/featured` - Get featured discussions

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📝 Example Requests

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Inventor",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Create Invention
```bash
curl -X POST http://localhost:5000/api/inventions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "AI Robot Assistant",
    "description": "Advanced AI-powered robot for home automation",
    "category": "robotics",
    "price": 1299.99,
    "features": ["AI Learning", "Voice Control", "Mobile App"],
    "specifications": {
      "weight": "25kg",
      "height": "150cm",
      "battery": "48h"
    }
  }'
```

## 🗄️ Database Schema

The backend uses the following main tables:

- **users**: User profiles and authentication
- **inventions**: Marketplace listings
- **reviews**: User reviews and ratings
- **community_posts**: Community discussions
- **transactions**: Purchase history

See `schema.sql` for complete schema details.

## 🔄 Integration with Frontend

Update your frontend to use the backend API:

```javascript
// In your frontend JavaScript (main2.js)
const API_BASE = 'http://localhost:5000/api';

// Example: Login
async function loginWithBackend(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  localStorage.setItem('airn_token', data.token);
  return data.user;
}

// Example: Get inventions
async function getInventions() {
  const response = await fetch(`${API_BASE}/inventions?limit=12`);
  const data = await response.json();
  return data.data;
}

// Example: Create invention (with auth)
async function createInvention(inventionData) {
  const token = localStorage.getItem('airn_token');
  const response = await fetch(`${API_BASE}/inventions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(inventionData)
  });
  
  return await response.json();
}
```

## 🚨 Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Server Error

## 📦 Deployment

### Deploy to Vercel
```bash
vercel
```

### Deploy to Heroku
```bash
heroku create airn-backend
git push heroku main
```

### Deploy to Railway
Visit https://railway.app and connect your GitHub repository

## 🔧 Troubleshooting

### Port already in use
```bash
# Change PORT in .env file
# Or kill the process using the port
lsof -ti:5000 | xargs kill -9
```

### Supabase connection issues
- Verify SUPABASE_URL and SUPABASE_KEY in .env
- Check that your Supabase project is active
- Ensure the database tables are created

### CORS errors
- Make sure FRONTEND_URL is correctly set in .env
- Verify the frontend is making requests to the correct API URL

## 📞 Support

For issues or questions, please check the Supabase documentation:
- https://supabase.com/docs
- https://express.js.com

## 📄 License

MIT
