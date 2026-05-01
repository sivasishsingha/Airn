# AIRN Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer {token}
```

Tokens are obtained from the login/signup endpoints and are valid for 7 days.

---

## Endpoints Reference

### 🔐 Authentication Endpoints

#### Sign Up
```
POST /auth/signup
Content-Type: application/json

{
  "name": "John Inventor",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response:
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "John Inventor",
    "email": "john@example.com",
    "picture": null
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "John Inventor",
    "email": "john@example.com",
    "picture": null
  }
}
```

#### Google OAuth
```
POST /auth/google
Content-Type: application/json

{
  "token": "google_jwt_token",
  "email": "john@gmail.com",
  "name": "John Inventor",
  "picture": "https://..."
}

Response:
{
  "message": "Google authentication successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

---

### 👤 User Endpoints

#### Get Current User Profile
```
GET /users
Authorization: Bearer {token}

Response:
{
  "id": "uuid",
  "name": "John Inventor",
  "email": "john@example.com",
  "picture": "https://...",
  "bio": "AI enthusiast",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Get User Profile by ID
```
GET /users/{userId}

Response:
{
  "id": "uuid",
  "name": "John Inventor",
  "email": "john@example.com",
  "picture": "https://...",
  "bio": "AI enthusiast",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Update User Profile
```
PUT /users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Inventor Updated",
  "bio": "AI and Robotics Expert",
  "picture": "https://..."
}

Response:
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

#### Get User's Inventions
```
GET /users/{userId}/inventions

Response:
[
  {
    "id": "uuid",
    "title": "AI Robot",
    "description": "...",
    "category": "robotics",
    "price": 1299.99,
    "created_at": "2024-01-01T00:00:00Z"
  },
  ...
]
```

#### Get User Statistics
```
GET /users/{userId}/stats

Response:
{
  "inventionsCount": 5,
  "totalSales": 9999.99,
  "avgRating": 4.8,
  "joinDate": "2024-01-01T00:00:00Z"
}
```

---

### 🤖 Invention Endpoints

#### Get All Inventions
```
GET /inventions?category=robotics&status=published&page=1&limit=12

Query Parameters:
- category: (optional) Filter by category
- status: (optional) Filter by status
- page: (optional) Page number (default: 1)
- limit: (optional) Items per page (default: 12)

Response:
{
  "total": 150,
  "page": 1,
  "limit": 12,
  "data": [
    {
      "id": "uuid",
      "title": "AI Robot Assistant",
      "description": "...",
      "category": "robotics",
      "price": 1299.99,
      "images": ["https://..."],
      "status": "published",
      "users": {
        "id": "uuid",
        "name": "Creator Name",
        "picture": "https://..."
      },
      "created_at": "2024-01-01T00:00:00Z"
    },
    ...
  ]
}
```

#### Get Single Invention
```
GET /inventions/{inventionId}

Response:
{
  "id": "uuid",
  "title": "AI Robot Assistant",
  "description": "...",
  "category": "robotics",
  "price": 1299.99,
  "images": ["https://..."],
  "features": ["AI Learning", "Voice Control"],
  "specifications": {
    "weight": "25kg",
    "height": "150cm"
  },
  "status": "published",
  "views": 150,
  "users": {
    "id": "uuid",
    "name": "Creator Name",
    "picture": "https://...",
    "email": "creator@example.com"
  },
  "reviews": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Amazing product!",
      "users": {
        "name": "Reviewer Name",
        "picture": "https://..."
      },
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Create Invention
```
POST /inventions
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "AI Robot Assistant",
  "description": "Advanced AI-powered robot for home automation",
  "category": "robotics",
  "price": 1299.99,
  "images": ["https://...", "https://..."],
  "features": ["AI Learning", "Voice Control", "Mobile App"],
  "specifications": {
    "weight": "25kg",
    "height": "150cm",
    "battery": "48h"
  }
}

Response:
{
  "message": "Invention created successfully",
  "invention": { ... }
}
```

#### Update Invention
```
PUT /inventions/{inventionId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 1399.99,
  "description": "Updated description"
}

Response:
{
  "message": "Invention updated successfully",
  "invention": { ... }
}
```

#### Delete Invention
```
DELETE /inventions/{inventionId}
Authorization: Bearer {token}

Response:
{
  "message": "Invention deleted successfully"
}
```

#### Add Review to Invention
```
POST /inventions/{inventionId}/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Amazing product, highly recommend!"
}

Response:
{
  "message": "Review added successfully",
  "review": {
    "id": "uuid",
    "invention_id": "uuid",
    "user_id": "uuid",
    "rating": 5,
    "comment": "...",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Search Inventions
```
GET /inventions/search/query?q=AI robot

Query Parameters:
- q: Search query (minimum 2 characters)

Response:
{
  "query": "AI robot",
  "results": [
    { ... },
    { ... }
  ]
}
```

---

### 💬 Community Endpoints

#### Get Community Posts
```
GET /community/posts?category=discussion&page=1&limit=10

Query Parameters:
- category: (optional) Filter by category
- page: (optional) Page number (default: 1)
- limit: (optional) Items per page (default: 10)

Response:
{
  "total": 50,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "id": "uuid",
      "title": "How to build your first AI robot",
      "content": "...",
      "category": "tutorials",
      "tags": ["ai", "robotics"],
      "likes": 25,
      "users": {
        "id": "uuid",
        "name": "Expert User",
        "picture": "https://..."
      },
      "created_at": "2024-01-01T00:00:00Z"
    },
    ...
  ]
}
```

#### Create Community Post
```
POST /community/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Discussion: AI Ethics in Robotics",
  "content": "What are the ethical considerations...",
  "category": "discussion",
  "tags": ["ethics", "ai", "robotics"]
}

Response:
{
  "message": "Post created successfully",
  "post": { ... }
}
```

#### Get Featured Posts
```
GET /community/featured

Response:
{
  "featured": [
    { ... },
    { ... }
  ]
}
```

---

## Error Responses

### Bad Request (400)
```json
{
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "error": "Access token required"
}
```

### Forbidden (403)
```json
{
  "error": "Not authorized to update this invention"
}
```

### Not Found (404)
```json
{
  "error": "User not found"
}
```

### Conflict (409)
```json
{
  "error": "Email already registered"
}
```

### Server Error (500)
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. In production, consider implementing:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## WebSocket Support (Future)

Consider adding WebSocket support for real-time notifications:

```javascript
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL }
});

io.on('connection', (socket) => {
  socket.on('join-room', (room) => {
    socket.join(room);
  });
});
```

---

## Testing

Use Postman, Insomnia, or cURL to test endpoints:

```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Get inventions
curl http://localhost:5000/api/inventions

# Create invention (requires token)
curl -X POST http://localhost:5000/api/inventions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{ "title": "Test", "description": "Test", "category": "ai", "price": 99.99 }'
```
