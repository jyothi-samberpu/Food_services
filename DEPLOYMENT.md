# Production Deployment Guide

## Prerequisites

- Node.js 16+
- MongoDB Atlas account
- GitHub account
- Heroku/Railway/Render account (for hosting)

## Environment Setup

### Backend (.env)

```env
PORT=4000
NODE_ENV=production
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
```

### Frontend (.env.local in dashboard/)

```env
VITE_API_URL=https://your-deployed-backend.com
```

## Local Development

```bash
# Install all dependencies
npm run install:all

# Start both servers (backend on 4000, frontend on 5173)
npm run dev

# Build frontend for production
npm run build:frontend
```

## Deployment Options

### Option 1: Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add MongoDB URL
heroku config:set MONGO_URL=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_jwt_secret

# Deploy
git push heroku main
```

### Option 2: Railway Deployment

1. Go to railway.app
2. Connect GitHub repo
3. Add environment variables
4. Deploy

### Option 3: Render Deployment

1. Go to render.com
2. Create Web Service from GitHub
3. Set environment variables
4. Deploy

## Database Setup (MongoDB Atlas)

1. Create cluster at mongodb.com/cloud/atlas
2. Create database user
3. Get connection string
4. Add IP whitelist (allow all for initial setup)

## Security Checklist

- [ ] JWT_SECRET is strong (32+ chars, random)
- [ ] MONGO_URL is from MongoDB Atlas (not local)
- [ ] NODE_ENV=production on production server
- [ ] CORS is configured for frontend domain
- [ ] Rate limiting is enabled
- [ ] Helmet security headers are active
- [ ] Environment variables are not in git

## Running on Production

```bash
cd Backend
npm start
```

Backend will:

- Connect to MongoDB
- Start on port defined in PORT env var
- Enable Morgan request logging
- Serve static uploads folder
- Apply security middleware

Frontend will be served via the build output in `dashboard/dist/`

## Monitoring

- Check logs: `heroku logs --tail`
- Monitor requests: Backend logs are stored in `logs/access.log`
- Database: Use MongoDB Atlas dashboard

## Troubleshooting

**MongoDB connection fails:**

- Check MONGO_URL is correct
- Verify IP whitelist on MongoDB Atlas
- Ensure NODE_ENV doesn't have typos

**Frontend can't reach API:**

- Check VITE_API_URL is set correctly
- Verify backend is running
- Check CORS configuration

**Build fails:**

- Clear node_modules: `rm -rf node_modules && npm install:all`
- Check Node version: `node --version` (should be 16+)
