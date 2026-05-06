# AI Prompt 模板文档

**版本**: v1.0  
**日期**: 2026-05-07  
**状态**: AI 功能开发阶段

---

## 1. 错别字检测 Prompt

### 1.1 基础检测 Prompt

```
请检测以下文本中的错别字、语病和标点错误，并以 JSON 格式返回结果：

文本：
{文本内容}

自定义词典（这些词不应被视为错误）：
{自定义词典列表}

忽略的错误类型：
{忽略的错误类型列表}

请返回以下格式的 JSON：
{
  "errors": [
    {
      "position": 错误位置（字符索引）,
      "original": "原始文本",
      "suggestion": "建议修改",
      "type": "错误类型（错字/别字/语病/标点）",
      "reason": "错误原因",
      "confidence": 置信度（0-1之间的小数）
    }
  ]
}
```

### 1.2 高级检测 Prompt（带上下文）

```
你是一个专业的中文校对助手，擅长检测错别字、语病和标点错误。请对以下文本进行全面检查：

## 文本上下文
作品标题：{作品标题}
章节：第{章节号}章
前文摘要：{前文摘要}

## 待检测文本
{文本内容}

## 检查要求
1. **错字检测**：识别错误的汉字，如"的地得"混用
2. **别字检测**：识别同音字错误，如"既然"误写为"即然"
3. **语病检测**：
   - 成分赘余（如"通过...使..."）
   - 否定失当（如"防止...不再"）
   - 搭配不当
   - 语序不当
4. **标点检测**：
   - 连续标点（如"，。"）
   - 中英文标点混用
   - 缺少标点

## 输出格式（JSON）
{
  "errors": [
    {
      "position": 数字,
      "original": "原文",
      "suggestion": "建议",
      "type": "错误类型",
      "reason": "原因",
      "confidence": 0.95
    }
  ]
}

## 注意事项
- 专有名词（人名、地名、门派名等）不应被视为错误
- 网文专用术语（如"筑基"、"金丹"）不应被视为错误
- 置信度低于0.7的错误应谨慎提示
```

---

## 2. 大纲生成 Prompt

### 2.1 单章大纲生成 Prompt

```
你是一个专业的网文大纲编辑，请分析以下章节内容，生成结构化大纲。

## 章节内容
标题：{章节标题}
内容：
{章节内容}

## 前文大纲
{前文大纲列表}

## 任务要求
1. 提取章节标题（去除章节号，如"第一章 风起云涌"提取为"风起云涌"）
2. 生成 50-100 字的剧情摘要
3. 列出出场人物（仅列出有名字或重要角色）
4. 列出关键事件（3-5 个，简明扼要）
5. 标记伏笔（如有暗示后续发展的情节）
6. 提取时间线（如"第三天清晨"、"半年后"等）

## 输出格式（JSON）
{
  "chapter": 章节序号,
  "title": "章节标题",
  "summary": "剧情摘要",
  "characters": ["人物1", "人物2"],
  "events": ["事件1", "事件2", "事件3"],
  "foreshadowing": ["伏笔1", "伏笔2"],
  "timeline": "时间线描述"
}

## 注意事项
- 只输出 JSON，不要添加任何解释
- summary 应简洁明了，突出核心冲突或发展
- characters 只列出真正有出场的角色
- events 按时间顺序排列
- foreshadowing 可以留空数组
```

### 2.2 批量大纲生成 Prompt

```
你是一个专业的网文大纲编辑，请分析以下多个章节的内容，生成结构化大纲。

## 章节列表
{章节列表}

## 任务要求
为每个章节生成大纲，包括：
1. 章节标题
2. 剧情摘要（50-100字）
3. 出场人物
4. 关键事件（3-5个）
5. 伏笔标记

## 输出格式（JSON数组）
[
  {
    "chapter": 1,
    "title": "章节标题",
    "summary": "剧情摘要",
    "characters": ["人物1", "人物2"],
    "events": ["事件1", "事件2"],
    "foreshadowing": ["伏笔1"]
  },
  ...
]

## 注意事项
- 保持章节间的连贯性
- 注意追踪人物出场情况
- 标记跨章节的伏笔和呼应
```

