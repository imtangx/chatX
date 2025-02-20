import express from 'express';
import { getMessages } from '../services/messageService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getMessages);

export default router;
