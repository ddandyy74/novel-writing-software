# Bug 修复列表

**生成日期**: 2026-05-07  
**审查范围**: 前端、后端、AI、安全、性能  
**审查人**: Code Reviewer + Security Engineer + Performance Benchmarker

---

## 📊 问题统计

### 按严重程度分类

| 严重程度 | 数量 | 占比 | 说明 |
|---------|------|------|------|
| 🔴 **Critical** | 15 | 23% | 必须立即修复，存在安全漏洞或核心功能缺失 |
| 🟠 **High** | 10 | 15% | 本周内修复，影响系统安全或重要功能 |
| 🟡 **Medium** | 20 | 31% | 两周内修复，影响代码质量或用户体验 |
| 🟢 **Low** | 20 | 31% | 有时间修复，改进项 |
| **总计** | **65** | **100%** | |

### 按模块分类

| 模块 | Critical | High | Medium | Low | 总计 |
|------|----------|------|--------|-----|------|
| **前端** | 3 | 2 | 4 | 4 | 13 |
| **后端** | 4 | 3 | 4 | 4 | 15 |
| **AI** | 5 | 2 | 5 | 3 | 15 |
| **安全** | 3 | 4 | 5 | 3 | 15 |
| **性能** | 0 | 0 | 2 | 5 | 7 |
| **总计** | **15** | **10** | **20** | **20** | **65** |

---

## 🔴 Critical 问题列表（必须立即修复）

### 前端模块

#### CR-FE-001: 文件路径拼接不安全
**严重程度**: Critical  
**CVSS 评分**: 9.1  
**位置**: `src/utils/file.ts:57`  
**问题描述**: 直接拼接路径存在路径遍历攻击风险，`filename` 未经验证可能包含 `../` 等危险字符  
**影响**: 攻击者可访问应用数据目录外的文件，可能导致数据泄露或篡改  
**修复方案**:
```typescript
import { join } from '@tauri-apps/api/path';

export async function autoSaveToLocal(content: string, filename: string): Promise<boolean> {
  try {
    // 验证文件名安全性
    if (!isValidFilename(filename)) {
      throw new Error('Invalid filename');
    }
    
    const appDataDir = await getAppDataDir();
    const filePath = await join(appDataDir, filename);
    await writeTextFile(filePath, content);
    return true;
  } catch (error) {
    console.error('Auto save error:', error);
    return false;
  }
}

function isValidFilename(filename: string): boolean {
  const dangerousPattern = /(\.\.|[<>:"\/\\|?*])/;
  return !dangerousPattern.test(filename) && filename.length > 0 && filename.length < 255;
}
```
**责任人**: @frontend-developer  
**预计工时**: 2 小时  
**验收标准**: 
- ✅ 所有文件路径使用 `join` API
- ✅ 文件名验证测试通过
- ✅ 路径遍历攻击测试失败

---

#### CR-FE-002: 错误处理泄露敏感信息
**严重程度**: Critical  
**CVSS 评分**: 8.5  
**位置**: `src/utils/file.ts:24, 48, 62`  
**问题描述**: 在生产环境泄露错误堆栈信息，可能暴露文件路径、用户数据等敏感信息  
**影响**: 日志可能被恶意应用读取，导致信息泄露  
**修复方案**:
```typescript
// src/utils/errorHandler.ts
export enum ErrorCode {
  FILE_SAVE_ERROR = 'FILE_SAVE_ERROR',
  FILE_OPEN_ERROR = 'FILE_OPEN_ERROR',
  AUTO_SAVE_ERROR = 'AUTO_SAVE_ERROR',
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public userMessage: string,
    public internalError?: Error
  ) {
    super(userMessage);
  }
}

export function logError(error: AppError): void {
  if (import.meta.env.DEV) {
    console.error(`[${error.code}]`, error.internalError);
  }
  // 生产环境可以上报到监控系统
}
```
**责任人**: @frontend-developer  
**预计工时**: 3 小时  
**验收标准**:
- ✅ 创建统一错误处理工具
- ✅ 生产环境不输出详细错误堆栈
- ✅ 错误日志测试通过

---

