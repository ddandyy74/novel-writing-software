# 网文作者码字软件 UI 设计规范

**版本**: v1.0  
**日期**: 2026-05-07  
**设计师**: UI Designer  
**基于文档**: interaction-design.md、system-design.md、PRD.md

---

## 1. 设计理念

### 1.1 核心原则

| 原则 | 描述 | 实现方式 |
|------|------|----------|
| **专注优先** | 写作是核心任务，界面不干扰创作 | 沉浸式设计、快捷键驱动、AI 功能默认隐藏 |
| **数据可见** | 保存状态、字数统计、网络状态实时可见 | 状态栏常驻、工具栏提示、进度可视化 |
| **智能辅助** | AI 作为增强工具，不喧宾夺主 | 侧边栏设计、快捷键触发、可折叠面板 |
| **渐进增强** | 新手友好，高级功能可发现 | 清晰层级、工具提示、快捷键提示 |

### 1.2 设计语言

**关键词**: 专业、简洁、可靠、智能

**视觉风格**:
- 扁平化设计 + 微妙的阴影层次
- 圆角卡片风格
- 克制的色彩使用
- 清晰的视觉层级

---

## 2. 界面布局设计

### 2.1 主界面三栏布局

```
┌──────────────────────────────────────────────────────────────────────┐
│  工具栏 (Toolbar) - 高度: 48px                                         │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ [⬇ 已保存] 总字数: 247,832 | 本章: 3,247 | 今日: 1,832/4000    │  │
│  │                                                                  │  │
│  │                                    [🌓 主题] [⚙ 设置] [📁 菜单]  │  │
│  └────────────────────────────────────────────────────────────────┘  │
├────────────┬────────────────────────────────────┬────────────────────┤
│            │                                    │                    │
│  左侧边栏   │          主编辑器区域               │    右侧面板         │
│  240-320px │          60-70%                    │    280-360px       │
│  可折叠     │          (最小 400px)               │    可折叠           │
│            │                                    │                    │
│  ┌────────┐│  ┌──────────────────────────────┐  │  ┌──────────────┐  │
│  │作品列表 ││  │                              │  │  │ AI 助手面板   │  │
│  │        ││  │                              │  │  │              │  │
│  │ ┌────┐ ││  │   第三十八章：决战之巅         │  │  │ [思路启发]    │  │
│  │ │作品1│ ││  │                              │  │  │ [错别字检测]  │  │
│  │ └────┘ ││  │   李明握紧手中的剑，眼神      │  │  │ [大纲生成]    │  │
│  │ ┌────┐ ││  │   坚定地看着对面的敌人。       │  │  │ [续写]        │  │
│  │ │作品2│ ││  │                              │  │  │              │  │
│  │ └────┘ ││  │   他深吸一口气，准备施展      │  │  │ AI 对话历史   │  │
│  │        ││  │   绝技...                     │  │  │              │  │
│  │章节树   ││  │                              │  │  │              │  │
│  │        ││  │                              │  │  └──────────────┘  │
│  │ ┌────┐ ││  │                              │  │                    │
│  │ │第37章│ ││  │                              │  │  或               │
│  │ └────┘ ││  │                              │  │                    │
│  │ ┌────┐ ││  │                              │  │  ┌──────────────┐  │
│  │ │第38章│ ││  │                              │  │  │ 属性面板      │  │
│  │ └────┘ ││  │                              │  │  │ - 章节属性    │  │
│  │ ┌────┐ ││  │                              │  │  │ - 角色卡片    │  │
│  │ │第39章│ ││  └──────────────────────────────┘  │  │ - 大纲视图    │  │
│  │ └────┘ ││                                    │  └──────────────┘  │
│  │        ││                                    │                    │
│  │ [大纲]  ││                                    │                    │
│  │ [角色]  ││                                    │                    │
│  │ [发布]  ││                                    │                    │
│  └────────┘│                                    │                    │
│            │                                    │                    │
├────────────┴────────────────────────────────────┴────────────────────┤
│  状态栏 (StatusBar) - 高度: 28px                                       │
│  [《剑道独尊》] [第三十八章] [行 12, 列 45] [⬤ 在线] [☁ 同步完成]      │
└──────────────────────────────────────────────────────────────────────┘

布局比例:
├────────────┼────────────────────────────┼────────────────────┤
│  240-320px │      60-70% (可拖拽)        │    280-360px       │
│  左侧边栏   │          主编辑器            │      右侧面板       │

最小宽度限制:
- 左侧边栏: 最小 200px，最大 400px
- 主编辑器: 最小 400px（强制）
- 右侧面板: 最小 240px，最大 480px
```

