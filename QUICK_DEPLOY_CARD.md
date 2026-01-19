# ⚡ QUICK DEPLOYMENT REFERENCE CARD

## 1️⃣ MONGODB SETUP (5 mins)

```
URL: mongodb.com/cloud/atlas
1. Sign Up → Email Verify
2. Create Project → "Food_Services"
3. Create M0 Free Cluster → Select Region
4. Database Access → Add User: foodadmin / [Strong Password]
5. Network Access → Allow Anywhere
6. Connect → Node.js → Copy Connection String
```

**SAVE:** Connection String + Password

---

## 2️⃣ GENERATE JWT SECRET (1 min)

**PowerShell Command:**

```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (New-Guid).ToString()))
```

**SAVE:** Output

---

## 3️⃣ RAILWAY DEPLOYMENT (15 mins)

### Backend Setup:

```
URL: railway.app
1. Sign Up with GitHub
2. New Project → Deploy from GitHub
3. Select: Food_services → Deploy
4. Variables:
   PORT = 4000
   NODE_ENV = production
   MONGO_URL = [From MongoDB Step 1]
   JWT_SECRET = [From JWT Step 2]
5. Save → Deploy Complete ✅
6. COPY Backend URL from Railway
```

### Frontend Setup:

```
1. New Service → GitHub Repo
2. Select: Food_services
3. Root Directory: dashboard
4. Deploy
5. COPY Frontend URL
```

### Update Backend:

```
1. Backend Service → Variables
2. FRONTEND_URL = [Your Frontend URL]
3. Save
```

---

## 4️⃣ TEST (5 mins)

```
✅ Frontend URL → See login page
✅ Backend URL → See "Food Services API"
✅ Register → Enter email & password
✅ Login → Should work
✅ All Connected! 🎉
```

---

## 5️⃣ SHARE YOUR APP

**Frontend:** `https://your-frontend-url.com`  
**Backend:** `https://your-backend-url.com`  
**Users can:** Register → Login → Add Firms/Products

---

## ⚠️ IF ERRORS

| Error                    | Solution                                        |
| ------------------------ | ----------------------------------------------- |
| MongoDB fails            | Check IP whitelist, password, connection string |
| Frontend can't reach API | Check FRONTEND_URL variable, backend running    |
| Deploy stuck             | Check logs in Railway, missing variables        |
| 404 on URLs              | Wait 2 mins for Railway to fully start          |

---

## 📋 FINAL CHECKLIST

- [ ] MongoDB cluster ready
- [ ] JWT secret generated
- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Railway
- [ ] All environment variables set
- [ ] Login works
- [ ] Ready to share!

**Your app is LIVE! 🚀**
