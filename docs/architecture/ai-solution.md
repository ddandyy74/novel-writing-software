# 网文作者码字软件 AI 技术方案

**版本**: v1.0  
**日期**: 2026-05-06  
**架构师**: AI 工程师

---

## 1. AI 功能概述

### 1.1 AI 功能列表

| 功能 | 优先级 | 描述 |
|------|--------|------|
| **错别字智能检测** | P1 | 检测错字、别字、语病、标点错误 |
| **AI 智能大纲生成** | P1 | 分析章节内容，生成结构化大纲 |
| **AI 思路启发** | P1 | 分析前文，提供剧情走向建议 |
| **AI 正文生成** | P1 | 根据大纲 + 前文 + 角色，生成正文 |
| **AI 续写功能** | P1 | 续写用户已写内容 |
| **剧情一致性检查** | P1 | 检测剧情冲突、逻辑漏洞 |
| **AI 封面生成** | P2 | 根据作品题材生成封面 |

### 1.2 AI 技术栈

| 功能 | 模型类型 | 推荐模型 | 部署方式 |
|------|----------|----------|----------|
| 错别字检测 | NLP 分类/序列标注 | BERT/DeBERTa | 本地/云端 |
| 大纲生成 | 大语言模型 | GPT-4/Claude | 云端 API |
| 正文生成 | 大语言模型 | GPT-4/Claude | 云端 API |
| 续写功能 | 大语言模型 | GPT-4/Claude | 云端 API |
| 剧情检查 | 大语言模型 | GPT-4/Claude | 云端 API |
| 封面生成 | 图像生成模型 | Stable Diffusion | 云端 API |

---

## 2. 错别字智能检测

### 2.1 技术方案

#### 方案选择

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **本地 BERT 模型** | 无网络延迟、隐私保护好 | 准确率受限、占用资源 | 对隐私要求高的用户 |
| **云端 API** | 准确率高、持续更新 | 有网络延迟、成本高 | 大部分用户 |
| **混合方案** | 平衡性能和成本 | 实现复杂 | 推荐 |

**推荐方案**: 混合方案
- 本地部署轻量级模型（快速检测）
- 云端部署高精度模型（深度检测）

#### 模型选型

```
本地模型:
- 模型: BERT-base-chinese 或 DeBERTa-v3-base
- 大小: ~400MB
- 推理速度: ~100ms/千字
- 准确率: ~85%

云端模型:
- 模型: GPT-4 / Claude
- 推理速度: ~3s/千字
- 准确率: ~95%
```

### 2.2 实现方案

#### 本地模型部署

```python
# 使用 Transformers 部署 BERT
from transformers import BertTokenizer, BertForTokenClassification
import torch

class SpellChecker:
    def __init__(self, model_path):
        self.tokenizer = BertTokenizer.from_pretrained(model_path)
        self.model = BertForTokenClassification.from_pretrained(model_path)
        self.model.eval()
    
    def detect_errors(self, text):
        # 分词
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True)
        
        # 推理
        with torch.no_grad():
            outputs = self.model(**inputs)
            predictions = torch.argmax(outputs.logits, dim=-1)
        
        # 解析结果
        errors = []
        for i, pred in enumerate(predictions[0]):
            if pred != 0:  # 0 表示正确
                errors.append({
                    "position": i,
                    "error_type": self.get_error_type(pred),
                    "original": text[i],
                    "suggestion": self.get_suggestion(text[i], pred)
                })
        
        return errors
```

#### 云端 API 调用

```javascript
// 调用 GPT-4 进行错别字检测
async function detectSpellingErrors(content) {
  const prompt = `请检测以下文本中的错别字、语病和标点错误，并以 JSON 格式返回结果：

文本：
${content}

请返回以下格式的 JSON：
{
  "errors": [
    {
      "position": 错误位置（字符索引）,
      "original": "原始文本",
      "suggestion": "建议修改",
      "type": "错误类型（错字/别字/语病/标点）",
      "reason": "错误原因"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: "你是一个专业的中文校对助手，擅长检测错别字、语病和标点错误。" },
      { role: "user", content: prompt }
    ],
    temperature: 0.3,
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
}
```

### 2.3 性能优化

```javascript
// 批量检测优化
async function batchDetectErrors(chapters) {
  const batchSize = 5;
  const results = [];
  
  for (let i = 0; i < chapters.length; i += batchSize) {
    const batch = chapters.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(ch => detectSpellingErrors(ch.content))
    );
    results.push(...batchResults);
  }
  
  return results;
}

// 缓存常见错误
const errorCache = new Map();

