# Architecture Overview - AIRN Backend

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (HTML/CSS/JS)                  │
│              airn.html, airn.css, main2.js                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/HTTPS
                        │ JSON
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Backend                       │
│              (Node.js - localhost:5000)                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │             API Routes (25+ endpoints)              │  │
│  │  ┌──────────────┬──────────────┬──────────────┐   │  │
│  │  │    Auth      │    Users     │ Inventions   │   │  │
│  │  │  /signup     │  /profile    │  /browse     │   │  │
│  │  │  /login      │  /stats      │  /create     │   │  │
│  │  │  /google     │  /update     │  /search     │   │  │
│  │  └──────────────┴──────────────┴──────────────┘   │  │
│  │  ┌──────────────┬──────────────────────────────┐   │  │
│  │  │  Community   │       Transactions           │   │  │
│  │  │  /posts      │       /history               │   │  │
│  │  │  /create     │       /details               │   │  │
│  │  │  /featured   │                              │   │  │
│  │  └──────────────┴──────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────┘  │
│                        ▲                                    │
│                        │                                    │
│                   Middleware                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   CORS       │  │   JWT Auth   │  │   Validation │   │
│  │   Protection │  │   Tokens     │  │   & Errors   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ PostgreSQL
                        │ Protocol
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Supabase (PostgreSQL Database)                 │
│                  (Cloud - supabase.co)                      │
│                                                             │
│  Tables:                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │    Users     │  │ Inventions   │  │   Reviews    │   │
│  │ (Auth Data)  │  │ (Marketplace)│  │ (Ratings)    │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│  ┌──────────────┐  ┌──────────────┐                      │
│  │ Community    │  │ Transactions │                      │
│  │ Posts        │  │ (History)    │                      │
│  └──────────────┘  └──────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### User Login Flow
```
User Input (Email, Password)
           │
           ▼
    Frontend Form
    (airn.html)
           │
           ▼
    Send POST /api/auth/login
           │
           ▼
    Backend server.js
    routes/auth.js
           │
           ▼
    Hash Password Compare
    (bcryptjs)
           │
           ├─── Invalid ──► Return 401 Error
           │
           └─── Valid
                │
                ▼
          Generate JWT Token
          (7 day expiry)
                │
                ▼
          Store in Database
          Return Token
                │
                ▼
    Frontend stores token
    localStorage.setItem('airn_token', token)
                │
                ▼
    Use token for all future requests
    Authorization: Bearer TOKEN
```

### Marketplace Item Creation Flow
```
User (Logged In)
Create Invention Form
           │
           ▼
    Send POST /api/inventions
    With JWT Token in Header
           │
           ▼
    Backend Receives Request
    Validates Token (middleware/auth.js)
           │
           ├─── Invalid/Expired ──► Return 401/403
           │
           └─── Valid
                │
                ▼
          Validate Request Data
          (express-validator)
                │
                ├─── Invalid ──► Return 400 Error
                │
                └─── Valid
                     │
                     ▼
               Create UUID for item
               Insert into Database
               (utils/database.js)
                     │
                     ▼
               Return 201 Created
               With item details
                     │
                     ▼
          Frontend Updates UI
          Show success message
```

## Authentication Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     JWT Token System                         │
│                                                              │
│  Token Structure: header.payload.signature                  │
│                                                              │
│  Header:   { "alg": "HS256", "typ": "JWT" }                │
│                                                              │
│  Payload:  {                                                │
│              "id": "uuid",                                   │
│              "email": "user@example.com",                   │
│              "name": "John",                                │
│              "iat": 1234567890,                             │
│              "exp": 1234567890 + 7days                      │
│            }                                                │
│                                                              │
│  Signature: HMACSHA256(header+payload, JWT_SECRET)         │
│                                                              │
│  Storage:   localStorage (Frontend)                         │
│                                                              │
│  Usage:     Authorization: Bearer TOKEN (in headers)        │
│                                                              │
│  Validation: Every protected route checks token             │
│              expiry and signature                           │
└──────────────────────────────────────────────────────────────┘
```

## Database Schema Relationships

```
                    ┌────────────────┐
                    │     users      │
                    ├────────────────┤
                    │ id (PK)        │
                    │ name           │
                    │ email (UNIQUE) │
                    │ password_hash  │
                    │ picture        │
                    │ bio            │
                    │ created_at     │
                    └────────┬───────┘
                             │
                  ┌──────────┼──────────┐
                  │          │          │
                  ▼          ▼          ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │ inventions   │ │   reviews    │ │community_    │
        ├──────────────┤ ├──────────────┤ │posts         │
        │ id           │ │ id           │ ├──────────────┤
        │ user_id (FK) │ │ invention_id │ │ id           │
        │ title        │ │ (FK)         │ │ user_id (FK) │
        │ description  │ │ user_id (FK) │ │ title        │
        │ category     │ │ rating       │ │ content      │
        │ price        │ │ comment      │ │ category     │
        │ images       │ │ created_at   │ │ tags         │
        │ features     │ └──────────────┘ │ likes        │
        │ status       │                  │ created_at   │
        │ created_at   │                  └──────────────┘
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │transactions  │
        ├──────────────┤
        │ id           │
        │ invention_id │
        │ (FK)         │
        │ buyer_id (FK)│ ──► users
        │ seller_id    │ ──► users
        │ (FK)         │
        │ amount       │
        │ status       │
        │ created_at   │
        └──────────────┘

