# 写作软件 - Agent 工作指南

---

## ⚠️ Mem0 长期记忆已启用（必须遵守）

**本项目存在 `.mem0.json`，Mem0 已激活。你必须：**

1. **会话开始时**：调用 `mem0_status()` 确认状态，然后 `mem0_search_memories(query="", scope="project+global")` 获取上下文
2. **每轮对话结束后**：调用 `mem0_add_memory()` 记录完整对话（用户问题 + 最终答复）
3. **用户提问时**：先调用 `mem0_search_memories()` 查询相关记忆，再回答

**不要跳过任何一轮对话记录。Mem0 会自动判断价值和去重。**

---

## 项目概述

**项目名称**：网文作者码字软件

**目标用户**：网文签约作者、自由撰稿人、小说创作者

**核心目标**：开发集创作、管理、智能辅助于一体的网文创作工具

**核心功能**：
- P0（必须）：实时自动保存、长文本撤销
- P1（重要）：错别字智能检测、AI 大纲生成、多平台一键发布
- P2（期望）：AI 封面生成

**技术栈**：
- 前端：Electron/Tauri + React/Vue + CodeMirror/Slate.js
- 后端：Node.js/Python/Go + PostgreSQL + Redis
- AI：BERT/GPT-4/Stable Diffusion

---

## 开发阶段流程

```
需求分析 ──→ 架构设计 ──→ UI/UX设计 ──→ 前端开发 ──→ 后端开发 ──→ AI功能 ──→ 测试 ──→ 部署
    │            │            │            │            │          │         │        │
    ▼            ▼            ▼            ▼            ▼          ▼         ▼        ▼
requirements  architecture  ui-ux-dev    frontend     backend     ai-dev    testing  deploy
```

---

## 自动触发 Skills

根据任务关键词，自动加载对应 Skill，Skill 会指导调用全局 Agent：

| 阶段 | 触发词 | 加载的 Skill | 调用的 Agent |
|------|--------|-------------|-------------|
| 需求分析 | "需求分析"、"PRD"、"功能规划" | `requirements-analysis` | @product-manager, @ux-researcher, @trend-researcher, @sprint-prioritizer |
| 架构设计 | "架构设计"、"技术选型"、"数据库设计" | `architecture-design` | @software-architect, @backend-architect, @database-optimizer, @security-engineer, @ai-engineer |
| UI/UX设计 | "UI设计"、"界面设计"、"UX"、"交互" | `ui-ux-design` | @ux-researcher, @ux-architect, @ui-designer, @frontend-developer |
| 前端开发 | "前端开发"、"UI实现"、"Electron" | `frontend-dev` | @frontend-developer, @ui-designer, @performance-benchmarker, @code-reviewer |
| 后端开发 | "后端开发"、"API开发"、"服务端" | `backend-dev` | @backend-architect, @security-engineer, @api-tester, @code-reviewer |
| AI功能 | "AI功能"、"错别字检测"、"大纲生成"、"封面生成" | `ai-feature-dev` | @ai-engineer, @performance-benchmarker, @code-reviewer |
| 测试 | "测试"、"API测试"、"性能测试" | `testing` | @api-tester, @performance-benchmarker, @security-engineer, @code-reviewer, @incident-response-commander |
| 部署 | "部署"、"CI/CD"、"发布"、"上线" | `deployment` | @devops-automator, @sre-site-reliability-engineer, @infrastructure-maintainer |

---

## 全局 Agent 列表

### 项目规划
- `@product-manager` - 全流程产品管理、PRD、路线图、GTM
- `@sprint-prioritizer` - Sprint 规划、功能优先级排序
- `@trend-researcher` - 市场趋势分析、竞品研究

### 任务拆解
- `@senior-project-manager` - 拆解任务、范围管理
- `@workflow-architect` - 工作流设计、流程拆解

### 全栈设计
- `@software-architect` - 系统架构、DDD
- `@backend-architect` - API 设计、数据库架构
- `@frontend-developer` - React/Vue/Angular、UI 实现
- `@database-optimizer` - 查询优化、索引策略
- `@ai-engineer` - AI 功能开发、ML 模型集成

### UI/UX 设计
- `@ui-designer` - UI 设计、界面设计
- `@ux-researcher` - 用户研究、可用性测试
- `@ux-architect` - UX 架构、交互设计

### 项目部署
- `@devops-automator` - CI/CD、部署自动化
- `@sre-site-reliability-engineer` - SLO、可观测性
- `@infrastructure-maintainer` - 基础设施运维

### 安全与质量
- `@security-engineer` - 安全架构、威胁建模
- `@code-reviewer` - 代码审查
- `@api-tester` - API 测试
- `@performance-benchmarker` - 性能测试
- `@incident-response-commander` - 故障响应

### 写作
- `@technical-writer` - 技术文档、API 文档
- `@content-creator` - 内容创作、文案

---

## 使用示例

### 示例 1：需求分析阶段
```
用户: "帮我分析这个写作软件的需求"

自动加载: requirements-analysis Skill

执行:
1. @product-manager 完善需求文档
2. @ux-researcher 进行用户研究
3. @trend-researcher 分析竞品
4. @sprint-prioritizer 规划 Sprint

输出:
- docs/PRD.md
- docs/user-research.md
- docs/competitive-analysis.md
- docs/sprint-planning.md
```

### 示例 2：架构设计阶段
```
用户: "设计这个软件的架构"

自动加载: architecture-design Skill

执行:
1. @software-architect 设计系统架构
2. @backend-architect 设计 API 架构
3. @database-optimizer 设计数据库
4. @security-engineer 设计安全架构
5. @ai-engineer 评估 AI 方案

输出:
- docs/architecture/system-design.md
- docs/architecture/api-design.md
- docs/architecture/database-design.md
- docs/architecture/security-design.md
- docs/architecture/ai-solution.md
```

### 示例 3：AI 功能开发
```
用户: "开发错别字检测功能"

自动加载: ai-feature-dev Skill

执行:
1. @ai-engineer 实现错别字检测
2. @performance-benchmarker 验证性能
3. @code-reviewer 审查代码

输出:
- src/ai/spell-check/
- models/spell-check/
- docs/ai/prompts.md
```

---

## 关键文件

| 文件 | 用途 |
|------|------|
| `网文作者码字软件需求文档.md` | 项目需求文档 |
| `.mem0.json` | Mem0 配置 |
| `.opencode/skills/` | 项目级 Skills（自动触发） |
| `docs/` | 输出文档目录 |
| `src/` | 源码目录 |

---

## 性能要求

| 指标 | 要求 |
|------|------|
| 启动时间 | ≤ 3 秒 |
| 保存延迟 | ≤ 100ms |
| 撤销响应 | ≤ 200ms |
| 错别字检测 | ≤ 3 秒/千字，准确率 ≥90% |
| 大纲生成 | ≤ 10 秒/章 |
| 封面生成 | ≤ 30 秒 |