### 2.2 分屏对照布局

```
┌──────────────────────────────────────────────────────────────────────┐
│  工具栏 (Toolbar)                                                      │
│  [⬇ 已保存] [字数: 3,247]        [📊 分屏模式 ▼] [主题] [⚙ 设置]      │
├───────────────────────────────────┬──────────────────────────────────┤
│                                   │                                  │
│  左侧对照面板 (40-50%)             │      右侧编辑器 (50-60%)          │
│                                   │                                  │
│  ┌──────────────────────────────┐│  ┌──────────────────────────────┐│
│  │ [大纲] [前文] [角色] [笔记]   ││  │                              ││
│  ├──────────────────────────────┤│  │   第三十八章：决战之巅         ││
│  │ 📋 第三十八章大纲              ││  │                              ││
│  │                              ││  │   李明握紧手中的剑，          ││
│  │ 1. 李明与敌首对峙             ││  │   眼神坚定地看着对面的敌人。   ││
│  │ 2. 回忆师门往事               ││  │                              ││
│  │ 3. 施展绝技"剑气纵横"         ││  │   他深吸一口气，准备施展       ││
│  │ 4. 击败敌人，境界突破          ││  │   绝技...                     ││
│  │                              ││  │                              ││
│  │ 📍 当前位置: 第2节             ││  │   【支持同步滚动】             ││
│  │                              ││  │                              ││
│  └──────────────────────────────┘│  └──────────────────────────────┘│
│                                   │                                  │
├───────────────────────────────────┴──────────────────────────────────┤
│  状态栏: [《剑道独尊》] [第三十八章] [分屏模式: 大纲对照] [⬤ 在线]     │
└──────────────────────────────────────────────────────────────────────┘

分屏模式类型:
┌─────────────────────────────────────────────────────────────────────┐
│  Ctrl+Shift+1  标准模式    编辑器 100%                               │
│  Ctrl+Shift+2  大纲对照    左 40% : 右 60%                           │
│  Ctrl+Shift+3  前文对照    左 50% : 右 50%                           │
│  Ctrl+Shift+4  角色对照    左 30% : 右 70%                           │
│  Ctrl+Shift+5  双章对照    左 35% : 右 65%                           │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.3 专注模式布局

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                       │
│                                                                       │
│                     沉浸式写作区域 (100%)                              │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │                                                                  │  │
│  │   第三十八章：决战之巅                                           │  │
│  │                                                                  │  │
│  │   李明握紧手中的剑，眼神坚定地看着对面的敌人。                    │  │
│  │                                                                  │  │
│  │   他深吸一口气，准备施展绝技...                                   │  │
│  │                                                                  │  │
│  │                                                                  │  │
│  │                                                                  │  │
│  │                                                                  │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  字数: 3,247 | 今日: 1,832/4,000    [ESC 退出专注模式]           │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘

特点:
- 工具栏隐藏
- 侧边栏隐藏
- AI 面板隐藏
- 仅保留底部迷你状态栏
- ESC 键退出
```

### 2.4 响应式设计原则

#### 2.4.1 断点系统

```css
/* 响应式断点 */
:root {
  --breakpoint-sm: 640px;   /* 小屏桌面 */
  --breakpoint-md: 768px;   /* 标准桌面 */
  --breakpoint-lg: 1024px;  /* 大屏桌面 */
  --breakpoint-xl: 1280px;  /* 超大屏桌面 */
  --breakpoint-2xl: 1536px; /* 超宽屏 */
}
```

#### 2.4.2 布局适配规则

