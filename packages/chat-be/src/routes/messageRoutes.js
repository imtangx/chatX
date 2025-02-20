import express from 'express';
import { getMessages } from '../services/messageService.js';

const router = express.Router();

router.get('/', getMessages);

export default router;
