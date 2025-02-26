export const VERIFY_CODE = {
  LENGTH: 6,
  EXPIRE_TIME: 1000 * 60 * 10, // 10分钟
  MAX_ATTEMPTS: 5, // 最大尝试次数
  MAX_RETRY_TIME: 1000 * 60 * 1, // 重发间隔 1分钟
};

/**
 * 邮箱模板
 */
export const EMAIL_TEMPLATES = {
  VERIFY_CODE: {
    subject: '[chatX] 登录验证码',
    html: (code) => `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>登录验证码</h2>
      <p>您的验证码是：<strong style="font-size: 20px; color: #1a73e8;">${code}</strong></p>
      <p>该验证码将在10分钟后过期，请尽快使用。</p>
      <p>如果这不是您的操作，请忽略此邮件。</p>
      <hr>
      <p style="color: #666;">此致</p>
      <p style="color: #666;">chatX团队</p>
    </div>
  `,
  },
};
