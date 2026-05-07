# AI 辅助功能设计文档

**版本**: v1.0  
**日期**: 2026-05-07  
**状态**: 设计阶段

---

## 一、功能清单总览

### 1.1 全部预留功能（共 43 个）

#### AI 辅助功能（P1 - 核心）
| 功能 | 位置 | 需登录 | 红点 | 说明 |
|------|------|--------|------|------|
| 纠错 | WorkspaceStatusBar | 否 | - | 错别字、语病检测 |
| 校对 | RightToolRail | 是 | 是 | 智能校对 |
| 大纲 | RightToolRail | 是 | - | AI 大纲生成 |
| 取名 | EditorToolbar | 是 | - | 人名/地名生成 |
| 妙笔 | RightToolRail | 是 | - | AI 续写/润色 |
| 灵感 | RightToolRail | 是 | 是 | 创意提示 |
| 画师 | EditorToolbar | 是 | 是 | AI 封面生成 |

#### 编辑器功能（P1 - 基础）
| 功能 | 位置 | 需登录 | 红点 | 说明 |
|------|------|--------|------|------|
| 字体 | EditorToolbar | 否 | - | 字体大小、字体选择 |
| 背景 | EditorToolbar | 否 | - | 护眼背景色 |
| 撤销 | EditorToolbar | 否 | - | 长文本撤销 |
| 重做 | EditorToolbar | 否 | - | 重做操作 |
| 一键排版 | EditorToolbar | 否 | - | 自动排版（缩进、分段） |
| 查找替换 | EditorToolbar | 否 | - | 文本查找替换 |
| 全屏 | EditorToolbar | 否 | - | 沉浸式写作 |
| 历史 | EditorToolbar | 否 | - | 版本历史 |

#### 创作管理功能（P1 - 重要）
| 功能 | 位置 | 需登录 | 红点 | 说明 |
|------|------|--------|------|------|
| 新建卷 | ChapterSidebar | 否 | - | 创建卷管理 |
| 删除章节 | ChapterSidebar | 否 | - | 删除章节 |
| 导入章节 | ChapterSidebar | 否 | - | 从本地导入 |
| 章节排序 | ChapterSidebar | 否 | - | 拖拽排序 |
| 筛选 | ChapterSidebar | 否 | - | 章节筛选 |
| 角色 | RightToolRail | 否 | 是 | 角色卡片管理 |
| 设定 | RightToolRail | 否 | - | 世界观设定 |
| 双栏 | RightToolRail | 否 | 是 | 对照写作 |
| 写作计划 | WorkspaceStatusBar | 否 | - | 字数目标 |

#### 多平台发布功能（P1 - 重要）
| 功能 | 位置 | 需登录 | 红点 | 说明 |
|------|------|--------|------|------|
| 发布到阅文 | EditorToolbar | 是 | - | 一键发布起点/创世 |
| 发布到其他平台 | EditorToolbar | 是 | - | 发布番茄/晋江等 |
| 投稿阅文 | WriterHome | 否 | - | 编辑直投 |

#### 导入导出功能（P1 - 基础）
| 功能 | 位置 | 需登录 | 红点 | 说明 |
|------|------|--------|------|------|
| 导入 | WriterHome | 否 | - | 本地导入私密作品 |
| 模板中心 | WriterHome | 否 | - | 大纲模板、开头模板 |

#### 统计与分析功能（P2 - 增值）
| 功能 | 位置 | 需登录 | 红点 | 说明 |
|------|------|--------|------|------|
| 码字统计 | GlobalSidebar | 否 | - | 日/周/月字数统计 |
| 拼字 | RightToolRail | 否 | - | 实时字数统计 |

#### 社交功能（P2 - 增值）
| 功能 | 位置 | 需登录 | 红点 | 说明 |
|------|------|--------|------|------|
| 码字好友 | GlobalSidebar | 是 | - | 好友系统 |
| 神助社区 | GlobalSidebar | 是 | - | 写作社区 |
| 消息通知 | GlobalSidebar | 是 | 是 | 消息中心 |
| 分享口令 | WriterHome | 否 | - | 分享作品 |

#### 平台增值功能（P3 - 未来）
| 功能 | 位置 | 需登录 | 红点 | 说明 |
|------|------|--------|------|------|
| 短剧剧本 | GlobalSidebar | 是 | - | 短剧创作 |
| 阅创学堂 | GlobalSidebar | 是 | - | 写作教程 |
| 任务中心 | GlobalSidebar | 是 | - | 任务系统 |
| 墨水商店 | GlobalSidebar | 是 | - | 虚拟道具 |
| 邀请卡 | GlobalSidebar | 是 | - | 邀请奖励 |
| 装扮中心 | GlobalSidebar | 是 | - | 主题皮肤 |
| 邀请码 | WriterHome | 否 | - | 邀请码兑换 |

#### 系统功能（P1 - 基础）
| 功能 | 位置 | 需登录 | 红点 | 说明 |
|------|------|--------|------|------|
| 偏好设置 | GlobalSidebar | 否 | - | 应用设置 |
| 客服帮助 | GlobalSidebar | 否 | - | 帮助文档 |
| 同步工具 | GlobalSidebar | 否 | - | 手动同步 |
| 已隐藏 | WriterHome | 否 | - | 隐藏的作品 |
| 回收站 | WriterHome | 否 | - | 删除的作品 |
| 输入 | EditorToolbar | 否 | 是 | 语音输入 |
| 插入 | EditorToolbar | 否 | - | 插入图片/表格 |
| 闪关 | EditorToolbar | 否 | 是 | 快速跳转 |