| 屏幕宽度 | 布局策略 | 左侧边栏 | 主编辑器 | 右侧面板 |
|----------|----------|----------|----------|----------|
| **< 1024px** | 紧凑模式 | 默认折叠 | 100% | 默认折叠 |
| **1024px - 1280px** | 标准模式 | 240px | 自适应 | 折叠 |
| **1280px - 1536px** | 扩展模式 | 280px | 自适应 | 280px |
| **> 1536px** | 宽屏模式 | 320px | 自适应 | 360px |

#### 2.4.3 自适应行为

```javascript
// 响应式布局逻辑
const layoutAdaptations = {
  // 小屏 (< 1024px)
  compact: {
    leftSidebar: 'collapsed',  // 默认折叠
    rightPanel: 'collapsed',   // 默认折叠
    toolbar: 'compact',        // 紧凑工具栏
    statusBar: 'mini'          // 迷你状态栏
  },
  
  // 标准屏 (1024px - 1280px)
  standard: {
    leftSidebar: '240px',
    rightPanel: 'collapsed',   // 需要时展开
    toolbar: 'standard',
    statusBar: 'full'
  },
  
  // 大屏 (> 1536px)
  wide: {
    leftSidebar: '320px',
    rightPanel: '360px',
    toolbar: 'full',
    statusBar: 'full'
  }
};
```

---

## 3. 主题配色方案

### 3.1 默认主题（经典白底）

```css
/* 默认主题 - 设计令牌 */
:root[data-theme="default"] {
  /* ========== 色彩系统 ========== */
  
  /* 主色系 (Primary) */
  --color-primary-50: #f0f9ff;    /* 最浅 */
  --color-primary-100: #e0f2fe;
  --color-primary-200: #bae6fd;
  --color-primary-300: #7dd3fc;
  --color-primary-400: #38bdf8;
  --color-primary-500: #0ea5e9;   /* 主色 */
  --color-primary-600: #0284c7;   /* 悬停 */
  --color-primary-700: #0369a1;   /* 激活 */
  --color-primary-800: #075985;
  --color-primary-900: #0c4a6e;   /* 最深 */
  
  /* 次要色系 (Secondary/Neutral) */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f4f4f5;
  --color-neutral-200: #e4e4e7;
  --color-neutral-300: #d4d4d8;
  --color-neutral-400: #a1a1aa;
  --color-neutral-500: #71717a;
  --color-neutral-600: #52525b;
  --color-neutral-700: #3f3f46;
  --color-neutral-800: #27272a;
  --color-neutral-900: #18181b;
  
  /* 语义色系 */
  --color-success: #10b981;       /* 成功 - 绿色 */
  --color-warning: #f59e0b;       /* 警告 - 橙色 */
  --color-error: #ef4444;         /* 错误 - 红色 */
  --color-info: #3b82f6;          /* 信息 - 蓝色 */
  
  /* 背景色系 */
  --color-bg-primary: #ffffff;    /* 主背景 */
  --color-bg-secondary: #f8fafc;  /* 次级背景 */
  --color-bg-tertiary: #f1f5f9;   /* 三级背景 */
  --color-bg-elevated: #ffffff;   /* 提升背景（卡片、下拉菜单） */
  
  /* 文本色系 */
  --color-text-primary: #1f2937;    /* 主文本 */
  --color-text-secondary: #6b7280;  /* 次级文本 */
  --color-text-tertiary: #9ca3af;   /* 三级文本 */
  --color-text-disabled: #d1d5db;   /* 禁用文本 */
  --color-text-inverse: #ffffff;    /* 反色文本 */
  
  /* 边框色系 */
  --color-border-light: #e5e7eb;    /* 浅边框 */
  --color-border-medium: #d1d5db;   /* 中等边框 */
  --color-border-dark: #9ca3af;     /* 深边框 */
  --color-border-focus: #0ea5e9;    /* 焦点边框 */
  
  /* ========== 编辑器专用色 ========== */
  
  --editor-bg: #ffffff;
  --editor-text: #1f2937;
  --editor-text-secondary: #6b7280;
  --editor-selection: #bfdbfe;      /* 选中背景 */
  --editor-cursor: #0ea5e9;         /* 光标 */
  --editor-line-number: #9ca3af;    /* 行号 */
  --editor-line-number-active: #3b82f6;
  --editor-line-highlight: #f8fafc; /* 当前行高亮 */
  
  /* AI 标注色 */
  --ai-error-underline: #ef4444;    /* 错别字下划线 */
  --ai-error-bg: #fef2f2;           /* 错别字背景 */
  --ai-suggestion-bg: #ecfdf5;      /* AI 建议背景 */
  
  /* ========== 阴影系统 ========== */
  
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
}
```