### 2.3 大纲更新 Prompt

```
你是一个专业的网文大纲编辑，章节内容有更新，请更新大纲。

## 当前大纲
{当前大纲JSON}

## 新增内容
{新增内容}

## 任务要求
1. 根据新增内容更新摘要
2. 添加新出场的人物
3. 添加新的关键事件
4. 添加新的伏笔（如有）
5. 更新时间线

## 输出格式
返回完整的更新后大纲，格式同上。
```

---

## 3. 封面生成 Prompt

### 3.1 Stable Diffusion Prompt 模板

#### 古风风格
```
prompt: "ancient Chinese style novel book cover, traditional painting, ink wash, elegant, classical, historical, {题材关键词}, {标签关键词}, high quality, professional, detailed, masterpiece, best quality"

negative_prompt: "low quality, worst quality, bad anatomy, bad proportions, extra digits, missing digits, blurry, watermark, signature, text, logo, username, modern elements, western style, cars, buildings"
```

#### 现代风格
```
prompt: "modern novel book cover, contemporary, urban, clean, minimalist, stylish, {题材关键词}, {标签关键词}, high quality, professional, detailed, masterpiece, best quality"

negative_prompt: "low quality, worst quality, bad anatomy, bad proportions, extra digits, missing digits, blurry, watermark, signature, text, logo, username, ancient elements, traditional, historical"
```

#### 玄幻风格
```
prompt: "fantasy novel book cover, magical, mystical, ethereal, epic, divine, supernatural, {题材关键词}, {标签关键词}, high quality, professional, detailed, masterpiece, best quality"

negative_prompt: "low quality, worst quality, bad anatomy, bad proportions, extra digits, missing digits, blurry, watermark, signature, text, logo, username, mundane, ordinary, realistic"
```

#### 言情风格
```
prompt: "romantic novel book cover, soft, dreamy, elegant, beautiful, emotional, {题材关键词}, {标签关键词}, high quality, professional, detailed, masterpiece, best quality"

negative_prompt: "low quality, worst quality, bad anatomy, bad proportions, extra digits, missing digits, blurry, watermark, signature, text, logo, username, dark, horror, scary, ugly"
```

#### 科幻风格
```
prompt: "sci-fi novel book cover, futuristic, cyberpunk, technological, space, neon, {题材关键词}, {标签关键词}, high quality, professional, detailed, masterpiece, best quality"

negative_prompt: "low quality, worst quality, bad anatomy, bad proportions, extra digits, missing digits, blurry, watermark, signature, text, logo, username, medieval, ancient, fantasy creatures"
```

#### 悬疑风格
```
prompt: "mystery thriller novel book cover, dark, atmospheric, noir, suspense, {题材关键词}, {标签关键词}, high quality, professional, detailed, masterpiece, best quality"

negative_prompt: "low quality, worst quality, bad anatomy, bad proportions, extra digits, missing digits, blurry, watermark, signature, text, logo, username, bright colors, happy, cheerful"
```

### 3.2 题材关键词映射

| 题材 | 关键词 |
|------|--------|
| 玄幻 | cultivation, martial arts, fantasy world, mythical creatures |
| 奇幻 | magic, fantasy, dragons, elves, mystical realm |
| 武侠 | martial arts, swordsman, wuxia, ancient China |
| 仙侠 | immortal cultivation, flying swords, magical realms |
| 都市 | modern city, urban life, skyscrapers, contemporary |
| 现实 | realistic, slice of life, everyday, relatable |
| 军事 | military, soldiers, war, tactical |
| 历史 | historical, ancient times, period drama, historical figures |
| 游戏 | gaming, virtual reality, MMO, fantasy game |
| 科幻 | science fiction, futuristic, space, technology |
| 灵异 | supernatural, ghost, paranormal, mysterious |
| 二次元 | anime style, manga, vibrant colors, kawaii |
| 轻小说 | light novel style, anime inspired, youthful, vibrant |

