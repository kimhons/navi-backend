# Navi Backend - Production Deployment Guide

Complete step-by-step guide to deploy the Navi backend API to production.

---

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas account created
- [ ] AWS account with S3 bucket configured
- [ ] Mapbox account with production token
- [ ] SendGrid account for emails (optional)
- [ ] Domain name (optional but recommended)
- [ ] SSL certificate (provided by hosting platform)

---

## 🚀 Deployment Options

### Option 1: Railway (Recommended - Easiest)

**Why Railway?**
- Free tier available
- Automatic HTTPS
- Easy environment variable management
- GitHub integration
- Built-in monitoring

**Steps:**

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `navi-backend` repository

3. **Add MongoDB Database**
   - Click "New" → "Database" → "Add MongoDB"
   - Railway will provision a MongoDB instance
   - Connection string will be auto-added to environment

4. **Configure Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=${{MongoDB.MONGO_URL}}
   DB_NAME=navi
   JWT_SECRET=your-secret-min-32-chars
   JWT_EXPIRE=7d
   JWT_REFRESH_EXPIRE=30d
   MAPBOX_ACCESS_TOKEN=pk.your-token
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=your-secret
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=navi-app-images
   ALLOWED_ORIGINS=https://navi.app,https://www.navi.app
   ```

5. **Deploy**
   - Railway auto-deploys on git push
   - Get your API URL: `https://your-app.up.railway.app`

6. **Custom Domain (Optional)**
   - Settings → Domains → Add Custom Domain
   - Add CNAME record: `api.navi.app` → Railway URL

**Cost:** Free tier includes $5/month credit

---

### Option 2: Render

**Why Render?**
- Free tier available
- Automatic deployments
- Easy database setup
- Built-in SSL

**Steps:**

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - New → Web Service
   - Connect `navi-backend` repository
   - Name: `navi-api`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add MongoDB**
   - New → PostgreSQL (or use MongoDB Atlas)
   - For MongoDB: Use external MongoDB Atlas connection

4. **Environment Variables**
   - Add all variables from Railway example above
   - Use MongoDB Atlas connection string

5. **Deploy**
   - Click "Create Web Service"
   - URL: `https://navi-api.onrender.com`

**Cost:** Free tier available (spins down after inactivity)

---

### Option 3: Heroku

**Why Heroku?**
- Mature platform
- Many add-ons
- Easy scaling

**Steps:**

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create navi-api
   ```

3. **Add MongoDB**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret
   heroku config:set MAPBOX_ACCESS_TOKEN=pk.your-token
   heroku config:set AWS_ACCESS_KEY_ID=AKIA...
   heroku config:set AWS_SECRET_ACCESS_KEY=your-secret
   heroku config:set AWS_REGION=us-east-1
   heroku config:set S3_BUCKET_NAME=navi-app-images
   ```

5. **Deploy**
   ```bash
   git push heroku master
   ```

6. **Open App**
   ```bash
   heroku open
   ```

**Cost:** $7/month for basic dyno (free tier discontinued)

---

### Option 4: DigitalOcean App Platform

**Why DigitalOcean?**
- Predictable pricing
- Good performance
- Managed databases

**Steps:**

