import express from 'express';
import { getFriends, getDialogs, getFriendRequests, sendFriendRequests, updateFriendRequestStatus } from '../services/friendService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getFriends);
router.get('/dialogs', authMiddleware, getDialogs);
router.get('/requests', authMiddleware, getFriendRequests);
router.post('/requests', authMiddleware, sendFriendRequests);
router.patch('/requests/:requestId', authMiddleware, updateFriendRequestStatus);

export default router;
