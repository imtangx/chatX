# ChatX - 轻量级聊天应用

ChatX 是一个基于 React + TypeScript + Zustand + Node.js 构建的聊天应用。

## 主要功能

- 🔐 用户认证
  - ✅ 账号密码登录
  - ✅ 邮箱验证码登录
  - ✅ Github登录
  - ✅ JWT token 认证

- 👥 好友系统
  - ✅ 好友列表
  - ✅ 发送好友请求
  - ✅ 处理好友请求(同意/拒绝)

- 💬 即时通讯
  - ✅ 私聊功能
  - ❌ 在线状态显示
  - ✅ 消息历史记录

- 🌓 主题切换
  - ✅ 支持亮色/暗色主题
  - ✅ 主题状态本地持久化

## 技术栈

### 前端

- React + Vite：高性能的前端开发框架。
- TypeScript：提供类型安全，提高开发效率。
- Storybook：独立开发和测试组件，提高可维护性。
- React Router DOM：支持前端路由管理，并实现路由守卫。
- Ant Design & Ant Design Pro Components: 提供丰富的 UI 组件和布局。

### 后端

- Node.js: 构建高性能、可扩展的网络应用。
- MySQL: 作为数据库存储好友、消息的数据。

### 架构

- Monorepo + pnpm: 使用分模块化管理，高效地组织和管理多个模块或项目依赖。

## 开发环境设置

1. 克隆仓库

```bash
git clone git@github.com:imtangx/chatX.git
```

2. 安装依赖

```bash
# 安装前端依赖
cd packages/chat-fe
pnpm install

# 安装后端依赖
cd packages/chat-be
pnpm install
```

3. 启动开发服务器

```bash
# 启动前端开发服务器
cd packages/chat-fe
pnpm run start

# 启动后端服务器
cd packages/chat-be
pnpm run dev
```

4. 数据库配置

- 创建 MySQL 数据库 `chat_app_db`
- 配置数据库连接信息(users, friendships, messages)