#### CR-FE-003: 字数统计不准确
**严重程度**: Critical  
**位置**: `src/stores/editorStore.ts:29-34`  
**问题描述**: 未统计数字、标点符号，未处理混合语言  
**影响**: 核心功能错误，用户无法准确了解字数  
**修复方案**:
```typescript
interface WordCountResult {
  chinese: number;    // 汉字数量
  english: number;    // 英文单词数量
  punctuation: number; // 标点符号数量
  total: number;      // 总字数（根据业务规则）
}

const countWords = (text: string): WordCountResult => {
  const cleanText = text.replace(/\s+/g, '');
  
  const chinese = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length;
  const english = (cleanText.match(/[a-zA-Z]+/g) || []).length;
  const punctuation = (cleanText.match(/[，。！？；：""''【】《》\-\—\…\·]/g) || []).length;
  
  // 网文常见规则：汉字+标点 = 总字数
  const total = chinese + punctuation;
  
  return { chinese, english, punctuation, total };
};
```
**责任人**: @frontend-developer  
**预计工时**: 2 小时  
**验收标准**:
- ✅ 支持多种统计模式
- ✅ 单元测试覆盖率 100%
- ✅ 性能测试通过

---

### 后端模块

#### CR-BE-001: 生产环境密钥硬编码
**严重程度**: Critical  
**CVSS 评分**: 9.8  
**位置**: `src/config/index.ts:30, 38`  
**问题描述**: JWT_SECRET 和 AES_KEY 有默认值，生产环境未强制要求环境变量  
**影响**: 攻击者可使用默认密钥伪造 Token 或解密敏感数据  
**修复方案**:
```typescript
secret: process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' 
  ? (() => { throw new Error('JWT_SECRET must be set in production') })()
  : 'dev-secret-not-for-production'),

// 或在启动时验证
function validateConfig() {
  const required = ['JWT_SECRET', 'AES_ENCRYPTION_KEY'];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}
```
**责任人**: @backend-architect  
**预计工时**: 1 小时  
**验收标准**:
- ✅ 移除所有默认密钥
- ✅ 启动时验证环境变量
- ✅ 文档更新（部署指南）

---

#### CR-BE-002: 认证功能未完成
**严重程度**: Critical  
**CVSS 评分**: 8.1  
**位置**: `src/services/auth.service.ts:80-84, 112`  
**问题描述**: `signToken` 和 `refreshToken` 方法是 Mock 实现  
**影响**: 用户无法正常登录和刷新 Token  
**修复方案**:
```typescript
// 使用 Fastify JWT 插件
private static async signToken(app: FastifyInstance, payload: any, expiresIn: string): Promise<string> {
  return app.jwt.sign(payload, { expiresIn });
}

static async refreshToken(refreshToken: string, app: FastifyInstance) {
  const userId = await redis.get(`refresh-token:${refreshToken}`);
  if (!userId) throw new Error('Refresh Token 无效');
  
  const user = await UserService.findById(userId);
  if (!user) throw new Error('用户不存在');
  
  const tokens = await this.generateTokens(user);
  await redis.del(`refresh-token:${userId}`);
  return tokens;
}
```
**责任人**: @backend-architect  
**预计工时**: 4 小时  
**验收标准**:
- ✅ JWT Token 签名实现完成
- ✅ Refresh Token 逻辑完整
- ✅ 集成测试通过

---

#### CR-BE-003: 密码验证错误信息泄露
**严重程度**: Critical  
**CVSS 评分**: 7.5  
**位置**: `src/services/auth.service.ts:35-43`  
**问题描述**: 分别返回"用户不存在"和"密码错误"，泄露用户存在性信息  
**影响**: 攻击者可枚举有效用户账户  
**修复方案**:
```typescript
// 统一错误信息
if (!user || !(await UserService.validatePassword(user, password))) {
  throw new Error('邮箱或密码错误');
}
```
**责任人**: @backend-architect  
**预计工时**: 0.5 小时  
**验收标准**:
- ✅ 统一错误消息
- ✅ 用户枚举测试失败

---

#### CR-BE-004: 日志记录敏感信息
**严重程度**: Critical  
**CVSS 评分**: 8.0  
**位置**: `src/middleware/error.ts:23`  
**问题描述**: 错误日志中记录了 `request.body`，可能包含密码等敏感信息  
**影响**: 日志泄露用户密码、Token 等敏感信息  
**修复方案**:
```typescript
const sanitizeBody = (body: any) => {
  const sanitized = { ...body };
  ['password', 'token', 'secret', 'apiKey'].forEach(key => {
    if (sanitized[key]) sanitized[key] = '***REDACTED***';
  });
  return sanitized;
};

body: sanitizeBody(request.body),
```
**责任人**: @backend-architect  
**预计工时**: 1 小时  
**验收标准**:
- ✅ 敏感字段过滤
- ✅ 日志审计通过