---

## 二、P1 AI 辅助功能详细设计

### 2.1 纠错（错别字检测）

#### 功能描述
- 实时或手动触发错别字检测
- 检测范围：错字、别字、语病、标点错误
- 提供纠错建议，一键修正

#### 用户流程
```
1. 用户选中文本（可选，不选则检测全文）
2. 点击"纠错"按钮
3. 系统调用 AI 接口分析文本
4. 显示检测结果弹窗：
   - 标记错误位置（高亮显示）
   - 错误类型（错字/别字/语病/标点）
   - 建议修正
   - 置信度
5. 用户可：
   - 单个修正
   - 批量修正
   - 忽略
6. 修正后自动保存
```

#### 前端实现
```typescript
// 组件：SpellCheckModal.tsx
interface SpellCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterId: string;
  selectedText?: string;
  onApplyFix: (fixes: Fix[]) => void;
}

// API 调用
const checkSpelling = async (text: string, chapterId: string) => {
  const response = await api.post('/ai/spell-check', {
    text,
    chapterId,
  });
  return response.data;
};
```

#### 后端 API
```
POST /ai/spell-check

Request:
{
  "text": "第一章 天才少年\n\n李明是一个天才少年...",
  "chapterId": "chapter-001",
  "options": {
    "types": ["wrong_char", "wrong_word", "grammar", "punctuation"],
    "ignoreCustomDict": false
  }
}

Response:
{
  "code": 0,
  "data": {
    "errors": [
      {
        "position": 25,
        "length": 2,
        "type": "wrong_word",
        "original": "天才",
        "suggestion": "天材",
        "confidence": 0.95,
        "reason": "根据上下文，此处应为'天材'而非'天才'"
      }
    ],
    "stats": {
      "total": 2543,
      "errorCount": 1,
      "time": 1.2
    }
  }
}
```

#### 数据模型
```typescript
interface SpellCheckResult {
  errors: SpellError[];
  stats: {
    total: number;      // 检测字数
    errorCount: number; // 错误数量
    time: number;       // 检测耗时（秒）
  };
}

interface SpellError {
  position: number;     // 错误位置（字符索引）
  length: number;       // 错误长度
  type: 'wrong_char' | 'wrong_word' | 'grammar' | 'punctuation';
  original: string;     // 原文
  suggestion: string;   // 建议修正
  confidence: number;   // 置信度 (0-1)
  reason?: string;      // 错误原因
}
```

#### 技术方案
| 方案 | 优点 | 缺点 | 成本 |
|------|------|------|------|
| BERT 微调 | 本地部署、响应快 | 需要 GPU、准确率一般 | 高（硬件） |
| GPT-4 API | 准确率高、无需硬件 | 依赖网络、有延迟 | 中（API 费用） |
| 国内大模型 | 中文优化、成本适中 | 质量略逊 GPT-4 | 中 |

**推荐方案**：GPT-4 API + 自定义词库

#### 性能要求
- 检测速度：≤ 3 秒/千字
- 准确率：≥ 90%
- 支持自定义词典

---

### 2.2 校对（智能校对）

#### 功能描述
- 比纠错更高级的文本检查
- 检测：逻辑一致性、前后矛盾、时间线错误
- 提供详细校对报告

#### 用户流程
```
1. 用户点击"校对"按钮（需登录）
2. 选择校对范围：
   - 当前章节
   - 当前卷
   - 全部作品
3. 系统调用 AI 接口分析
4. 显示校对报告：
   - 按问题类型分组
   - 每个问题显示位置、描述、建议
5. 用户逐条确认修正
```

#### 前端实现
```typescript
// 组件：ProofreadModal.tsx
interface ProofreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  workId: string;
  chapterIds?: string[];
  onApplyFix: (fixes: ProofreadFix[]) => void;
}
```

#### 后端 API
```
POST /ai/proofread

Request:
{
  "workId": "work-001",
  "chapterIds": ["chapter-001", "chapter-002"],
  "checkTypes": ["logic", "timeline", "character", "geography"]
}

Response:
{
  "code": 0,
  "data": {
    "issues": [
      {
        "id": "issue-001",
        "type": "character",
        "severity": "high",
        "description": "角色'李明'在第3章是黑发，第5章变成了金发",
        "location": {
          "chapterId": "chapter-005",
          "position": 1234
        },
        "suggestion": "统一角色外貌描述",
        "relatedIssues": ["issue-002"]
      }
    ],
    "stats": {
      "totalChapters": 2,
      "totalWords": 5432,
      "issueCount": 1,
      "time": 5.6
    }
  }
}
```

#### 数据模型
```typescript
interface ProofreadResult {
  issues: ProofreadIssue[];
  stats: {
    totalChapters: number;
    totalWords: number;
    issueCount: number;
    time: number;
  };
}

interface ProofreadIssue {
  id: string;
  type: 'logic' | 'timeline' | 'character' | 'geography' | 'common_sense';
  severity: 'high' | 'medium' | 'low';
  description: string;
  location: {
    chapterId: string;
    position: number;
    context?: string;
  };
  suggestion: string;
  relatedIssues?: string[];
}
```

#### 技术方案
**推荐**：GPT-4 API（需要强上下文理解能力）

---

### 2.3 大纲（AI 大纲生成）

#### 功能描述
- 自动分析已写内容，生成章节大纲
- 支持实时更新大纲
- 大纲内容：主要事件、角色出场、关键对话、伏笔