async function detectWithCache(text) {
  const hash = createHash(text);
  
  if (errorCache.has(hash)) {
    return errorCache.get(hash);
  }
  
  const result = await detectSpellingErrors(text);
  errorCache.set(hash, result);
  
  return result;
}
```

---

## 3. AI 智能大纲生成

### 3.1 技术方案

#### 模型选择

```
推荐模型:
- GPT-4 Turbo: 效果最好，成本较高
- Claude 3 Opus: 效果好，成本适中
- Claude 3 Sonnet: 平衡效果和成本
- 国产模型: 成本低，效果可接受

推荐使用: Claude 3 Sonnet（平衡性价比）
```

### 3.2 实现方案

#### Prompt 设计

```javascript
const outlinePrompt = `你是一个专业的网文大纲编辑，请分析以下章节内容，生成结构化大纲。

## 章节内容
标题：${chapterTitle}
内容：
${chapterContent}

## 前文大纲
${previousOutlines}

## 任务要求
1. 提取章节标题
2. 生成 50-100 字的剧情摘要
3. 列出出场人物
4. 列出关键事件（3-5 个）
5. 标记伏笔（如有）

## 输出格式（JSON）
{
  "chapter": 章节序号,
  "title": "章节标题",
  "summary": "剧情摘要",
  "characters": ["人物1", "人物2"],
  "events": ["事件1", "事件2", "事件3"],
  "foreshadowing": ["伏笔1", "伏笔2"]
}`;
```

#### API 调用

```javascript
async function generateOutline(chapter, previousOutlines) {
  const response = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: outlinePrompt
          .replace('${chapterTitle}', chapter.title)
          .replace('${chapterContent}', chapter.content)
          .replace('${previousOutlines}', JSON.stringify(previousOutlines))
      }
    ]
  });

  const result = JSON.parse(response.content[0].text);
  
  return {
    chapterId: chapter.id,
    ...result,
    generatedAt: new Date().toISOString()
  };
}
```

### 3.3 大纲更新策略

```javascript
// 增量更新大纲
async function updateOutline(workId, chapterId) {
  // 1. 获取当前章节
  const chapter = await getChapter(chapterId);
  
  // 2. 获取前 3 章的大纲
  const previousOutlines = await getPreviousOutlines(workId, chapter.order, 3);
  
  // 3. 生成新大纲
  const outline = await generateOutline(chapter, previousOutlines);
  
  // 4. 保存大纲
  await saveOutline(outline);
  
  // 5. 更新后续章节的大纲（异步）
  updateFollowingOutlines(workId, chapter.order);
}
```

---

## 4. AI 正文生成

### 4.1 技术方案

#### 上下文构建

```
正文生成需要的上下文:
1. 章节大纲（必须）
2. 前 5 章内容（必须）
3. 相关角色卡片（必须）
4. 作品风格设定（可选）
5. 世界观设定（可选）
```

#### 上下文窗口管理

```
模型上下文限制:
- GPT-4 Turbo: 128K tokens (~50 万字)
- Claude 3 Opus/Sonnet: 200K tokens (~80 万字)