---

### AI 模块

#### CR-AI-001: API Key 明文暴露风险
**严重程度**: Critical  
**CVSS 评分**: 8.8  
**位置**: `src/ai/spell-check/detector.ts:183`, `src/ai/outline-gen/generator.ts:150`  
**问题描述**: API Key 通过 HTTP Header 传递，存在日志泄露风险  
**影响**: API Key 泄露可能导致费用失控或账户被盗用  
**修复方案**:
```typescript
import { safeStringify } from '../utils/log-utils';

// 使用专门的日志工具，自动过滤敏感信息
private logRequest(headers: Record<string, string>) {
  const safeHeaders = {
    ...headers,
    Authorization: '[REDACTED]'
  };
  console.log('Request headers:', safeStringify(safeHeaders));
}
```
**责任人**: @ai-engineer  
**预计工时**: 2 小时  
**验收标准**:
- ✅ 日志中不包含 API Key
- ✅ 错误堆栈过滤测试通过

---

#### CR-AI-002: 缺少输入验证
**严重程度**: Critical  
**CVSS 评分**: 8.5  
**位置**: `src/ai/spell-check/detector.ts:24`, `src/ai/outline-gen/generator.ts:37`  
**问题描述**: 所有输入参数缺少验证，可能导致超长文本导致 API 费用爆炸、恶意输入导致 Prompt Injection  
**影响**: 成本失控、安全漏洞  
**修复方案**:
```typescript
import { z } from 'zod';

const SpellCheckRequestSchema = z.object({
  text: z.string()
    .min(1, '文本不能为空')
    .max(50000, '单次检测文本不能超过 50000 字符'),
  options: z.object({
    useLocal: z.boolean().optional(),
    customDict: z.array(z.string()).max(100).optional(),
    ignoreTypes: z.array(z.enum(['错字', '别字', '语病', '标点'])).optional(),
  }).optional(),
});

async detect(text: string, options?: SpellCheckOptions): Promise<SpellCheckResult> {
  const validated = SpellCheckRequestSchema.parse({ text, options });
  const sanitizedText = this.sanitizeInput(validated.text);
  return this.detectCloud(sanitizedText, validated.options, startTime);
}

private sanitizeInput(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '[代码块已移除]')
    .replace(/忽略之前的指令/gi, '')
    .replace(/你是一个/gi, '');
}
```
**责任人**: @ai-engineer  
**预计工时**: 3 小时  
**验收标准**:
- ✅ 输入验证测试通过
- ✅ 边界测试通过
- ✅ Prompt Injection 攻击测试失败

---

#### CR-AI-003: Prompt Injection 漏洞
**严重程度**: Critical  
**CVSS 评分**: 9.0  
**位置**: `src/ai/spell-check/detector.ts:255-278`  
**问题描述**: Prompt 直接拼接用户输入，存在 Prompt Injection 攻击风险  
**影响**: 攻击者可通过输入绕过系统限制  
**修复方案**:
```typescript
private buildSpellCheckPrompt(text: string, options?: SpellCheckOptions): string {
  const customDict = options?.customDict || this.customDict.getAllWords();
  const ignoreTypes = options?.ignoreTypes || [];

  // 使用结构化的输入格式
  return `你是一个专业的中文校对助手。请严格按照以下格式处理文本。

<task>
检测文本中的错别字、语病和标点错误
</task>

<text>
${this.escapeXML(text)}
</text>

<custom_dict>
${customDict.map(word => this.escapeXML(word)).join(', ')}
</custom_dict>

<output_format>
{
  "errors": [
    {
      "position": number,
      "original": "string",
      "suggestion": "string",
      "type": "错字|别字|语病|标点",
      "reason": "string",
      "confidence": number
    }
  ]
}
</output_format>

<rules>
- 只返回 JSON 格式结果
- 不要解释或添加额外内容
- 自定义词典中的词不应被视为错误
</rules>`;
}

private escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
```
**责任人**: @ai-engineer  
**预计工时**: 4 小时  
**验收标准**:
- ✅ Prompt Injection 攻击测试失败
- ✅ 输出格式验证测试通过

---