#### 用户流程
```
1. 用户点击"大纲"按钮（需登录）
2. 选择生成范围：
   - 当前章节
   - 当前卷
   - 全部作品
3. 系统调用 AI 接口生成大纲
4. 显示大纲侧边栏：
   - 树状结构展示
   - 可折叠展开
5. 用户可：
   - 编辑大纲标题和摘要
   - 添加备注
   - 导出大纲
```

#### 前端实现
```typescript
// 组件：OutlineSidebar.tsx
interface OutlineSidebarProps {
  workId: string;
  isOpen: boolean;
  onClose: () => void;
}

// 大纲节点组件
const OutlineNode: React.FC<{ node: OutlineNode; level: number }> = ({ node, level }) => {
  return (
    <div className="outline-node" style={{ paddingLeft: level * 16 }}>
      <div className="node-header">
        <span className="node-title">{node.title}</span>
        {node.characters.length > 0 && (
          <span className="node-characters">出场：{node.characters.join('、')}</span>
        )}
      </div>
      <div className="node-summary">{node.summary}</div>
    </div>
  );
};
```

#### 后端 API
```
POST /ai/outline

Request:
{
  "workId": "work-001",
  "chapterIds": ["chapter-001", "chapter-002"],
  "depth": "scene"  // chapter | scene | event
}

Response:
{
  "code": 0,
  "data": {
    "outline": [
      {
        "id": "outline-001",
        "type": "chapter",
        "title": "第一章 天才少年",
        "summary": "李明被发现拥有修炼天赋，拜入天剑宗",
        "characters": ["李明", "张长老", "王虎"],
        "keywords": ["修炼", "天赋", "宗门"],
        "foreshadowing": ["李明的身世之谜"],
        "children": [
          {
            "id": "outline-001-1",
            "type": "scene",
            "title": "测试天赋",
            "summary": "李明在天剑宗测试天赋，震惊全场",
            "characters": ["李明", "张长老"],
            "keywords": ["天赋测试", "震惊"],
            "foreshadowing": []
          }
        ]
      }
    ]
  }
}
```

#### 数据模型
```typescript
interface OutlineNode {
  id: string;
  type: 'chapter' | 'scene' | 'event';
  title: string;
  summary: string;
  characters: string[];     // 出场角色
  keywords: string[];       // 关键词
  foreshadowing: string[];  // 伏笔
  children?: OutlineNode[];
}

interface Outline {
  workId: string;
  nodes: OutlineNode[];
  generatedAt: number;
  version: number;
}
```

#### 技术方案
**推荐**：GPT-4 API（需要理解剧情结构）

---

### 2.4 取名（人名/地名生成）

#### 功能描述
- AI 生成符合小说风格的名字
- 支持人名、地名、势力名、功法名等
- 可设置风格、性别、种族等参数

#### 用户流程
```
1. 用户点击"取名"按钮（需登录）
2. 弹窗选择：
   - 类型：人名/地名/势力名/功法名/物品名
   - 风格：古风/现代/玄幻/仙侠/科幻
   - 性别（人名）：男/女/中性
   - 数量：1-10 个
   - 描述（可选）：补充说明
3. 系统调用 AI 接口生成
4. 显示生成结果列表：
   - 名字
   - 含义
   - 拼音
5. 用户可：
   - 复制名字
   - 插入到文本
   - 重新生成
```

#### 前端实现
```typescript
// 组件：NamingModal.tsx
interface NamingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (name: string) => void;
}

type NamingType = 'person' | 'place' | 'faction' | 'skill' | 'item';
type NamingStyle = 'ancient' | 'modern' | 'fantasy' | 'xianxia' | 'scifi';
type NamingGender = 'male' | 'female' | 'neutral';

interface NamingParams {
  type: NamingType;
  style: NamingStyle;
  gender?: NamingGender;
  count: number;
  description?: string;
}
```

#### 后端 API
```
POST /ai/naming

Request:
{
  "type": "person",
  "style": "xianxia",
  "gender": "male",
  "count": 5,
  "description": "一个性格冷漠的剑修"
}

Response:
{
  "code": 0,
  "data": {
    "names": [
      {
        "name": "冷剑心",
        "meaning": "冷若冰霜的剑心，寓意剑道无情",
        "pinyin": "Lěng Jiàn Xīn"
      },
      {
        "name": "萧寒月",
        "meaning": "萧瑟寒月，孤傲清冷",
        "pinyin": "Xiāo Hán Yuè"
      }
    ]
  }
}
```

#### 数据模型
```typescript
interface NamingResult {
  names: Array<{
    name: string;
    meaning: string;
    pinyin: string;
  }>;
}
```

#### 技术方案
**推荐**：GPT-4 API（创意生成能力强）

---

### 2.5 妙笔（AI 续写/润色）

#### 功能描述
- AI 续写：根据上下文自动续写
- AI 润色：优化文笔、修正语病
- 支持多种风格：玄幻、都市、言情

#### 用户流程
```
1. 用户选中文本（续写可不选）
2. 点击"妙笔"按钮（需登录）
3. 弹窗选择：
   - 模式：续写/润色/改写/扩写
   - 风格：玄幻/都市/言情/悬疑
   - 长度：短/中/长
4. 系统调用 AI 接口生成
5. 显示结果：
   - 原文 vs 新文对比
   - 可选择多个候选结果
6. 用户可：
   - 替换原文
   - 插入到光标位置
   - 重新生成
```