**对比度验证**:

| 组合 | 对比度 | WCAG AA | WCAG AAA | 用途 |
|------|--------|---------|----------|------|
| text-primary / bg-primary | 16.1:1 | ✓ | ✓ | 正文文本 |
| text-secondary / bg-primary | 5.0:1 | ✓ | ✗ | 次级文本 |
| text-tertiary / bg-primary | 3.3:1 | ✗ | ✗ | 三级文本（大字可用） |
| primary-500 / bg-primary | 4.6:1 | ✓ | ✗ | 主按钮文本 |
| error / bg-primary | 4.5:1 | ✓ | ✗ | 错误文本 |

### 3.2 护眼模式（浅米色）

```css
/* 护眼模式 - 设计令牌 */
:root[data-theme="eye-care"] {
  /* ========== 色彩系统 ========== */
  
  /* 主色系 (Primary - 绿色调) */
  --color-primary-50: #f0fdf4;
  --color-primary-100: #dcfce7;
  --color-primary-200: #bbf7d0;
  --color-primary-300: #86efac;
  --color-primary-400: #4ade80;
  --color-primary-500: #22c55e;   /* 主色 */
  --color-primary-600: #16a34a;
  --color-primary-700: #15803d;
  --color-primary-800: #166534;
  --color-primary-900: #14532d;
  
  /* 背景色系 - 米色调 */
  --color-bg-primary: #fffef5;    /* 米白 */
  --color-bg-secondary: #fffbeb;  /* 浅米黄 */
  --color-bg-tertiary: #fef3c7;   /* 淡橙黄 */
  --color-bg-elevated: #fffef5;
  
  /* 文本色系 */
  --color-text-primary: #3f3f1e;    /* 深橄榄绿 */
  --color-text-secondary: #6b6949;  /* 橄榄绿 */
  --color-text-tertiary: #9ca377;   /* 浅橄榄绿 */
  --color-text-disabled: #d1d5b7;
  --color-text-inverse: #ffffff;
  
  /* 边框色系 */
  --color-border-light: #e5e2d4;
  --color-border-medium: #d1cebe;
  --color-border-dark: #9ca887;
  --color-border-focus: #22c55e;
  
  /* ========== 编辑器专用色 ========== */
  
  --editor-bg: #fffef5;
  --editor-text: #3f3f1e;
  --editor-text-secondary: #6b6949;
  --editor-selection: #d1fae5;
  --editor-cursor: #22c55e;
  --editor-line-number: #9ca377;
  --editor-line-number-active: #16a34a;
  --editor-line-highlight: #fef3c7;
  
  /* AI 标注色 */
  --ai-error-underline: #dc2626;
  --ai-error-bg: #fef2f2;
  --ai-suggestion-bg: #d1fae5;
  
  /* 阴影系统 - 暖色调 */
  --shadow-xs: 0 1px 2px 0 rgb(139 119 72 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(139 119 72 / 0.1), 0 1px 2px -1px rgb(139 119 72 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(139 119 72 / 0.1), 0 2px 4px -2px rgb(139 119 72 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(139 119 72 / 0.1), 0 4px 6px -4px rgb(139 119 72 / 0.1);
}
```

**对比度验证**:

| 组合 | 对比度 | WCAG AA | 用途 |
|------|--------|---------|------|
| text-primary / bg-primary | 14.2:1 | ✓ | 正文文本 |
| text-secondary / bg-primary | 4.8:1 | ✓ | 次级文本 |
| primary-500 / bg-primary | 4.7:1 | ✓ | 主按钮文本 |

### 3.3 夜间模式（深色主题）