#### CR-AI-004: 缺少成本控制机制
**严重程度**: Critical  
**位置**: `src/backend/src/services/ai.service.ts:50-60`  
**问题描述**: 没有 API 调用成本监控和限制，可能导致费用失控  
**影响**: 用户增长后成本线性增长，可能超出预算  
**修复方案**:
```typescript
async checkSpelling(request: SpellCheckRequest): Promise<SpellCheckResult> {
  const userId = request.userId;
  
  // 1. 检查用户配额
  const hasQuota = await this.checkQuota(userId, 'spell-check');
  if (!hasQuota) {
    throw new Error('今日配额已用完，请升级会员或明天再试');
  }
  
  // 2. 估算成本
  const textLength = request.text.length;
  const estimatedCost = this.estimateCost('spell-check', textLength);
  
  // 3. 成本预警
  if (estimatedCost > 0.1) {
    console.warn(`高成本请求: userId=${userId}, cost=${estimatedCost}`);
  }
  
  // 4. 执行检测
  const result = await detector.detect(request.text, request.options);
  
  // 5. 记录使用量
  await this.logUsage({
    userId,
    service: 'spell-check',
    tokens: textLength,
    cost: estimatedCost,
  });
  
  return result;
}
```
**责任人**: @ai-engineer  
**预计工时**: 5 小时  
**验收标准**:
- ✅ 配额检查实现
- ✅ 成本监控 Dashboard
- ✅ 成本超预算告警测试通过

---

#### CR-AI-005: 缺少速率限制
**严重程度**: Critical  
**位置**: `src/ai/spell-check/index.ts:60-86`  
**问题描述**: 批量接口没有速率限制，可能触发 API 提供商的限流  
**影响**: 可能触发 429 Too Many Requests，影响服务可用性  
**修复方案**:
```typescript
import pLimit from 'p-limit';

export async function batchCheckSpelling(
  texts: string[],
  options?: SpellCheckOptions,
): Promise<SpellCheckResult[]> {
  const concurrency = options?.concurrency || 3;
  const limit = pLimit(concurrency);
  
  const promises = texts.map((text, index) => 
    limit(async () => {
      await sleep(index * 200);
      return detector.detect(text, options);
    })
  );
  
  return Promise.all(promises);
}
```
**责任人**: @ai-engineer  
**预计工时**: 2 小时  
**验收标准**:
- ✅ 速率限制测试通过
- ✅ 并发控制测试通过

---

### 安全模块

#### CR-SEC-001: 硬编码默认密钥
**严重程度**: Critical  
**CVSS 评分**: 9.8  
**位置**: `src/config/index.ts:30, 38`  
**问题描述**: JWT_SECRET 和 AES_KEY 有默认值，生产环境未强制要求环境变量  
**影响**: 攻击者可使用默认密钥伪造 JWT Token，获取任意用户权限  
**修复方案**: 同 CR-BE-001  
**责任人**: @security-engineer  
**预计工时**: 1 小时  
**验收标准**:
- ✅ 默认密钥移除
- ✅ 启动验证测试通过

---

#### CR-SEC-002: Refresh Token 未实现
**严重程度**: Critical  
**CVSS 评分**: 8.1  
**位置**: `src/services/auth.service.ts:88-112`  
**问题描述**: Token 刷新机制不可用，存在会话固定攻击风险  
**影响**: Refresh Token 未存储到 Redis，无法验证有效性  
**修复方案**: 同 CR-BE-002  
**责任人**: @security-engineer  
**预计工时**: 4 小时  
**验收标准**:
- ✅ Refresh Token 实现完成
- ✅ 会话管理测试通过

---

#### CR-SEC-003: 敏感数据未加密存储
**严重程度**: Critical  
**CVSS 评分**: 8.5  
**位置**: `prisma/schema.prisma:229-230`  
**问题描述**: 第三方平台 Access Token 和 Refresh Token 明文存储  
**影响**: 数据库泄露时攻击者可访问用户的所有平台账户  
**修复方案**:
```typescript
export class PlatformService {
  static async saveCredentials(userId: string, platform: string, tokens: any) {
    const encryptedAccess = encrypt(tokens.accessToken);
    const encryptedRefresh = encrypt(tokens.refreshToken);
    
    await prisma.platformAccount.create({
      data: {
        userId,
        platform,
        accessToken: JSON.stringify(encryptedAccess),
        refreshToken: JSON.stringify(encryptedRefresh),
        expiresAt: tokens.expiresAt,
      },
    });
  }
}
```
**责任人**: @security-engineer  
**预计工时**: 3 小时  
**验收标准**:
- ✅ 敏感数据加密存储
- ✅ 解密测试通过

---

## 🟠 High 问题列表（本周内修复）

### 前端模块

