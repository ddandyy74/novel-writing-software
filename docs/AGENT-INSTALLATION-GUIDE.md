# Agent 安装指南

## 安装位置

Agent 安装到 OpenCode 全局配置目录：

```
Windows: C:\Users\<用户名>\.config\opencode\agents\
macOS:   ~/.config/opencode/agents/
Linux:   ~/.config/opencode/agents/
```

---

## 安装方法

### 方法一：从 GitHub 安装（推荐）

```bash
# 1. 克隆仓库
git clone https://github.com/msitarzewski/agency-agents.git

# 2. 进入目录
cd agency-agents

# 3. 运行安装脚本（需要 Git Bash）
./convert.sh
```

脚本会自动将所有 Agent 转换并安装到 `~/.config/opencode/agents/` 目录。

### 方法二：复制现有 Agent 文件（最快）

从已安装的机器复制整个 `agents` 目录：

```bash
# Windows
xcopy "C:\Users\DD\.config\opencode\agents" "C:\Users\<新用户>\.config\opencode\agents" /E /I

# macOS/Linux
cp -r ~/.config/opencode/agents/* /path/to/new/machine/.config/opencode/agents/
```

---

## 配置全局 AGENTS.md（精简版）

**重要**：全局 AGENTS.md 每次会话都会加载，建议只写核心规则，避免臃肿。

在 `~/.config/opencode/AGENTS.md` 开头添加：

```markdown
# OpenCode 全局规则

## Agent 使用

已安装 30+ Agent 覆盖软件开发全流程。

查看完整列表请问：**"有哪些 Agent 可以用？"**

调用方式：`@agent名称 任务描述`

示例：`@product-manager 帮我规划一个项目`
```

**这样每次会话只加载 <200 token，Agent 列表按需查询。**

---

## 验证安装

安装完成后，在 OpenCode 中运行：

```
有哪些 Agent 可以用？
```

或者直接使用：
```
@product-manager 帮我规划一个项目
```

---

## 已安装的 Agent（30 个）

<details>
<summary>点击展开完整列表</summary>

### 项目规划（3 个）
| Agent | 用途 |
|-------|------|
| `@product-manager` | 全流程产品管理、PRD、路线图、GTM |
| `@sprint-prioritizer` | Sprint 规划、功能优先级排序 |
| `@trend-researcher` | 市场趋势分析、竞品研究 |

### 任务拆解（2 个）
| Agent | 用途 |
|-------|------|
| `@senior-project-manager` | 拆解任务、范围管理 |
| `@workflow-architect` | 工作流设计、流程拆解 |

### 全栈设计（5 个）
| Agent | 用途 |
|-------|------|
| `@software-architect` | 系统架构、DDD |
| `@backend-architect` | API 设计、数据库架构 |
| `@frontend-developer` | React/Vue/Angular、UI 实现 |
| `@database-optimizer` | 查询优化、索引策略 |
| `@ai-engineer` | AI 功能开发、ML 模型集成 |

### UI/UX 设计（3 个）
| Agent | 用途 |
|-------|------|
| `@ui-designer` | UI 设计、界面设计 |
| `@ux-researcher` | 用户研究、可用性测试 |
| `@ux-architect` | UX 架构、交互设计 |

### 项目部署（3 个）
| Agent | 用途 |
|-------|------|
| `@devops-automator` | CI/CD、部署自动化 |
| `@sre-site-reliability-engineer` | SLO、可观测性 |
| `@infrastructure-maintainer` | 基础设施运维 |

### 安全与质量（5 个）
| Agent | 用途 |
|-------|------|
| `@security-engineer` | 安全架构、威胁建模 |
| `@code-reviewer` | 代码审查 |
| `@api-tester` | API 测试 |
| `@performance-benchmarker` | 性能测试 |
| `@incident-response-commander` | 故障响应 |

### 写作（2 个）
| Agent | 用途 |
|-------|------|
| `@technical-writer` | 技术文档、API 文档 |
| `@content-creator` | 内容创作、文案 |

### 小说写作（3 个）
| Agent | 用途 |
|-------|------|
| `@narratologist` | 故事结构、叙事理论、角色弧线 |
| `@psychologist` | 角色心理、动机分析 |
| `@narrative-designer` | 分支剧情、对话设计 |

### 世界构建（3 个）
| Agent | 用途 |
|-------|------|
| `@anthropologist` | 文化体系、社会结构 |
| `@historian` | 历史背景、时代细节 |
| `@geographer` | 地理逻辑、气候系统 |

### 文档生成（1 个）
| Agent | 用途 |
|-------|------|
| `@document-generator` | PDF/PPTX/DOCX/XLSX 生成 |

</details>

---

## 项目级 Skills

本项目包含项目级 Skills（自动触发），会随项目复制自动生效：

位置：`项目目录/.opencode/skills/`

| Skill | 触发词 |
|-------|--------|
| `requirements-analysis` | "需求分析"、"PRD"、"功能规划" |
| `architecture-design` | "架构设计"、"技术选型" |
| `ui-ux-design` | "UI设计"、"界面设计" |
| `frontend-dev` | "前端开发"、"Electron" |
| `backend-dev` | "后端开发"、"API开发" |
| `ai-feature-dev` | "AI功能"、"错别字检测" |
| `testing` | "测试"、"API测试" |
| `deployment` | "部署"、"CI/CD"、"发布" |

---

## 快速迁移清单

在新机器上开发本项目，只需：

- [ ] 安装 OpenCode
- [ ] 复制 `agents/` 目录（方法二最快）
- [ ] 更新全局 `AGENTS.md`（添加简短引导即可）
- [ ] 复制项目目录（包含 `.opencode/skills/`）

**无需复制 `AGENTS-INDEX.md`，Agent 列表按需查询即可。**

---

## 文件架构说明

| 文件 | 加载时机 | 内容 |
|------|---------|------|
| 全局 `AGENTS.md` | **每次会话** | 核心规则 + 简短引导（<200 token） |
| `agent-index` Skill | **用户问时** | 完整 Agent 列表（按需加载） |
| 项目级 `AGENTS.md` | **打开项目时** | 项目特定工作流程 |
| 项目级 Skills | **任务匹配时** | 自动触发对应 Agent |

**这样设计既不臃肿，又保证功能完整。**
