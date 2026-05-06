---
name: ai-feature-dev
description: |
  网文作者码字软件 AI 功能开发阶段。实现错别字检测、大纲生成、封面生成。
  Use when: "AI功能"、"错别字检测"、"大纲生成"、"封面生成"、"NLP"、"BERT"、"GPT"、"Stable Diffusion"
---

# AI 功能开发阶段

## 项目背景

**项目名称**：网文作者码字软件  
**AI 功能**：
- P1：错别字智能检测、AI 大纲生成
- P2：AI 封面生成

**技术栈**：
- 错别字检测：BERT/DeBERTa 微调
- 大纲生成：GPT-4/Claude API
- 封面生成：Stable Diffusion/Midjourney API

## 当前输入

- PRD 文档
- AI 技术方案
- 性能要求

## 任务说明

1. 实现错别字智能检测
2. 实现 AI 大纲生成
3. 实现 AI 封面生成
4. 集成自定义词库

## 调用的 Agent

### 1. AI Engineer
```
@ai-engineer 实现错别字智能检测功能，基于 BERT/DeBERTa 微调
```

**开发任务**：
- 选择并微调 NLP 模型
- 实现实时检测 API
- 实现批量检测 API
- 支持自定义词典
- 优化检测速度（≤ 3 秒/千字）

### 2. AI Engineer
```
@ai-engineer 实现 AI 大纲生成功能，集成 GPT-4/Claude API
```

**开发任务**：
- 设计 Prompt 模板
- 实现内容摘要
- 提取人物出场记录
- 生成时间线和伏笔标记
- 优化生成速度（≤ 10 秒/章）

### 3. AI Engineer
```
@ai-engineer 实现 AI 封面生成功能，集成 Stable Diffusion API
```

**开发任务**：
- 设计封面生成 Prompt
- 支持多种风格（古风、现代、玄幻、言情）
- 支持文字排版（书名、作者名）
- 优化生成速度（≤ 30 秒）
- 分辨率 ≥ 1024x1536

### 4. Performance Benchmarker
```
@performance-benchmarker 验证 AI 功能性能指标
```

### 5. Code Reviewer
```
@code-reviewer 审查 AI 功能代码质量、Prompt 安全性
```

## 功能要求

根据需求文档：

### 错别字智能检测（P1）
| 指标 | 要求 |
|------|------|
| 识别准确率 | ≥ 90% |
| 检测速度 | ≤ 3 秒/千字 |
| 支持错误类型 | 错字、别字、语病、标点 |
| 自定义词典 | 支持 |

### AI 大纲生成（P1）
| 指标 | 要求 |
|------|------|
| 生成速度 | ≤ 10 秒/章 |
| 大纲内容 | 章节标题、剧情摘要、人物出场、时间线、伏笔 |
| 支持格式 | Markdown/思维导图 |

### AI 封面生成（P2）
| 指标 | 要求 |
|------|------|
| 生成速度 | ≤ 30 秒 |
| 分辨率 | ≥ 1024x1536 |
| 支持风格 | 古风、现代、玄幻、言情 |
| 输出格式 | PNG/JPG |

## 开发优先级

### Sprint 1（3-4 周）- P1 功能
- [ ] 错别字检测模型微调
- [ ] 错别字检测 API 实现
- [ ] 自定义词典支持
- [ ] AI 大纲生成 API

### Sprint 2（2-3 周）- P2 功能
- [ ] AI 封面生成 API
- [ ] 多风格支持
- [ ] 文字排版功能

## 输出物

完成后应产出：

| 输出物 | 文件位置 | 责任 Agent |
|--------|---------|-----------|
| AI 功能源码 | `src/ai/` | ai-engineer |
| 模型文件 | `models/` | ai-engineer |
| Prompt 模板 | `docs/ai/prompts.md` | ai-engineer |
| 性能测试报告 | `docs/testing/ai-performance.md` | performance-benchmarker |

## 验收标准

- [ ] 错别字检测准确率 ≥ 90%
- [ ] 检测速度 ≤ 3 秒/千字
- [ ] 大纲生成速度 ≤ 10 秒/章
- [ ] 封面生成速度 ≤ 30 秒
- [ ] 支持自定义词典
- [ ] 代码通过 Code Review

## 下一步

AI 功能开发完成后，进入 **测试阶段**：
```
调用 testing Skill
```