#### HI-FE-001: 内存泄漏隐患
**严重程度**: High  
**位置**: `src/editor/Editor.tsx:108-118`  
**问题描述**: 事件监听器清理不完整，当 `onSave` 回调改变时，旧的事件监听器可能短暂存在  
**修复方案**: 使用 useRef 存储最新的回调  
**责任人**: @frontend-developer  
**预计工时**: 1 小时

---

#### HI-FE-002: 缺少防抖/节流
**严重程度**: High  
**位置**: `src/stores/editorStore.ts:48-55`  
**问题描述**: 每次内容变化都触发字数统计和状态更新，快速输入时可能导致性能问题  
**修复方案**: 添加 debounce 300ms  
**责任人**: @frontend-developer  
**预计工时**: 1 小时

---

### 后端模块

#### HI-BE-001: 作品统计计算频繁
**严重程度**: High  
**位置**: `src/services/work.service.ts:278-296`  
**问题描述**: 每次章节更新都重新计算作品统计，可能造成 N+1 问题  
**修复方案**: 使用增量更新或异步队列  
**责任人**: @backend-architect  
**预计工时**: 3 小时

---

#### HI-BE-002: 章节批量排序缺少事务
**严重程度**: High  
**位置**: `src/services/work.service.ts:301-321`  
**问题描述**: 使用 `Promise.all` 批量更新，无事务保证  
**修复方案**: 使用 Prisma 事务  
**责任人**: @backend-architect  
**预计工时**: 2 小时

---

#### HI-BE-003: 同步功能未完成
**严重程度**: High  
**位置**: `src/services/sync.service.ts:195-201`  
**问题描述**: `applyCharacterChange` 方法未实现  
**修复方案**: 实现完整逻辑  
**责任人**: @backend-architect  
**预计工时**: 4 小时

---

### AI 模块

#### HI-AI-001: 错误处理不够健壮
**严重程度**: High  
**位置**: `src/ai/spell-check/detector.ts:129-145`  
**问题描述**: 错误处理只记录日志，缺少错误分类和用户友好提示  
**修复方案**: 实现错误分类和用户友好提示  
**责任人**: @ai-engineer  
**预计工时**: 2 小时

---

#### HI-AI-002: 缓存策略不完善
**严重程度**: High  
**位置**: `src/ai/outline-gen/generator.ts:40-52`  
**问题描述**: 缓存键生成过于简单，可能导致缓存冲突  
**修复方案**: 使用更可靠的哈希算法  
**责任人**: @ai-engineer  
**预计工时**: 2 小时

---

### 安全模块

#### HI-SEC-001: 缺少账户锁定机制
**严重程度**: High  
**CVSS 评分**: 7.5  
**位置**: `src/services/auth.service.ts:28-52`  
**问题描述**: 无失败次数限制，易受暴力破解攻击  
**修复方案**: 实现 5 次失败后锁定 30 分钟  
**责任人**: @security-engineer  
**预计工时**: 3 小时

---

#### HI-SEC-002: 会话管理缺失
**严重程度**: High  
**CVSS 评分**: 7.3  
**位置**: `src/services/auth.service.ts`  
**问题描述**: JWT Token 无吊销机制，无法强制用户下线  
**修复方案**: 实现会话管理功能  
**责任人**: @security-engineer  
**预计工时**: 4 小时

---

#### HI-SEC-003: 敏感操作缺少二次认证
**严重程度**: High  
**CVSS 评分**: 6.8  
**位置**: 多处  
**问题描述**: 修改密码、删除作品、绑定平台等操作缺少二次认证  
**修复方案**: 要求输入当前密码或二次确认  
**责任人**: @security-engineer  
**预计工时**: 3 小时

---

## 🟡 Medium 问题列表（两周内修复）

### 前端模块（4 个）

1. **ME-FE-001**: 缺少组件层 - 影响可维护性
2. **ME-FE-002**: 自动保存未实现 - P0 功能缺失
3. **ME-FE-003**: Date 类型序列化问题 - 类型安全
4. **ME-FE-004**: 缺少 CSP 配置 - 安全隐患

### 后端模块（4 个）

1. **ME-BE-001**: 验证中间件未使用 - 错误处理不统一
2. **ME-BE-002**: 大量使用 any - 类型安全
3. **ME-BE-003**: 缺少环境变量验证 - 配置管理
4. **ME-BE-004**: 缺少自定义错误类 - 错误处理不统一

### AI 模块（5 个）