#### 前端实现
```typescript
// 组件：AiWriteModal.tsx
interface AiWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'continue' | 'polish' | 'rewrite' | 'expand';
  selectedText?: string;
  context: string;
  onApply: (text: string, mode: 'replace' | 'insert') => void;
}

type WriteStyle = 'fantasy' | 'urban' | 'romance' | 'suspense' | 'history';
type WriteLength = 'short' | 'medium' | 'long';
```

#### 后端 API
```
POST /ai/write

Request:
{
  "mode": "continue",
  "style": "fantasy",
  "length": "medium",
  "context": "李明站在悬崖边，望着远方的天际线...",
  "selectedText": ""
}

Response:
{
  "code": 0,
  "data": {
    "text": "他深吸一口气，运转体内的真气。丹田处，一股温暖的气流缓缓升起，沿着经脉流转全身...",
    "alternatives": [
      "他的眼中闪过一丝决绝。三年了，整整三年，他终于等到了这一天...",
      "远处，一道流光划过天际，引起了他的注意..."
    ],
    "stats": {
      "inputTokens": 45,
      "outputTokens": 128,
      "time": 2.3
    }
  }
}
```

#### 数据模型
```typescript
interface AiWriteResult {
  text: string;
  alternatives?: string[];
  stats: {
    inputTokens: number;
    outputTokens: number;
    time: number;
  };
}
```

#### 技术方案
**推荐**：GPT-4 API（文本生成质量高）

---

### 2.6 灵感（创意提示）

#### 功能描述
- 当卡文时，AI 提供创意提示
- 支持场景：打斗、情感、世界观、剧情转折
- 提供多个创意方向

#### 用户流程
```
1. 用户点击"灵感"按钮（需登录）
2. 弹窗输入：
   - 当前剧情描述（可选）
   - 场景类型：打斗/情感/世界观/剧情转折/其他
   - 关键词（可选）
3. 系统调用 AI 接口生成
4. 显示创意列表：
   - 标题
   - 描述
   - 发展方向
   - 示例片段
5. 用户可：
   - 选择一个创意展开详情
   - 继续追问
   - 复制内容
```

#### 前端实现
```typescript
// 组件：InspirationModal.tsx
interface InspirationModalProps {
  isOpen: boolean;
  onClose: () => void;
  workId?: string;
  onInsert: (text: string) => void;
}

type SceneType = 'battle' | 'emotion' | 'worldview' | 'plot_twist' | 'other';
```

#### 后端 API
```
POST /ai/inspiration

Request:
{
  "context": "主角被困在密室，需要逃脱",
  "sceneType": "plot_twist",
  "keywords": ["逃脱", "密室", "机关"],
  "workId": "work-001"
}

Response:
{
  "code": 0,
  "data": {
    "inspirations": [
      {
        "title": "机关反转",
        "description": "密室并非囚笼，而是试炼。主角发现机关的真正用途",
        "direction": "将困境转化为机遇，揭示更高层的阴谋",
        "keywords": ["试炼", "机遇", "阴谋"],
        "examples": [
          "李明仔细观察着墙壁上的纹路，突然发现这些纹路组成了一幅地图...",
          "原来，这个密室是古人留下的修炼之地，而非陷阱..."
        ]
      }
    ]
  }
}
```

#### 数据模型
```typescript
interface Inspiration {
  title: string;
  description: string;
  direction: string;
  keywords: string[];
  examples?: string[];
}
```

#### 技术方案
**推荐**：GPT-4 API（创意提示需要理解语境）

---

### 2.7 画师（AI 封面生成）

#### 功能描述
- 根据小说内容生成封面图
- 支持多种风格：古风、现代、奇幻
- 可导出高清图片

#### 用户流程
```
1. 用户点击"画师"按钮（需登录）
2. 弹窗输入：
   - 描述文字（可 AI 自动生成）
   - 风格：古风/现代/奇幻/仙侠/科幻
   - 尺寸：竖版/横版/方形
   - 数量：1-4 张
3. 系统调用 AI 接口生成
4. 显示生成结果：
   - 多张候选图
   - 可放大查看
5. 用户可：
   - 选择一张保存
   - 重新生成
   - 导出高清图
```

#### 前端实现
```typescript
// 组件：CoverGeneratorModal.tsx
interface CoverGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  workId: string;
  onSave: (imageUrl: string) => void;
}

type CoverStyle = 'ancient' | 'modern' | 'fantasy' | 'xianxia' | 'scifi';
type CoverSize = 'portrait' | 'landscape' | 'square';
```

#### 后端 API
```
POST /ai/cover

Request:
{
  "prompt": "一个身穿白衣的少年站在云端，手持长剑，背景是夕阳",
  "style": "xianxia",
  "size": "portrait",
  "count": 4,
  "workId": "work-001"
}

Response:
{
  "code": 0,
  "data": {
    "images": [
      {
        "id": "img-001",
        "url": "https://cdn.example.com/covers/img-001.png",
        "width": 1024,
        "height": 1536
      }
    ],
    "prompt": "Enhanced prompt for generation...",
    "time": 12.5
  }
}
```

#### 数据模型
```typescript
interface CoverResult {
  images: Array<{
    id: string;
    url: string;
    width: number;
    height: number;
  }>;
  prompt: string;
  time: number;
}
```

#### 技术方案
| 方案 | 优点 | 缺点 | 成本 |
|------|------|------|------|
| DALL-E 3 | 质量高、API 简单 | 贵、风格受限 | $0.04-0.08/张 |
| Stable Diffusion API | 开源、可定制 | 质量不稳定 | $0.02-0.05/张 |
| 本地部署 SD | 免费、完全控制 | 需 GPU、维护成本 | 高（硬件） |

