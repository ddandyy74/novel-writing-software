---
name: frontend-dev
description: |
  网文作者码字软件前端开发阶段。实现编辑器、UI 组件、桌面应用。
  Use when: "前端开发"、"UI实现"、"组件开发"、"Electron"、"Tauri"、"CodeMirror"、"编辑器开发"
---

# 前端开发阶段

## 项目背景

**项目名称**：网文作者码字软件  
**技术栈**：Electron/Tauri + React/Vue + CodeMirror/Slate.js  
**核心功能**：实时保存、长文本撤销、主题切换、分屏写作

## 当前输入

- PRD 文档
- UI 设计规范
- 系统架构设计
- 性能要求（启动 <3s、保存 <100ms）

## 任务说明

1. 搭建项目基础框架
2. 实现编辑器核心功能
3. 实现实时自动保存
4. 实现长文本撤销
5. 实现主题系统
6. 实现分屏写作模式
7. 实现桌面应用打包

## 调用的 Agent

### 1. Frontend Developer
```
@frontend-developer 搭建前端项目框架，实现编辑器核心功能
```

**开发任务**：
- 搭建 Electron/Tauri + React/Vue 项目
- 集成 CodeMirror/Slate.js 编辑器
- 实现实时自动保存（本地 + 云端）
- 实现长文本撤销（50 步、2000 字）
- 实现主题切换（护眼、夜间、默认）
- 实现分屏写作模式

### 2. UI Designer
```
@ui-designer 协助前端开发，确保 UI 实现符合设计规范
```

### 3. Performance Benchmarker
```
@performance-benchmarker 验证前端性能指标（启动 <3s、保存 <100ms）
```

### 4. Code Reviewer
```
@code-reviewer 审查前端代码质量、性能优化、最佳实践
```

## 开发优先级

根据需求文档的功能优先级：

### Sprint 1（1-2 周）- P0 功能
- [ ] 项目框架搭建
- [ ] 编辑器基础功能
- [ ] 实时自动保存
- [ ] 长文本撤销

### Sprint 2（2-3 周）- 用户体验
- [ ] 主题系统
- [ ] 分屏写作模式
- [ ] 快捷键系统
- [ ] 性能优化

## 技术要点

### 实时自动保存
- 每输入一个字符立即触发保存
- 断网时保存到本地 SQLite
- 联网时自动同步到云端
- 保存延迟 < 100ms

### 长文本撤销
- 支持至少 50 步撤销
- 每步最多 2000 字内容变更
- 撤销响应 < 200ms
- 历史版本可视化

### 性能要求
| 指标 | 要求 |
|------|------|
| 启动时间 | ≤ 3 秒 |
| 保存延迟 | ≤ 100ms |
| 撤销响应 | ≤ 200ms |

## 输出物

完成后应产出：

| 输出物 | 文件位置 | 责任 Agent |
|--------|---------|-----------|
| 前端源码 | `src/frontend/` | frontend-developer |
| 组件库 | `src/frontend/components/` | frontend-developer |
| 性能测试报告 | `docs/testing/frontend-performance.md` | performance-benchmarker |

## 验收标准

- [ ] 编辑器支持实时自动保存
- [ ] 撤销功能支持 50 步、2000 字
- [ ] 至少 3 种主题可用
- [ ] 启动时间 < 3 秒
- [ ] 保存延迟 < 100ms
- [ ] 代码通过 Code Review

## 下一步

前端开发完成后，进入 **后端开发阶段**：
```
调用 backend-dev Skill
```