1. **ME-AI-001**: 本地检测实现过于简单 - 实际生产环境无法使用
2. **ME-AI-002**: 封面生成缺少内容审核 - 可能生成不当内容
3. **ME-AI-003**: Prompt 模板缺少版本管理 - 无法 A/B 测试
4. **ME-AI-004**: 类型定义优化 - 使用 any 类型
5. **ME-AI-005**: 添加性能监控 - 缺少性能指标

### 安全模块（5 个）

1. **ME-SEC-001**: 缺少安全审计日志 - 无法追溯安全事件
2. **ME-SEC-002**: 错误响应泄露信息 - 帮助攻击者了解系统
3. **ME-SEC-003**: 章节内容缺少 XSS 防护 - 存在 XSS 风险
4. **ME-SEC-004**: JWT Algorithm Confusion 风险 - 配置不当风险
5. **ME-SEC-005**: 敏感信息暴露在日志中 - 日志文件泄露风险

### 性能模块（2 个）

1. **ME-PERF-001**: 大文档性能 - 100 万字文档可能占用大量内存
2. **ME-PERF-002**: 光标更新频率 - 快速移动光标可能触发大量更新

---

## 🟢 Low 问题列表（有时间修复）

### 前端模块（4 个）

1. **LO-FE-001**: 测试覆盖率：零测试文件
2. **LO-FE-002**: 可访问性：缺少 ARIA 标签
3. **LO-FE-003**: 错误边界：缺少全局错误处理
4. **LO-FE-004**: 虚拟滚动未使用

### 后端模块（4 个）

1. **LO-BE-001**: 用户认证检查重复
2. **LO-BE-002**: 缺少核心模块测试
3. **LO-BE-003**: 加密：密钥派生不安全
4. **LO-BE-004**: 导入顺序混乱

### AI 模块（3 个）

1. **LO-AI-001**: 添加单元测试
2. **LO-AI-002**: 文档注释完善
3. **LO-AI-003**: 本地 AI 模型集成

### 安全模块（3 个）

1. **LO-SEC-001**: API 文档未限制访问
2. **LO-SEC-002**: 密码策略不够严格
3. **LO-SEC-003**: 错误消息用户枚举

### 性能模块（5 个）

1. **LO-PERF-001**: 历史记录深度固定
2. **LO-PERF-002**: 主题切换性能
3. **LO-PERF-003**: 依赖包体积优化
4. **LO-PERF-004**: 构建配置优化
5. **LO-PERF-005**: Web Worker 优化

---

## 📅 修复优先级时间表

### Week 1（本周） - Critical 问题

| 日期 | 问题 ID | 问题名称 | 责任人 | 预计工时 | 状态 |
|------|---------|---------|--------|----------|------|
| 周一 | CR-BE-001 | 生产环境密钥硬编码 | @backend-architect | 1h | ⏳ 未开始 |
| 周一 | CR-SEC-001 | 硬编码默认密钥 | @security-engineer | 1h | ⏳ 未开始 |
| 周二 | CR-BE-003 | 密码验证错误信息泄露 | @backend-architect | 0.5h | ⏳ 未开始 |
| 周二 | CR-BE-004 | 日志记录敏感信息 | @backend-architect | 1h | ⏳ 未开始 |
| 周三 | CR-FE-001 | 文件路径拼接不安全 | @frontend-developer | 2h | ⏳ 未开始 |
| 周三 | CR-FE-002 | 错误处理泄露敏感信息 | @frontend-developer | 3h | ⏳ 未开始 |
| 周四 | CR-AI-001 | API Key 明文暴露风险 | @ai-engineer | 2h | ⏳ 未开始 |
| 周四 | CR-AI-002 | 缺少输入验证 | @ai-engineer | 3h | ⏳ 未开始 |
| 周五 | CR-BE-002 | 认证功能未完成 | @backend-architect | 4h | ⏳ 未开始 |
| 周五 | CR-SEC-002 | Refresh Token 未实现 | @security-engineer | 4h | ⏳ 未开始 |

**Week 1 总工时**: 21.5 小时

---

### Week 2（下周） - Critical + High 问题