**推荐方案**：DALL-E 3 API（质量优先）或 Stable Diffusion API（成本优先）

---

## 三、技术架构设计

### 3.1 后端 API 汇总

```
AI 功能 API（需认证）
├── POST /ai/spell-check      - 错别字检测
├── POST /ai/proofread        - 智能校对
├── POST /ai/outline          - 大纲生成
├── POST /ai/naming           - 取名生成
├── POST /ai/write            - AI 续写/润色
├── POST /ai/inspiration      - 灵感提示
└── POST /ai/cover            - 封面生成

数据存储
├── GET  /outlines/:workId    - 获取大纲
├── POST /outlines            - 保存大纲
├── PUT  /outlines/:id        - 更新大纲
└── DELETE /outlines/:id      - 删除大纲
```

### 3.2 AI 模型选型

| 功能 | 推荐模型 | 备选模型 | 原因 |
|------|---------|---------|------|
| 纠错 | GPT-4 | 通义千问 | 专用的错别字检测模型 |
| 校对 | GPT-4 | Claude | 需要强上下文理解 |
| 大纲 | GPT-4 | Claude | 需要理解剧情结构 |
| 取名 | GPT-4 | 通义千问 | 创意生成能力强 |
| 妙笔 | GPT-4 | Claude | 文本生成质量高 |
| 灵感 | GPT-4 | Claude | 创意提示需要理解语境 |
| 画师 | DALL-E 3 | Stable Diffusion | 图像生成专用 |

### 3.3 成本估算

#### GPT-4 API 成本
- 输入：$0.03 / 1K tokens
- 输出：$0.06 / 1K tokens
- 预估：每千字约 $0.01-0.02

#### DALL-E 3 成本
- 标准：$0.04 / 张
- 高清：$0.08 / 张

#### 月度成本（1000 活跃用户，每人每天 10 次）
- GPT-4 API：$300-600 / 月
- DALL-E 3：$40-80 / 月
- **总计：$340-680 / 月**

### 3.4 数据库设计

#### outlines 表
```sql
CREATE TABLE outlines (
  id VARCHAR(36) PRIMARY KEY,
  work_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  nodes JSONB NOT NULL,
  version INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (work_id) REFERENCES works(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_outlines_work ON outlines(work_id);
CREATE INDEX idx_outlines_user ON outlines(user_id);
```

#### ai_usage 表（用量统计）
```sql
CREATE TABLE ai_usage (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  feature VARCHAR(50) NOT NULL,
  input_tokens INT DEFAULT 0,
  output_tokens INT DEFAULT 0,
  cost_usd DECIMAL(10, 6) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_ai_usage_user ON ai_usage(user_id);
CREATE INDEX idx_ai_usage_date ON ai_usage(created_at);
```

---

## 四、前端组件设计

### 4.1 组件结构

```
src/frontend/src/components/ai/
├── SpellCheckModal.tsx      # 纠错弹窗
├── ProofreadModal.tsx       # 校对弹窗
├── OutlineSidebar.tsx       # 大纲侧边栏
├── NamingModal.tsx          # 取名弹窗
├── AiWriteModal.tsx         # AI 写作弹窗
├── InspirationModal.tsx     # 灵感弹窗
├── CoverGeneratorModal.tsx  # 封面生成弹窗
├── AiResultCard.tsx         # AI 结果卡片（通用）
└── AiLoadingIndicator.tsx   # AI 加载指示器
```

### 4.2 通用 Hook

```typescript
// hooks/useAiApi.ts
interface UseAiApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useAiApi<T>(
  endpoint: string,
  options?: UseAiApiOptions<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(endpoint, params);
      if (response.code === 0) {
        setData(response.data);
        options?.onSuccess?.(response.data);
      } else {
        setError(response.message);
        options?.onError?.(new Error(response.message));
      }
    } catch (err: any) {
      setError(err.message);
      options?.onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, execute };
}
```

### 4.3 状态管理

```typescript
// stores/aiStore.ts
interface AiState {
  // 大纲
  outline: OutlineNode[] | null;
  outlineLoading: boolean;
  
  // 当前 AI 任务
  currentTask: {
    type: string;
    status: 'idle' | 'loading' | 'success' | 'error';
    progress?: number;
  } | null;
  
  // 用量统计
  usage: {
    today: number;
    month: number;
    limit: number;
  };
  
  // Actions
  loadOutline: (workId: string) => Promise<void>;
  saveOutline: (workId: string, nodes: OutlineNode[]) => Promise<void>;
  checkSpell: (text: string, chapterId: string) => Promise<SpellCheckResult>;
  generateNames: (params: NamingParams) => Promise<NamingResult>;
  // ...
}
```

---

## 五、开发阶段规划

### 总览

| 阶段 | 名称 | 功能数量 | 预计时间 | 优先级 |
|------|------|---------|---------|--------|
| 阶段 1 | 基础设施 + 编辑器基础 | 8 个 | 3 周 | P0 |
| 阶段 2 | AI 核心功能 | 7 个 | 4 周 | P1 |
| 阶段 3 | 创作管理功能 | 9 个 | 3 周 | P1 |
| 阶段 4 | 多平台发布 | 3 个 | 2 周 | P1 |
| 阶段 5 | 导入导出 + 统计 | 4 个 | 2 周 | P2 |
| 阶段 6 | 社交与增值 | 12 个 | 4 周 | P3 |

