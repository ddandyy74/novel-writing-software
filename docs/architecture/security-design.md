# 网文作者码字软件安全架构设计文档

**版本**: v1.0  
**日期**: 2026-05-06  
**架构师**: 安全工程师

---

## 1. 安全概述

### 1.1 安全目标

| 目标 | 描述 |
|------|------|
| **数据安全** | 用户稿件数据不丢失、不泄露、不被篡改 |
| **账户安全** | 用户账户不被盗用、冒用 |
| **传输安全** | 数据传输全程加密 |
| **隐私保护** | 用户隐私数据得到保护 |

### 1.2 安全威胁模型

| 威胁类型 | 威胁描述 | 风险等级 |
|---------|---------|----------|
| **数据泄露** | 用户稿件被未授权访问 | 高 |
| **数据丢失** | 本地/云端数据丢失 | 高 |
| **账户盗用** | 用户账户被盗用 | 中 |
| **中间人攻击** | 传输数据被窃听或篡改 | 中 |
| **恶意软件** | 客户端被恶意软件感染 | 低 |
| **社会工程** | 用户被钓鱼攻击 | 低 |

---

## 2. 数据安全架构

### 2.1 数据分类

| 数据类型 | 敏感级别 | 存储位置 | 加密要求 |
|---------|---------|---------|----------|
| 用户密码 | 最高 | 云端（bcrypt） | 单向哈希 |
| 用户稿件 | 高 | 本地 + 云端 | 整库加密 + HTTPS |
| 用户信息 | 中 | 云端 | HTTPS |
| 用户配置 | 低 | 本地 + 云端 | HTTPS |

### 2.2 本地数据安全

#### 数据库加密

```
SQLite + SQLCipher 整库加密:

┌─────────────────────────────────┐
│  SQLite 数据库                   │
│  ┌────────────────────────────┐ │
│  │  SQLCipher 加密层           │ │
│  │  - 算法: AES-256-CBC       │ │
│  │  - 密钥: 用户主密钥派生     │ │
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │  数据文件                   │ │
│  │  novel-writer.db (加密)    │ │
│  └────────────────────────────┘ │
└─────────────────────────────────┘
```

**实现方案**:

```javascript
// 密钥派生
const crypto = require('crypto');

function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(
    password,
    salt,
    100000,  // 迭代次数
    32,      // 密钥长度
    'sha256' // 哈希算法
  );
}

// SQLCipher 加密
const Database = require('better-sqlite3');
const db = new Database('novel-writer.db');

// 用户首次使用时设置加密密钥
const masterKey = deriveKey(userPassword, userSalt);
db.pragma(`key = "x'${masterKey.toString('hex')}'"`);
```

#### 敏感字段加密

```javascript
// AES-256-GCM 加密
function encryptField(plaintext, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    iv: iv.toString('hex'),
    encrypted: encrypted,
    authTag: authTag.toString('hex')
  };
}

// 解密
function decryptField(encryptedData, key) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(encryptedData.iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### 2.3 云端数据安全

#### 数据库安全

```
PostgreSQL 安全措施:

1. 访问控制
   - 使用专用数据库用户（最小权限原则）
   - 禁用 root 用户远程登录
   - 使用 SSL 连接

2. 数据加密
   - 传输加密: SSL/TLS
   - 敏感字段加密: pgcrypto 扩展
   - 备份加密: AES-256

3. 审计日志
   - 启用 PostgreSQL 审计日志
   - 记录所有数据访问操作
```

#### 对象存储安全

```
对象存储安全措施:

1. 访问控制
   - 使用临时凭证 (STS)
   - 设置存储桶访问策略
   - 启用 MFA 删除保护

2. 数据加密
   - 服务端加密 (SSE-S3/SSE-KMS)
   - 客户端加密 (可选)

3. 版本控制
   - 启用版本控制
   - 防止误删除和覆盖
```

---

## 3. 传输安全架构

### 3.1 HTTPS 配置

```
TLS 1.3 配置:

- 协议: TLS 1.3 (最低 TLS 1.2)
- 加密套件:
  - TLS_AES_256_GCM_SHA384
  - TLS_CHACHA20_POLY1305_SHA256
  - TLS_AES_128_GCM_SHA256
