# Vercel Deployment Guide - Frontend

This frontend is now ready for production deployment on Vercel with the Railway backend.

## 📋 Prerequisites

- Frontend code is in `/frontend` directory
- Backend is deployed on Railway at: `https://live-chat-app-production-69b9.up.railway.app`
- Vercel account created and configured

## 🚀 Deployment Steps

### Step 1: Prepare Environment Variables

The frontend uses two environment variables:

1. **VITE_API_URL** - Used for REST API calls
2. **VITE_SERVER_URL** - Used for Socket.IO connections

Both should point to the Railway backend:
```
https://live-chat-app-production-69b9.up.railway.app
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI globally (if not installed)
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy to Vercel
vercel
```

#### Option B: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework**: Vite
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables in Vercel Dashboard:
   - Go to Settings → Environment Variables
   - Add the following variables for all environments (Preview, Production, Development):

   | Key | Value |
   |-----|-------|
   | VITE_API_URL | https://live-chat-app-production-69b9.up.railway.app |
   | VITE_SERVER_URL | https://live-chat-app-production-69b9.up.railway.app |

6. Click "Deploy"

### Step 3: Verify Environment Variables in Vercel

1. After project is created, go to **Settings** → **Environment Variables**
2. Ensure both variables are set and available in Production environment
3. Redeploy if needed (Settings → Deployments or push new commit)

## 🧪 Testing After Deployment

### Test API Connectivity

1. Open the deployed app in your browser
2. Try signing up or logging in
3. Create a new conversation
4. Send and receive messages
5. Check browser console for any errors

### Check Logs

- Vercel: Dashboard → Deployments → Logs
- Railway: Dashboard → Deployments → Logs
- Browser Console: F12 → Console tab

## 📝 Environment Configuration Details

### Development (Local)

File: `frontend/.env.local`
```env
VITE_API_URL=http://localhost:5000
VITE_SERVER_URL=http://localhost:5000
```

In development, Vite proxy at `/api/*` routes requests to the backend.

### Production (Vercel)

Set in Vercel Dashboard:
```env
VITE_API_URL=https://live-chat-app-production-69b9.up.railway.app
VITE_SERVER_URL=https://live-chat-app-production-69b9.up.railway.app
```

## 🔧 Troubleshooting

### API calls failing
- Check that `VITE_API_URL` is set correctly in Vercel
- Verify railway backend is running: `https://live-chat-app-production-69b9.up.railway.app/health`
- Check CORS configuration on Railway backend

### Socket.IO connection failing
- Verify `VITE_SERVER_URL` matches the Railway backend URL
- Check that Socket.IO is enabled on the Railway backend
- Look for connection errors in browser console

### Build failures
```bash
# Test build locally first
cd frontend
npm run build

# Check for errors
npm run lint
```

## 📦 Project Structure

```
frontend/
├── .env.local              # Development environment variables (local only)
├── .env.example            # Template for environment variables
├── vite.config.js          # Vite configuration with optimizations
├── src/
│   ├── utils/
│   │   └── apiConfig.js    # Centralized API URL configuration
│   ├── hooks/
│   │   ├── useLogin.js     # Updated to use VITE_API_URL
│   │   ├── useSignup.js    # Updated to use VITE_API_URL
│   │   ├── useLogout.js    # Updated to use VITE_API_URL
│   │   ├── useGetConversations.js  # Updated
│   │   ├── useGetMessages.js       # Updated
│   │   └── useSendMessage.js       # Updated
│   ├── context/
│   │   └── SocketContext.jsx       # Updated to use VITE_SERVER_URL
│   └── ...
└── ...
```

## 🎯 What Changed

1. **Created `src/utils/apiConfig.js`**
   - Centralized API URL configuration
   - Automatically uses correct URL based on environment
   - Handles both development (proxy) and production (full URL)

2. **Updated all API hooks**
   - Import `getAPIEndpoint` from apiConfig
   - Use it to construct proper API URLs
   - Works seamlessly in both development and production

3. **Updated SocketContext**
   - Uses `SERVER_URL` from centralized config
   - Fixed to use Railway backend URL

4. **Added environment files**
   - `.env.local` for development
   - `.env.example` as template for others

5. **Enhanced vite.config.js**
   - Improved proxy configuration
   - Added build optimizations
   - Configurable target based on environment

## ✅ Verification Checklist

- [ ] `.env.local` exists with development URLs
- [ ] `src/utils/apiConfig.js` is created
- [ ] All hooks in `src/hooks/` use `getAPIEndpoint()`
- [ ] SocketContext uses `SERVER_URL` from apiConfig
- [ ] `npm run build` completes without errors
- [ ] Environment variables set in Vercel Dashboard
- [ ] App deployed on Vercel
- [ ] Login/signup works
- [ ] Messages send and receive correctly
- [ ] Socket.IO connects successfully

## 📚 Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Railway Documentation](https://docs.railway.app/)
- [Socket.IO Production Deployment](https://socket.io/docs/v4/server-initialization/#important-warning-about-http-long-polling)

## 🆘 Support

If you encounter issues:
1. Check browser console for error messages
2. Check Vercel deployment logs
3. Check Railway backend logs
4. Verify all environment variables are set correctly
5. Ensure backend is running and accessible
6. Try testing with the local development setup first
