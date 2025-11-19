# Deploy Navi Backend to Render - Quick Start Guide

Deploy your Navi backend API to Render in **5 minutes** with the free tier!

---

## 🚀 Quick Deployment Steps

### 1. Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended)
3. Verify your email

### 2. Deploy Backend

1. **Create Web Service**
   - Dashboard → "New" → "Web Service"
   - Connect your GitHub account
   - Select repository: `kimhons/navi-backend`
   - Click "Connect"

2. **Configure Service**
   ```
   Name: navi-api
   Region: Oregon (US West) or closest to your users
   Branch: master
   Root Directory: (leave blank)
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

3. **Select Plan**
   - Choose "Free" plan
   - Note: Free instances spin down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds

### 3. Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up (free tier available)

2. **Create Cluster**
   - Build a Database → Shared (Free)
   - Cloud Provider: AWS
   - Region: us-east-1 (or closest to Render)
   - Cluster Name: `navi-cluster`

3. **Create Database User**
   - Database Access → Add New Database User
   - Username: `navi-admin`
   - Password: Generate secure password (save it!)
   - Role: Atlas admin

4. **Configure Network Access**
   - Network Access → Add IP Address
   - Allow Access from Anywhere: `0.0.0.0/0`
   - (This is safe - authentication is via username/password)

5. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string:
   ```
   mongodb+srv://navi-admin:<password>@navi-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password

### 4. Configure Environment Variables

In Render dashboard, go to your service → Environment tab:

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://navi-admin:YOUR_PASSWORD@navi-cluster.xxxxx.mongodb.net/navi?retryWrites=true&w=majority
DB_NAME=navi
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
MAPBOX_ACCESS_TOKEN=pk.your-mapbox-token-here
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
S3_BUCKET_NAME=navi-app-images
ALLOWED_ORIGINS=https://navi.app,https://www.navi.app
```

**Important:**
- `JWT_SECRET`: Generate with `openssl rand -base64 32`
- `MAPBOX_ACCESS_TOKEN`: Get free token from [mapbox.com](https://mapbox.com)
- AWS credentials: Optional (for file uploads), can skip initially

### 5. Deploy!

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Start the server
3. Wait 3-5 minutes for deployment
4. Your API URL: `https://navi-api.onrender.com`

---

## 🧪 Test Your Deployment

### 1. Health Check

```bash
curl https://navi-api.onrender.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Navi API is running",
  "version": "v1",
  "environment": "production"
}
```

### 2. Test Signup

```bash
curl -X POST https://navi-api.onrender.com/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 3. Test Login

```bash
curl -X POST https://navi-api.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response!

### 4. Test Protected Route

```bash
curl https://navi-api.onrender.com/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📱 Update Mobile Apps

### iOS

Edit `ios/Navi/Config/APIConfig.swift`:

```swift
struct APIConfig {
    static let baseURL = "https://navi-api.onrender.com/api/v1"
    // ... rest of config
}
```

### Android

Edit `android/app/src/main/java/com/navi/app/data/remote/ApiConfig.kt`:

```kotlin
object ApiConfig {
    const val BASE_URL = "https://navi-api.onrender.com/api/v1/"
    // ... rest of config
}
```

---

## 🔧 Optional: Custom Domain

1. **In Render:**
   - Settings → Custom Domain
   - Add domain: `api.navi.app`

2. **In your DNS provider:**
   - Add CNAME record:
   ```
   api.navi.app → navi-api.onrender.com
   ```

3. **Update ALLOWED_ORIGINS:**
   ```
   ALLOWED_ORIGINS=https://api.navi.app,https://navi.app
   ```

---

## 📊 Monitoring

### View Logs

1. Render Dashboard → Your Service
2. "Logs" tab
3. Real-time log streaming

### Check Status

1. Dashboard shows:
   - Deploy status
   - CPU/Memory usage
   - Request count
   - Response times

### Set Up Alerts

1. Settings → Notifications
2. Add email for:
   - Deploy failures
   - Service crashes
   - High resource usage

---

## 💰 Cost & Limits

### Free Tier

- ✅ 750 hours/month (enough for 1 service)
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Unlimited bandwidth
- ⚠️ Spins down after 15 min inactivity
- ⚠️ 512 MB RAM
- ⚠️ 0.1 CPU

### Paid Plans (Optional)

**Starter ($7/month):**
- No spin-down
- 512 MB RAM
- 0.5 CPU
- Better for production

**Standard ($25/month):**
- 2 GB RAM
- 1 CPU
- Priority support

---

## 🐛 Troubleshooting

### Deployment Failed

1. Check build logs in Render dashboard
2. Verify `package.json` has correct scripts:
   ```json
   {
     "scripts": {
       "start": "node src/server.js",
       "dev": "nodemon src/server.js"
     }
   }
   ```

### Database Connection Error

1. Verify MongoDB URI is correct
2. Check MongoDB Atlas network access (0.0.0.0/0)
3. Confirm database user credentials
4. Test connection string locally first

### API Returns 500 Error

1. Check Render logs for error details
2. Verify all environment variables are set
3. Check MongoDB connection
4. Ensure JWT_SECRET is set

### Slow First Request

- Normal for free tier (cold start)
- Service spins down after 15 min inactivity
- First request wakes it up (30-60 sec)
- Upgrade to paid plan to avoid spin-down

---

## 🚀 Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user configured
- [ ] Network access set to 0.0.0.0/0
- [ ] Render web service created
- [ ] All environment variables set
- [ ] JWT_SECRET is strong (32+ chars)
- [ ] Mapbox token configured
- [ ] Health check endpoint works
- [ ] Signup/Login tested
- [ ] Mobile apps updated with production URL
- [ ] Custom domain configured (optional)
- [ ] Monitoring/alerts set up

---

## 📈 Next Steps

1. **Test all endpoints** - Verify each API endpoint works
2. **Update mobile apps** - Change API URL to Render URL
3. **Beta testing** - Test with real users
4. **Monitor performance** - Watch logs and metrics
5. **Consider upgrade** - If traffic grows, upgrade to paid plan

---

## 🎉 You're Live!

Your Navi backend API is now deployed and ready to serve your mobile apps!

**API URL:** `https://navi-api.onrender.com`

**Next:** Update your iOS and Android apps with this URL and start testing!

---

**Need Help?**
- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- GitHub Issues: https://github.com/kimhons/navi-backend/issues
