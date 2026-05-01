# 📂 AIRN Backend - File Directory & Purpose Guide

## Complete Project Structure

```
c:\Users\Sivasish\OneDrive\Desktop\Airn2\
│
├── frontend files (existing)
│   ├── airn (1).html
│   ├── airn.css
│   ├── main2 (1).js
│   ├── main2.js
│   └── profile.html
│
└── backend/                              ← NEW BACKEND FOLDER
    │
    ├── 📄 package.json                  ← Dependencies and scripts
    ├── 📄 server.js                     ← Main Express server (START HERE)
    ├── 📄 .env.example                  ← Template for environment variables
    ├── 📄 .gitignore                    ← Git ignore rules
    ├── 📄 schema.sql                    ← Database tables (paste in Supabase)
    │
    ├── 📚 DOCUMENTATION (Read These First!)
    │   ├── START_HERE.md                ← 👈 BEGIN HERE - Complete overview
    │   ├── QUICK_REFERENCE.md           ← Quick lookup card
    │   ├── SETUP_GUIDE.md               ← Detailed setup instructions
    │   ├── SUPABASE_SETUP.md            ← Supabase configuration
    │   ├── README.md                    ← Installation & usage
    │   ├── API_DOCS.md                  ← Complete API reference (DETAILED!)
    │   ├── ARCHITECTURE.md              ← System design & diagrams
    │   └── FRONTEND_INTEGRATION.js      ← Ready-to-use API client library
    │
    ├── 🔐 middleware/
    │   └── auth.js                      ← JWT authentication middleware
    │
    ├── 🛣️ routes/ (API Endpoints)
    │   ├── auth.js                      ← /api/auth/* (login, signup, oauth)
    │   ├── users.js                     ← /api/users/* (profiles, stats)
    │   ├── inventions.js                ← /api/inventions/* (marketplace)
    │   ├── community.js                 ← /api/community/* (discussions)
    │   ├── transactions.js              ← /api/transactions/* (purchase history)
    │   └── payments.js                  ← /api/payments/* (payment processing)
    │
    └── 🛠️ utils/
        └── database.js                  ← Supabase query helpers
```

## File Descriptions

### 📄 Configuration Files

| File | Purpose | Notes |
|------|---------|-------|
| `package.json` | Dependencies & scripts | npm install reads this |
| `.env.example` | Template for .env | COPY to .env and fill in |
| `.env` | Your environment variables | CREATE this file (DO NOT COMMIT) |
| `.gitignore` | Git ignore rules | Prevents .env from uploading |

### 📚 Documentation Files

| File | Read Time | Purpose | Read First? |
|------|-----------|---------|-------------|
| `START_HERE.md` | 5 min | Overview of everything | ✅ YES |
| `QUICK_REFERENCE.md` | 3 min | Quick lookup card | ✅ YES (after START_HERE) |
| `README.md` | 10 min | Setup instructions | ✅ YES (3rd) |
| `SETUP_GUIDE.md` | 15 min | Detailed setup | ⏳ For reference |
| `SUPABASE_SETUP.md` | 10 min | Database setup | ✅ YES (during setup) |
| `API_DOCS.md` | 20 min | Complete API reference | ⏳ When building frontend |
| `ARCHITECTURE.md` | 10 min | System design & diagrams | ⏳ For understanding |
| `FRONTEND_INTEGRATION.js` | - | Copy to frontend | ✅ YES (for frontend dev) |

**Reading Order:**
1. `START_HERE.md` - Understand what you have
2. `QUICK_REFERENCE.md` - Get quick facts
3. `README.md` - Follow setup steps
4. `SUPABASE_SETUP.md` - Set up database
5. `API_DOCS.md` - Reference while coding
6. `FRONTEND_INTEGRATION.js` - Copy to frontend

### 🔐 Authentication (middleware/)

| File | Purpose | Used By |
|------|---------|---------|
| `auth.js` | JWT token middleware | All protected routes |

**Functions:**
- `authenticateToken()` - Validate JWT tokens (required)
- `optionalAuth()` - Optional authentication

### 🛣️ API Routes (routes/)

| File | Endpoints | Use Case |
|------|-----------|----------|
| `auth.js` | `/api/auth/*` | User login/signup |
| `users.js` | `/api/users/*` | User profiles |
| `inventions.js` | `/api/inventions/*` | Marketplace items |
| `community.js` | `/api/community/*` | Discussion posts |
| `transactions.js` | `/api/transactions/*` | Purchase history |
| `payments.js` | `/api/payments/*` | Payment processing |

**Example Routes:**
```
GET  /api/auth/login              ← Login user
POST /api/users/profile           ← Get user
GET  /api/inventions              ← Browse marketplace
POST /api/community/posts         ← Create discussion
```

### 🛠️ Utilities (utils/)

| File | Purpose | Used By |
|------|---------|---------|
| `database.js` | Supabase queries | All routes |

**Functions:**
- `db.getUserById()`
- `db.getInventions()`
- `db.createInvention()`
- `db.getReviews()`
- And many more...

### 🗄️ Database (schema.sql)

Contains SQL to create:
- `users` table
- `inventions` table
- `reviews` table
- `community_posts` table
- `transactions` table

**Action:** Paste entire content into Supabase SQL Editor and run.

---

## Quick Start Reference

### Before You Start
- [ ] Node.js installed? → Check with `node --version`
- [ ] npm ready? → Check with `npm --version`
- [ ] Supabase account? → Create at https://supabase.com

