---
name: backend-dev
description: |
  网文作者码字软件后端开发阶段。实现云端 API、多平台对接、数据同步。
  Use when: "后端开发"、"API开发"、"服务端"、"云端同步"、"多平台对接"、"某点"、"某茄"、"晋江"
---

# 后端开发阶段

## 项目背景

**项目名称**：网文作者码字软件  
**技术栈**：Node.js/Python/Go + PostgreSQL + Redis  
**核心功能**：云端同步、多平台发布、数据安全

## 当前输入

- PRD 文档
- API 设计文档
- 数据库设计
- 安全架构设计

## 任务说明

1. 实现云端同步 API
2. 实现多平台对接（某点、某茄、晋江）
3. 实现用户认证与授权
4. 实现数据加密存储
5. 实现发布管理功能

## 调用的 Agent

### 1. Backend Architect
```
@backend-architect 实现云端 API、用户认证、数据同步逻辑
```

**开发任务**：
- 实现云端同步 API
- 实现用户认证（注册、登录、Token）
- 实现稿件 CRUD API
- 实现本地-云端数据同步
- 实现数据加密存储

### 2. Backend Architect（多平台对接）
```
@backend-architect 对接某点、某茄、晋江等平台的发布 API
```

**对接任务**：
- 研究各平台 API 规范
- 实现平台授权流程
- 实现稿件发布接口
- 实现发布状态跟踪

### 3. Security Engineer
```
@security-engineer 审查 API 安全、数据加密实现
```

### 4. API Tester
```
@api-tester 测试所有 API 接口的正确性和安全性
```

### 5. Code Reviewer
```
@code-reviewer 审查后端代码质量、安全性、性能
```

## 开发优先级

### Sprint 1（2-3 周）- 核心功能
- [ ] 用户认证系统
- [ ] 云端同步 API
- [ ] 稿件管理 API
- [ ] 数据加密实现

### Sprint 2（2-3 周）- 多平台对接
- [ ] 某点平台对接
- [ ] 某茄平台对接
- [ ] 晋江平台对接
- [ ] 发布管理功能

## API 规范

根据需求文档，核心 API 包括：

### 用户认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh` - 刷新 Token

### 稿件管理
- `GET /api/novels` - 获取稿件列表
- `POST /api/novels` - 创建新稿件
- `PUT /api/novels/:id` - 更新稿件
- `DELETE /api/novels/:id` - 删除稿件

### 云端同步
- `POST /api/sync/upload` - 上传本地数据
- `GET /api/sync/download` - 下载云端数据
- `POST /api/sync/resolve` - 解决冲突

### 多平台发布
- `POST /api/publish/:platform` - 发布到指定平台
- `GET /api/publish/status/:id` - 查询发布状态

## 输出物

完成后应产出：

| 输出物 | 文件位置 | 责任 Agent |
|--------|---------|-----------|
| 后端源码 | `src/backend/` | backend-architect |
| API 文档 | `docs/api/` | backend-architect |
| API 测试报告 | `docs/testing/api-testing.md` | api-tester |

## 验收标准

- [ ] 云端同步 API 功能完整
- [ ] 至少对接 3 个平台
- [ ] 数据传输使用 HTTPS 加密
- [ ] 本地数据加密存储
- [ ] API 测试覆盖率 ≥ 80%
- [ ] 代码通过 Code Review

## 下一步

后端开发完成后，进入 **AI 功能开发阶段**：
```
调用 ai-feature-dev Skill
```