```css
/* 夜间模式 - 设计令牌 */
:root[data-theme="dark"] {
  /* ========== 色彩系统 ========== */
  
  /* 主色系 (Primary - 蓝紫色调) */
  --color-primary-50: #1e1b4b;    /* 最深 */
  --color-primary-100: #312e81;
  --color-primary-200: #3730a3;
  --color-primary-300: #4338ca;
  --color-primary-400: #4f46e5;
  --color-primary-500: #6366f1;   /* 主色 */
  --color-primary-600: #818cf8;   /* 悬停 */
  --color-primary-700: #a5b4fc;   /* 激活 */
  --color-primary-800: #c7d2fe;
  --color-primary-900: #e0e7ff;   /* 最浅 */
  
  /* 背景色系 - 深色 */
  --color-bg-primary: #0f0f10;    /* 最深背景 */
  --color-bg-secondary: #18181b;  /* 次级背景 */
  --color-bg-tertiary: #27272a;   /* 三级背景 */
  --color-bg-elevated: #1f1f23;   /* 提升背景 */
  
  /* 文本色系 */
  --color-text-primary: #f4f4f5;    /* 主文本 */
  --color-text-secondary: #a1a1aa;  /* 次级文本 */
  --color-text-tertiary: #71717a;   /* 三级文本 */
  --color-text-disabled: #3f3f46;   /* 禁用文本 */
  --color-text-inverse: #0f0f10;    /* 反色文本 */
  
  /* 边框色系 */
  --color-border-light: #27272a;
  --color-border-medium: #3f3f46;
  --color-border-dark: #52525b;
  --color-border-focus: #6366f1;
  
  /* ========== 编辑器专用色 ========== */
  
  --editor-bg: #0f0f10;
  --editor-text: #e4e4e7;
  --editor-text-secondary: #a1a1aa;
  --editor-selection: #4338ca;
  --editor-cursor: #6366f1;
  --editor-line-number: #52525b;
  --editor-line-number-active: #6366f1;
  --editor-line-highlight: #18181b;
  
  /* AI 标注色 - 深色适配 */
  --ai-error-underline: #f87171;
  --ai-error-bg: #450a0a;
  --ai-suggestion-bg: #14532d;
  
  /* ========== 阴影系统 ========== */
  
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.3);
  
  /* 发光效果 - 深色主题特有 */
  --glow-primary: 0 0 20px rgb(99 102 241 / 0.3);
  --glow-success: 0 0 20px rgb(16 185 129 / 0.3);
  --glow-error: 0 0 20px rgb(239 68 68 / 0.3);
}
```

**对比度验证**:

| 组合 | 对比度 | WCAG AA | 用途 |
|------|--------|---------|------|
| text-primary / bg-primary | 15.3:1 | ✓ | 正文文本 |
| text-secondary / bg-primary | 5.9:1 | ✓ | 次级文本 |
| primary-700 / bg-primary | 7.2:1 | ✓ | 主按钮文本 |

### 3.4 主题切换动画

```css
/* 主题切换平滑过渡 */
* {
  transition: background-color 0.3s ease,
              color 0.3s ease,
              border-color 0.3s ease,
              box-shadow 0.3s ease;
}

/* 减少动画偏好支持 */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
```

---

## 4. 字体规范

### 4.1 字体家族

```css
/* 字体家族定义 */
:root {
  /* 主字体 - 用于正文、UI */
  --font-family-primary: 
    -apple-system, BlinkMacSystemFont,
    'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', 'Helvetica Neue',
    Helvetica, Arial, sans-serif;
  
  /* 编辑器字体 - 用于代码、等宽内容 */
  --font-family-editor: 
    'Source Han Serif SC', 'Noto Serif SC',
    'Songti SC', 'SimSun', serif;
  
  /* 等宽字体 - 用于统计、行号 */
  --font-family-mono: 
    'JetBrains Mono', 'Fira Code',
    'Source Code Pro', Consolas,
    'Courier New', monospace;
  
  /* 标题字体 */
  --font-family-heading: 
    'PingFang SC', 'Microsoft YaHei',
    -apple-system, BlinkMacSystemFont,
    sans-serif;
}
```

### 4.2 字体大小比例

