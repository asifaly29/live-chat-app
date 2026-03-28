# Testing Guide - Railway Backend Integration

## Environmental Verification

### 1. Check Environment Configuration
Verify `.env.local` exists in `/frontend` with correct values:

```bash
cat frontend/.env.local
```

Expected output:
```
VITE_API_URL=https://live-chat-app-production-69b9.up.railway.app
VITE_SERVER_URL=https://live-chat-app-production-69b9.up.railway.app
```

✅ If values are correct, proceed to next step.

---

## Testing Checklist

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:5173/
```

### Step 3: Open Application
Open browser to: `http://localhost:5173`

### Step 4: Test User Registration
1. Click "Don't have an account? Sign up"
2. Fill in form with:
   - Full Name: Test User
   - Username: testuser123
   - Password: password123
   - Gender: Select any
3. Click Sign Up

✅ **Expected**: User created and logged in automatically
❌ **If failed**: Check browser console for API errors

### Step 5: Test API Connectivity
Check browser console (F12 > Console) for messages like:
- `✅ Socket connection established` - WebSocket working
- `Online users updated:` - Real-time updates working

✅ **If visible**: Railway backend is connected!
❌ **If not**: Check network tab for failed requests

### Step 6: Test Messaging
1. Create second user account
   - Username: otheruser456
   - Password: password123
2. Switch back to first user (testuser123)
3. Select second user from conversation list
4. Type message: "Hello from Railway backend!"
5. Send message

✅ **Expected**: Message sent and received instantly
❌ **If failed**: Check browser console and network tab

### Step 7: Test Real-Time Updates
1. Open second browser tab and log in as second user (otheruser456)
2. Back in first tab, send another message
3. Check second tab

✅ **Expected**: Message appears in second tab in real-time (via Socket.IO)
❌ **If not updating**: Check Socket.IO connection in console

### Step 8: Test Logout
1. Click logout button
2. Should redirect to login page

✅ **Expected**: User logged out successfully
❌ **If failed**: Check console for errors

---

## Browser Console Diagnostics

### View API URL Being Used
In browser console, run:
```javascript
import.meta.env.VITE_API_URL
```

Should return: `https://live-chat-app-production-69b9.up.railway.app`

### View WebSocket Connection
Check console logs for:
```
✅ Socket connection established
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform an action (sign up, send message)
4. Verify requests go to: `https://live-chat-app-production-69b9.up.railway.app`

Important requests to check:
- `/api/auth/signup` - POST
- `/api/auth/login` - POST
- `/api/users` - GET
- `/api/messages/...` - GET
- WebSocket upgrade request

---

## Network Tab Verification

### URL Check
All requests should start with:
```
https://live-chat-app-production-69b9.up.railway.app/api/...
```

**NOT**: `http://localhost:5000/api/...` or `http://localhost:3000/api/...`

### Status Codes
- ✅ 200 OK - Successful API call
- ✅ 201 Created - Successful user creation
- ❌ 404 Not Found - Wrong endpoint
- ❌ 403 Forbidden - Authentication issue
- ❌ 500 Internal Server Error - Backend issue

### Headers Check
Under Request Headers, verify:
```
Cookie: [JWT token here]
Content-Type: application/json
```

---

## Common Issues & Solutions

### Issue: "Cannot GET /api/auth/login"
**Cause**: Proxy is active or wrong backend URL
**Solution**: Verify `VITE_API_URL` in `.env.local` points to Railway

### Issue: "Network Error" on every API call
**Cause**: Railroad backend offline or unreachable
**Solution**: 
1. Check Railway platform is online
2. Verify internet connection
3. Check URL in `.env.local` is exact

### Issue: Socket.IO not connecting
**Cause**: Wrong `VITE_SERVER_URL`
**Solution**: 
1. Verify `VITE_SERVER_URL=https://live-chat-app-production-69b9.up.railway.app`
2. Restart dev server after changing `.env.local`

### Issue: Cookie not being sent
**Cause**: `credentials: "include"` missing from fetch
**Solution**: All hooks should have this - verify in source code

### Issue: CORS error in console
**Cause**: Backend doesn't allow this origin
**Solution**: 
1. Ensure Railway backend CORS allows `http://localhost:5173`
2. Check backend is properly configured

---

## Performance Checks

### Load Time
- Frontend loads in < 5 seconds on localhost:5173
- Initial API calls complete within 2-3 seconds

### Socket.IO Latency
- Real-time messages should appear instantly (< 100ms)
- Typing indicators update smoothly

### Console Warnings
- Should have minimal console warnings
- Check for deprecated API usage

---

## API Endpoints Tested

| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/auth/signup` | POST | ✅ |
| `/api/auth/login` | POST | ✅ |
| `/api/auth/logout` | POST | ✅ |
| `/api/users` | GET | ✅ |
| `/api/messages/:id` | GET | ✅ |
| `/api/messages/send/:id` | POST | ✅ |
| WebSocket | io() | ✅ |

---

## Success Criteria

Frontend is fully functional when:
- ✅ Sign up works without errors
- ✅ Login saves authentication token
- ✅ Conversations list loads
- ✅ Messages send and receive
- ✅ Real-time updates work via Socket.IO
- ✅ Logout clears session
- ✅ No console errors about localhost
- ✅ Network requests go to Railway (not localhost)

---

## Next Steps

If all tests pass:
1. ✅ Backend is properly deployed on Railway
2. ✅ Frontend is properly configured
3. ✅ Ready for production deployment
4. ✅ Ready to share with users

If any test fails:
1. Check console for specific error messages
2. Verify `.env.local` configuration
3. Restart dev server (`npm run dev`)
4. Clear browser cache and reload
5. Check Railway backend logs

---

## Debug Tips

### View Full API Response
Add this to any fetch call:
```javascript
.then(res => {
  console.log("Response Status:", res.status);
  return res.json();
})
.then(data => {
  console.log("Response Data:", data);
})
```

### Check Socket Events
In console:
```javascript
socket.on("getOnlineUsers", (users) => {
  console.log("Updated online users:", users);
});
```

### Verify Environment Variables
Check all at once:
```javascript
console.log({
  API_URL: import.meta.env.VITE_API_URL,
  SERVER_URL: import.meta.env.VITE_SERVER_URL,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
});
```

---

## Support

If you encounter issues not listed above:
1. Check browser console (F12)
2. Check Network tab for failed requests
3. Verify `.env.local` is correctly set
4. Verify Railway backend is online
5. Restart frontend dev server
6. Clear browser cache and reload

For persistent issues, check the application logs on Railway platform.
