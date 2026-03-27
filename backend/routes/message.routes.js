import express from 'express';
import {
	getMessages,
	sendMessage,
	getUnreadMessages,
	markMessagesAsSeen,
} from '../controllers/message.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/unread', protectRoute, getUnreadMessages);
router.put('/mark-seen/:senderId', protectRoute, markMessagesAsSeen);
router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage);

export default router;