### Step 1: Install (2 minutes)
```bash
cd backend
npm install
```

### Step 2: Configure (3 minutes)
```bash
cp .env.example .env
# Edit .env and add your Supabase URL and Key
```

### Step 3: Database (5 minutes)
- Copy contents of `schema.sql`
- Paste into Supabase SQL Editor
- Click Run

### Step 4: Start (1 minute)
```bash
npm run dev
```

### Step 5: Test (1 minute)
```bash
curl http://localhost:5000/health
```

---

## File Dependencies

```
server.js (MAIN)
├── routes/auth.js
├── routes/users.js
├── routes/inventions.js
├── routes/community.js
├── routes/transactions.js
├── routes/payments.js
├── middleware/auth.js
└── utils/database.js
    └── Supabase SDK

.env (Environment Variables)
└── Used by server.js

schema.sql (Database)
└── Creates tables in Supabase
```

---

## How to Use Each File

### 📄 package.json
```bash
# Install what's in package.json
npm install

# Run start script
npm start

# Run dev script (with auto-reload)
npm run dev
```

### 📄 server.js
```bash
# Start the server
npm run dev
# or
node server.js
```

### 🔐 middleware/auth.js
Used in routes:
```javascript
import { authenticateToken } from '../middleware/auth.js';

router.post('/protected', authenticateToken, (req, res) => {
  // req.user is now available
  const userId = req.user.id;
});
```

### 🛣️ routes/auth.js
Handles:
- User signup
- User login
- Google OAuth

### 🛣️ routes/users.js
Handles:
- Get user profile
- Update user profile
- Get user inventions
- Get user stats

### 🛣️ routes/inventions.js
Handles:
- List all inventions
- Get single invention
- Create invention
- Update invention
- Delete invention
- Add review
- Search inventions

### 🛣️ routes/community.js
Handles:
- Get community posts
- Create post
- Get featured posts

### 🛠️ utils/database.js
Provides helper functions:
```javascript
// Import in routes
import { db } from '../utils/database.js';

// Use in code
const user = await db.getUserById(userId);
const inventions = await db.getInventions({ category: 'robotics' });
```

### 🗄️ schema.sql
Paste entire file into Supabase SQL Editor and execute.

---

## Typical File Modification Scenarios

### 🔧 Adding a New API Endpoint

1. Create new file in `routes/` → `routes/newfeature.js`
2. Import in `server.js`
3. Add route handler with proper middleware
4. Update `.env.example` if needed
5. Add to `API_DOCS.md`

### 🔧 Adding a New Database Query

1. Add function to `utils/database.js`
2. Use in route handlers
3. Test before deploying

### 🔧 Changing Authentication Logic

1. Modify `middleware/auth.js`
2. Update `routes/auth.js`
3. Test all protected routes

---

## Important: DO NOT COMMIT

These files should be in `.gitignore`:
- `.env` - Contains secrets!
- `node_modules/` - Too large
- `*.log` - Log files
- `.DS_Store` - macOS files

Check `.gitignore` to ensure these are listed.

---

## Environment Variables Explained

| Variable | Example | Purpose |
|----------|---------|---------|
| SUPABASE_URL | https://abc.supabase.co | Database URL |
| SUPABASE_KEY | eyJhb... | Database API key |
| JWT_SECRET | mysecretkey123 | Token signing key |
| PORT | 5000 | Server port |
| NODE_ENV | development | Environment type |
| FRONTEND_URL | http://localhost:3000 | CORS allowed origin |

---

## Common Commands

```bash
# Install dependencies
npm install

# Start in development mode (auto-reload)
npm run dev

# Start in production mode
npm start

# Check for errors
npm test  (when configured)

# Update packages
npm update

# Install specific package
npm install package-name
```

---

## File Size Reference

| File | Lines | Size | Notes |
|------|-------|------|-------|
| server.js | 60 | 1.8KB | Main entry point |
| routes/auth.js | 140 | 4.2KB | Authentication |
| routes/users.js | 100 | 3.1KB | User management |
| routes/inventions.js | 200 | 6.5KB | Marketplace |
| routes/community.js | 80 | 2.5KB | Community |
| utils/database.js | 180 | 5.8KB | Database helpers |
| middleware/auth.js | 30 | 1.0KB | JWT middleware |
| **TOTAL CODE** | ~800 | ~25KB | Backend source |

---

## Production Checklist

- [ ] All files present?
- [ ] `.env` configured?
- [ ] Database schema imported?
- [ ] Dependencies installed?
- [ ] Server starts without errors?
- [ ] API endpoints responding?
- [ ] Frontend can connect?
- [ ] Errors handled properly?
- [ ] CORS configured correctly?
- [ ] JWT tokens working?

---

## Help & Support

- **Can't find something?** → Check `START_HERE.md`
- **Don't know where to start?** → Read `QUICK_REFERENCE.md`
- **API question?** → See `API_DOCS.md`
- **Database question?** → Check `schema.sql`
- **Setup stuck?** → Read `SETUP_GUIDE.md` or `SUPABASE_SETUP.md`

---

## Next Steps

✅ **What You Have:**
- Complete backend source code
- Database schema
- Documentation
- Example integration code
- Environment template

🚀 **What To Do Next:**
1. Set up Supabase account
2. Create `.env` file with credentials
3. Import `schema.sql` database
4. Run `npm install && npm run dev`
5. Test with `curl http://localhost:5000/health`
6. Integrate with frontend
7. Deploy!

---

**Created for AIRN - AI & Robotics Network Marketplace** 🤖🚀
