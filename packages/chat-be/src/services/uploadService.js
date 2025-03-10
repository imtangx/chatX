import { pool } from '../database/databaseServer.js';
import { StatusCodes } from 'http-status-codes';

export const uploadAvatar = async (req, res) => {
  try {
    const { username } = req.query;
    // 检查文件是否上传成功
    if (!req.file) {
      return res.status(400).json({ message: '没有上传文件' });
    }

    // 获取上传的文件信息
    console.log(req.file, username);

    const realPath = `${process.env.API_URL}/uploads/${req.file.filename}`;

    // 将文件信息保存到数据库中
    const [result] = await pool.execute('UPDATE users SET avatar = ? WHERE username = ?', [realPath, username]);

    // 返回上传成功的响应
    res.status(200).json({
      message: '文件上传成功',
      filename: realPath,
    });
  } catch (err) {
    console.error('文件上传错误:', err);
    res.status(500).json({ message: '文件上传失败' });
  }
};