| 日期 | 问题 ID | 问题名称 | 责任人 | 预计工时 | 状态 |
|------|---------|---------|--------|----------|------|
| 周一 | CR-FE-003 | 字数统计不准确 | @frontend-developer | 2h | ⏳ 未开始 |
| 周一 | CR-AI-003 | Prompt Injection 漏洞 | @ai-engineer | 4h | ⏳ 未开始 |
| 周二 | CR-AI-004 | 缺少成本控制机制 | @ai-engineer | 5h | ⏳ 未开始 |
| 周二 | CR-AI-005 | 缺少速率限制 | @ai-engineer | 2h | ⏳ 未开始 |
| 周三 | CR-SEC-003 | 敏感数据未加密存储 | @security-engineer | 3h | ⏳ 未开始 |
| 周三 | HI-SEC-001 | 缺少账户锁定机制 | @security-engineer | 3h | ⏳ 未开始 |
| 周四 | HI-FE-001 | 内存泄漏隐患 | @frontend-developer | 1h | ⏳ 未开始 |
| 周四 | HI-FE-002 | 缺少防抖/节流 | @frontend-developer | 1h | ⏳ 未开始 |
| 周五 | HI-SEC-002 | 会话管理缺失 | @security-engineer | 4h | ⏳ 未开始 |
| 周五 | HI-SEC-003 | 敏感操作缺少二次认证 | @security-engineer | 3h | ⏳ 未开始 |

**Week 2 总工时**: 28 小时

---

### Week 3-4（两周内） - High + Medium 问题

**后端优化**：
- HI-BE-001: 作品统计计算频繁（3h）
- HI-BE-002: 章节批量排序缺少事务（2h）
- HI-BE-003: 同步功能未完成（4h）

**AI 优化**：
- HI-AI-001: 错误处理不够健壮（2h）
- HI-AI-002: 缓存策略不完善（2h）

**前端优化**：
- ME-FE-002: 自动保存未实现（3h）

**Week 3-4 总工时**: 16 小时

---

### Month 1（一个月内） - Medium + Low 问题

**测试完善**：
- 补充前端单元测试
- 补充后端测试（目标覆盖率 ≥ 80%）
- 补充 AI 功能测试

**性能优化**：
- 大文档性能优化
- 构建配置优化
- Web Worker 优化

**工程化改进**：
- 环境变量验证
- 自定义错误类
- API 请求 ID 追踪

---

## 📋 责任人分配

### @frontend-developer

**Critical 问题**（3 个）：
- CR-FE-001: 文件路径拼接不安全
- CR-FE-002: 错误处理泄露敏感信息
- CR-FE-003: 字数统计不准确

**High 问题**（2 个）：
- HI-FE-001: 内存泄漏隐患
- HI-FE-002: 缺少防抖/节流

**Medium 问题**（4 个）：
- ME-FE-001: 缺少组件层
- ME-FE-002: 自动保存未实现
- ME-FE-003: Date 类型序列化问题
- ME-FE-004: 缺少 CSP 配置

**总工时**: 约 20 小时

---

### @backend-architect

**Critical 问题**（4 个）：
- CR-BE-001: 生产环境密钥硬编码
- CR-BE-002: 认证功能未完成
- CR-BE-003: 密码验证错误信息泄露
- CR-BE-004: 日志记录敏感信息

**High 问题**（3 个）：
- HI-BE-001: 作品统计计算频繁
- HI-BE-002: 章节批量排序缺少事务
- HI-BE-003: 同步功能未完成

**Medium 问题**（4 个）：
- ME-BE-001: 验证中间件未使用
- ME-BE-002: 大量使用 any
- ME-BE-003: 缺少环境变量验证
- ME-BE-004: 缺少自定义错误类

**总工时**: 约 25 小时

---

### @ai-engineer

**Critical 问题**（5 个）：
- CR-AI-001: API Key 明文暴露风险
- CR-AI-002: 缺少输入验证
- CR-AI-003: Prompt Injection 漏洞
- CR-AI-004: 缺少成本控制机制
- CR-AI-005: 缺少速率限制

**High 问题**（2 个）：
- HI-AI-001: 错误处理不够健壮
- HI-AI-002: 缓存策略不完善

**Medium 问题**（5 个）：
- ME-AI-001: 本地检测实现过于简单
- ME-AI-002: 封面生成缺少内容审核
- ME-AI-003: Prompt 模板缺少版本管理
- ME-AI-004: 类型定义优化
- ME-AI-005: 添加性能监控

**总工时**: 约 30 小时

---

### @security-engineer

**Critical 问题**（3 个）：
- CR-SEC-001: 硬编码默认密钥
- CR-SEC-002: Refresh Token 未实现
- CR-SEC-003: 敏感数据未加密存储

**High 问题**（3 个）：
- HI-SEC-001: 缺少账户锁定机制
- HI-SEC-002: 会话管理缺失
- HI-SEC-003: 敏感操作缺少二次认证

