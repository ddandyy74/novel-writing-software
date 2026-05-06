# AI 功能模块

网文作者码字软件的 AI 功能模块，包括错别字检测、大纲生成和封面生成。

## 功能列表

| 功能 | 优先级 | 描述 | 技术方案 |
|------|--------|------|----------|
| 错别字智能检测 | P1 | 检测错字、别字、语病、标点错误 | 本地模型 + 云端 API 混合方案 |
| AI 大纲生成 | P1 | 分析章节内容，生成结构化大纲 | GPT-4 / Claude API |
| AI 封面生成 | P2 | 根据作品题材生成封面 | Stable Diffusion API |

## 目录结构

```
src/ai/
├── spell-check/              # 错别字检测
│   ├── index.ts              # API 入口
│   ├── detector.ts           # 检测逻辑
│   ├── dict.ts               # 自定义词典
│   └── types.ts              # 类型定义
├── outline-gen/              # 大纲生成
│   ├── index.ts              # API 入口
│   ├── generator.ts          # 生成逻辑
│   └── prompts.ts            # Prompt 模板
├── cover-gen/                # 封面生成
│   ├── index.ts              # API 入口
│   ├── generator.ts          # 生成逻辑
│   └── prompts.ts            # Prompt 模板
├── types.ts                  # 公共类型定义
├── index.ts                  # 统一导出
└── __tests__/                # 测试文件
    └── spell-check.test.ts   # 测试示例
```

## 安装配置

### 1. 环境变量配置

复制 `.env.example` 为 `.env`，并配置必要的 API Key：

```bash
# OpenAI API（错别字检测、大纲生成）
OPENAI_API_KEY=sk-your-openai-api-key-here

# Anthropic API（大纲生成）
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here

# Stable Diffusion API（封面生成）
STABILITY_API_KEY=sk-your-stability-api-key-here
# 或
REPLICATE_API_TOKEN=r8_your-replicate-api-token-here
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
```

## 使用方法

### 错别字检测

```typescript
import { checkSpelling } from './ai/spell-check';

// 本地模型检测（快速）
const result = await checkSpelling(text, { useLocal: true });

// 云端 API 检测（高精度）
const result = await checkSpelling(text, {
  openaiApiKey: process.env.OPENAI_API_KEY,
});

// 批量检测
import { batchCheckSpelling } from './ai/spell-check';
const results = await batchCheckSpelling([text1, text2, text3]);
```

#### 响应格式

```typescript
interface SpellCheckResult {
  text: string;              // 原始文本
  errors: SpellCheckError[]; // 错误列表
  processingTime: number;    // 处理时间（毫秒）
  source: 'local' | 'cloud'; // 来源
}

interface SpellCheckError {
  position: number;          // 错误位置
  original: string;          // 原始文本
  suggestion: string;        // 建议修改
  type: '错字' | '别字' | '语病' | '标点';
  confidence: number;        // 置信度
  reason?: string;           // 错误原因
}
```

### 大纲生成

```typescript
import { generateOutline, outlineToMarkdown } from './ai/outline-gen';

const result = await generateOutline(
  {
    workId: 'work-001',
    chapterId: 'chapter-001',
    chapterTitle: '风起云涌',
    chapterContent: '...', // 章节内容
    previousOutlines: [], // 前文大纲（可选）
  },
  {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  }
);

// 转换为 Markdown
const markdown = outlineToMarkdown(result.outline);
```

#### 响应格式

```typescript
interface OutlineGenerateResult {
  workId: string;
  chapterId: string;
  outline: OutlineChapter;
  generatedAt: string;
  processingTime: number;
}

interface OutlineChapter {
  chapter: number;
  title: string;
  summary: string;           // 剧情摘要
  characters: string[];      // 出场人物
  events: string[];          // 关键事件
  foreshadowing: string[];   // 伏笔标记
  timeline?: string;         // 时间线
}
```

### 封面生成

```typescript
import { generateCover } from './ai/cover-gen';

const result = await generateCover(
  {
    workId: 'work-001',
    workTitle: '天机阁',
    author: '李明',
    genre: '玄幻',
    style: '玄幻',
    tags: ['修仙', '神秘'],
    description: '作品简介...',
    options: {
      samples: 4, // 生成 4 个方案
    },
  },
  {
    stabilityApiKey: process.env.STABILITY_API_KEY,
  }
);
```