策略:
1. 前 5 章: ~2-3 万字
2. 角色卡片: ~500-1000 字/角色
3. 大纲: ~300 字
4. 风格设定: ~500 字
总计: ~3 万字（安全范围）
```

### 4.2 实现方案

#### Prompt 设计

```javascript
const contentGenerationPrompt = `你是一个专业的网文作家，请根据以下信息生成章节正文。

## 作品信息
标题：${workTitle}
类型：${genre}
风格：${style}

## 章节大纲
章节：第 ${chapterNumber} 章
标题：${chapterTitle}
剧情：${summary}
关键事件：${events.join('、')}

## 相关角色
${characters.map(ch => `
【${ch.name}】
- 年龄：${ch.age}
- 性格：${ch.personality}
- 外貌：${ch.appearance}
`).join('\n')}

## 前文内容（最近 5 章）
${previousChapters}

## 写作要求
1. 字数：约 ${targetLength} 字
2. 保持与前文风格一致
3. 符合角色性格设定
4. 合理衔接前文剧情
5. 完整展现大纲中的关键事件

## 输出要求
直接输出章节正文，不要添加任何解释。`;
```

#### 多版本生成

```javascript
async function generateChapterContent(params) {
  const versions = [];
  
  // 生成 3 个版本
  for (let i = 0; i < 3; i++) {
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4096,
      temperature: 0.7 + i * 0.1,  // 不同温度产生不同风格
      messages: [
        {
          role: "user",
          content: buildPrompt(params)
        }
      ]
    });

    versions.push({
      versionId: `v${i + 1}`,
      content: response.content[0].text,
      wordCount: countWords(response.content[0].text),
      temperature: 0.7 + i * 0.1
    });
  }
  
  return versions;
}
```

### 4.3 角色信息提取

```javascript
// 从大纲中提取角色
async function extractCharacters(outline, allCharacters) {
  const prompt = `根据以下大纲，识别需要出场的角色：

大纲：
${JSON.stringify(outline)}

所有角色：
${allCharacters.map(ch => ch.name).join('、')}

请返回需要出场的角色名称列表（JSON 数组）。`;

  const response = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 256,
    messages: [{ role: "user", content: prompt }]
  });

  const characterNames = JSON.parse(response.content[0].text);
  
  return allCharacters.filter(ch => characterNames.includes(ch.name));
}
```

---

## 5. AI 续写功能

### 5.1 技术方案

```javascript
const continuationPrompt = `你是一个专业的网文作家，请续写以下内容。

## 前文内容
${previousContent}

## 续写要求
1. 字数：约 ${targetLength} 字
2. 保持与前文风格一致
3. 合理衔接前文
4. 推动剧情发展

## 直接输出续写内容`;
```

### 5.2 实现方案

```javascript
async function continueWriting(content, targetLength = 500) {
  const response = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 1024,
    temperature: 0.7,
    messages: [
      {
        role: "user",
        content: continuationPrompt
          .replace('${previousContent}', content)
          .replace('${targetLength}', targetLength)
      }
    ]
  });

  return {
    continuation: response.content[0].text,
    wordCount: countWords(response.content[0].text)
  };
}
```

---

## 6. AI 思路启发

### 6.1 技术方案

```javascript
const inspirationPrompt = `你是一个专业的网文创作顾问，作者在写作过程中遇到了卡文问题，请提供思路启发。

## 作品信息
标题：${workTitle}
类型：${genre}

## 已有内容
${previousChapters}

## 大纲
${outline}

## 当前困境
${userContext || '作者暂时没有明确思路'}

## 任务
请提供 3-5 个可能的剧情走向建议，每个建议包含：
1. 建议标题
2. 剧情走向描述（50-100 字）
3. 可能的冲突点
4. 角色发展空间

## 输出格式（JSON）
{
  "suggestions": [
    {
      "title": "建议标题",
      "description": "剧情走向描述",
      "conflicts": ["冲突点1", "冲突点2"],
      "characterDevelopment": "角色发展空间"
    }
  ]
}`;
```

### 6.2 实现方案

```javascript
async function provideInspiration(params) {
  const response = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 1024,
    temperature: 0.8,  // 更高的温度产生更有创意的建议
    messages: [
      {
        role: "user",
        content: buildInspirationPrompt(params)
      }
    ]
  });

  const result = JSON.parse(response.content[0].text);
  
  return result.suggestions;
}
```

---

## 7. 剧情一致性检查

### 7.1 技术方案

```javascript
const consistencyCheckPrompt = `你是一个专业的网文编辑，请检查以下作品是否存在剧情一致性问题。

## 作品信息
标题：${workTitle}

## 大纲
${outlines}

## 角色设定
${characters}

## 任务
请检查以下问题：
1. 剧情前后矛盾
2. 时间线错乱
3. 角色设定冲突
4. 逻辑漏洞
5. 伏笔未回收

## 输出格式（JSON）
{
  "issues": [
    {
      "type": "问题类型",
      "severity": "严重程度（high/medium/low）",
      "location": "问题位置（章节或段落）",
      "description": "问题描述",
      "suggestion": "修复建议"
    }
  ]
}`;
```

### 7.2 实现方案

```javascript
async function checkConsistency(workId) {
  // 1. 获取作品信息
  const work = await getWork(workId);
  const outlines = await getOutlines(workId);
  const characters = await getCharacters(workId);

  // 2. 调用 AI 检查
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",  // 使用更强的模型
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: consistencyCheckPrompt
          .replace('${workTitle}', work.title)
          .replace('${outlines}', JSON.stringify(outlines))
          .replace('${characters}', JSON.stringify(characters))
      }
    ]
  });

  const result = JSON.parse(response.content[0].text);
  
  return result.issues;
}
```

---

## 8. AI 封面生成

### 8.1 技术方案

```
模型选择:
- Stable Diffusion XL: 开源、可定制、效果好
- Midjourney: 效果最好、商业 API
- DALL-E 3: 效果好、易用