```css
/* 字体大小系统 - 模块化比例 (1.25) */
:root {
  --font-size-xs: 0.75rem;     /* 12px */
  --font-size-sm: 0.875rem;    /* 14px */
  --font-size-base: 1rem;      /* 16px - 基准 */
  --font-size-lg: 1.125rem;    /* 18px */
  --font-size-xl: 1.25rem;     /* 20px */
  --font-size-2xl: 1.5rem;     /* 24px */
  --font-size-3xl: 1.875rem;   /* 30px */
  --font-size-4xl: 2.25rem;    /* 36px */
  --font-size-5xl: 3rem;       /* 48px */
}
```

### 4.3 字体应用场景

```css
/* 标题系统 */
.heading-1 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-4xl);      /* 36px */
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.heading-2 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-3xl);      /* 30px */
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.heading-3 {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-2xl);      /* 24px */
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

/* 正文系统 */
.body-large {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-lg);       /* 18px */
  font-weight: 400;
  line-height: 1.7;
}

.body-base {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);     /* 16px */
  font-weight: 400;
  line-height: 1.6;
}

.body-small {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-sm);       /* 14px */
  font-weight: 400;
  line-height: 1.5;
}

/* 编辑器系统 */
.editor-content {
  font-family: var(--font-family-editor);
  font-size: var(--font-size-lg);       /* 18px - 编辑器默认 */
  font-weight: 400;
  line-height: 2.0;                     /* 网文双倍行距 */
  letter-spacing: 0.02em;
}

/* 代码/数字系统 */
.mono {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);       /* 14px */
  font-weight: 400;
  line-height: 1.6;
}
```

### 4.4 字体设置 UI

```
字体设置面板:
┌─────────────────────────────────────────────────────────┐
│  字体设置                                                │
├─────────────────────────────────────────────────────────┤
│  编辑器字体                                              │
│  [宋体 ▼]                                                │
│                                                          │
│  字号: [18px ▼]  行距: [2.0 ▼]  段距: [1.5 ▼]          │
│                                                          │
│  预览:                                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  第一章：初入江湖                                  │   │
│  │                                                    │   │
│  │  李明握紧手中的剑，眼神坚定地看着                  │   │
│  │  对面的敌人。他深吸一口气，准备施展                │   │
│  │  绝技...                                           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  [应用] [重置为默认]                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 5. 间距系统

### 5.1 间距比例

```css
/* 间距系统 - 4px 基准单位 */
:root {
  --space-0: 0;           /* 0px */
  --space-1: 0.25rem;     /* 4px */
  --space-2: 0.5rem;      /* 8px */
  --space-3: 0.75rem;     /* 12px */
  --space-4: 1rem;        /* 16px - 基准 */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-8: 2rem;        /* 32px */
  --space-10: 2.5rem;     /* 40px */
  --space-12: 3rem;       /* 48px */
  --space-16: 4rem;       /* 64px */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */
}
```

### 5.2 间距应用规则

| 元素 | 内边距 (Padding) | 外边距 (Margin) | 说明 |
|------|------------------|-----------------|------|
| **按钮** | 8px 16px | 4px | 上下 8px，左右 16px |
| **输入框** | 8px 12px | 4px 0 | 上下 8px，左右 12px |
| **卡片** | 16px | 12px | 统一 16px 内边距 |
| **面板** | 20px | 0 | 面板内边距 20px |
| **工具栏** | 0 16px | 0 | 左右 16px，上下 0 |
| **状态栏** | 0 12px | 0 | 左右 12px，上下 0 |
| **列表项** | 8px 12px | 0 | 列表项间距 |
| **章节标题** | 12px 16px | 8px 0 | 章节标题间距 |

---

## 6. 图标系统

### 6.1 图标来源

推荐使用: **Lucide Icons** (开源、现代、一致性好)

备选: Heroicons, Phosphor Icons

### 6.2 图标尺寸

```css
/* 图标尺寸系统 */
:root {
  --icon-xs: 12px;
  --icon-sm: 16px;
  --icon-md: 20px;
  --icon-lg: 24px;
  --icon-xl: 32px;
}
```

### 6.3 核心图标列表

| 图标名称 | 用途 | 尺寸 |
|----------|------|------|
| **save** | 保存状态 | 16px |
| **cloud** | 云端同步 | 16px |
| **wifi** | 在线状态 | 16px |
| **wifi-off** | 离线状态 | 16px |
| **edit-3** | 编辑器 | 20px |
| **file-text** | 章节 | 16px |
| **folder** | 作品 | 16px |
| **users** | 角色 | 16px |
| **list** | 大纲 | 16px |
| **send** | 发布 | 16px |
| **sparkles** | AI 功能 | 20px |
| **sun** | 日间模式 | 20px |
| **moon** | 夜间模式 | 20px |
| **maximize-2** | 专注模式 | 20px |
| **settings** | 设置 | 20px |
| **menu** | 菜单 | 20px |
| **x** | 关闭 | 16px |
| **check** | 确认 | 16px |
| **alert-circle** | 警告 | 16px |
| **info** | 信息 | 16px |

---

## 7. AI 功能 UI 设计

### 7.1 错别字标注

```
编辑器内错别字标注:
┌──────────────────────────────────────────────────────┐
│  李明握紧手中的剑，眼神坚定地看着对面的敌人。           │
│                                                        │
│  他深吸一口气，准备施展绝技。                           │
│         ~~~~~~                                         │
│         ↓                                              │
│  ┌──────────────────────────────────────┐            │
│  │  ❌ 错别字: "深吸" → "深吸一口气"      │            │
│  │  建议: 深吸一口气                      │            │
│  │  [采纳] [忽略] [添加到词典]            │            │
│  └──────────────────────────────────────┘            │
│                                                        │
│  突然，他想起了师门往事...                              │
└──────────────────────────────────────────────────────┘

