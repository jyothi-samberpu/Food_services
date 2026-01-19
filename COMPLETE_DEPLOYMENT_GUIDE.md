# Food Services - Complete Setup & Deployment Guide

## Quick Start (Local)

```bash
# 1. Clone and install
git clone https://github.com/jyothi-samberpu/Food_services.git
cd Food_services
npm run install:all

# 2. Setup environment
cp Backend/.env.example Backend/.env
# Edit Backend/.env with your MongoDB Atlas credentials

# 3. Start development servers
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:4000
```

## Production Deployment

### Option 1: Heroku (Easiest)

```bash
# Prerequisites: Heroku CLI installed, account created

# 1. Create Heroku app
heroku create your-app-name

# 2. Set environment variables
heroku config:set MONGO_URL="your_mongodb_connection_string"
heroku config:set JWT_SECRET="your_super_secret_key_min_32_chars"
heroku config:set NODE_ENV=production

# 3. Deploy
git push heroku main

# 4. Monitor
heroku logs --tail
```

### Option 2: Railway (Recommended)

1. Go to [Railway.app](https://railway.app)
2. Connect GitHub account
3. Create new project
4. Add this repo
5. Set environment variables:
   - `MONGO_URL` - MongoDB connection string
   - `JWT_SECRET` - Your secret key
   - `NODE_ENV` - Set to `production`
6. Deploy automatically on push to main

### Option 3: Render

1. Go to [Render.com](https://render.com)
2. Create Web Service from GitHub
3. Configure:
   - Build command: `npm install:all && npm run build:frontend`
   - Start command: `cd Backend && npm start`
   - Environment variables: MONGO_URL, JWT_SECRET
4. Deploy

### Option 4: Docker (Any Cloud)

```bash
# Build images
docker-compose build

# Run locally
docker-compose up

# Deploy to Docker Hub / Cloud Registry
docker tag food-services-backend:latest your-registry/food-services-backend:latest
docker push your-registry/food-services-backend:latest
```

## Deployment Checklist

- [ ] MongoDB Atlas account with cluster created
- [ ] Connection string saved (MONGO_URL)
- [ ] JWT_SECRET generated (32+ chars, random)
- [ ] GitHub repository is public/private as desired
- [ ] Environment variables set on hosting platform
- [ ] Tested locally with production environment
- [ ] Frontend API URL points to correct backend
- [ ] CORS configured for frontend domain

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user (different password from account)
4. Get connection string
5. Whitelist IP (allow all for testing, restrict in production)
6. Connection string format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

## Environment Variables Reference

### Backend

```env
# Server
PORT=4000                          # Default: 4000
NODE_ENV=production                # production or development

# Database
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/db    # Required

# Security
JWT_SECRET=your_secret_key_here_min_32_chars                # Required
FRONTEND_URL=https://your-frontend-domain.com               # For CORS
```

## Monitoring & Logs

### Heroku

```bash
heroku logs --tail
heroku logs -n 100
```

### Railway

- Dashboard shows real-time logs
- View in web interface

### Render

- Logs tab in dashboard
- Real-time streaming available

### Local Access Logs

```bash
tail -f Backend/logs/access.log
```

## Troubleshooting

### MongoDB Connection Fails

- Check connection string is correct
- Verify IP is whitelisted on MongoDB Atlas
- Check username/password is correct
- Ensure NODE_ENV doesn't have typos

### Frontend Can't Reach API

- Check VITE_API_URL environment variable
- Verify backend is running
- Check CORS configuration in Backend/index.js
- Look for CORS errors in browser console

### Port Already in Use

```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# On Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Build Fails

- Clear cache: `rm -rf node_modules package-lock.json`
- Reinstall: `npm run install:all`
- Check Node version: `node --version` (need 16+)

## Performance Optimization

1. **Enable Caching**
   - Set Cache-Control headers
   - Use CDN for static assets

2. **Database Indexing**
   - Index frequently queried fields
   - Use MongoDB Atlas performance advisor

3. **Rate Limiting**
   - Already configured in Backend/index.js
   - Adjust limits based on traffic

4. **Compression**
   - Gzip enabled in production
   - Already configured with Helmet

## Security in Production

- ✅ JWT authentication
- ✅ Helmet security headers
- ✅ Rate limiting
- ✅ CORS configured
- ✅ Environment variables protected
- ✅ MongoDB password protected

**Additional Recommendations:**

- Use HTTPS only
- Enable 2FA on hosting platform
- Regular security audits
- Keep dependencies updated
- Monitor API usage

## Scaling Strategy

1. **Horizontal Scaling** (Multiple instances)
   - Use load balancer (Railway/Render auto-handles)
   - Session storage in Redis

2. **Vertical Scaling** (Bigger servers)
   - Upgrade instance size on hosting platform
   - More CPU/RAM

3. **Database Optimization**
   - Add indexes
   - Use MongoDB Atlas sharding
   - Connection pooling

## Auto-Deployment

Push to main branch → GitHub Actions triggers → Auto-deploys to production

Check `.github/workflows/` for CI/CD configurations.

## Support & Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [React Docs](https://react.dev/)
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)

---

**Ready to deploy? Push to main and watch it live!** 🚀