**Medium 问题**（5 个）：
- ME-SEC-001: 缺少安全审计日志
- ME-SEC-002: 错误响应泄露信息
- ME-SEC-003: 章节内容缺少 XSS 防护
- ME-SEC-004: JWT Algorithm Confusion 风险
- ME-SEC-005: 敏感信息暴露在日志中

**总工时**: 约 30 小时

---

## ✅ 验收标准

### Critical 问题验收标准

#### 安全类问题
- ✅ CVSS 评分降低至 5.0 以下
- ✅ 穿透测试通过
- ✅ OWASP Top 10 检查通过
- ✅ 安全审计日志完整

#### 功能类问题
- ✅ 单元测试覆盖率 ≥ 80%
- ✅ 集成测试通过
- ✅ 性能测试达标
- ✅ 用户验收测试通过

### High 问题验收标准

- ✅ 单元测试覆盖率 ≥ 70%
- ✅ 功能测试通过
- ✅ 代码审查通过
- ✅ 文档更新完成

### Medium 问题验收标准

- ✅ 单元测试覆盖率 ≥ 60%
- ✅ 功能测试通过
- ✅ 代码审查通过

### Low 问题验收标准

- ✅ 功能测试通过
- ✅ 代码审查通过

---

## 📈 修复进度追踪

### Week 1 进度

- [ ] Day 1: CR-BE-001, CR-SEC-001
- [ ] Day 2: CR-BE-003, CR-BE-004
- [ ] Day 3: CR-FE-001, CR-FE-002
- [ ] Day 4: CR-AI-001, CR-AI-002
- [ ] Day 5: CR-BE-002, CR-SEC-002

### Week 2 进度

- [ ] Day 1: CR-FE-003, CR-AI-003
- [ ] Day 2: CR-AI-004, CR-AI-005
- [ ] Day 3: CR-SEC-003, HI-SEC-001
- [ ] Day 4: HI-FE-001, HI-FE-002
- [ ] Day 5: HI-SEC-002, HI-SEC-003

### Week 3-4 进度

- [ ] 后端优化（HI-BE-001, HI-BE-002, HI-BE-003）
- [ ] AI 优化（HI-AI-001, HI-AI-002）
- [ ] 前端优化（ME-FE-002）

---

## 🎯 上线前检查清单

### 安全检查

- [ ] 所有 Critical 和 High 安全问题已修复
- [ ] 穿透测试通过
- [ ] OWASP Top 10 检查通过
- [ ] 安全审计日志启用
- [ ] 密钥轮换机制就绪
- [ ] CSP 配置完成

### 功能检查

- [ ] 所有 Critical 功能问题已修复
- [ ] 核心功能测试通过
- [ ] 用户验收测试通过
- [ ] 错误处理完善
- [ ] 日志系统就绪

### 性能检查

- [ ] 所有性能指标达标
- [ ] 大文档性能测试通过
- [ ] 并发性能测试通过
- [ ] 内存泄漏测试通过
- [ ] 成本监控就绪

### 部署检查

- [ ] 环境变量配置完成
- [ ] 数据库迁移就绪
- [ ] 监控系统就绪
- [ ] 回滚方案就绪
- [ ] 应急预案就绪

---

## 📝 总结

### 关键数据

- **总问题数**: 65 个
- **Critical 问题**: 15 个（23%）
- **High 问题**: 10 个（15%）
- **预计总工时**: 约 105 小时
- **预计修复周期**: 4 周

### 风险评估

**高风险模块**：
1. 🔴 **安全模块**: 3 个 Critical + 3 个 High，共 6 个高危问题
2. 🔴 **AI 模块**: 5 个 Critical + 2 个 High，共 7 个高危问题
3. 🔴 **后端模块**: 4 个 Critical + 3 个 High，共 7 个高危问题

**建议**：
1. 优先修复 Critical 问题，预计 2 周完成
2. High 问题在第 3 周完成
3. Medium 问题在第 4 周完成
4. Low 问题可延后至第 2 个月

### 下一步行动

1. **立即**: 召开修复启动会议，分配任务
2. **本周**: 完成 Week 1 的 Critical 问题修复
3. **下周**: 完成 Week 2 的 Critical + High 问题修复
4. **两周内**: 完成 High + Medium 问题修复
5. **一个月内**: 完成 Medium + Low 问题修复
6. **上线前**: 进行全面测试和安全审计

---

**文档生成时间**: 2026-05-07  
**下次更新时间**: Week 1 修复完成后  
**负责人**: @senior-project-manager
