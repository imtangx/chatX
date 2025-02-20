import express from 'express';
import { getFriends, getFriendRequests, sendFriendRequests, updateFriendRequestStatus } from '../services/friendService.js';

const router = express.Router();

router.get('/:userId', getFriends);
router.get('/requests/:userId', getFriendRequests);
router.post('/requests/:userId', sendFriendRequests);
router.patch('/requests/:requestId', updateFriendRequestStatus);

export default router;
