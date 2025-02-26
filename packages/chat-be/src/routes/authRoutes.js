import express from 'express';
import { toGithub, callbackGithub, sendCode, verifyCode, login, register, refreshToken } from '../services/authService.js';

const router = express.Router();

router.get('/github', toGithub);
router.get('/github/callback', callbackGithub);
router.post('/email/code', sendCode);
router.post('/email/verify', verifyCode);
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

export default router;
