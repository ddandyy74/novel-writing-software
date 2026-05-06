# 网文作者码字软件后端服务

## 项目概述

网文作者码字软件后端 API 服务，提供用户认证、稿件管理、云端同步、多平台发布等功能。

## 技术栈

- **运行时**: Node.js 18+
- **框架**: Fastify 4.x
- **语言**: TypeScript 5.x
- **数据库**: PostgreSQL 15+
- **ORM**: Prisma 5.x
- **缓存**: Redis 7+
- **认证**: JWT
- **验证**: Zod
- **日志**: Pino

## 项目结构

```
src/backend/
├── src/
│   ├── controllers/    # 控制器（处理 HTTP 请求）
│   ├── services/       # 业务逻辑
│   ├── models/         # 数据模型（Prisma）
│   ├── routes/         # 路由定义
│   ├── middleware/     # 中间件（认证、验证、限流等）
│   ├── utils/          # 工具函数
│   ├── config/         # 配置文件
│   ├── types/          # TypeScript 类型定义
│   └── index.ts        # 应用入口
├── prisma/
│   └── schema.prisma   # 数据库 Schema
├── tests/              # 测试文件
├── package.json
└── tsconfig.json
```

## 快速开始

### 1. 安装依赖

```bash
cd src/backend
npm install
```

### 2. 配置环境变量

复制环境变量示例文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库、Redis 等信息：

```env
# 数据库
DATABASE_URL="postgresql://user:password@localhost:5432/novel_writer_db"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
```

### 3. 初始化数据库

```bash
# 生成 Prisma Client
npm run prisma:generate

# 运行数据库迁移
npm run prisma:migrate

# (可选) 打开 Prisma Studio 查看数据
npm run prisma:studio
```

### 4. 启动服务

```bash
# 开发模式（热重载）
npm run dev

# 生产模式
npm run build
npm start
```

服务启动后访问：
- API: http://localhost:3000/api/v1
- 文档: http://localhost:3000/docs
- 健康检查: http://localhost:3000/api/v1/health

## 核心 API

### 认证

- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/refresh` - 刷新 Token
- `POST /api/v1/auth/logout` - 登出

### 用户

- `GET /api/v1/users/me` - 获取当前用户信息
- `PUT /api/v1/users/me/settings` - 更新用户设置

### 作品

- `GET /api/v1/works` - 获取作品列表
- `POST /api/v1/works` - 创建作品
- `GET /api/v1/works/:id` - 获取作品详情
- `PUT /api/v1/works/:id` - 更新作品
- `DELETE /api/v1/works/:id` - 删除作品

### 章节

- `GET /api/v1/works/:workId/chapters` - 获取章节列表
- `POST /api/v1/works/:workId/chapters` - 创建章节
- `GET /api/v1/works/chapters/:id` - 获取章节详情
- `PUT /api/v1/works/chapters/:id` - 更新章节
- `DELETE /api/v1/works/chapters/:id` - 删除章节
- `PUT /api/v1/works/:workId/chapters/reorder` - 章节排序

### 同步

- `POST /api/v1/sync/push` - 推送本地变更
- `POST /api/v1/sync/pull` - 拉取云端变更

## 数据库设计

### 核心表

| 表名 | 描述 |
|------|------|
| users | 用户信息 |
| works | 作品信息 |
| chapters | 章节信息 |
| characters | 角色信息 |
| outlines | 大纲信息 |
| writing_goals | 写作目标 |
| writing_records | 写作记录 |
| platform_accounts | 平台账号 |
| sync_logs | 同步日志 |
| security_logs | 安全日志 |

详细设计见：`docs/architecture/database-design.md`

## 安全措施

- ✅ 密码 bcrypt 加密
- ✅ JWT Token 认证
- ✅ API 限流保护
- ✅ 请求参数验证
- ✅ SQL 注入防护（Prisma ORM）
- ✅ XSS 防护
- ✅ HTTPS 支持
- ✅ 安全响应头（Helmet）

详细设计见：`docs/architecture/security-design.md`

## 开发指南

### 代码规范

```bash
# 代码格式化
npm run format

# 代码检查
npm run lint
```

### 测试

```bash
# 运行测试
npm test

# 测试覆盖率
npm run test:coverage
```

### 数据库操作

```bash
# 创建迁移
npx prisma migrate dev --name description

# 重置数据库
npx prisma migrate reset

# 生成客户端
npx prisma generate
```

## 环境变量说明

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| NODE_ENV | 运行环境 | development |
| PORT | 服务端口 | 3000 |
| DATABASE_URL | 数据库连接字符串 | - |
| REDIS_HOST | Redis 主机 | localhost |
| REDIS_PORT | Redis 端口 | 6379 |
| JWT_SECRET | JWT 密钥 | - |
| JWT_EXPIRES_IN | Token 过期时间 | 1h |
| RATE_LIMIT_MAX | 限流最大请求数 | 100 |
| LOG_LEVEL | 日志级别 | info |

## 部署

### Docker 部署

```bash
# 构建镜像
docker build -t novel-writer-backend .

# 运行容器
docker run -p 3000:3000 novel-writer-backend
```

### PM2 部署

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start dist/index.js --name novel-writer-backend

# 查看状态
pm2 status

# 查看日志
pm2 logs novel-writer-backend
```

## 监控与日志

- 使用 Pino 记录结构化日志
- 日志级别：trace, debug, info, warn, error, fatal
- 开发环境使用 pino-pretty 美化输出

## 常见问题

### 1. 数据库连接失败

检查 PostgreSQL 服务是否运行：
```bash
sudo systemctl status postgresql
```

检查 `.env` 中的 `DATABASE_URL` 配置是否正确。

### 2. Redis 连接失败

检查 Redis 服务是否运行：
```bash
redis-cli ping
```

### 3. 端口被占用

修改 `.env` 中的 `PORT` 为其他端口。

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

项目维护者：Backend Architect

---

**更新日期**: 2026-05-07
