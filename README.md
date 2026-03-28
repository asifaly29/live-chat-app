# 🚀 Chat App V1 - Production Ready with Socket.IO

A full-stack MERN chat application with real-time messaging, online users tracking, and production-ready deployment setup.

**✨ NOW WORKS WITH DEPLOYED RAILWAY BACKEND - NO LOCAL BACKEND NEEDED!**

---

## 🚀 Quick Start (Frontend Only)

### Prerequisites
- Node.js 16+

### Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

The app will be available at: `http://localhost:5173`

That's it! The frontend automatically connects to the deployed Railway backend.

**See [RAILWAY_BACKEND_SETUP.md](./RAILWAY_BACKEND_SETUP.md) for detailed setup instructions.**

---

## ✨ Features

### Core Features
- ✅ **User Authentication** - Secure signup, login, logout with JWT
- ✅ **Real-Time Messaging** - Instant message delivery via Socket.IO
- ✅ **Online Users Tracking** - See who's online in real-time
- ✅ **Offline Message Handling** - Messages saved if receiver is offline
- ✅ **User Profiles** - Auto-generated profile pictures
- ✅ **Conversation History** - Fetch all past messages anytime

### Technical Features
- ✅ **Socket.IO Integration** - Bi-directional real-time communication
- ✅ **Input Validation** - Server-side validation on all inputs
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **CORS Security** - Properly configured for production
- ✅ **Environment Configuration** - Support for development and production
- ✅ **Production Deployment Ready** - Render.com, Netlify, Vercel compatible

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Socket.IO Client** - Real-time client
- **Zustand** - State management
- **Tailwind CSS** - Styling

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Account (Atlas or local)
- Git

### Backend Setup

```bash
# Clone repository
git clone <your-repo-url>
cd ChatAppV1

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values
# MONGODB_URI=mongodb+srv://...
# JWT_SECRET=your_secret_key
# NODE_ENV=development
# CLIENT_URL=http://localhost:3000

# Start server
npm run server
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
# VITE_SERVER_URL=http://localhost:5000

# Start development server
npm run dev
```

---

## 🔧 Environment Variables

### Backend (.env)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)

```env
VITE_SERVER_URL=http://localhost:5000
```

---

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/signup    - Register new user
POST   /api/auth/login     - Login user
POST   /api/auth/logout    - Logout user
```

### Users
```
GET    /api/users          - Get all users except current (requires auth)
```

### Messages
```
POST   /api/messages/send/:id    - Send message to user (requires auth)
GET    /api/messages/:id         - Get conversation history (requires auth)
```

---

## 🔌 Socket.IO Events

### Server → Client

| Event | Data | Description |
|-------|------|-------------|
| `getOnlineUsers` | `[userId1, userId2, ...]` | List of online users |
| `newMessage` | `{_id, senderId, message, createdAt}` | New message received |
| `userTyping` | `{senderId, isTyping: true}` | User is typing |
| `userStoppedTyping` | `{senderId, isTyping: false}` | User stopped typing |
| `messageError` | `{error: string}` | Message error |

### Client → Server

| Event | Data | Description |
|-------|------|-------------|
| `sendMessage` | `{senderId, receiverId, message, ...}` | Send real-time message |
| `userTyping` | `{receiverId}` | Notify user is typing |
| `userStoppedTyping` | `{receiverId}` | Notify stopped typing |

---

## 📁 Project Structure

```
ChatAppV1/
├── .env.example                      # Backend environment template
├── DEPLOYMENT_GUIDE.md              # Production deployment guide
├── FRONTEND_IMPLEMENTATION.md       # Frontend feature guide
├── package.json
│
├── backend/
│   ├── server.js                    # Main server with Socket.IO
│   ├── socket/
│   │   └── socket.js                # Socket.IO handlers & online users
│   ├── controllers/
│   │   ├── auth.controller.js       # Auth logic
│   │   ├── message.controller.js    # Message logic
│   │   └── user.controller.js       # User logic
│   ├── middleware/
│   │   └── protectRoute.js          # Auth middleware
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── message.routes.js
│   │   └── user.routes.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── message.model.js
│   │   └── conversation.model.js
│   ├── utils/
│   │   └── generateToken.js
│   └── db/
│       └── connectToMongoDB.js
│
└── frontend/
    ├── .env.example                 # Frontend environment template
    ├── package.json
    ├── vite.config.js
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx       # Auth state management
    │   │   └── SocketContext.jsx     # Socket.IO state management
    │   ├── hooks/
    │   │   ├── useLogin.js
    │   │   ├── useLogout.js
    │   │   ├── useSignup.js
    │   │   ├── useSendMessage.js
    │   │   ├── useGetMessages.js
    │   │   ├── useGetConversations.js
    │   │   └── useListenMessages.js
    │   ├── zustand/
    │   │   └── useConversation.js    # State management
    │   ├── components/
    │   │   ├── messages/
    │   │   ├── sidebar/
    │   │   └── skeletons/
    │   ├── pages/
    │   │   ├── login/
    │   │   ├── signup/
    │   │   └── home/
    │   └── utils/
