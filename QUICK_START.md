# ⚡ Quick Start Guide

Get your improved chat app running in 5 minutes!

---

## 1️⃣ Backend Setup (2 minutes)

### Install & Configure
```bash
cd ChatAppV1

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Edit `.env` with your values:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Start Backend
```bash
npm run server
```

**Expected Output:**
```
🚀 Server is running on port 5000
📱 Socket.IO is connected and listening for events
Connected to MongoDB successfully!
```

---

## 2️⃣ Frontend Setup (2 minutes)

### Install & Configure
```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Edit `frontend/.env`:
```env
VITE_SERVER_URL=http://localhost:5000
```

### Start Frontend
```bash
npm run dev
```

**Expected Output:**
```
  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

---

## 3️⃣ Test the App (1 minute)

1. Open `http://localhost:3000` in your browser
2. Sign up with test account
3. Open another browser tab/window (private window works too)
4. Sign up with different account
5. Send message from first account
6. ✅ Should see message instantly in second account

---

## 🎯 Check Socket.IO Connection

### In Browser DevTools:

1. Open **Developer Tools** (F12)
2. Go to **Network** tab
3. Filter by **socket.io**
4. Should see WebSocket connection
5. Check **Messages** tab - should see `getOnlineUsers` event with user IDs

---

## 🟢 Show Online Status

To display green dot for online users:

**Edit:** `frontend/src/components/sidebar/Conversation.jsx`

Add after the user avatar:
```jsx
{isOnline && (
  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
)}
```

Import at top:
```jsx
import { useSocketContext } from "../../context/SocketContext";

// Inside component:
const { onlineUsers } = useSocketContext();
const isOnline = onlineUsers.includes(conversation._id);
```

---

## 🚀 Ready to Deploy?

See `DEPLOYMENT_GUIDE.md` for production setup with Render.com

---

## ❓ Troubleshooting

### Messages not sending:
- [ ] Check backend is running
- [ ] Check frontend .env has correct backend URL
- [ ] Look for errors in browser console (F12)

### Socket.IO not connecting:
- [ ] Check Network tab in DevTools
- [ ] Verify VITE_SERVER_URL in .env
- [ ] Restart frontend server

### Can't see online status:
- [ ] Check Socket.IO connection works
- [ ] Verify `onlineUsers` array in browser console
- [ ] Check component is using `useSocketContext`

---

## 📚 Full Documentation

- **[README.md](./README.md)** - Complete project guide
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Production deployment
- **[FRONTEND_IMPLEMENTATION.md](./FRONTEND_IMPLEMENTATION.md)** - Feature details
- **[CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md)** - What was improved

---

## 🆘 Still Having Issues?

1. Check console logs (F12 in browser, terminal for backend)
2. Verify all environment variables are set
3. Make sure MongoDB is accessible
4. Restart both backend and frontend
5. Check the documentation files above

---

**You're all set! Happy chatting! 🎉**
