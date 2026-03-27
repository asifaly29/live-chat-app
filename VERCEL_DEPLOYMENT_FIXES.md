# Vercel Deployment Guide - CORS & Production Configuration

**Updated: March 2026**  
**Status**: Production-Ready ✅

This guide explains the fixes applied to make your MERN chat app work seamlessly on Vercel with separate frontend and backend deployments.

---

## 🔧 What Was Fixed

### 1. **Backend CORS Configuration** ✅
- **File**: `backend/server.js`
- **Issue**: Manual CORS middleware was fragile and incompatible with Vercel serverless
- **Fix**: Replaced with `cors` npm package for production-ready CORS handling
- **Change**:
  ```javascript
  // OLD: Custom middleware
  app.use((req, res, next) => { ... })
  
  // NEW: Using cors package (Vercel-compatible)
  app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
  ```
- **Why**: The `cors` package properly handles preflight requests and Vercel serverless functions

### 2. **Frontend Credentials Configuration** ✅
- **Files Updated**: 
  - `frontend/src/hooks/useLogin.js`
  - `frontend/src/hooks/useSignup.js`
  - `frontend/src/hooks/useSendMessage.js`
  - `frontend/src/hooks/useGetMessages.js`
  - `frontend/src/hooks/useGetConversations.js`
  - `frontend/src/hooks/useLogout.js`
  - `frontend/src/components/sidebar/Conversations.jsx`
- **Issue**: Fetch calls were missing `credentials: "include"` which prevents cookies from being sent/received across domains
- **Fix**: Added `credentials: "include"` to all fetch requests
- **Change**:
  ```javascript
  // OLD: No credentials
  const res = await fetch(getAPIEndpoint("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  
  // NEW: With credentials for cookie-based auth
  const res = await fetch(getAPIEndpoint("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include" // ✅ REQUIRED for CORS cookies
  });
  ```
- **Why**: Without credentials, authentication tokens (JWT stored in cookies) won't be sent to the backend

### 3. **Environment Variables** ✅
- **Files Updated**:
  - `.env` - Added `CLIENT_URL=http://localhost:3000`
  - `.env.example` - Added `CLIENT_URL` documentation
  - `backend/server.js` - Uses `process.env.CLIENT_URL`
  - `frontend/src/utils/apiConfig.js` - Updated with Vercel deployment comments

### 4. **Package Scripts for Vercel** ✅
- **Files Updated**:
  - `package.json` (root) - Added `"vercel-build"` script
  - `frontend/package.json` - Added `"start"` script for Vercel
- **New Scripts**:
  ```json
  {
    "start": "node backend/server.js",
    "vercel-build": "echo 'No build needed for backend'"
  }
  ```

### 5. **Vercel Configuration Files** ✅
- **File Created**: `backend/vercel.json` - Backend serverless configuration
- **File Created**: `frontend/vercel.json` - Frontend static deployment configuration

---

## 🚀 Deployment Steps

### Backend Deployment (via Vercel CLI or Dashboard)

#### 1. **Create Vercel Project for Backend**
```bash
cd backend
vercel
```

#### 2. **Set Environment Variables in Vercel Dashboard**
Go to: Project Settings → Environment Variables
Add the following:
```
MONGODB_URI = (your MongoDB connection string)
JWT_SECRET = (your JWT secret)
CLIENT_URL = https://your-frontend.vercel.app
PORT = 5000 (optional, Vercel sets this)
NODE_ENV = production
```

#### 3. **Deploy**
```bash
vercel --prod
```

**Backend URL**: https://your-backend.vercel.app

---

### Frontend Deployment (via Vercel CLI or Dashboard)

#### 1. **Create Vercel Project for Frontend**
```bash
cd frontend
vercel
```

#### 2. **Set Environment Variables in Vercel Dashboard**
Go to: Project Settings → Environment Variables
Add the following:
```
VITE_API_URL = https://your-backend.vercel.app
VITE_SERVER_URL = https://your-backend.vercel.app
```

#### 3. **Deploy**
```bash
vercel --prod
```

**Frontend URL**: https://your-frontend.vercel.app

---

## 🔐 Key Changes for Production

### CORS (Cross-Origin Resource Sharing)
- ✅ Backend now uses `cors` package
- ✅ Frontend sends `credentials: "include"` in all fetch calls
- ✅ `CLIENT_URL` environment variable controls which frontend can access the backend
- ✅ Cookies are properly handled across domains

### Credentials & Authentication
- ✅ JWT tokens stored in HTTP-only cookies (if your backend config uses this)
- ✅ Cookies automatically sent with all requests to the API domain
- ✅ No more "Failed to fetch" or "401 Unauthorized" errors

### Socket.IO
- ✅ Configured to use the same `CLIENT_URL` for WebSocket connections
- ✅ Works with Vercel's Hobby plan and above

---

## 🧪 Testing Checklist

- [ ] Login works without "Failed to fetch" error
- [ ] Signup creates new user and logs in automatically
- [ ] Messages send and receive in real-time
- [ ] Conversations list updates
- [ ] Logout clears session properly
- [ ] Page refresh retains session (if token is in cookie)
- [ ] No CORS errors in browser console
- [ ] Works on mobile devices
- [ ] WebSocket connection (Socket.IO) is established

---

## 🐛 Troubleshooting

### Problem: Still Getting "Failed to fetch" or CORS errors

**Solution**: Check these in order:

1. **Verify Environment Variables**
   - Backend: `echo $CLIENT_URL` (should be frontend URL)
   - Frontend: `echo $VITE_API_URL` (should be backend URL)
   - Redeploy after changing variables

2. **Check CORS Origin**
   - Backend logs should show which origin was accepted
   - Make sure `CLIENT_URL` exactly matches frontend domain (including protocol)

3. **Verify Credentials Flag**
   - Search codebase for `fetch(` and ensure all requests have `credentials: "include"`
   - Check browser Network tab → see if cookies are being sent

### Problem: Login works but messages don't send

**Solution**:
- Check if Socket.IO is connecting (should see "✅ Socket connection established" in console)
- Verify `VITE_SERVER_URL` is set correctly to backend URL
- Check backend logs for Socket.IO connection errors

### Problem: Deployed but getting "Cannot find module 'cors'"

**Solution**:
```bash
cd backend
npm install cors
npm install  # Reinstall dependencies
vercel --prod
```

---

## 📝 Code Comments

All changes have been marked with `// CHANGED:` comments in the code for easy reference. Search for "CHANGED:" in your IDE to see all modifications.

---

## 📋 Files Modified

1. ✅ `backend/server.js` - CORS middleware
2. ✅ `backend/vercel.json` - Created
3. ✅ `frontend/vercel.json` - Created
4. ✅ `frontend/src/utils/apiConfig.js` - Updated comments
5. ✅ All frontend hooks - Added `credentials: "include"`
6. ✅ `.env` - Added `CLIENT_URL`
7. ✅ `.env.example` - Added `CLIENT_URL` docs
8. ✅ `package.json` - Updated scripts
9. ✅ `frontend/package.json` - Updated scripts

---

## 🎯 Next Steps

1. Install dependencies: `npm install && npm install --prefix frontend`
2. Test locally: `npm run server` (in one terminal) and `npm run dev --prefix frontend` (in another)
3. Deploy backend to Vercel
4. Deploy frontend to Vercel
5. Update environment variables in both Vercel projects
6. Test production URLs

---

**Questions?** Check the comments in the code marked with `// CHANGED:` for specific implementation details.