**总计**：43 个功能，18 周（约 4.5 个月）

---

## 六、阶段详细规划

### 阶段 1：基础设施 + 编辑器基础（3 周）

**目标**：完善软件基础能力，提升写作体验

| 功能 | 位置 | 说明 | 优先级 |
|------|------|------|--------|
| 字体 | EditorToolbar | 字体大小、字体选择 | P0 |
| 背景 | EditorToolbar | 护眼背景色、主题切换 | P0 |
| 全屏 | EditorToolbar | 沉浸式写作模式 | P0 |
| 撤销增强 | EditorToolbar | 长文本撤销（现有基础上增强） | P0 |
| 查找替换 | EditorToolbar | 文本查找替换功能 | P0 |
| 一键排版 | EditorToolbar | 自动缩进、分段、标点规范化 | P1 |
| 偏好设置 | GlobalSidebar | 应用全局设置（字体、背景、自动保存等） | P0 |
| 回收站 | WriterHome | 已删除作品恢复 | P0 |

**技术要点**：
- 编辑器设置持久化（localStorage + 云端同步）
- 全屏模式实现（Tauri API）
- 查找替换算法（CodeMirror 扩展）
- 回收站数据模型（软删除）

**验收标准**：
- [ ] 字体大小可调节（12-24px）
- [ ] 提供 3+ 种护眼背景色
- [ ] 全屏模式可快捷键切换（F11）
- [ ] 撤销支持 50+ 步操作
- [ ] 查找替换支持正则表达式
- [ ] 一键排版符合网文规范
- [ ] 偏好设置实时生效
- [ ] 回收站保留 30 天

---

### 阶段 2：AI 核心功能（4 周）

**目标**：实现 AI 辅助创作能力

| 功能 | 位置 | 说明 | 优先级 |
|------|------|------|--------|
| 纠错 | WorkspaceStatusBar | 错别字、语病检测 | P1 |
| 妙笔 | RightToolRail | AI 续写/润色/改写 | P1 |
| 大纲 | RightToolRail | AI 大纲生成与管理 | P1 |
| 取名 | EditorToolbar | 人名/地名/势力名生成 | P1 |
| 校对 | RightToolRail | 智能校对（逻辑、时间线） | P1 |
| 灵感 | RightToolRail | 创意提示 | P1 |
| 画师 | EditorToolbar | AI 封面生成 | P1 |

**技术要点**：
- GPT-4 API 集成
- AI API 路由设计
- 用量统计与限制
- 结果缓存策略
- 流式响应实现

**验收标准**：
- [ ] 纠错准确率 ≥ 90%，响应 ≤ 3s/千字
- [ ] 妙笔生成质量符合网文风格
- [ ] 大纲支持多级结构（卷/章/场景）
- [ ] 取名支持 5 种类型、5 种风格
- [ ] 校对支持逻辑、时间线、角色一致性检查
- [ ] 灵感提供 3+ 创意方向
- [ ] 画师生成 4 张候选图，≤ 30s

**后端 API**：
```
POST /ai/spell-check      - 纠错
POST /ai/write            - 妙笔
POST /ai/outline          - 大纲
POST /ai/naming           - 取名
POST /ai/proofread        - 校对
POST /ai/inspiration      - 灵感
POST /ai/cover            - 画师
```

---

### 阶段 3：创作管理功能（3 周）

**目标**：提升创作管理效率

| 功能 | 位置 | 说明 | 优先级 |
|------|------|------|--------|
| 新建卷 | ChapterSidebar | 创建卷管理章节 | P1 |
| 删除章节 | ChapterSidebar | 删除章节（可恢复） | P1 |
| 导入章节 | ChapterSidebar | 从本地 TXT/DOCX 导入 | P1 |
| 章节排序 | ChapterSidebar | 拖拽排序 | P1 |
| 筛选 | ChapterSidebar | 按状态/标签筛选章节 | P1 |
| 角色 | RightToolRail | 角色卡片管理 | P1 |
| 设定 | RightToolRail | 世界观设定管理 | P1 |
| 双栏 | RightToolRail | 对照写作（参考文档） | P1 |
| 写作计划 | WorkspaceStatusBar | 字数目标、进度跟踪 | P1 |

**技术要点**：
- 卷-章数据模型重构
- 文件解析（TXT、DOCX）
- 拖拽排序实现
- 角色/设定数据模型
- 写作计划与统计关联

**验收标准**：
- [ ] 卷支持创建、重命名、删除
- [ ] 章节拖拽排序流畅
- [ ] 导入支持 TXT、DOCX 格式
- [ ] 角色卡片支持头像、简介、关系图
- [ ] 设定支持分类（地理、势力、功法等）
- [ ] 双栏支持参考文档加载
- [ ] 写作计划支持日/周/月目标

**数据库设计**：
```sql
-- 卷表
CREATE TABLE volumes (
  id VARCHAR(36) PRIMARY KEY,
  work_id VARCHAR(36) NOT NULL,
  title VARCHAR(200) NOT NULL,
  order_index INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (work_id) REFERENCES works(id)
);

-- 角色表
CREATE TABLE characters (
  id VARCHAR(36) PRIMARY KEY,
  work_id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar VARCHAR(500),
  description TEXT,
  attributes JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (work_id) REFERENCES works(id)
);

-- 设定表
CREATE TABLE settings (
  id VARCHAR(36) PRIMARY KEY,
  work_id VARCHAR(36) NOT NULL,
  type VARCHAR(50) NOT NULL, -- geography, faction, skill, item
  title VARCHAR(200) NOT NULL,
  content TEXT,
  order_index INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (work_id) REFERENCES works(id)
);
```

