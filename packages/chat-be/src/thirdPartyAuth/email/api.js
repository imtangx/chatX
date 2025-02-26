import nodemailer from 'nodemailer';
import { EMAIL_TEMPLATES } from './constant.js';

export class EmailApiService {
  constructor(config) {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.port === 465, // SSL
      auth: {
        user: this.config.user,
        pass: this.config.authCode,
      },
    });
  }

  /**
   * 发送验证码邮件
   * @param to 目标邮箱
   * @param code 验证码
   * @returns 是否发送成功
   */

  async sendVerifyCode(to, code) {
    try {
      await this.transporter.sendMail({
        from: this.config.from,
        to,
        subject: EMAIL_TEMPLATES.VERIFY_CODE.subject,
        html: EMAIL_TEMPLATES.VERIFY_CODE.html(code),
      });
      return true;
    } catch (error) {
      console.error('发送验证码失败', error);
      return false;
    }
  }
}
