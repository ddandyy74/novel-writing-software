---
name: requirements-analysis
description: |
  网文作者码字软件需求分析阶段。完善需求文档、定义功能优先级、进行用户研究。
  Use when: "需求分析"、"PRD"、"需求文档"、"功能规划"、"产品定义"、"用户研究"、"竞品分析"
---

# 需求分析阶段

## 项目背景

**项目名称**：网文作者码字软件  
**目标用户**：网文签约作者、自由撰稿人、小说创作者  
**核心目标**：开发集创作、管理、智能辅助于一体的网文创作工具

## 当前输入

- 需求文档：`网文作者码字软件需求文档.md`
- 已定义的核心功能：
  - P0：实时自动保存、长文本撤销
  - P1：错别字智能检测、AI 大纲生成、多平台一键发布
  - P2：AI 封面生成

## 任务说明

1. 完善产品需求文档（PRD）
2. 定义功能成功指标
3. 进行用户研究和竞品分析
4. 确定功能优先级

## 调用的 Agent

按顺序调用以下全局 Agent：

### 1. Product Manager
```
@product-manager 根据需求文档完善 PRD，定义每个功能的成功指标和验收标准
```

**应输出**：
- 完整的 PRD 文档
- 每个功能的成功指标
- 非功能需求细化

### 2. UX Researcher
```
@ux-researcher 针对网文作者群体进行用户研究，验证需求文档中的痛点是否真实
```

**应输出**：
- 用户画像
- 核心痛点验证
- 用户旅程地图

### 3. Trend Researcher
```
@trend-researcher 分析竞品（某点作家助手、某茄、晋江写作助手、Scrivener）的功能和差距
```

**应输出**：
- 竞品功能对比表
- 差异化机会点
- 市场定位建议

### 4. Sprint Prioritizer
```
@sprint-prioritizer 根据 PRD 和资源情况，规划功能优先级和 Sprint 安排
```

**应输出**：
- 功能优先级矩阵
- Sprint 规划建议
- 时间线估算

## 输出物

完成后应产出：

| 输出物 | 文件位置 | 责任 Agent |
|--------|---------|-----------|
| 完整 PRD | `docs/PRD.md` | product-manager |
| 用户研究报告 | `docs/user-research.md` | ux-researcher |
| 竞品分析报告 | `docs/competitive-analysis.md` | trend-researcher |
| Sprint 规划 | `docs/sprint-planning.md` | sprint-prioritizer |

## 验收标准

- [ ] PRD 包含所有 P0/P1/P2 功能的详细说明
- [ ] 每个功能都有明确的成功指标
- [ ] 用户研究覆盖至少 3 类用户画像
- [ ] 竞品分析覆盖至少 4 个主要竞品
- [ ] Sprint 规划符合需求文档中的时间建议

## 下一步

需求分析完成后，进入 **架构设计阶段**：
```
调用 architecture-design Skill
```