- 证书: Let's Encrypt / 商业证书
- HSTS: 启用 Strict-Transport-Security
```

**Nginx 配置示例**:

```nginx
server {
    listen 443 ssl http2;
    server_name api.novel-writer.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256;
    ssl_prefer_server_ciphers on;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # 其他安全头
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 3.2 API 安全

#### 请求签名

```javascript
// API 请求签名
function signRequest(method, path, timestamp, body, secretKey) {
  const payload = `${method}\n${path}\n${timestamp}\n${body || ''}`;
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(payload)
    .digest('hex');
  
  return signature;
}

// 请求示例
const timestamp = Date.now().toString();
const signature = signRequest(
  'POST',
  '/api/v1/works',
  timestamp,
  JSON.stringify(requestBody),
  userSecretKey
);

// 请求头
{
  'X-Timestamp': timestamp,
  'X-Signature': signature
}
```

#### 防重放攻击

```javascript
// Redis 存储已使用的 nonce
async function checkNonce(nonce, timestamp) {
  const key = `nonce:${nonce}`;
  
  // 检查时间戳（5 分钟内有效）
  if (Math.abs(Date.now() - timestamp) > 5 * 60 * 1000) {
    return false;
  }
  
  // 检查 nonce 是否已使用
  const exists = await redis.exists(key);
  if (exists) {
    return false;
  }
  
  // 标记 nonce 为已使用（过期时间 10 分钟）
  await redis.setex(key, 600, '1');
  return true;
}
```

---

## 4. 认证与授权

### 4.1 认证方案

#### JWT Token 认证

```
认证流程:

1. 用户登录
   ├───► 验证邮箱密码
   ├───► 生成 Access Token (1 小时)
   └───► 生成 Refresh Token (7 天)

2. API 请求
   ├───► 携带 Access Token
   └───► 服务端验证 Token

3. Token 刷新
   ├───► Access Token 过期
   ├───► 使用 Refresh Token 换取新 Token
   └───► Refresh Token 过期则重新登录
```

**JWT Token 结构**:

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_123",
    "email": "user@example.com",
    "role": "author",
    "iat": 1715011200,
    "exp": 1715014800
  },
  "signature": "xxx"
}
```

**Token 安全措施**:

```javascript
// Token 生成
const jwt = require('jsonwebtoken');

function generateTokens(userId, email) {
  const accessToken = jwt.sign(
    { sub: userId, email, role: 'author' },
    privateKey,
    { 
      algorithm: 'RS256',
      expiresIn: '1h',
      issuer: 'novel-writer',
      audience: 'novel-writer-client'
    }
  );
  
  const refreshToken = jwt.sign(
    { sub: userId, type: 'refresh' },
    refreshTokenSecret,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
}

// Token 验证
function verifyToken(token) {
  try {
    return jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: 'novel-writer',
      audience: 'novel-writer-client'
    });
  } catch (err) {
    return null;
  }
}
```

### 4.2 授权方案

#### RBAC (基于角色的访问控制)

```
角色定义:

1. user: 普通用户
   - 创建作品
   - 编辑自己的作品
   - 使用基础 AI 功能

2. author: 签约作者
   - user 的所有权限
   - 多平台发布
   - 高级 AI 功能

3. admin: 管理员
   - author 的所有权限
   - 用户管理
   - 系统配置
```

**权限检查**:

```javascript
// 权限中间件
function requirePermission(permission) {
  return (req, res, next) => {
    const user = req.user;
    
    // 检查用户角色权限
    if (!hasPermission(user.role, permission)) {
      return res.status(403).json({
        code: 20002,
        message: '权限不足'
      });
    }
    
    next();
  };
}

// 权限定义
const permissions = {
  user: ['work:create', 'work:edit', 'ai:basic'],
  author: ['work:create', 'work:edit', 'ai:basic', 'ai:advanced', 'publish'],
  admin: ['*']
};
```

---

## 5. 输入验证

### 5.1 客户端验证

```javascript
// 输入验证规则
const validationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 255
  },
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true
  },
  title: {
    minLength: 1,
    maxLength: 100
  },
  content: {
    maxLength: 1000000  // 100 万字
  }
};

// 验证函数
function validateInput(value, rules) {
  const errors = [];
  
  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`最小长度 ${rules.minLength}`);
  }
  
  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`最大长度 ${rules.maxLength}`);
  }
  
  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push('格式不正确');
  }
  
  return errors;
}
```

### 5.2 服务端验证

```javascript
// 使用 Joi 进行验证
const Joi = require('joi');

const chapterSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  content: Joi.string().max(1000000).required(),
  order: Joi.number().integer().min(1).required()
});

// 验证中间件
function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        code: 90002,
        message: '参数错误',
        error: error.details[0].message
      });
    }
    
    next();
  };
}

// 使用
app.post('/chapters', validate(chapterSchema), createChapter);
```

### 5.3 XSS 防护

```javascript
// 使用 DOMPurify 清理 HTML
const DOMPurify = require('dompurify');

function sanitizeHtml(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'p', 'br'],
    ALLOWED_ATTR: []
  });
}

// 内容转义
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
```

---

## 6. SQL 注入防护

### 6.1 参数化查询

```javascript
// 使用参数化查询（正确方式）
const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
const user = stmt.get(email);

