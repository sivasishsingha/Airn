# AIRN Backend - Quick Reference Card

## 🎯 What This Backend Provides

A complete Node.js/Express backend for your AIRN AI & Robotics marketplace with:
- User authentication (email & Google OAuth)
- Marketplace inventory management
- User profiles and statistics
- Community discussions
- Reviews and ratings system
- Transaction tracking

## 🛠️ Tech Stack

- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator
- **File handling**: multer
- **CORS**: enabled for frontend integration

## 📋 Installation Checklist

- [ ] Node.js installed
- [ ] npm/yarn available
- [ ] Supabase account created
- [ ] Project dependencies installed (`npm install`)
- [ ] `.env` file created with credentials
- [ ] Database schema imported (schema.sql)
- [ ] Backend running on localhost:5000

## 🔌 API Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/signup` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/google` | ❌ | Google OAuth |
| GET | `/api/users` | ✅ | Current user profile |
| GET | `/api/users/:id` | ❌ | Public user profile |
| PUT | `/api/users` | ✅ | Update profile |
| GET | `/api/inventions` | ❌ | Get marketplace |
| POST | `/api/inventions` | ✅ | Create invention |
| PUT | `/api/inventions/:id` | ✅ | Update invention |
| DELETE | `/api/inventions/:id` | ✅ | Delete invention |
| POST | `/api/inventions/:id/reviews` | ✅ | Add review |
| GET | `/api/community/posts` | ❌ | Get discussions |
| POST | `/api/community/posts` | ✅ | Create post |

## 🔑 Environment Variables

```env
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiI...
SUPABASE_DB_PASSWORD=yourpassword
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## 🚀 Commands

```bash
# Install dependencies
npm install

# Development (auto-reload)
npm run dev

# Production
npm start

# Test API
curl http://localhost:5000/health
```

## 📁 File Structure

```
backend/
├── server.js           ← Main app entry
├── package.json        ← Dependencies
├── .env               ← Your secrets
├── schema.sql         ← Database tables
├── API_DOCS.md        ← Full API docs
├── middleware/auth.js ← JWT middleware
├── routes/            ← API endpoints
│   ├── auth.js
│   ├── users.js
│   ├── inventions.js
│   └── community.js
└── utils/database.js  ← DB helpers
```

## 🔐 Authentication Flow

1. **Signup**: Send name, email, password → Get JWT token
2. **Login**: Send email, password → Get JWT token
3. **Authenticated Request**: Include `Authorization: Bearer TOKEN` header
4. **Token Expires**: 7 days (user must login again)

## 📊 Database Tables

- `users` - User accounts
- `inventions` - Marketplace products
- `reviews` - Ratings & feedback
- `community_posts` - Discussions
- `transactions` - Purchase history

## 🎬 Getting Started (5 minutes)

1. **Set up Supabase**
   ```
   Go to supabase.com → New Project → Copy URL & Key
   ```

2. **Create `.env` file**
   ```
   SUPABASE_URL=your-url
   SUPABASE_KEY=your-key
   JWT_SECRET=anything-random-here
   ```

3. **Import database schema**
   ```
   Copy schema.sql → Supabase SQL Editor → Run
   ```

4. **Start backend**
   ```
   npm install && npm run dev
   ```

5. **Test it works**
   ```
   curl http://localhost:5000/health
   ```

## 🌐 Frontend Integration

Use `FRONTEND_INTEGRATION.js` in your frontend:

```javascript
import { login, getInventions } from './FRONTEND_INTEGRATION.js';

// Login
await login('user@example.com', 'password');

// Get inventions
const data = await getInventions({ category: 'robotics' });
```

Or make direct fetch calls with the JWT token.

## ⚠️ Common Mistakes

❌ **Forgot `.env` file** → Backend won't connect to database  
❌ **Wrong Supabase URL** → "SUPABASE_URL is not defined" error  
❌ **Schema not imported** → Table not found errors  
❌ **Token not sent** → "Access token required" on protected routes  
❌ **CORS issues** → Check FRONTEND_URL matches your frontend

## 💡 Tips

- Store JWT token in localStorage after login
- Always send token in Authorization header for protected routes
- Test with `curl` or Postman first before coding
- Check browser console for API errors
- Keep `.env` file private (in `.gitignore`)

## 🔗 Useful Links

- Supabase Docs: https://supabase.com/docs
- Express Guide: https://express.js.com
- JWT Explained: https://jwt.io
- HTTP Status Codes: https://httpwg.org/specs/rfc7231.html

## 📞 Debugging

**Backend won't start?**
- Check Node.js: `node --version`
- Check npm: `npm --version`
- Check dependencies: `npm install`

**Can't connect to database?**
- Verify SUPABASE_URL in .env
- Check Supabase project is active
- Ensure network is working

**Getting 401 Unauthorized?**
- Token not sent or expired
- User not logged in
- Check localStorage.getItem('airn_token')

**Database tables not created?**
- Paste schema.sql into Supabase SQL Editor
- Make sure to click "Run"
- Refresh the browser

## ✅ Next Steps

1. **Integrate with Frontend**: Copy FRONTEND_INTEGRATION.js
2. **Add Payment Processing**: Implement Stripe integration
3. **Deploy**: Use Vercel, Heroku, or Railway
4. **Monitor**: Add logging and error tracking
5. **Scale**: Add caching, CDN, rate limiting

---

**Made for AIRN - AI & Robotics Network Marketplace** 🚀
