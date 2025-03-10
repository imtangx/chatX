import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { uploadAvatar } from '../services/uploadService.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: 'src/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const router = express.Router();
router.post('/avatar', upload.single('avatar'), uploadAvatar);

export default router;