// 错误方式（易受 SQL 注入）
const user = db.exec(`SELECT * FROM users WHERE email = '${email}'`);
```

### 6.2 ORM 使用

```javascript
// 使用 Prisma ORM
const user = await prisma.user.findUnique({
  where: { email }
});

// Prisma 自动处理参数化查询
```

---

## 7. API 限流

### 7.1 限流策略

```javascript
// 使用 Redis 实现令牌桶限流
const Redis = require('ioredis');
const redis = new Redis();

async function rateLimit(userId, limit, window) {
  const key = `rate-limit:${userId}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, window);
  }
  
  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
    resetAt: Date.now() + window * 1000
  };
}

// 限流中间件
function rateLimitMiddleware(limit, window) {
  return async (req, res, next) => {
    const userId = req.user?.id || req.ip;
    const result = await rateLimit(userId, limit, window);
    
    if (!result.allowed) {
      return res.status(429).json({
        code: 90003,
        message: '请求频率超限',
        data: {
          retryAfter: result.resetAt - Date.now()
        }
      });
    }
    
    res.set('X-RateLimit-Remaining', result.remaining);
    next();
  };
}
```

### 7.2 限流配置

| API 类型 | 限流策略 | Redis Key |
|---------|---------|-----------|
| 普通接口 | 100 次/分钟 | `rate-limit:user:{userId}` |
| AI 接口 | 10 次/分钟 | `rate-limit:ai:{userId}` |
| 登录接口 | 5 次/分钟 | `rate-limit:login:{ip}` |

---

## 8. 日志与审计

### 8.1 安全日志

```javascript
// 安全事件日志
const securityEvents = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  TOKEN_REFRESH: 'token_refresh',
  PASSWORD_CHANGE: 'password_change',
  PERMISSION_DENIED: 'permission_denied',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity'
};

async function logSecurityEvent(event, userId, details) {
  await prisma.securityLog.create({
    data: {
      event,
      userId,
      ipAddress: details.ip,
      userAgent: details.userAgent,
      details: JSON.stringify(details),
      createdAt: new Date()
    }
  });
}
```

### 8.2 异常检测

```javascript
// 异常登录检测
async function detectAnomalousLogin(userId, ipAddress) {
  // 检查异地登录
  const lastLogin = await prisma.securityLog.findFirst({
    where: { userId, event: 'login_success' },
    orderBy: { createdAt: 'desc' }
  });
  
  if (lastLogin && lastLogin.ipAddress !== ipAddress) {
    // 发送异地登录提醒
    await sendSecurityAlert(userId, '异地登录检测', {
      lastIp: lastLogin.ipAddress,
      currentIp: ipAddress
    });
  }
  
  // 检查失败次数
  const failedCount = await prisma.securityLog.count({
    where: {
      userId,
      event: 'login_failed',
      createdAt: { gte: new Date(Date.now() - 3600000) }  // 1 小时内
    }
  });
  
  if (failedCount >= 5) {
    // 账户暂时锁定
    await lockAccount(userId, 30 * 60);  // 锁定 30 分钟
  }
}
```

---

## 9. 隐私保护

### 9.1 数据脱敏

```javascript
// 敏感数据脱敏
function maskEmail(email) {
  const [name, domain] = email.split('@');
  const maskedName = name.charAt(0) + '***' + name.charAt(name.length - 1);
  return `${maskedName}@${domain}`;
}

function maskPhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}
```

### 9.2 GDPR 合规

```
GDPR 合规措施:

1. 用户同意
   - 明确告知数据收集目的
   - 获得用户明确同意
   - 允许用户随时撤回同意

2. 数据访问权
   - 提供数据导出功能
   - 提供数据查看功能

3. 数据删除权
   - 提供账户删除功能
   - 删除后彻底清除数据

4. 数据可携带权
   - 支持标准格式导出
   - 支持数据迁移
```

---

## 10. 安全检查清单

### 10.1 开发阶段

- [ ] 所有用户输入进行验证
- [ ] 使用参数化查询防止 SQL 注入
- [ ] 对输出进行编码防止 XSS
- [ ] 使用 HTTPS 传输数据
- [ ] 敏感数据加密存储
- [ ] 实现适当的访问控制
- [ ] 添加日志和审计

### 10.2 部署阶段

- [ ] 配置 HTTPS 证书
- [ ] 设置安全响应头
- [ ] 配置防火墙规则
- [ ] 启用数据库加密
- [ ] 配置备份和恢复
- [ ] 设置监控和告警

### 10.3 运维阶段

- [ ] 定期更新依赖库
- [ ] 定期进行安全审计
- [ ] 监控异常行为
- [ ] 及时修复安全漏洞
- [ ] 定期备份数据
- [ ] 进行渗透测试

---

## 11. 下一步

1. ✅ 安全架构设计完成
2. ⏳ AI 技术方案（ai-solution.md）

---

**文档状态**: 初稿完成  
**下一步**: AI 技术方案