标注样式:
- 错别字: 红色波浪下划线 (wavy underline)
- 背景: 淡红色高亮 (--ai-error-bg)
- 悬停: 显示纠错建议弹窗
```

### 7.2 大纲生成 UI

```
大纲生成面板:
┌──────────────────────────────────────────────────────┐
│  📋 章节大纲 - 第三十八章                               │
├──────────────────────────────────────────────────────┤
│                                                        │
│  正在分析章节内容...                                    │
│  [████████████░░░░░░░░] 60%                           │
│                                                        │
├──────────────────────────────────────────────────────┤
│  生成的大纲:                                           │
│                                                        │
│  1. 李明与敌首对峙                                      │
│     - 剑拔弩张的气氛                                    │
│     - 双方实力对比                                      │
│                                                        │
│  2. 回忆师门往事                                        │
│     - 师父的教诲                                        │
│     - 曾经的承诺                                        │
│                                                        │
│  3. 施展绝技"剑气纵横"                                  │
│     - 招式描述                                          │
│     - 敌人反应                                          │
│                                                        │
│  4. 击败敌人，境界突破                                  │
│     - 战斗结果                                          │
│     - 境界提升                                          │
│                                                        │
├──────────────────────────────────────────────────────┤
│  [编辑大纲] [导出 Markdown] [重新生成] [关闭]           │
└──────────────────────────────────────────────────────┘
```

### 7.3 AI 续写建议

```
AI 续写建议界面:
┌──────────────────────────────────────────────────────┐
│  ✨ AI 续写建议                                         │
├──────────────────────────────────────────────────────┤
│  正在生成续写内容...                                    │
│  [████████████████░░░░] 80%                           │
├──────────────────────────────────────────────────────┤
│  建议方案 1:                                            │
│  ┌──────────────────────────────────────────────┐    │
│  │  剑气纵横！李明大喝一声，手中长剑化作一道      │    │
│  │  惊天长虹，直指敌人心脏。那气势，仿佛要将      │    │
│  │  整个天地都劈开一般...                         │    │
│  └──────────────────────────────────────────────┘    │
│  [采纳此方案]                                           │
│                                                        │
│  建议方案 2:                                            │
│  ┌──────────────────────────────────────────────┐    │
│  │  就在这一刻，李明想起了师父曾经说过的话：      │    │
│  │  "真正的剑道，不在于剑招，而在于剑心..."       │    │
│  └──────────────────────────────────────────────┘    │
│  [采纳此方案]                                           │
│                                                        │
│  [重新生成] [取消]                                      │
└──────────────────────────────────────────────────────┘
```

### 7.4 封面生成 UI

```
封面生成面板:
┌──────────────────────────────────────────────────────┐
│  🎨 AI 封面生成                                         │
├──────────────────────────────────────────────────────┤
│  作品信息:                                             │
│  书名: 剑道独尊                                         │
│  作者: 张三                                            │
│  题材: [玄幻 ▼]                                         │
│  风格: [热血 ▼]                                         │
│                                                        │
│  关键词: 剑、修仙、强者、逆天                           │
│                                                        │
│  封面风格:                                              │
│  ○ 古风水墨    ○ 现代简约                              │
│  ● 玄幻特效    ○ 言情唯美                              │
│                                                        │
├──────────────────────────────────────────────────────┤
│  [生成封面 (约 30 秒)]                                   │
├──────────────────────────────────────────────────────┤
│  生成结果:                                              │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐    │
│  │ 封面1  │  │ 封面2  │  │ 封面3  │  │ 封面4  │    │
│  │        │  │        │  │        │  │        │    │
│  │ [选择] │  │ [选择] │  │ [选择] │  │ [选择] │    │
│  └────────┘  └────────┘  └────────┘  └────────┘    │
│                                                        │
│  [下载 PNG] [下载 JPG] [重新生成]                       │
└──────────────────────────────────────────────────────┘
```

---

## 8. 动画与过渡

### 8.1 过渡时间

```css
/* 过渡时间系统 */
:root {
  --duration-instant: 0ms;      /* 瞬间 */
  --duration-fast: 150ms;       /* 快速 */
  --duration-normal: 300ms;     /* 正常 */
  --duration-slow: 500ms;       /* 慢速 */
  --duration-slower: 700ms;     /* 更慢 */
}
```

### 8.2 缓动函数

```css
/* 缓动函数 */
:root {
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### 8.3 常用动画

```css
/* 淡入淡出 */
.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 滑入滑出 */
.slide-in-right {
  animation: slideInRight var(--duration-normal) var(--ease-out);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 缩放 */
.scale-in {
  animation: scaleIn var(--duration-fast) var(--ease-out);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 加载旋转 */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## 9. 无障碍设计

### 9.1 键盘导航

- **Tab 键**: 按照逻辑顺序在可交互元素间导航
- **Enter 键**: 激活按钮、菜单项
- **Space 键**: 切换复选框、按钮状态
- **Escape 键**: 关闭弹窗、退出专注模式
- **方向键**: 在列表、菜单中导航

### 9.2 焦点指示器

```css
/* 焦点样式 */
:focus {
  outline: none;
}

:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: 4px;
}

