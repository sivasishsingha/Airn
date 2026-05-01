# AIRN Backend - Complete Setup Guide

## 📦 Project Structure

```
backend/
├── server.js                 # Main Express server
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── schema.sql              # Database schema
├── README.md               # Setup instructions
├── API_DOCS.md             # Complete API documentation
├── FRONTEND_INTEGRATION.js # Frontend API client functions
│
├── middleware/
│   └── auth.js             # JWT authentication middleware
│
├── routes/
│   ├── auth.js             # Authentication endpoints
│   ├── users.js            # User profile endpoints
│   ├── inventions.js       # Marketplace endpoints
│   ├── community.js        # Community endpoints
│   ├── payments.js         # Payment processing (placeholder)
│   └── transactions.js     # Transaction history endpoints
│
└── utils/
    └── database.js         # Database utility functions
```

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Supabase

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Enter project name and database password
   - Wait for project to be created

2. **Get Your Credentials**
   - Navigate to Project Settings → API
   - Copy:
     - Project URL (SUPABASE_URL)
     - Anon Public Key (SUPABASE_KEY)
   - Also copy the database password you set during creation

### Step 3: Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_DB_PASSWORD=your_database_password
JWT_SECRET=your-super-secret-key-12345-change-this!
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Step 4: Create Database Schema

1. In Supabase Dashboard, go to SQL Editor
2. Click "New Query"
3. Copy the entire contents of `schema.sql`
4. Paste into the SQL editor
5. Click "Run"
6. Verify all tables are created

### Step 5: Start the Backend

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
🚀 AIRN Backend running on http://localhost:5000
Environment: development
```

### Step 6: Test the API

```bash
# Test health endpoint
curl http://localhost:5000/health

# Response:
# {"status":"OK","message":"AIRN Backend is running"}
```

## 🔑 Key Features

### ✅ Authentication System
- Email/Password signup and login
- Google OAuth integration
- JWT token-based authentication
- 7-day token expiration

### ✅ User Management
- Create and manage user profiles
- Update profile information and picture
- View user statistics

### ✅ Marketplace
- Create, read, update, delete inventions
- Support for images, features, and specifications
- Categorization and status tracking
- Full-text search capability

### ✅ Reviews & Ratings
- Add reviews to inventions
- 5-star rating system
- User feedback and comments

### ✅ Community
- Create discussion posts
- Tag-based categorization
- Featured content system
- Community engagement

### ✅ Transaction History
- Track purchases and sales
- Payment history
- Prepared for payment integration

## 🔐 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Tokens**: Stateless authentication
- **CORS Protection**: Cross-origin request validation
- **Input Validation**: Express-validator for request validation
- **SQL Injection Prevention**: Parameterized queries via Supabase
- **Row-Level Security**: Database-level access control (RLS)

## 📱 Frontend Integration

### Option 1: Use Provided Integration Library
Copy `FRONTEND_INTEGRATION.js` to your frontend and import:

```javascript
import { login, getInventions, createInvention } from './FRONTEND_INTEGRATION.js';

// Use in your code
const data = await getInventions({ category: 'robotics' });
```

### Option 2: Make Direct API Calls
```javascript
const token = localStorage.getItem('airn_token');

fetch('http://localhost:5000/api/inventions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'My Invention',
    description: '...',
    category: 'ai',
    price: 99.99
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module '@supabase/supabase-js'"
**Solution**: Run `npm install`

### Issue: "SUPABASE_URL is not defined"
**Solution**: Check `.env` file exists and has SUPABASE_URL

### Issue: "Port 5000 already in use"
**Solution**: Change PORT in `.env` or kill the process
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Issue: "Connection refused" when calling API
**Solution**: 
1. Ensure backend is running: `npm run dev`
2. Check FRONTEND_URL matches your frontend URL
3. Verify CORS is enabled in server.js

### Issue: "Email already registered" on signup
**Solution**: Normal behavior - user already has an account. Use login instead.

### Issue: "Invalid or expired token"
**Solution**: 
1. User token may have expired (7 days)
2. Ask user to login again
3. Clear localStorage and restart login flow

## 📚 API Examples

### Login Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create Invention Example
```bash
TOKEN="your_jwt_token_here"
curl -X POST http://localhost:5000/api/inventions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "AI Robot",
    "description": "My awesome AI robot",
    "category": "robotics",
    "price": 1299.99,
    "features": ["AI", "Learning"],
    "specifications": {
      "weight": "25kg",
      "power": "500W"
    }
  }'
```

### Get All Inventions
```bash
curl "http://localhost:5000/api/inventions?category=robotics&limit=12&page=1"
```

See `API_DOCS.md` for complete API reference.

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Deploy to Heroku
```bash
heroku create airn-backend
git push heroku main
```

### Deploy to Railway
1. Push code to GitHub
2. Visit https://railway.app
3. Click "Deploy from GitHub"
4. Select repository
5. Add environment variables
6. Deploy

### Deploy to DigitalOcean
```bash
# Install doctl CLI
doctl apps create --spec app.yaml

# app.yaml contains your backend configuration
```

## 📊 Database Queries

### View all users
```sql
SELECT id, name, email, created_at FROM users;
```

### View all inventions
```sql
SELECT id, title, category, price, user_id, created_at FROM inventions;
```

### View reviews
```sql
SELECT * FROM reviews WHERE invention_id = 'your-invention-id';
```

### Calculate avg rating
```sql
SELECT invention_id, AVG(rating) as avg_rating FROM reviews GROUP BY invention_id;
```

## 🔄 API Rate Limiting

Currently no rate limiting is implemented. For production, add:

```bash
npm install express-rate-limit
```

Then in server.js:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

## 📝 Future Enhancements

- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Real-time updates with WebSockets
- [ ] Image upload to cloud storage
- [ ] Advanced search with filters
- [ ] User follows/subscriptions
- [ ] Messaging system
- [ ] Advanced analytics

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Express Docs**: https://express.js.com
- **Node.js Docs**: https://nodejs.org/docs

## 📄 License

MIT License - Feel free to use this backend for your projects!