---

### 阶段 4：多平台发布（2 周）

**目标**：实现一键多平台发布

| 功能 | 位置 | 说明 | 优先级 |
|------|------|------|--------|
| 发布到阅文 | EditorToolbar | 发布起点/创世/云起 | P1 |
| 发布到其他平台 | EditorToolbar | 发布番茄/晋江/纵横 | P1 |
| 投稿阅文 | WriterHome | 编辑直投 | P1 |

**技术要点**：
- 平台 API 对接（阅文开放平台）
- 登录态管理（OAuth）
- 格式转换（Markdown → 平台格式）
- 发布状态跟踪

**验收标准**：
- [ ] 支持阅文系平台（起点、创世、云起）
- [ ] 支持主流平台（番茄、晋江、纵横）
- [ ] 发布状态实时更新
- [ ] 支持定时发布

**后端 API**：
```
POST /publish/prepare     - 准备发布（格式转换）
POST /publish/yuewen      - 发布到阅文
POST /publish/fanqie      - 发布到番茄
POST /publish/jinjiang    - 发布到晋江
GET  /publish/status/:id  - 查询发布状态
```

---

### 阶段 5：导入导出 + 统计（2 周）

**目标**：完善数据管理与统计功能

| 功能 | 位置 | 说明 | 优先级 |
|------|------|------|--------|
| 导入 | WriterHome | 本地导入作品（TXT/DOCX） | P1 |
| 模板中心 | WriterHome | 大纲模板、开头模板 | P2 |
| 码字统计 | GlobalSidebar | 日/周/月字数统计 | P2 |
| 拼字 | RightToolRail | 实时字数统计 | P2 |

**技术要点**：
- 文件解析（TXT、DOCX、EPUB）
- 统计数据聚合
- 图表可视化
- 模板数据模型

**验收标准**：
- [ ] 导入支持 TXT、DOCX、EPUB
- [ ] 提供至少 10 个模板
- [ ] 统计支持日/周/月视图
- [ ] 实时字数准确显示

---

### 阶段 6：社交与增值（4 周）

**目标**：构建社区生态与增值服务

#### 6.1 社交功能（P2）

| 功能 | 位置 | 说明 |
|------|------|------|
| 码字好友 | GlobalSidebar | 好友系统、在线状态 |
| 神助社区 | GlobalSidebar | 写作社区、问答 |
| 消息通知 | GlobalSidebar | 消息中心 |
| 分享口令 | WriterHome | 分享作品、邀请码 |

#### 6.2 增值功能（P3）

| 功能 | 位置 | 说明 |
|------|------|------|
| 短剧剧本 | GlobalSidebar | 短剧创作模式 |
| 阅创学堂 | GlobalSidebar | 写作教程、直播 |
| 任务中心 | GlobalSidebar | 每日任务、成就系统 |
| 墨水商店 | GlobalSidebar | 虚拟道具、会员 |
| 邀请卡 | GlobalSidebar | 邀请奖励系统 |
| 装扮中心 | GlobalSidebar | 主题皮肤、头像框 |
| 邀请码 | WriterHome | 邀请码兑换 |

#### 6.3 其他功能（P2）

| 功能 | 位置 | 说明 |
|------|------|------|
| 已隐藏 | WriterHome | 隐藏的作品管理 |
| 输入 | EditorToolbar | 语音输入（需 ASR） |
| 插入 | EditorToolbar | 插入图片/表格 |
| 闪关 | EditorToolbar | 快速跳转章节 |
| 客服帮助 | GlobalSidebar | 帮助文档、在线客服 |
| 同步工具 | GlobalSidebar | 手动同步、冲突解决 |
| 历史 | EditorToolbar | 版本历史、对比 |

**技术要点**：
- 社交数据模型（好友、消息、通知）
- 实时通信（WebSocket）
- 成就系统设计
- 会员体系设计

---

## 七、里程碑规划

```
Month 1 (Week 1-4)
├── 阶段 1 完成：基础设施 + 编辑器基础
└── 阶段 2 启动：AI 核心功能

Month 2 (Week 5-8)
├── 阶段 2 完成：AI 核心功能
└── 阶段 3 启动：创作管理功能

Month 3 (Week 9-11)
├── 阶段 3 完成：创作管理功能
└── 阶段 4 启动：多平台发布

Month 4 (Week 12-13)
├── 阶段 4 完成：多平台发布
└── 阶段 5 启动：导入导出 + 统计

Month 4.5 (Week 14-15)
├── 阶段 5 完成：导入导出 + 统计
└── 内部测试、Bug 修复

Month 5-6 (Week 16-18)
└── 阶段 6：社交与增值（可选）
```

---

## 八、当前阶段：阶段 1 详细任务

### Week 1：编辑器基础

| 任务 | 负责模块 | 预计耗时 |
|------|---------|---------|
| 字体选择器组件 | 前端 | 4h |
| 字体大小调节 | 前端 | 2h |
| 背景色选择器 | 前端 | 4h |
| 主题切换逻辑 | 前端 | 2h |
| 全屏模式实现 | 前端 + Tauri | 4h |

### Week 2：编辑器增强

| 任务 | 负责模块 | 预计耗时 |
|------|---------|---------|
| 查找替换组件 | 前端 | 6h |
| 查找替换算法 | 前端 | 4h |
| 一键排版逻辑 | 前端 | 4h |
| 撤销历史增强 | 前端 | 4h |