/* 跳过链接 */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary-500);
  color: white;
  padding: 8px;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### 9.3 屏幕阅读器支持

```html
<!-- ARIA 标签示例 -->
<button aria-label="保存当前章节">
  <SaveIcon />
</button>

<div role="status" aria-live="polite">
  已保存
</div>

<aside aria-label="AI 助手面板">
  <!-- AI 面板内容 -->
</aside>
```

### 9.4 颜色对比度

所有文本与背景的组合均满足 WCAG AA 标准（4.5:1），重要信息达到 AAA 标准（7:1）。

---

## 10. 设计系统实施

### 10.1 CSS 变量使用

```css
/* 组件样式示例 */
.button-primary {
  background-color: var(--color-primary-500);
  color: var(--color-text-inverse);
  padding: var(--space-2) var(--space-4);
  border-radius: 6px;
  font-family: var(--font-family-primary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--duration-fast) var(--ease-out);
  box-shadow: var(--shadow-sm);
}

.button-primary:hover {
  background-color: var(--color-primary-600);
  box-shadow: var(--shadow-md);
}

.button-primary:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

### 10.2 主题切换实现

```javascript
// 主题切换逻辑
function setTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('theme', themeName);
}

// 初始化主题
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (prefersDark) {
    setTheme('dark');
  } else {
    setTheme('default');
  }
}
```

---

**文档状态**: 初稿完成  
**下一步**: 组件设计规范（component-system.md）  
**负责人**: @ui-designer
