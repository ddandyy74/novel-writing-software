# 网文作者码字软件 API 设计文档

**版本**: v1.0  
**日期**: 2026-05-06  
**架构师**: 后端架构设计

---

## 1. API 概述

### 1.1 API 设计原则

| 原则 | 描述 |
|------|------|
| **RESTful** | 遵循 REST 架构风格 |
| **版本化** | API 版本管理，向后兼容 |
| **统一响应** | 标准化的响应格式 |
| **错误处理** | 统一的错误码和错误信息 |
| **文档化** | 完整的 API 文档（OpenAPI 3.0） |

### 1.2 API 基础信息

| 项目 | 值 |
|------|-----|
| **Base URL** | `https://api.novel-writer.com/v1` |
| **协议** | HTTPS |
| **数据格式** | JSON |
| **字符编码** | UTF-8 |
| **认证方式** | JWT Token |

---

## 2. 统一响应格式

### 2.1 成功响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    // 响应数据
  },
  "timestamp": 1715011200000
}
```

### 2.2 错误响应

```json
{
  "code": 10001,
  "message": "参数错误",
  "error": {
    "field": "title",
    "reason": "标题不能为空"
  },
  "timestamp": 1715011200000
}
```

### 2.3 分页响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5
    }
  },
  "timestamp": 1715011200000
}
```

---

## 3. 认证与授权

### 3.1 认证方式

采用 **JWT (JSON Web Token)** 认证：

```
请求头:
Authorization: Bearer <access_token>
```

### 3.2 Token 结构

```json
{
  "userId": "user_123",
  "email": "user@example.com",
  "role": "author",
  "exp": 1715011200,
  "iat": 1715007600
}
```

### 3.3 Token 刷新

```
POST /auth/refresh
Request:
{
  "refreshToken": "xxx"
}

Response:
{
  "code": 0,
  "data": {
    "accessToken": "xxx",
    "refreshToken": "xxx",
    "expiresIn": 3600
  }
}
```

---

## 4. API 模块划分

### 4.1 模块列表

| 模块 | 路径前缀 | 描述 |
|------|----------|------|
| **认证** | `/auth` | 用户认证、Token 管理 |
| **用户** | `/users` | 用户信息、配置 |
| **作品** | `/works` | 作品管理 |
| **章节** | `/chapters` | 章节管理 |
| **角色** | `/characters` | 角色管理 |
| **大纲** | `/outlines` | 大纲管理 |
| **AI 服务** | `/ai` | AI 功能 |
| **发布** | `/publish` | 多平台发布 |
| **同步** | `/sync` | 数据同步 |

---

## 5. 核心 API 设计

### 5.1 认证 API

#### 用户注册

```
POST /auth/register

Request:
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "作者昵称"
}

Response:
{
  "code": 0,
  "data": {
    "userId": "user_123",
    "email": "user@example.com",
    "nickname": "作者昵称",
    "accessToken": "xxx",
    "refreshToken": "xxx"
  }
}
```

#### 用户登录

```
POST /auth/login

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "code": 0,
  "data": {
    "userId": "user_123",
    "email": "user@example.com",
    "nickname": "作者昵称",
    "accessToken": "xxx",
    "refreshToken": "xxx",
    "expiresIn": 3600
  }
}
```

#### 用户登出

```
POST /auth/logout

Headers:
Authorization: Bearer <token>

Response:
{
  "code": 0,
  "message": "登出成功"
}
```

---

### 5.2 用户 API

#### 获取用户信息

```
GET /users/me

Headers:
Authorization: Bearer <token>

Response:
{
  "code": 0,
  "data": {
    "userId": "user_123",
    "email": "user@example.com",
    "nickname": "作者昵称",
    "avatar": "https://xxx.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00Z",
    "settings": {
      "theme": "dark",
      "fontSize": 16,
      "dailyGoal": 2000
    },
    "stats": {
      "totalWords": 100000,
      "totalWorks": 3,
      "writingDays": 30
    }
  }
}
```

#### 更新用户配置

```
PUT /users/me/settings

Headers:
Authorization: Bearer <token>

Request:
{
  "theme": "dark",
  "fontSize": 18,
  "dailyGoal": 3000,
  "autoSave": true
}

Response:
{
  "code": 0,
  "data": {
    "theme": "dark",
    "fontSize": 18,
    "dailyGoal": 3000,
    "autoSave": true
  }
}
```

---

### 5.3 作品 API

#### 创建作品

