# 项目结构说明

本文档详细说明网文作者码字软件的项目目录结构和文件用途。

## 📁 目录树

```
novel-writing-software/
├── 📄 package.json                 # 根 package.json,包含快捷脚本
├── 📄 README.md                    # 项目说明文档
├── 📄 LICENSE                      # MIT 许可证
│
├── 📂 src/                         # 源码目录
│   ├── 📂 frontend/                # 前端项目
│   │   ├── 📄 package.json         # 前端依赖配置
│   │   ├── 📄 vite.config.ts       # Vite 构建配置
│   │   ├── 📄 tsconfig.json        # TypeScript 配置
│   │   ├── 📄 tailwind.config.js   # Tailwind CSS 配置
│   │   ├── 📄 postcss.config.js    # PostCSS 配置
│   │   ├── 📄 index.html           # HTML 入口文件
│   │   │
│   │   ├── 📂 src/                 # 前端源码
│   │   │   ├── 📄 main.tsx         # React 入口
│   │   │   ├── 📄 App.tsx          # 根组件
│   │   │   │
│   │   │   ├── 📂 components/      # UI 组件 (原子/分子/有机组件)
│   │   │   │   ├── atoms/          # 原子组件 (Button, Input, Icon...)
│   │   │   │   ├── molecules/      # 分子组件 (Card, Dropdown, Modal...)
│   │   │   │   └── organisms/      # 有机组件 (Toolbar, Sidebar, Editor...)
│   │   │   │
│   │   │   ├── 📂 hooks/           # React Hooks
│   │   │   │   ├── useAutoSave.ts  # 自动保存 Hook
│   │   │   │   └── useKeyboard.ts  # 快捷键 Hook
│   │   │   │
│   │   │   ├── 📂 stores/          # Zustand 状态管理
│   │   │   │   ├── editorStore.ts  # 编辑器状态
│   │   │   │   ├── themeStore.ts   # 主题状态
│   │   │   │   └── workStore.ts    # 作品状态
│   │   │   │
│   │   │   ├── 📂 themes/          # 主题配置
│   │   │   │   └── editorThemes.ts # CodeMirror 主题
│   │   │   │
│   │   │   ├── 📂 editor/          # CodeMirror 编辑器
│   │   │   │   ├── Editor.tsx      # 编辑器组件
│   │   │   │   ├── extensions/     # 编辑器扩展
│   │   │   │   └── utils/          # 编辑器工具
│   │   │   │
│   │   │   ├── 📂 types/           # TypeScript 类型定义
│   │   │   │   └── index.ts        # 全局类型
│   │   │   │
│   │   │   ├── 📂 utils/           # 工具函数
│   │   │   │   ├── helpers.ts      # 辅助函数 (防抖、节流...)
│   │   │   │   └── file.ts         # 文件操作
│   │   │   │
│   │   │   └── 📂 styles/          # 全局样式
│   │   │       └── index.css       # 全局 CSS (设计令牌)
│   │   │
│   │   └── 📂 public/              # 静态资源
│   │       └── vite.svg            # Vite Logo
│   │
│   └── 📂 src-tauri/               # Tauri 后端
│       ├── 📄 Cargo.toml           # Rust 依赖配置
│       ├── 📄 tauri.conf.json      # Tauri 配置
│       ├── 📄 build.rs             # Rust 构建脚本
│       │
│       └── 📂 src/                 # Rust 源码
│           ├── 📄 main.rs          # 程序入口
│           └── 📄 lib.rs           # Tauri 应用配置
│
├── 📂 docs/                        # 文档目录
│   ├── 📂 architecture/            # 架构设计文档
│   │   ├── system-design.md        # 系统架构设计
│   │   ├── api-design.md           # API 设计
│   │   ├── database-design.md      # 数据库设计
│   │   ├── security-design.md      # 安全架构设计
│   │   └── ai-solution.md          # AI 技术方案
│   │
│   ├── 📂 design/                  # UI/UX 设计文档
│   │   ├── ui-spec.md              # UI 设计规范
│   │   ├── tech-feasibility.md     # 技术可行性评估
│   │   ├── component-system.md     # 组件设计系统
│   │   └── interaction-design.md   # 交互设计
│   │
│   ├── PRD.md                      # 产品需求文档
│   ├── user-research.md            # 用户研究报告
│   ├── competitive-analysis.md     # 竞品分析
│   └── sprint-planning.md          # Sprint 规划
│
└── 📂 .opencode/                   # OpenCode 配置
    ├── 📄 package.json             # OpenCode 依赖
    └── 📂 skills/                  # 项目级 Skills
        ├── requirements-analysis/   # 需求分析 Skill
        ├── architecture-design/     # 架构设计 Skill
        ├── ui-ux-design/           # UI/UX 设计 Skill
        ├── frontend-dev/           # 前端开发 Skill
        ├── backend-dev/            # 后端开发 Skill
        ├── ai-feature-dev/         # AI 功能开发 Skill
        ├── testing/                # 测试 Skill
        └── deployment/             # 部署 Skill
```