1. **Create Account**
   - Go to [digitalocean.com](https://www.digitalocean.com)
   - Sign up and add payment method

2. **Create App**
   - Apps → Create App
   - Connect GitHub → Select `navi-backend`

3. **Configure**
   - Name: navi-api
   - Region: Choose closest to users
   - Plan: Basic ($5/month)

4. **Add Database**
   - Resources → Add Resource → Database
   - Choose MongoDB or use Atlas

5. **Environment Variables**
   - Settings → Environment Variables
   - Add all required variables

6. **Deploy**
   - Automatic deployment on git push

**Cost:** $5/month + database ($15/month for managed MongoDB)

---

## 🗄️ MongoDB Atlas Setup

**Required for all deployment options**

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up (free tier available)

2. **Create Cluster**
   - Build a Database → Shared (Free)
   - Choose cloud provider and region
   - Cluster Name: `navi-cluster`

3. **Create Database User**
   - Database Access → Add New Database User
   - Username: `navi-admin`
   - Password: Generate secure password
   - Role: Atlas admin

4. **Configure Network Access**
   - Network Access → Add IP Address
   - Allow Access from Anywhere: `0.0.0.0/0`
   - (Or add specific IPs of your hosting platform)

5. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy connection string:
   ```
   mongodb+srv://navi-admin:<password>@navi-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with actual password
   - Add to `MONGODB_URI` environment variable

---

## 📦 AWS S3 Setup

**For image and file storage**

1. **Create S3 Bucket**
   - Go to AWS Console → S3
   - Create bucket: `navi-app-images`
   - Region: `us-east-1` (or your preferred region)
   - Uncheck "Block all public access"
   - Enable versioning (optional)

2. **Configure CORS**
   - Bucket → Permissions → CORS
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": ["ETag"]
     }
   ]
   ```

3. **Create IAM User**
   - IAM → Users → Add User
   - Username: `navi-s3-user`
   - Access type: Programmatic access
   - Permissions: Attach `AmazonS3FullAccess` policy

4. **Get Credentials**
   - Download CSV with access keys
   - Add to environment variables:
     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`

---

## 🗺️ Mapbox Setup

**For maps and routing**

1. **Create Account**
   - Go to [mapbox.com](https://www.mapbox.com)
   - Sign up (free tier: 50,000 requests/month)

2. **Create Access Token**
   - Account → Tokens → Create a token
   - Name: `Navi Production`
   - Scopes: Select all
   - Copy token

3. **Add to Environment**
   - `MAPBOX_ACCESS_TOKEN=pk.your-token-here`

4. **Monitor Usage**
   - Dashboard → Statistics
   - Upgrade plan if needed

---

## 📧 SendGrid Setup (Optional)

**For transactional emails**

1. **Create Account**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Sign up (free tier: 100 emails/day)

2. **Create API Key**
   - Settings → API Keys → Create API Key
   - Name: `Navi Production`
   - Permissions: Full Access

3. **Verify Sender**
   - Settings → Sender Authentication
   - Verify single sender: `noreply@navi.app`

4. **Add to Environment**
   ```
   SENDGRID_API_KEY=SG.your-key
   FROM_EMAIL=noreply@navi.app
   FROM_NAME=Navi
   ```

---

## 🧪 Testing Deployment

### 1. Health Check

```bash
curl https://your-api-url.com/health
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
curl -X POST https://your-api-url.com/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 3. Test Login

```bash
curl -X POST https://your-api-url.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Test Protected Route

```bash
curl https://your-api-url.com/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📊 Monitoring

### Railway
- Dashboard → Metrics
- View CPU, Memory, Network usage
- Check logs in real-time

### Render
- Dashboard → Logs
- Metrics tab for resource usage

### Heroku
```bash
heroku logs --tail
heroku ps
```

### DigitalOcean
- App → Insights
- Runtime Logs
- Resource usage graphs

---

## 🔒 Security Checklist

- [ ] HTTPS enabled (automatic on all platforms)
- [ ] Environment variables secured
- [ ] MongoDB network access restricted
- [ ] AWS S3 bucket policies configured
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] JWT secret is strong (32+ characters)
- [ ] Database backups enabled
- [ ] Error logging configured
- [ ] API monitoring set up

---

## 🚨 Troubleshooting

### API Not Responding

1. Check logs for errors
2. Verify environment variables
3. Test database connection
4. Check rate limiting

### Database Connection Failed

1. Verify MongoDB URI
2. Check network access whitelist
3. Confirm database user credentials
4. Test connection string locally

### File Upload Failing

1. Verify AWS credentials
2. Check S3 bucket permissions
3. Confirm CORS configuration
4. Test with smaller files

### Mapbox Errors

1. Verify access token
2. Check API quota
3. Confirm coordinates format
4. Review Mapbox dashboard

---

## 📈 Scaling

### When to Scale

- API response time > 500ms
- CPU usage > 80%
- Memory usage > 80%
- Error rate > 1%

### How to Scale

**Railway:**
- Settings → Resources → Upgrade plan

**Render:**
- Settings → Instance Type → Upgrade

**Heroku:**
```bash
heroku ps:scale web=2
```

**DigitalOcean:**
- Settings → Scale → Increase resources

---

## 💰 Cost Estimation

### Free Tier (Development)

| Service | Free Tier | Cost After |
|---------|-----------|------------|
| Railway | $5/month credit | $0.000463/GB-hour |
| Render | 750 hours/month | $7/month |
| MongoDB Atlas | 512MB storage | $9/month (2GB) |
| AWS S3 | 5GB storage | $0.023/GB |
| Mapbox | 50k requests | $0.50/1k requests |
| SendGrid | 100 emails/day | $19.95/month |

### Production (1000 users)

- Hosting: $10-20/month
- Database: $15-30/month
- Storage: $5-10/month
- Maps: $10-20/month
- **Total: $40-80/month**

---

## 🎯 Post-Deployment

1. **Update Mobile Apps**
   - Change API_BASE_URL to production URL
   - Update Mapbox token
   - Test all features

2. **Monitor Performance**
   - Set up error tracking (Sentry)
   - Configure uptime monitoring
   - Review logs daily

3. **Backup Strategy**
   - Enable MongoDB Atlas backups
   - S3 versioning for files
   - Export database weekly

4. **Documentation**
   - Update API documentation
   - Document deployment process
   - Create runbook for incidents

---

## ✅ Deployment Complete!

Your Navi backend API is now live and ready to serve mobile apps!

**Next Steps:**
1. Update mobile apps with production API URL
2. Test all features end-to-end
3. Monitor logs and performance
4. Set up alerts for errors
5. Plan for scaling

---

**Need Help?**
- GitHub Issues: https://github.com/kimhons/navi-backend/issues
- Email: dev@navi.app
