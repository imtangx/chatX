import express from 'express';
import { toGithub, callbackGithub, tempGoogle, toGoogle, callbackGoogle, sendCode, verifyCode, login, register, refreshToken } from '../services/authService.js';

const router = express.Router();

router.get('/github', toGithub);
router.get('/github/callback', callbackGithub);
router.get('/google', toGoogle);
router.get('/google/temp', tempGoogle);
router.get('/google/callback', callbackGoogle);
router.post('/email/code', sendCode);
router.post('/email/verify', verifyCode);
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

export default router;