推荐: Stable Diffusion API（平衡成本和效果）
```

### 8.2 实现方案

```javascript
// 使用 Stable Diffusion API
async function generateCover(work) {
  // 1. 构建 Prompt
  const prompt = buildCoverPrompt(work);
  
  // 2. 调用 Stable Diffusion API
  const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`
    },
    body: JSON.stringify({
      text_prompts: [{ text: prompt }],
      cfg_scale: 7,
      height: 1536,
      width: 1024,
      samples: 4,
      steps: 30
    })
  });

  const result = await response.json();
  
  return result.artifacts.map((artifact, i) => ({
    versionId: `v${i + 1}`,
    imageUrl: `data:image/png;base64,${artifact.base64}`,
    seed: artifact.seed
  }));
}

function buildCoverPrompt(work) {
  const genrePrompts = {
    '玄幻': 'fantasy art, magical atmosphere, mystical landscape',
    '言情': 'romantic, elegant, soft lighting, beautiful characters',
    '都市': 'modern cityscape, contemporary style, urban atmosphere',
    '科幻': 'sci-fi, futuristic, cyberpunk, space'
  };

  return `novel book cover, ${genrePrompts[work.genre] || ''}, ${work.tags.join(', ')}, high quality, professional`;
}
```

---

## 9. AI 服务架构

### 9.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 编辑器        │  │ AI 功能面板   │  │ 设置面板      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      AI 服务网关                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ 路由       │  │ 限流       │  │ 日志       │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ 错别字检测     │  │ 大纲生成       │  │ 正文生成       │
│ (本地 BERT)   │  │ (Claude API)  │  │ (Claude API)  │
└───────────────┘  └───────────────┘  └───────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ 云端 API      │  │ 缓存 (Redis)  │  │ 队列 (任务)    │
└───────────────┘  └───────────────┘  └───────────────┘
```

### 9.2 服务实现

```javascript
// AI 服务网关
class AIServiceGateway {
  constructor() {
    this.services = {
      spellCheck: new SpellCheckService(),
      outline: new OutlineService(),
      content: new ContentService(),
      cover: new CoverService()
    };
    this.rateLimiter = new RateLimiter();
    this.cache = new RedisCache();
  }

  async call(serviceName, params, userId) {
    // 1. 限流检查
    if (!await this.rateLimiter.check(userId, serviceName)) {
      throw new Error('Rate limit exceeded');
    }

    // 2. 缓存检查
    const cacheKey = `${serviceName}:${hashParams(params)}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // 3. 调用服务
    const result = await this.services[serviceName].execute(params);

    // 4. 缓存结果
    await this.cache.set(cacheKey, result, 3600);

    // 5. 记录日志
    await this.logUsage(userId, serviceName, params, result);

    return result;
  }
}
```

---

## 10. 成本估算

### 10.1 API 成本

| 功能 | 模型 | 单次成本 | 月用量估算 | 月成本估算 |
|------|------|----------|-----------|-----------|
| 错别字检测 | 本地 BERT | ¥0 | - | ¥0 |
| 错别字检测（云端） | GPT-4 | ¥0.01/千字 | 100 万字 | ¥100 |
| 大纲生成 | Claude 3 Sonnet | ¥0.05/章 | 300 章 | ¥150 |
| 正文生成 | Claude 3 Sonnet | ¥0.3/章 | 100 章 | ¥300 |
| 续写功能 | Claude 3 Sonnet | ¥0.05/次 | 500 次 | ¥250 |
| 思路启发 | Claude 3 Sonnet | ¥0.02/次 | 200 次 | ¥40 |
| 剧情检查 | Claude 3 Opus | ¥0.5/次 | 50 次 | ¥250 |
| 封面生成 | Stable Diffusion | ¥0.2/张 | 50 张 | ¥100 |

**总计**: 约 ¥1190/月（初期）

### 10.2 成本优化策略

1. **本地模型**: 错别字检测使用本地模型，节省成本
2. **缓存策略**: 缓存常见请求，减少 API 调用
3. **批量处理**: 批量调用 API，减少请求次数
4. **模型选择**: 根据任务复杂度选择合适的模型
5. **用户配额**: 免费用户限制使用次数，付费用户无限制

---

## 11. 风险与缓解

### 11.1 技术风险

| 风险 | 可能性 | 影响 | 缓解措施 |
|------|--------|------|----------|
| AI 生成内容质量不稳定 | 高 | 中 | 多版本生成、用户选择、持续优化 Prompt |
| AI API 不可用 | 中 | 高 | 多模型备选、降级方案 |
| 成本超预期 | 中 | 中 | 使用配额、缓存优化、本地模型 |
| 内容审核风险 | 中 | 高 | 内容审核机制、用户协议 |

### 11.2 内容安全

```javascript
// 内容审核
async function moderateContent(content) {
  const response = await openai.moderations.create({
    input: content
  });

  if (response.results[0].flagged) {
    throw new Error('内容包含违规信息');
  }

  return true;
}
```

---

## 12. 下一步

1. ✅ AI 技术方案完成
2. ⏳ 进入 UI/UX 设计阶段

---

**文档状态**: 初稿完成  
**下一步**: UI/UX 设计