```
POST /works

Headers:
Authorization: Bearer <token>

Request:
{
  "title": "我的小说",
  "genre": "玄幻",
  "description": "这是一个关于...",
  "tags": ["玄幻", "修仙"]
}

Response:
{
  "code": 0,
  "data": {
    "workId": "work_123",
    "title": "我的小说",
    "genre": "玄幻",
    "description": "这是一个关于...",
    "tags": ["玄幻", "修仙"],
    "status": "draft",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 获取作品列表

```
GET /works?page=1&pageSize=20

Headers:
Authorization: Bearer <token>

Response:
{
  "code": 0,
  "data": {
    "items": [
      {
        "workId": "work_123",
        "title": "我的小说",
        "genre": "玄幻",
        "status": "draft",
        "wordCount": 50000,
        "chapterCount": 20,
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

#### 获取作品详情

```
GET /works/:workId

Headers:
Authorization: Bearer <token>

Response:
{
  "code": 0,
  "data": {
    "workId": "work_123",
    "title": "我的小说",
    "genre": "玄幻",
    "description": "这是一个关于...",
    "tags": ["玄幻", "修仙"],
    "status": "draft",
    "wordCount": 50000,
    "chapterCount": 20,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 5.4 章节 API

#### 创建章节

```
POST /works/:workId/chapters

Headers:
Authorization: Bearer <token>

Request:
{
  "title": "第一章 开始",
  "content": "章节内容...",
  "order": 1
}

Response:
{
  "code": 0,
  "data": {
    "chapterId": "chapter_123",
    "workId": "work_123",
    "title": "第一章 开始",
    "content": "章节内容...",
    "wordCount": 3000,
    "order": 1,
    "status": "draft",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 获取章节列表

```
GET /works/:workId/chapters

Headers:
Authorization: Bearer <token>

Response:
{
  "code": 0,
  "data": {
    "items": [
      {
        "chapterId": "chapter_123",
        "title": "第一章 开始",
        "wordCount": 3000,
        "order": 1,
        "status": "draft",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### 获取章节详情

```
GET /chapters/:chapterId

Headers:
Authorization: Bearer <token>

Response:
{
  "code": 0,
  "data": {
    "chapterId": "chapter_123",
    "workId": "work_123",
    "title": "第一章 开始",
    "content": "章节内容...",
    "wordCount": 3000,
    "order": 1,
    "status": "draft",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 更新章节

```
PUT /chapters/:chapterId

Headers:
Authorization: Bearer <token>

Request:
{
  "title": "第一章 重新开始",
  "content": "更新后的内容...",
  "status": "published"
}

Response:
{
  "code": 0,
  "data": {
    "chapterId": "chapter_123",
    "title": "第一章 重新开始",
    "content": "更新后的内容...",
    "wordCount": 3500,
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 删除章节

```
DELETE /chapters/:chapterId

Headers:
Authorization: Bearer <token>

Response:
{
  "code": 0,
  "message": "删除成功"
}
```

#### 章节排序

```
PUT /works/:workId/chapters/reorder

Headers:
Authorization: Bearer <token>

Request:
{
  "orders": [
    { "chapterId": "chapter_1", "order": 2 },
    { "chapterId": "chapter_2", "order": 1 }
  ]
}

Response:
{
  "code": 0,
  "message": "排序成功"
}
```

---

### 5.5 角色 API

#### 创建角色

```
POST /works/:workId/characters

Headers:
Authorization: Bearer <token>

Request:
{
  "name": "张三",
  "age": 25,
  "gender": "male",
  "appearance": "身高180cm，黑发黑眼",
  "personality": "性格开朗，乐于助人",
  "background": "出身普通家庭，从小喜欢读书",
  "tags": ["主角", "男"]
}

Response:
{
  "code": 0,
  "data": {
    "characterId": "char_123",
    "workId": "work_123",
    "name": "张三",
    "age": 25,
    "gender": "male",
    "appearance": "身高180cm，黑发黑眼",
    "personality": "性格开朗，乐于助人",
    "background": "出身普通家庭，从小喜欢读书",
    "tags": ["主角", "男"],
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### 获取角色列表

```
GET /works/:workId/characters

Headers:
Authorization: Bearer <token>

Response:
{
  "code": 0,
  "data": {
    "items": [
      {
        "characterId": "char_123",
        "name": "张三",
        "age": 25,
        "tags": ["主角", "男"]
      }
    ]
  }
}
```

#### 更新角色关系

```
POST /works/:workId/characters/relations

Headers:
Authorization: Bearer <token>

Request:
{
  "characterId1": "char_123",
  "characterId2": "char_456",
  "relation": "friend",
  "description": "从小一起长大的好朋友"
}

Response:
{
  "code": 0,
  "data": {
    "relationId": "rel_123",
    "character1": { "id": "char_123", "name": "张三" },
    "character2": { "id": "char_456", "name": "李四" },
    "relation": "friend",
    "description": "从小一起长大的好朋友"
  }
}
```

---

### 5.6 大纲 API

#### 生成大纲

```
POST /ai/outlines/generate

Headers:
Authorization: Bearer <token>

Request:
{
  "chapterId": "chapter_123",
  "chapterContent": "章节内容...",
  "previousOutlines": [
    { "chapter": 1, "summary": "..." }
  ]
}

Response:
{
  "code": 0,
  "data": {
    "outlineId": "outline_123",
    "chapterId": "chapter_123",
    "chapter": 1,
    "title": "第一章 开始",
    "summary": "主角张三在家乡遇到了神秘老人...",
    "characters": ["张三", "神秘老人"],
    "events": [
      "张三在家乡闲逛",
      "遇到神秘老人",
      "老人给了张三一本书"
    ],
    "foreshadowing": ["神秘老人的身份", "书中的秘密"]
  }
}
```

---

### 5.7 AI 服务 API

#### 错别字检测

```
POST /ai/spell-check

Headers:
Authorization: Bearer <token>

Request:
{
  "content": "要检测的文本内容...",
  "options": {
    "checkType": ["错字", "别字", "语病", "标点"],
    "customDictionary": true
  }
}

Response:
{
  "code": 0,
  "data": {
    "errors": [
      {
        "position": 100,
        "original": "的",
        "suggestion": "得",
        "type": "别字",
        "reason": "此处应使用'得'作为补语标记"
      }
    ],
    "stats": {
      "totalErrors": 5,
      "byType": {
        "错字": 2,
        "别字": 2,
        "语病": 1
      }
    }
  }
}
```

#### AI 正文生成

```
POST /ai/content/generate

Headers:
Authorization: Bearer <token>

Request:
{
  "outline": {
    "chapter": 1,
    "title": "第一章 开始",
    "summary": "主角张三在家乡遇到了神秘老人...",
    "characters": ["张三", "神秘老人"]
  },
  "previousChapters": [
    { "chapterId": "chapter_prev", "content": "前文内容..." }
  ],
  "characters": [
    { "characterId": "char_123", "name": "张三", "personality": "开朗" }
  ],
  "options": {
    "style": "轻松",
    "length": 3000,
    "generateVersions": 3
  }
}

Response:
{
  "code": 0,
  "data": {
    "taskId": "task_123",
    "status": "generating",
    "estimatedTime": 30
  }
}
```

#### 查询生成任务

```
GET /ai/tasks/:taskId

Headers:
Authorization: Bearer <token>

Response:
{
  "code": 0,
  "data": {
    "taskId": "task_123",
    "status": "completed",
    "versions": [
      {
        "versionId": "v1",
        "content": "生成的版本1内容...",
        "wordCount": 3000
      },
      {
        "versionId": "v2",
        "content": "生成的版本2内容...",
        "wordCount": 3100
      }
    ]
  }
}
```

---

### 5.8 发布 API

#### 发布到平台

```
POST /publish

Headers:
Authorization: Bearer <token>

Request:
{
  "chapterId": "chapter_123",
  "platforms": ["qidian", "fanqie", "jinjiang"],
  "options": {
    "autoFormat": true,
    "publishTime": "2024-01-01T10:00:00Z"
  }
}

Response:
{
  "code": 0,
  "data": {
    "publishId": "pub_123",
    "chapterId": "chapter_123",
    "platforms": [
      {
        "platform": "qidian",
        "status": "success",
        "url": "https://xxx.com/chapter/123"
      },
      {
        "platform": "fanqie",
        "status": "pending",
        "message": "等待审核"
      }
    ]
  }
}
```

---

### 5.9 同步 API

#### 推送本地变更

```
POST /sync/push

Headers:
Authorization: Bearer <token>

Request:
{
  "clientId": "client_123",
  "lastSyncTime": "2024-01-01T00:00:00Z",
  "changes": [
    {
      "type": "chapter",
      "action": "update",
      "id": "chapter_123",
      "data": { "title": "新标题" },
      "timestamp": "2024-01-01T01:00:00Z",
      "version": 2
    }
  ]
}

Response:
{
  "code": 0,
  "data": {
    "syncTime": "2024-01-01T02:00:00Z",
    "conflicts": []
  }
}
```

#### 拉取云端变更

```
POST /sync/pull

Headers:
Authorization: Bearer <token>

Request:
{
  "clientId": "client_123",
  "lastSyncTime": "2024-01-01T00:00:00Z"
}

Response:
{
  "code": 0,
  "data": {
    "syncTime": "2024-01-01T02:00:00Z",
    "changes": [
      {
        "type": "chapter",
        "action": "update",
        "id": "chapter_456",
        "data": { "title": "云端更新的标题" },
        "timestamp": "2024-01-01T01:30:00Z",
        "version": 3
      }
    ]
  }
}
```

---

## 6. 错误码定义

### 6.1 错误码结构

```
错误码格式: XXYYY
XX: 模块代码
YYY: 具体错误代码

示例: 10001
10: 认证模块
001: 用户名或密码错误
```

### 6.2 错误码列表

| 错误码 | 模块 | 描述 |
|--------|------|------|
| **1xxxx** | **认证模块** | |
| 10001 | 认证 | 用户名或密码错误 |
| 10002 | 认证 | Token 已过期 |
| 10003 | 认证 | Token 无效 |
| 10004 | 认证 | 用户已存在 |
| 10005 | 认证 | 邮箱格式错误 |
| **2xxxx** | **用户模块** | |
| 20001 | 用户 | 用户不存在 |
| 20002 | 用户 | 权限不足 |
| **3xxxx** | **作品模块** | |
| 30001 | 作品 | 作品不存在 |
| 30002 | 作品 | 作品标题已存在 |
| **4xxxx** | **章节模块** | |
| 40001 | 章节 | 章节不存在 |
| 40002 | 章节 | 章节内容为空 |
| **5xxxx** | **AI 模块** | |
| 50001 | AI | AI 服务不可用 |
| 50002 | AI | 生成超时 |
| 50003 | AI | 内容审核失败 |
| **9xxxx** | **系统模块** | |
| 90001 | 系统 | 服务器内部错误 |
| 90002 | 系统 | 请求参数错误 |
| 90003 | 系统 | 请求频率超限 |

---

## 7. API 限流策略

### 7.1 限流规则

| API 类型 | 限流策略 |
|---------|---------|
| 普通接口 | 100 次/分钟 |
| AI 接口 | 10 次/分钟 |
| 同步接口 | 30 次/分钟 |

### 7.2 限流响应

```json
{
  "code": 90003,
  "message": "请求频率超限，请稍后再试",
  "data": {
    "retryAfter": 60
  }
}
```

---

## 8. API 文档

### 8.1 OpenAPI 3.0 规范

使用 OpenAPI 3.0 规范编写 API 文档，工具支持：
- Swagger UI（在线查看）
- Postman（导入测试）
- 代码生成

### 8.2 文档结构

```
docs/api/
├── openapi.yaml          # OpenAPI 主文件
├── schemas/              # 数据模型定义
│   ├── user.yaml
│   ├── work.yaml
│   ├── chapter.yaml
│   └── character.yaml
├── paths/                # API 路径定义
│   ├── auth.yaml
│   ├── users.yaml
│   ├── works.yaml
│   └── chapters.yaml
└── examples/             # 示例数据
    └── examples.yaml
```

---

## 9. API 测试

### 9.1 测试策略

| 测试类型 | 工具 | 覆盖率目标 |
|---------|------|-----------|
| 单元测试 | Jest | ≥ 80% |
| 集成测试 | Supertest | ≥ 70% |
| E2E 测试 | Postman | 主要流程 |

### 9.2 测试用例示例

```javascript
describe('章节 API', () => {
  it('应该创建章节成功', async () => {
    const res = await request(app)
      .post('/works/work_123/chapters')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '第一章 开始',
        content: '章节内容...'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(0);
    expect(res.body.data.title).toBe('第一章 开始');
  });
});
```

---

## 10. 下一步

1. ✅ API 设计完成
2. ⏳ 数据库设计（database-design.md）
3. ⏳ 安全架构设计（security-design.md）
4. ⏳ AI 技术方案（ai-solution.md）

---

**文档状态**: 初稿完成  
**下一步**: 数据库设计