---

## 4. AI 辅助写作 Prompt

### 4.1 思路启发 Prompt

```
你是一个专业的网文创作顾问，作者在写作过程中遇到了卡文问题，请提供思路启发。

## 作品信息
标题：{作品标题}
类型：{作品类型}

## 已有内容
{前文内容}

## 大纲
{作品大纲}

## 当前困境
{用户描述的困境或"作者暂时没有明确思路"}

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
}

## 注意事项
- 建议应与已有剧情风格一致
- 考虑角色性格和动机
- 提供多样化的选择
- 避免陈词滥调
```

### 4.2 正文生成 Prompt

```
你是一个专业的网文作家，请根据以下信息生成章节正文。

## 作品信息
标题：{作品标题}
类型：{作品类型}
风格：{作品风格}

## 章节大纲
章节：第 {章节号} 章
标题：{章节标题}
剧情：{剧情摘要}
关键事件：{事件列表}

## 相关角色
{角色信息列表}

## 前文内容（最近 5 章）
{前文内容}

## 写作要求
1. 字数：约 {目标字数} 字
2. 保持与前文风格一致
3. 符合角色性格设定
4. 合理衔接前文剧情
5. 完整展现大纲中的关键事件

## 输出要求
直接输出章节正文，不要添加任何解释。
```

### 4.3 续写 Prompt

```
你是一个专业的网文作家，请续写以下内容。

## 前文内容
{前文内容}

## 续写要求
1. 字数：约 {目标字数} 字
2. 保持与前文风格一致
3. 合理衔接前文
4. 推动剧情发展

## 直接输出续写内容
```

### 4.4 剧情一致性检查 Prompt

```
你是一个专业的网文编辑，请检查以下作品是否存在剧情一致性问题。

## 作品信息
标题：{作品标题}

## 大纲
{大纲列表}

## 角色设定
{角色设定列表}

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
}

## 注意事项
- 只报告真正的问题，不要过度挑剔
- 提供具体的位置和描述
- 给出可行的修复建议
```

---

## 5. Prompt 优化建议

### 5.1 通用优化技巧

1. **明确角色定位**：开头明确 AI 的角色（如"你是一个专业的网文编辑"）
2. **提供充分上下文**：包含必要的前文信息、角色设定等
3. **结构化输出**：要求 JSON 格式输出，便于程序解析
4. **设置温度参数**：
   - 错别字检测：temperature = 0.3（低随机性）
   - 大纲生成：temperature = 0.3（低随机性）
   - 正文生成：temperature = 0.7（中等随机性）
   - 思路启发：temperature = 0.8（高随机性）

### 5.2 中文优化技巧

1. **使用中文指令**：对中文用户更友好
2. **添加示例**：提供正确和错误的示例
3. **强调格式**：明确要求 JSON 输出格式
4. **限制长度**：控制输出长度，避免冗余

### 5.3 网文特色优化

1. **网文术语库**：添加网文专用术语到自定义词典
2. **风格识别**：根据作品类型调整 Prompt
3. **角色一致性**：在生成时传入角色卡片信息
4. **伏笔追踪**：在大纲生成时特别标注伏笔

---

## 6. 成本估算

| 功能 | Prompt 长度 | 模型 | 单次成本 |
|------|------------|------|----------|
| 错别字检测 | ~500 tokens | GPT-4 Turbo | ¥0.01/千字 |
| 大纲生成 | ~2000 tokens | Claude 3 Sonnet | ¥0.05/章 |
| 思路启发 | ~3000 tokens | Claude 3 Sonnet | ¥0.02/次 |
| 正文生成 | ~5000 tokens | Claude 3 Sonnet | ¥0.3/章 |
| 续写 | ~3000 tokens | Claude 3 Sonnet | ¥0.05/次 |
| 剧情检查 | ~8000 tokens | Claude 3 Opus | ¥0.5/次 |
| 封面生成 | ~200 tokens | Stable Diffusion | ¥0.2/张 |

---

**文档状态**: 初稿完成  
**下一步**: AI 功能集成测试
