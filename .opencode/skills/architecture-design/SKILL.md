---
name: architecture-design
description: |
  网文作者码字软件架构设计阶段。设计系统架构、技术选型、数据库设计、安全架构。
  Use when: "架构设计"、"系统设计"、"技术选型"、"数据库设计"、"安全架构"、"后端架构"、"前端架构"
---

# 架构设计阶段

## 项目背景

**项目名称**：网文作者码字软件  
**技术栈建议**：
- 前端：Electron/Tauri + React/Vue + CodeMirror/Slate.js
- 后端：Node.js/Python/Go + PostgreSQL + Redis
- AI：BERT/GPT-4/Stable Diffusion

## 当前输入

- 完整的 PRD 文档
- 功能需求列表
- 非功能需求（性能、安全、跨平台）

## 任务说明

1. 设计整体系统架构
2. 确定技术选型
3. 设计数据库架构
4. 设计安全架构
5. 定义 API 接口规范

## 调用的 Agent

按顺序调用以下全局 Agent：

### 1. Software Architect
```
@software-architect 设计网文码字软件的整体架构，包括桌面端、云端同步、AI 功能集成
```

**应输出**：
- 系统架构图
- 技术选型决策（ADR）
- 模块划分

### 2. Backend Architect
```
@backend-architect 设计云端 API 架构、多平台对接方案（某点、某茄、晋江）
```

**应输出**：
- API 架构设计
- 微服务划分
- REST API 规范

### 3. Database Optimizer
```
@database-optimizer 设计本地 SQLite 和云端 PostgreSQL 数据库架构，支持离线同步
```

**应输出**：
- 数据库 Schema 设计
- 索引策略
- 同步策略

### 4. Security Engineer
```
@security-engineer 设计数据加密方案（本地存储加密、HTTPS 传输），确保用户稿件安全
```

**应输出**：
- 安全架构设计
- 数据加密方案
- API 安全策略

### 5. AI Engineer（初步评估）
```
@ai-engineer 评估 AI 功能的技术可行性（错别字检测、大纲生成、封面生成），确定集成方案
```

**应输出**：
- AI 功能技术方案
- 模型选型建议
- API 集成方案

## 输出物

完成后应产出：

| 输出物 | 文件位置 | 责任 Agent |
|--------|---------|-----------|
| 系统架构设计 | `docs/architecture/system-design.md` | software-architect |
| API 设计文档 | `docs/architecture/api-design.md` | backend-architect |
| 数据库设计 | `docs/architecture/database-design.md` | database-optimizer |
| 安全架构设计 | `docs/architecture/security-design.md` | security-engineer |
| AI 技术方案 | `docs/architecture/ai-solution.md` | ai-engineer |

## 验收标准

- [ ] 系统架构支持离线优先模式
- [ ] 数据库设计支持本地-云端同步
- [ ] 安全方案覆盖数据加密和 API 安全
- [ ] API 设计符合 RESTful 规范
- [ ] AI 功能方案有明确的技术路径

## 下一步

架构设计完成后，进入 **UI/UX 设计阶段**：
```
调用 ui-ux-design Skill
```
