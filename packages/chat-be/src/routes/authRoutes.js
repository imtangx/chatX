import express from 'express';
import { sendCode, verifyCode, login, register, refreshToken } from '../services/authService.js';

const router = express.Router();

router.post('/email/code', sendCode);
router.post('/email/verify', verifyCode);
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

export default router;