PK  = Primary Key
FK  = Foreign Key
--- = References
```

## API Request/Response Cycle

```
┌─ Frontend ─────────────────────────────────────────────┐
│                                                        │
│  const data = await fetch('/api/inventions', {        │
│    method: 'GET',                                      │
│    headers: {                                          │
│      'Authorization': 'Bearer eyJh...'                 │
│    }                                                   │
│  });                                                   │
│                                                        │
└──────────────────┬─────────────────────────────────────┘
                   │
                   │ HTTP Request
                   │ { method, headers, body }
                   │
┌──────────────────▼─────────────────────────────────────┐
│  Backend Express.js                                    │
│                                                        │
│  1. Receive Request                                    │
│     ├─ Parse JSON body                                │
│     └─ Extract headers                                │
│                                                        │
│  2. CORS Middleware                                   │
│     └─ Check if origin allowed                        │
│                                                        │
│  3. Auth Middleware                                   │
│     └─ Validate JWT token                             │
│                                                        │
│  4. Route Handler                                     │
│     ├─ Validate input                                 │
│     ├─ Query database                                 │
│     └─ Process data                                   │
│                                                        │
│  5. Generate Response                                 │
│     └─ JSON object                                    │
│                                                        │
└──────────────────┬─────────────────────────────────────┘
                   │
                   │ HTTP Response
                   │ { status, body }
                   │
┌──────────────────▼─────────────────────────────────────┐
│  Frontend                                              │
│                                                        │
│  const data = await response.json();                   │
│  console.log(data);                                    │
│  // { total: 50, data: [...inventions] }             │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Middleware Stack

```
Incoming Request
      │
      ▼
┌─────────────────────────────────────┐
│  CORS Middleware                    │
│  Check origin allowed               │
│  Set response headers               │
└─────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│  JSON Parser                        │
│  Parse request body                 │
│  Set content-type                   │
└─────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│  Auth Middleware (if protected)     │
│  Validate JWT token                 │
│  Extract user info                  │
└─────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│  Route Handler                      │
│  Validation                         │
│  Database queries                   │
│  Business logic                     │
└─────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────┐
│  Error Handler                      │
│  Catch errors                       │
│  Format error response              │
└─────────────────────────────────────┘
      │
      ▼
Response Sent to Frontend
```

## Deployment Architecture (Example: Vercel)

```
Your Computer
  │
  ├─ Local Backend (localhost:5000)
  │  └─ npm run dev
  │
  └─ Push to GitHub
     │
     ▼
GitHub Repository
  │
  └─ Connect to Vercel
     │
     ▼
Vercel Deployment
  │
  ├─ Build
  │  └─ npm install
  │  └─ npm build (if applicable)
  │
  ├─ Deploy
  │  └─ Start backend
  │  └─ Assign URL (e.g., airn-backend.vercel.app)
  │
  └─ Environment Variables
     ├─ SUPABASE_URL
     ├─ SUPABASE_KEY
     ├─ JWT_SECRET
     └─ PORT=3000 (Vercel)
        │
        ▼
    Production Backend
    https://airn-backend.vercel.app/api/inventions
        │
        ▼
    Connected to Supabase Database
    (Same database as development)
```

## Security Layers

```
Frontend
   │
   ├─ HTTPS (encrypted transmission)
   │
   ▼
Backend
   │
   ├─ CORS validation (allowed origins only)
   │
   ├─ JWT authentication (token validation)
   │
   ├─ Input validation (sanitize data)
   │
   ├─ Rate limiting (prevent abuse)
   │
   ├─ Error handling (no sensitive info in errors)
   │
   ▼
Supabase Database
   │
   ├─ Row Level Security (data isolation)
   │
   ├─ User authentication (verified users only)
   │
   ├─ Encryption at rest (data encryption)
   │
   ├─ Backup & recovery (data protection)
   │
   └─ Audit logs (track changes)
```

---

This architecture ensures a scalable, secure, and maintainable backend for your AIRN marketplace!
