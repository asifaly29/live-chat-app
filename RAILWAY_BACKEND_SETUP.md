# Railway Backend Integration Guide

## Overview
This frontend is now configured to work exclusively with the deployed Railway backend. **No local backend server is required**.

## Quick Start

### 1. Prerequisites
- Node.js 16+ installed
- Frontend dependencies installed (`npm install` in `/frontend`)

### 2. Environment Configuration
The frontend is already configured with the Railway backend URLs in `.env.local`:

```env
VITE_API_URL=https://live-chat-app-production-69b9.up.railway.app
VITE_SERVER_URL=https://live-chat-app-production-69b9.up.railway.app
```

**No additional configuration needed!**

### 3. Start the Development Server

```bash
cd frontend
npm run dev
```

The app will be available at: `http://localhost:5173`

### 4. Access the Application
- Open your browser to `http://localhost:5173`
- Sign up or log in
- Start chatting!

## Key Configuration Files

### `.env.local` (Frontend)
Located at: `frontend/.env.local`

Configures API and WebSocket connections to the Railway backend:
- `VITE_API_URL`: REST API endpoint
- `VITE_SERVER_URL`: WebSocket connection endpoint

### `vite.config.js` (Frontend)
No proxy middleware needed - all API calls go directly to Railway backend.

### `apiConfig.js` (Frontend Utils)
Located at: `frontend/src/utils/apiConfig.js`

Exports:
- `API_URL`: The Railway backend URL
- `SERVER_URL`: The Railway backend URL
- `getAPIEndpoint(path)`: Helper to construct full API URLs

**All API calls use `getAPIEndpoint()` for proper URL construction.**

## API Architecture

### REST Endpoints
All fetch calls use `getAPIEndpoint()`:

```javascript
const res = await fetch(getAPIEndpoint("/api/auth/login"), {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
  credentials: "include", // Critical for CORS with cookies
});
```

**All endpoints include `credentials: "include"`** to ensure authentication cookies work across domains.

### WebSocket Connection
Socket.IO connects to the Railway backend:

```javascript
const socket = io(SERVER_URL, {
  query: { userId: authUser._id },
  reconnection: true,
  reconnectionAttempts: 5,
});
```

## API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/users` | Get all conversations/users |
| GET | `/api/messages/:conversationId` | Fetch messages |
| POST | `/api/messages/send/:conversationId` | Send message |

All endpoints are prefixed with the Railway backend URL automatically.

## CORS & Security

### Credentials Included ✅
All API requests include `credentials: "include"` to:
- Send authentication cookies
- Maintain session across requests
- Work with CORS properly

### Backend CORS Configuration
The Railway backend is configured to accept requests from:
- `http://localhost:5173` (local development)
- Production deployment URLs

## File Structure

```
frontend/
├── .env.local                    # Current environment config (Railway)
├── .env.example                  # Template for environment setup
├── vite.config.js               # Vite config (no proxy needed)
├── src/
│   ├── utils/
│   │   └── apiConfig.js         # Centralized API configuration
│   ├── hooks/
│   │   ├── useLogin.js          # Uses getAPIEndpoint()
│   │   ├── useSignup.js         # Uses getAPIEndpoint()
│   │   ├── useLogout.js         # Uses getAPIEndpoint()
│   │   ├── useGetConversations.js # Uses getAPIEndpoint()
│   │   ├── useGetMessages.js    # Uses getAPIEndpoint()
│   │   └── useSendMessage.js    # Uses getAPIEndpoint()
│   └── context/
│       └── SocketContext.jsx    # Uses SERVER_URL from apiConfig
```

## Changes Made

### 1. Environment Configuration ✅
- Updated `frontend/.env.local` to use Railway backend
- Updated `frontend/.env.example` with clear documentation
- Both files now point to: `https://live-chat-app-production-69b9.up.railway.app`

### 2. Vite Configuration ✅
- Removed proxy middleware from `vite.config.js`
- Changed port from 3000 to 5173 (standard Vite port)
- No longer needs local backend

### 3. API Configuration ✅
- Updated `apiConfig.js` to always use full Railway URLs
- `getAPIEndpoint()` now always prepends `API_URL`
- No conditional logic for proxy

### 4. All API Hooks ✅
The following hooks are already configured correctly:
- `useLogin.js` - login API calls
- `useSignup.js` - signup API calls
- `useLogout.js` - logout API calls
- `useGetConversations.js` - fetch conversations
- `useGetMessages.js` - fetch messages
- `useSendMessage.js` - send messages

All hooks:
- Use `getAPIEndpoint()` for URL construction
- Include `credentials: "include"` for proper auth

### 5. Socket Configuration ✅
- `SocketContext.jsx` uses `SERVER_URL` from `apiConfig.js`
- Connects to Railway WebSocket endpoint
- Properly handles reconnection

## Troubleshooting

### API Calls Failing
1. Check browser console for errors
2. Verify `VITE_API_URL` is set in `.env.local`
3. Ensure Railway backend is accessible

### WebSocket Connection Issues
1. Check `VITE_SERVER_URL` in `.env.local`
2. Verify Socket.IO is properly connected in browser console
3. Check network tab for WebSocket connections

### CORS Errors
1. Ensure all API requests include `credentials: "include"`
2. All hooks already have this configured
3. Railway backend is configured to allow these origins

### Authentication Issues
1. Verify authentication token is stored in localStorage
2. Check browser cookies for authentication
3. Ensure logout clears localStorage properly

## Deployment

### Vercel / NetLify Deployment
Set environment variables in your deployment platform:
```
VITE_API_URL=https://live-chat-app-production-69b9.up.railway.app
VITE_SERVER_URL=https://live-chat-app-production-69b9.up.railway.app
```

### Production Considerations
- Railway backend should have CORS configured for your production domain
- Ensure SSL/TLS is enabled for secure connections
- Monitor API rate limits
- Set up error logging/monitoring

## Next Steps

1. ✅ Run `npm run dev` in the frontend directory
2. ✅ Open `http://localhost:5173`
3. ✅ Test sign up, login, and messaging
4. ✅ Verify no console errors

## Notes

- **No local backend needed** - everything connects to Railway
- **Development is isolated** - changes don't affect production Railway instance
- **CORS is handled** - Railway backend allows localhost:5173
- **Authentication works** - cookies properly sent with all requests
- **WebSockets work** - real-time messaging via Socket.IO

## Support

If you encounter issues:
1. Check `.env.local` has correct URLs
2. Verify Railway backend is online
3. Check browser console for specific errors
4. Ensure you've run `npm install` in frontend directory
