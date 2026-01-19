# 🚀 Step-by-Step Deployment Guide

## STEP 1: Create MongoDB Database (5 mins)

### 1.1 Create MongoDB Account

- Go to: https://www.mongodb.com/cloud/atlas
- Click "Sign Up"
- Create free account with your email
- Verify email

### 1.2 Create Free Cluster

1. Click "Create" → "New Project"
2. Project name: `Food_Services`
3. Click "Create Project"
4. Click "Create" → Select "M0 Free" tier
5. Select Region: Choose closest to you (e.g., AWS, us-east-1)
6. Click "Create"
7. Wait 2-3 minutes for cluster to be ready

### 1.3 Create Database User

1. Go to "Security" → "Database Access"
2. Click "Add New Database User"
3. Username: `foodadmin`
4. Password: Generate strong password → **SAVE THIS**
5. Built-in role: `Atlas admin`
6. Click "Add User"

### 1.4 Whitelist IP

1. Go to "Security" → "Network Access"
2. Click "Add IP Address"
3. Select "Allow access from anywhere" (for now)
4. Click "Confirm"

### 1.5 Get Connection String

1. Go back to "Clusters"
2. Click "Connect"
3. Click "Drivers" → "Node.js"
4. Copy connection string
5. **Replace `<password>` with your database password**

Example format:

```
mongodb+srv://foodadmin:YOUR_PASSWORD@cluster0.abc123.mongodb.net/foodservices?retryWrites=true&w=majority
```

---

## STEP 2: Generate JWT Secret (2 mins)

Use this command in PowerShell:

```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (New-Guid).ToString()))
```

**Save the output** - this is your JWT_SECRET

---

## STEP 3: Deploy to Railway (10 mins)

### 3.1 Create Railway Account

1. Go to: https://railway.app
2. Click "Sign Up"
3. Choose "GitHub" for signup (easiest)
4. Authorize Railway to access your GitHub

### 3.2 Create New Project

1. Click "New Project"
2. Click "Deploy from GitHub repo"
3. Search and select: `Food_services`
4. Click "Deploy"

### 3.3 Configure Environment Variables

1. In Railway dashboard, click "Variables"
2. Add these variables:

```
PORT = 4000
NODE_ENV = production
MONGO_URL = mongodb+srv://foodadmin:YOUR_PASSWORD@cluster0.abc123.mongodb.net/foodservices
JWT_SECRET = YOUR_GENERATED_SECRET_FROM_STEP_2
FRONTEND_URL = https://your-railway-frontend-url.com
```

3. Click "Save"

### 3.4 Wait for Deployment

- Green checkmark = ✅ Successfully deployed!
- Red X = ❌ Check logs for errors

View logs:

1. Click "Logs" tab
2. Look for errors
3. Common error: Missing environment variable (go back to step 3.3)

---

## STEP 4: Deploy Frontend to Railway (5 mins)

### 4.1 In Railway Dashboard

1. Click "New Service"
2. Select "GitHub repo"
3. Select `Food_services` again
4. Under "Root Directory", enter: `dashboard`

### 4.2 Set Frontend URL

1. Click the frontend service
2. Go to "Settings"
3. Look for "Domain" or "Public URL"
4. **Copy this URL**

### 4.3 Update Backend Environment

1. Go back to Backend service
2. Click "Variables"
3. Update: `FRONTEND_URL = https://your-frontend-url-from-4.2`
4. Save

---

## STEP 5: Test Your Application (5 mins)

### 5.1 Frontend URL

- Go to your Railway frontend URL
- You should see login page
- ✅ If you see it = Frontend works!

### 5.2 Backend URL

- Go to `https://your-backend-url/`
- You should see: "🍕 Food Services API"
- ✅ If you see it = Backend works!

### 5.3 Register & Login

1. Click "Register"
2. Enter email & password
3. Submit
4. If successful → ✅ Database connected!
5. Try to login with credentials
6. If works → ✅ Everything connected!

---

## STEP 6: Add Your Own Domain (Optional, 10 mins)

### 6.1 Buy Domain

- Go to GoDaddy, Namecheap, or similar
- Buy your domain (e.g., `foodservices.com`)

### 6.2 Add to Railway

1. Railway Dashboard → Frontend Service
2. Settings → Domains
3. Click "Add Domain"
4. Enter your domain name
5. Follow DNS instructions

### 6.3 Point Domain to Railway

- Add CNAME record to your domain registrar
- Follow Railway's DNS setup guide
- Wait 24 hours for DNS propagation

---

## TROUBLESHOOTING

### "MongoDB connection failed"

**Solution:**

1. Go to MongoDB Atlas
2. Check if IP is whitelisted (Network Access)
3. Verify password in connection string
4. Verify database name is correct

### "Frontend can't reach API"

**Solution:**

1. Check FRONTEND_URL in Railway environment
2. Verify backend service is running (green checkmark)
3. Check backend logs for errors
4. Verify CORS is enabled in Backend/index.js

### "Deployment failed/stuck"

**Solution:**

1. Click "Logs" in Railway
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - Invalid connection strings
   - Node/npm version mismatch

---

## FINAL CHECKLIST

Before going live:

- [ ] MongoDB cluster created & running
- [ ] Database user created with strong password
- [ ] JWT_SECRET generated (32+ characters)
- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Railway
- [ ] All environment variables set
- [ ] Tested login/register flow
- [ ] No errors in logs
- [ ] Frontend can reach backend API

---

## 🎉 YOU'RE LIVE!

Your application is now live on the internet!

**Frontend URL:** https://your-railway-frontend-url.com  
**Backend URL:** https://your-railway-backend-url.com  
**Database:** MongoDB Atlas

Users can now:

- ✅ Register as vendors
- ✅ Login with email/password
- ✅ Add firms
- ✅ Add products
- ✅ View all products

---

## MONITORING YOUR APP

### Check Logs

- Railway Dashboard → "Logs"
- Look for errors or warnings
- Check MongoDB connection messages

### Monitor Database

- Go to MongoDB Atlas
- View "Collections"
- See all stored vendor/firm/product data

### Track Users

- See login attempts in logs
- Monitor API requests (Morgan logs in backend)

---

## NEXT STEPS

1. **Add SSL Certificate** (automatic on Railway)
2. **Setup Automated Backups** (MongoDB Atlas)
3. **Monitor Performance** (Railway analytics)
4. **Add More Features** (payment, notifications, etc.)
5. **Scale** (upgrade plan if needed)

---

**Questions?** Check logs first, then review this guide again.

**Your app is production-ready!** 🚀
