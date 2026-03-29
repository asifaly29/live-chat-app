# Production Deployment Guide - Vercel & Railway

## Overview
This guide covers the complete setup to deploy your chat app frontend on Vercel and ensure seamless communication with the Railway backend.

---

## ✅ Changes Made (Production-Ready Code)

### 1. **CORS Cookie Configuration** 
**File Modified:** `backend/utils/generateToken.js`, `backend/controllers/auth.controller.js`

**What Changed:**
- Updated cookie settings to use `sameSite: "None"` in production (required for cross-site cookies)
- Keeps `sameSite: "strict"` in development for security
- Both login and logout cookies now use consistent configuration

```javascript
// Production: sameSite: "None" (allows cross-site cookies from Vercel → Railway)
// Development: sameSite: "strict" (tighter security)
sameSite: process.env.NODE_ENV === "development" ? "strict" : "None"
```

**Impact:** ✅ Cookies will now be properly sent/received between Vercel and Railway

---

### 2. **Environment Variable Validation**
**File Modified:** `frontend/src/utils/apiConfig.js`, `frontend/src/App.jsx`

**What Changed:**
- Added validation logging to verify API URLs are configured
- Added `checkBackendHealth()` function to test backend connectivity
- Console logs on app startup to diagnose issues

**What You'll See in Browser Console:**
```
🔧 API Configuration:
   Environment: production
   API_URL: ✓ Set
   SERVER_URL: ✓ Set
   Development Mode: false

🏥 Checking backend health at: https://live-chat-app-production-69b9.up.railway.app/api/health
✅ Backend is healthy: {status: "ok", ...}
```

**Impact:** ✅ Easy debugging if backend is unreachable

---

### 3. **Health Check Endpoint**
**File Modified:** `backend/server.js`

**What Added:**
```javascript
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend is running and accessible",
    timestamp: new Date().toISOString(),
  });
});
```

**Impact:** ✅ Frontend can verify backend connectivity before making requests

---

### 4. **Enhanced Error Handling**
**Files Modified:** All hooks (`useLogin.js`, `useSignup.js`, `useLogout.js`, `useSendMessage.js`, `useGetMessages.js`, `useGetConversations.js`)

**What Changed:**
- Detailed console logging for debugging
- Better error messages for network failures
- Distinguishes between network errors and API errors

**Console Output on Failure:**
```
❌ Network Error - Possible causes:
   1. Backend unreachable at: https://your-backend.up.railway.app
   2. CORS configuration issue on backend
   3. Network connectivity problem
```

**Impact:** ✅ Users see helpful error messages, developers can debug easily

---

### 5. **Socket.IO Configuration**
**File Modified:** `frontend/src/context/SocketContext.jsx`

**What Changed:**
- Enhanced logging for Socket.IO connection
- Shows which server URL is being used
- Reports socket connection errors with suggestions

**Console Output:**
```
🔌 Socket.IO connecting to: https://live-chat-app-production-69b9.up.railway.app
✅ Socket.IO connection established
   User ID: 507f1f77bcf36cd799439011
   Socket ID: abc123def456
```

**Impact:** ✅ Easy diagnosis of real-time communication issues

---

### 6. **Frontend Environment File**
**File Created:** `frontend/.env`

**Purpose:**
- Provides defaults for development
- Development uses Vite proxy for `/api` calls
- Socket.IO connects directly to Railway

```env
VITE_API_URL=http://localhost:5173
VITE_SERVER_URL=https://live-chat-app-production-69b9.up.railway.app
```

**Impact:** ✅ Development works without changes

---

## 🚀 Vercel Deployment Checklist

### Step 1: Push Changes to GitHub
```bash
git add .
git commit -m "Fix: Production-ready frontend-backend communication"
git push origin main
```

### Step 2: Vercel Environment Variables
1. Go to: **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Add these variables** (exact names matter):

| Variable | Value | Environment |
| --- | --- | --- |
| `VITE_API_URL` | `https://live-chat-app-production-69b9.up.railway.app` | Production |
| `VITE_SERVER_URL` | `https://live-chat-app-production-69b9.up.railway.app` | Production |

3. **DO NOT** set these for Development (let Vercel Preview builds use defaults)

### Step 3: Railway Environment Variables
1. Go to: **Railway Dashboard** → Your Backend Project → **Variables**

2. **Verify/Add these variables:**

| Variable | Value |
| --- | --- |
| `CLIENT_URL` | `https://your-vercel-app.vercel.app` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `(your-secret-key)` |
| `MONGODB_URI` | `(your-mongodb-url)` |
| `PORT` | `(auto-assigned by Railway)` |

⚠️ **IMPORTANT:** Replace `https://your-vercel-app.vercel.app` with your actual Vercel URL (e.g., `https://chatapp-asifaly.vercel.app`)

### Step 4: Deploy Frontend to Vercel
1. Vercel will **automatically deploy** when you push to GitHub
2. Or manually trigger: **Vercel Dashboard** → **Deployments** → **Redeploy**
3. Wait for deployment to complete (usually 1-2 minutes)

---

## 🧪 Testing Checklist

### Test in Browser Console (Open DevTools → Console Tab)

#### ✅ Test 1: Verify Configuration Logs
After deployment, refresh the page and look for:
```
🔧 API Configuration:
   Environment: production
   API_URL: ✓ Set
   SERVER_URL: ✓ Set
```