### Week 3：系统功能

| 任务 | 负责模块 | 预计耗时 |
|------|---------|---------|
| 偏好设置数据模型 | 后端 | 2h |
| 偏好设置 API | 后端 | 2h |
| 偏好设置界面 | 前端 | 4h |
| 回收站数据模型 | 后端 | 2h |
| 回收站 API | 后端 | 2h |
| 回收站界面 | 前端 | 4h |
| 集成测试 | 全栈 | 4h |

**阶段 1 验收清单**：
- [ ] 字体可调节（12-24px，至少 5 种字体）
- [ ] 背景色可切换（至少 3 种）
- [ ] 全屏模式可用（F11 快捷键）
- [ ] 查找替换功能正常
- [ ] 一键排版符合网文规范
- [ ] 撤销支持 50+ 步
- [ ] 偏好设置可保存
- [ ] 回收站可恢复删除作品

---

## 九、阶段进度跟踪

### 进度总览

| 阶段 | 名称 | 状态 | 开始时间 | 完成时间 | 备注 |
|------|------|------|---------|---------|------|
| 阶段 1 | 基础设施 + 编辑器基础 | ⏳ 待开始 | - | - | 当前阶段 |
| 阶段 2 | AI 核心功能 | ⏳ 待开始 | - | - | - |
| 阶段 3 | 创作管理功能 | ⏳ 待开始 | - | - | - |
| 阶段 4 | 多平台发布 | ⏳ 待开始 | - | - | - |
| 阶段 5 | 导入导出 + 统计 | ⏳ 待开始 | - | - | - |
| 阶段 6 | 社交与增值 | ⏳ 待开始 | - | - | - |

**状态说明**：
- ⏳ 待开始
- 🚧 进行中
- ✅ 已完成
- ⏸️ 暂停
- ❌ 取消

### 阶段 1 任务清单

| 任务 | 状态 | 负责人 | 开始 | 完成 | 备注 |
|------|------|--------|------|------|------|
| 字体选择器组件 | ⏳ | - | - | - | Week 1 |
| 字体大小调节 | ⏳ | - | - | - | Week 1 |
| 背景色选择器 | ⏳ | - | - | - | Week 1 |
| 主题切换逻辑 | ⏳ | - | - | - | Week 1 |
| 全屏模式实现 | ⏳ | - | - | - | Week 1 |
| 查找替换组件 | ⏳ | - | - | - | Week 2 |
| 查找替换算法 | ⏳ | - | - | - | Week 2 |
| 一键排版逻辑 | ⏳ | - | - | - | Week 2 |
| 撤销历史增强 | ⏳ | - | - | - | Week 2 |
| 偏好设置数据模型 | ⏳ | - | - | - | Week 3 |
| 偏好设置 API | ⏳ | - | - | - | Week 3 |
| 偏好设置界面 | ⏳ | - | - | - | Week 3 |
| 回收站数据模型 | ⏳ | - | - | - | Week 3 |
| 回收站 API | ⏳ | - | - | - | Week 3 |
| 回收站界面 | ⏳ | - | - | - | Week 3 |
| 集成测试 | ⏳ | - | - | - | Week 3 |

---

## 十、风险与对策

### 6.1 技术风险

| 风险 | 影响 | 对策 |
|------|------|------|
| AI API 不稳定 | 功能不可用 | 实现降级方案、多模型备选 |
| 响应延迟高 | 用户体验差 | 实现流式响应、进度提示 |
| 成本超预算 | 财务压力 | 实现用量限制、缓存策略 |
| 生成质量差 | 用户不满意 | 优化提示词、支持重新生成 |

### 6.2 业务风险

| 风险 | 影响 | 对策 |
|------|------|------|
| 用户滥用 | 成本失控 | 实现每日限额、异常检测 |
| 内容安全 | 合规风险 | 内容审核、敏感词过滤 |
| 版权问题 | 法律风险 | 用户协议、版权声明 |

---

## 十一、后续规划

### 7.1 短期（1-2 个月）
- 完成 7 个 AI 功能开发
- 用户测试与反馈收集
- 性能与成本优化

### 7.2 中期（3-6 个月）
- 实现编辑器基础功能（字体、背景、全屏等）
- 实现创作管理功能（角色、设定、双栏等）
- 实现导入导出功能

### 7.3 长期（6-12 个月）
- 实现多平台发布功能
- 实现社交功能
- 实现平台增值功能

---

## 八、附录

### 8.1 GPT-4 Prompt 示例

#### 纠错
```
你是一个专业的中文文字校对专家。请检查以下文本中的错别字、语病和标点错误。

要求：
1. 识别所有错误并给出修正建议
2. 说明错误类型（错字、别字、语病、标点）
3. 给出置信度（0-1）

文本：
{text}

请以 JSON 格式返回结果。
```

#### 大纲生成
```
你是一个专业的小说大纲分析师。请分析以下章节内容，生成结构化大纲。

要求：
1. 提取主要事件和场景
2. 识别出场角色
3. 提取关键词和伏笔
4. 生成简短摘要

文本：
{text}

请以 JSON 格式返回结果。
```

### 8.2 参考资源
- OpenAI API 文档：https://platform.openai.com/docs
- DALL-E 3 指南：https://platform.openai.com/docs/guides/images
- Stable Diffusion API：https://stability.ai
- 通义千问 API：https://tongyi.aliyun.com