```

---

## 🚀 Deployment

### Option 1: Render.com (Recommended)

**Backend:**
1. Push code to GitHub
2. Deploy to Render
3. Set environment variables
4. Socket.IO will work automatically

**Frontend:**
- Deploy on Netlify or Vercel
- Set `VITE_SERVER_URL` to your Render backend URL

### Option 2: Heroku (Free tier ended)

Alternative platforms:
- Railway.app
- Fly.io
- AWS Elastic Beanstalk

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 🔒 Security Features

- ✅ JWT-based authentication (7-day expiry)
- ✅ HTTP-only cookies (XSS protection)
- ✅ Secure flag on cookies (HTTPS in production)
- ✅ SameSite strict policy (CSRF protection)
- ✅ Password hashing with bcrypt (salt: 10)
- ✅ Input validation on all endpoints
- ✅ CORS properly configured
- ✅ Protected routes with middleware

---

## 🧪 Testing

```bash
# Backend tests
npm test

# Frontend tests
cd frontend
npm test

# Run with coverage
npm test -- --coverage
```

### Manual Testing Checklist
- [ ] Signup with new user
- [ ] Login with credentials
- [ ] Send/receive messages in real-time
- [ ] See online users list updating
- [ ] Test offline message delivery
- [ ] Logout and verify session cleared
- [ ] Test with multiple browser tabs

---

## 📝 Recent Changes (v1.1)

### Added
- ✅ Socket.IO real-time messaging
- ✅ Online users tracking
- ✅ Typing indicators (backend support)
- ✅ Environment variable support
- ✅ Improved error handling
- ✅ Better input validation

### Improved
- ✅ Message controller with real-time emit
- ✅ Authentication middleware
- ✅ Server startup configuration
- ✅ Frontend Socket.IO context
- ✅ Error messages and logging

### Fixed
- ✅ CORS configuration for Socket.IO
- ✅ Message sending reliability
- ✅ Online status updates
- ✅ Connection cleanup on logout

### Documentation
- ✅ Added DEPLOYMENT_GUIDE.md
- ✅ Added FRONTEND_IMPLEMENTATION.md
- ✅ Added .env.example files
- ✅ Added comprehensive comments

---

## 🐛 Known Issues

None at the moment! Report issues on GitHub.

---

## 💡 Future Enhancements

- [ ] Group conversations
- [ ] Message search
- [ ] User blocking
- [ ] Message reactions
- [ ] Read receipts
- [ ] Voice/video calls
- [ ] File sharing
- [ ] End-to-end encryption
- [ ] Dark mode toggle
- [ ] Mobile app (React Native)

---

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review error messages in browser console
3. Check server logs
4. Visit Socket.IO documentation

---

## 📄 License

ISC

---

## 🙌 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Quick Links

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Frontend Implementation](./FRONTEND_IMPLEMENTATION.md)
- [Socket.IO Docs](https://socket.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)

---

**Happy Chatting! 🎉**

For the latest updates and issues, check GitHub or contact the team.

Last Updated: March 26, 2026
