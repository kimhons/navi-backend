# Navi Backend API

**Production-ready REST API for Navi Navigation App**

Version: 1.0.0  
Node.js: 18+  
Database: MongoDB

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Testing](#testing)
- [Security](#security)

---

## ✨ Features

- **42+ REST API Endpoints**
- **JWT Authentication** with refresh tokens
- **MongoDB Database** with Mongoose ODM
- **Geospatial Queries** for location-based features
- **Rate Limiting** and security middleware
- **Input Validation** with express-validator
- **Error Handling** with custom error middleware
- **File Upload** with AWS S3 integration
- **Mapbox Integration** for routing and geocoding

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js |
| **Database** | MongoDB 6+ |
| **ODM** | Mongoose |
| **Authentication** | JWT (jsonwebtoken) |
| **Validation** | express-validator |
| **Security** | Helmet, CORS, bcryptjs |
| **File Storage** | AWS S3 |
| **Maps** | Mapbox SDK |
| **Email** | SendGrid |

---

## 🔌 API Endpoints

### Authentication (8 endpoints)

```
POST   /api/v1/auth/signup              - Create new account
POST   /api/v1/auth/login               - Login user
POST   /api/v1/auth/logout              - Logout user
POST   /api/v1/auth/refresh             - Refresh access token
POST   /api/v1/auth/verify-email        - Verify email address
POST   /api/v1/auth/forgot-password     - Request password reset
POST   /api/v1/auth/reset-password      - Reset password
GET    /api/v1/auth/me                  - Get current user
```

### Users (4 endpoints)

```
GET    /api/v1/users/profile            - Get user profile
PUT    /api/v1/users/profile            - Update profile
PUT    /api/v1/users/preferences        - Update preferences
GET    /api/v1/users/stats              - Get user statistics
```

### Routes (7 endpoints)

```
POST   /api/v1/routes                   - Create route
GET    /api/v1/routes                   - Get user routes
GET    /api/v1/routes/:id               - Get route by ID
PUT    /api/v1/routes/:id               - Update route
DELETE /api/v1/routes/:id               - Delete route
POST   /api/v1/routes/optimize          - Optimize multi-stop route
POST   /api/v1/routes/:id/share         - Share route with friends
```

### Places (6 endpoints)

```
GET    /api/v1/places/search            - Search places
GET    /api/v1/places/nearby            - Get nearby places
GET    /api/v1/places/:id               - Get place details
GET    /api/v1/places/:id/reviews       - Get place reviews
POST   /api/v1/places/:id/reviews       - Add review
POST   /api/v1/places/:id/save          - Save place to favorites
```

### Trips (5 endpoints)

```
POST   /api/v1/trips                    - Create trip
GET    /api/v1/trips                    - Get user trips
GET    /api/v1/trips/:id                - Get trip by ID
PUT    /api/v1/trips/:id                - Update trip
POST   /api/v1/trips/:id/export         - Export trip data
```

### Social (8 endpoints)

```
GET    /api/v1/social/friends           - Get friends list
POST   /api/v1/social/friends/request   - Send friend request
POST   /api/v1/social/friends/accept/:id - Accept friend request
DELETE /api/v1/social/friends/:id       - Remove friend
GET    /api/v1/social/messages          - Get messages
POST   /api/v1/social/messages          - Send message
GET    /api/v1/social/groups            - Get groups
POST   /api/v1/social/groups            - Create group
```

### Maps (5 endpoints)

```
GET    /api/v1/maps/offline             - Get offline maps
POST   /api/v1/maps/offline/download    - Download offline map
DELETE /api/v1/maps/offline/:id         - Delete offline map
GET    /api/v1/maps/safety-alerts       - Get safety alerts
POST   /api/v1/maps/safety-alerts       - Report safety alert
```

**Total: 43 endpoints**

---

## 🚀 Installation

### Prerequisites

- Node.js 18+ and npm
- MongoDB 6+ (local or MongoDB Atlas)
- AWS account (for S3)
- Mapbox account (for maps)

### Local Setup

```bash
# Clone repository
git clone https://github.com/kimhons/navi-backend.git
cd navi-backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
nano .env

# Start development server
npm run dev
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Server
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
DB_NAME=navi

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Mapbox
MAPBOX_ACCESS_TOKEN=pk.eyJ1...

# AWS S3
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET_NAME=navi-app-images

# SendGrid
SENDGRID_API_KEY=SG...
FROM_EMAIL=noreply@navi.app
FROM_NAME=Navi

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=https://navi.app,https://www.navi.app
```

### MongoDB Atlas Setup

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster (free tier available)
3. Create database user
4. Whitelist IP addresses (or use 0.0.0.0/0 for all)
5. Get connection string and add to `MONGODB_URI`

### AWS S3 Setup

1. Create S3 bucket in AWS Console
2. Create IAM user with S3 permissions
3. Generate access keys
4. Add credentials to `.env`

### Mapbox Setup

1. Create account at [mapbox.com](https://www.mapbox.com)
2. Get access token from dashboard
3. Add to `MAPBOX_ACCESS_TOKEN`

---

## 🌐 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create navi-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=...
# ... set all other env vars

# Deploy
git push heroku master

# Open app
heroku open
```

### Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select repository
4. Add environment variables in dashboard
5. Deploy automatically

### Deploy to Render

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy

### Deploy to DigitalOcean App Platform

1. Go to [digitalocean.com](https://www.digitalocean.com)
2. Create new app
3. Connect GitHub repository
4. Configure environment variables
5. Deploy

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm test -- --coverage
```

### Manual API Testing

```bash
# Health check
curl https://your-api.com/health

# Signup
curl -X POST https://your-api.com/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST https://your-api.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get profile (with token)
curl https://your-api.com/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔒 Security

### Implemented Security Measures

- ✅ **Helmet.js** - Sets security HTTP headers
- ✅ **CORS** - Cross-origin resource sharing protection
- ✅ **Rate Limiting** - Prevents brute force attacks
- ✅ **Input Validation** - Validates and sanitizes all inputs
- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **MongoDB Injection Prevention** - Mongoose sanitization
- ✅ **XSS Protection** - Input escaping
- ✅ **HTTPS Only** - Enforced in production

### Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use strong JWT secret** - Minimum 32 characters
3. **Enable HTTPS** - Use SSL certificates
4. **Rotate secrets regularly** - Change JWT secret periodically
5. **Monitor logs** - Track suspicious activity
6. **Keep dependencies updated** - Run `npm audit` regularly
7. **Use environment-specific configs** - Different keys for dev/prod

---

## 📊 Database Schema

### Collections

- **users** - User accounts and profiles
- **routes** - Saved and historical routes
- **places** - Points of interest
- **trips** - Completed trips with analytics
- **reviews** - Place reviews and ratings
- **messages** - Chat messages
- **notifications** - User notifications
- **offlinemaps** - Downloaded offline maps
- **safetyalerts** - Speed cameras, hazards, etc.
- **friendrequests** - Friend connection requests
- **groups** - User groups for messaging

---

## 📝 API Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "routes": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

---

## 🔧 Maintenance

### Database Backup

```bash
# Backup MongoDB
mongodump --uri="mongodb+srv://..." --out=./backup

# Restore MongoDB
mongorestore --uri="mongodb+srv://..." ./backup
```

### Logs

```bash
# View logs (Heroku)
heroku logs --tail

# View logs (Railway)
railway logs

# View logs (local)
npm run dev
```

---

## 📞 Support

**Issues:** https://github.com/kimhons/navi-backend/issues  
**Email:** dev@navi.app

---

## 📄 License

ISC License - © 2024 Navi Team

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** November 18, 2024