#### 响应格式

```typescript
interface CoverGenerateResult {
  workId: string;
  images: CoverImage[];
  generatedAt: string;
  processingTime: number;
}

interface CoverImage {
  versionId: string;
  imageUrl: string;          // Base64 或 CDN URL
  seed?: number;
  width: number;
  height: number;
}
```

## 后端 API

### API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/v1/ai/spell-check` | POST | 错别字检测 |
| `/api/v1/ai/spell-check/batch` | POST | 批量错别字检测 |
| `/api/v1/ai/outline/generate` | POST | 大纲生成 |
| `/api/v1/ai/cover/generate` | POST | 封面生成 |
| `/api/v1/ai/cover/styles` | GET | 获取封面风格列表 |
| `/api/v1/ai/usage/stats` | GET | 获取使用统计 |

### API 示例

#### 错别字检测

```bash
curl -X POST http://localhost:3000/api/v1/ai/spell-check \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "text": "他来到这个城市已经三年了，从一个小镇青年变成了一个成功的的企业家。",
    "options": {
      "useLocal": false
    }
  }'
```

#### 大纲生成

```bash
curl -X POST http://localhost:3000/api/v1/ai/outline/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "workId": "work-001",
    "chapterId": "chapter-001",
    "chapterTitle": "风起云涌",
    "chapterContent": "章节内容..."
  }'
```

#### 封面生成

```bash
curl -X POST http://localhost:3000/api/v1/ai/cover/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "workId": "work-001",
    "workTitle": "天机阁",
    "author": "李明",
    "genre": "玄幻",
    "style": "玄幻",
    "tags": ["修仙", "神秘"]
  }'
```

## 性能指标

| 功能 | 性能要求 | 实际指标 |
|------|----------|----------|
| 错别字检测（本地） | ≤ 3 秒/千字 | ~100ms/千字 |
| 错别字检测（云端） | ≤ 3 秒/千字 | ~2-3 秒/千字 |
| 大纲生成 | ≤ 10 秒/章 | ~5-8 秒/章 |
| 封面生成 | ≤ 30 秒 | ~20-25 秒 |

## 成本估算

| 功能 | 单次成本 | 月用量估算 | 月成本估算 |
|------|----------|-----------|-----------|
| 错别字检测（本地） | ¥0 | - | ¥0 |
| 错别字检测（云端） | ¥0.01/千字 | 100 万字 | ¥100 |
| 大纲生成 | ¥0.05/章 | 300 章 | ¥150 |
| 封面生成 | ¥0.2/张 | 50 张 | ¥100 |

**总计**: 约 ¥350/月（初期）

## 自定义词典

支持添加网文专有名词，避免误报：

```typescript
import { CustomDictionary } from './ai/spell-check';

const dict = new CustomDictionary();

// 添加自定义词汇
dict.addWord('筑基');
dict.addWord('金丹');
dict.addWord('元婴');

// 批量添加
dict.addWords(['修仙', '炼气', '化神']);

// 使用自定义词典
const detector = createSpellChecker({
  customDict: dict,
});
```

## 错误处理

所有 AI 功能都实现了：

- **失败重试机制**：最多重试 3 次
- **降级方案**：云端 API 失败时自动降级到本地模型
- **缓存机制**：使用 Redis 缓存结果，减少重复调用
- **限流保护**：防止 API 滥用

## 测试

```bash
# 运行测试
npm test

# 运行特定测试
npm test -- spell-check.test.ts
```

## 文档

- [AI 技术方案](../../docs/architecture/ai-solution.md)
- [Prompt 模板文档](../../docs/ai/prompts.md)
- [PRD](../../docs/PRD.md)

## 注意事项

1. **API Key 安全**：不要将 API Key 提交到代码仓库
2. **成本控制**：监控 API 使用量，避免超支
3. **性能优化**：优先使用本地模型，云端 API 作为备选
4. **内容审核**：生成的封面可能需要人工审核

## 下一步

- [ ] 训练网文领域专用的错别字检测模型
- [ ] 实现更多 AI 功能（续写、思路启发、剧情检查）
- [ ] 优化 Prompt 模板，提高生成质量
- [ ] 实现用户配额系统
- [ ] 添加更多封面风格选项