#### ✅ Test 2: Test Backend Health Check
Paste this command in the console:
```javascript
fetch("https://live-chat-app-production-69b9.up.railway.app/api/health", {
  credentials: "include"
}).then(r => r.json()).then(console.log);
```

**Expected Output:**
```json
{status: "ok", message: "Backend is running and accessible", timestamp: "2026-03-29T..."}
```

#### ✅ Test 3: Test Login
1. Try to login with credentials
2. Watch the console for:
```
🔐 Logging in, API endpoint: https://live-chat-app-production-69b9.up.railway.app/api/auth/login
✅ Login successful
```

#### ✅ Test 4: Test Socket.IO Connection
1. After login, look for:
```
🔌 Socket.IO connecting to: https://live-chat-app-production-69b9.up.railway.app
✅ Socket.IO connection established
   User ID: (your-user-id)
   Socket ID: (socket-id)
```

#### ✅ Test 5: Test Real-time Messages
1. Open app in two browser tabs
2. Send a message in one tab
3. Should appear instantly in the other tab
4. Check console for:
```
📤 Sending message, API endpoint: ...
✅ Message sent successfully
```

---

## 🔍 Troubleshooting

### Issue: "Failed to fetch" Error

**Diagnosis:**
1. Open browser DevTools → **Console** tab
2. Look for network error logs like:
```
❌ Network Error - Possible causes:
   1. Backend unreachable at: ...
   2. CORS configuration issue on backend
   3. Network connectivity problem
```

**Solutions:**

**A) Backend URL is Wrong**
- Verify your Railway backend URL is correct in Vercel environment variables
- Check that Railway backend is actually running
- Test with: `curl https://your-backend.up.railway.app/api/health`

**B) CORS Configuration Missing**
- Ensure Railway has `CLIENT_URL` set to your Vercel URL
- Check that `NODE_ENV=production` is set
- Formula: Frontend URL → Backend CORS must include that URL

**C) Network/Firewall Issue**
- Check Railway logs for errors
- Verify no network firewall blocking requests
- Try accessing backend URL directly in browser

---

### Issue: Cookies Not Persisting

**Check:**
1. Go to DevTools → **Application** → **Cookies**
2. Should see `jwt` cookie from Railway domain
3. Should have:
   - ✅ HttpOnly: (checked)
   - ✅ Secure: (checked in production)
   - ✅ SameSite: None

**If Missing:**
- Backend cookie is not being set properly
- Check that login response includes Set-Cookie header
- Railway NODE_ENV must be "production" for secure cookies

---

### Issue: Socket.IO Not Connecting

**Diagnosis in Console:**
```
❌ Socket.IO connection error: ...
   This could indicate:
   1. Backend is down or unreachable
   2. CORS configuration issue
   3. Invalid server URL: ...
```

**Solutions:**
- Verify `VITE_SERVER_URL` is set in Vercel
- Check that Railway backend is running
- Ensure Socket.IO CORS allows your Vercel URL
- Check Railway logs for Socket.IO errors

---

### Issue: Messages Not Sending (400/401 Error)

**Possible Causes:**
1. **Invalid JWT Token** → Clear localStorage and login again
2. **Session Expired** → Logout and login
3. **Backend Authentication Issue** → Check middleware in `protectRoute.js`
4. **CORS Headers Missing** → Check Rails CORS config

**Fix:**
```javascript
// Clear frontend storage and force re-login
localStorage.removeItem("chat-user");
location.reload();
```

---

## 📊 Configuration Summary

### Environment Variables Map

```
Frontend (Vercel)
├─ VITE_API_URL → Production: https://railway-url
├─ VITE_SERVER_URL → Production: https://railway-url

Backend (Railway)
├─ CLIENT_URL → https://vercel-app-url
├─ NODE_ENV → production
├─ JWT_SECRET → (key)
├─ MONGODB_URI → (mongo-url)
```

### Request Flow

```
Browser (Vercel)
  ↓ (credentials: "include")
  ├→ /api/auth/login → Railway Backend
  │  ↓ (Sets cookie: jwt with sameSite: None, secure: true)
  │  ← Response with Set-Cookie header
  │
  ├→ /api/messages/send → Railway Backend
  │  (Cookie sent automatically because credentials: "include")
  │
  └→ Socket.IO ws://Railway → Real-time updates

```

---

## ✅ You're All Set!

Your frontend should now:
- ✅ Communicate with Railway backend
- ✅ Handle cookies correctly across domains
- ✅ Provide detailed error messages if something fails
- ✅ Support real-time messaging via Socket.IO
- ✅ Work in both development and production

**Last Step:** Commit and push the changes:
```bash
git add .
git commit -m "feat: Production-ready frontend-backend communication

- Fix CORS cookies with sameSite:None for cross-site requests
- Add environment validation and health checks
- Enhance error handling with detailed logging
- Add Socket.IO connection diagnostics
- Verify API endpoints before deployment
"
git push origin main
```

---

## 📚 References

- [CORS with Credentials - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#credentialed_requests)
- [SameSite Cookie Attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Socket.IO CORS Configuration](https://socket.io/docs/v4/handling-cors/)
- [Express CORS Middleware](https://github.com/expressjs/cors)