## 📋 核心文件说明

### 前端配置文件

| 文件 | 用途 |
|------|------|
| `package.json` | 前端依赖管理,包含 React、CodeMirror、Zustand 等 |
| `vite.config.ts` | Vite 构建配置,包含 Tauri 集成、路径别名 |
| `tsconfig.json` | TypeScript 编译配置 |
| `tailwind.config.js` | Tailwind CSS 配置,使用 CSS 变量实现主题系统 |
| `postcss.config.js` | PostCSS 配置,Tailwind CSS 前置处理 |

### 前端源码

| 目录/文件 | 用途 |
|-----------|------|
| `src/main.tsx` | React 应用入口 |
| `src/App.tsx` | 根组件,包含基础布局 |
| `src/components/` | UI 组件库 (按原子设计模式组织) |
| `src/hooks/` | 自定义 React Hooks |
| `src/stores/` | Zustand 全局状态管理 |
| `src/themes/` | CodeMirror 主题配置 (默认、护眼、夜间) |
| `src/editor/` | CodeMirror 编辑器封装 |
| `src/types/` | TypeScript 类型定义 |
| `src/utils/` | 工具函数 (防抖、节流、文件操作) |
| `src/styles/` | 全局样式,包含设计令牌 (颜色、间距、字体) |

### Tauri 后端

| 文件 | 用途 |
|------|------|
| `Cargo.toml` | Rust 依赖配置 (tauri、serde、serde_json) |
| `tauri.conf.json` | Tauri 应用配置 (窗口、打包、安全) |
| `src/main.rs` | Rust 程序入口 |
| `src/lib.rs` | Tauri 应用配置,包含插件初始化 |

## 🎨 设计系统

### CSS 变量

全局样式使用 CSS 变量实现主题系统:

```css
/* 三大主题 */
:root[data-theme="default"]  /* 默认主题 - 白色背景 */
:root[data-theme="eye-care"] /* 护眼模式 - 米白背景 */
:root[data-theme="dark"]     /* 夜间模式 - 深色背景 */

/* 设计令牌 */
--color-primary-*      /* 主色系 */
--color-text-*         /* 文本色系 */
--color-bg-*           /* 背景色系 */
--color-border-*       /* 边框色系 */
--font-size-*          /* 字体大小 */
--space-*              /* 间距系统 */
--shadow-*             /* 阴影系统 */
```

### 组件分类

按照原子设计模式分类:

1. **原子组件 (Atoms)**: Button, Input, Icon, Badge, Tooltip
2. **分子组件 (Molecules)**: Card, Dropdown, Modal, InputField
3. **有机组件 (Organisms)**: Toolbar, Sidebar, Editor, StatusBar, AIPanel
4. **模板 (Templates)**: EditorLayout, SplitViewLayout, FocusModeLayout

## 🔧 开发命令

```bash
# 安装前端依赖
npm run install:frontend

# 开发模式运行
npm run tauri:dev

# 构建生产版本
npm run tauri:build

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

## 📊 技术栈

- **前端框架**: React 18 + TypeScript
- **编辑器**: CodeMirror 6
- **状态管理**: Zustand
- **样式**: Tailwind CSS
- **构建工具**: Vite
- **桌面框架**: Tauri 2.0
- **后端语言**: Rust

---

**更新日期**: 2026-05-07  
**维护者**: Frontend Developer Agent
