import { z } from 'zod';

// ============================================
// 认证验证
// ============================================

export const registerSchema = z.object({
  email: z.string().email('邮箱格式错误'),
  password: z.string().min(8, '密码至少8位').max(128, '密码最长128位'),
  nickname: z.string().min(1, '昵称不能为空').max(50, '昵称最长50位'),
});

export const loginSchema = z.object({
  email: z.string().email('邮箱格式错误'),
  password: z.string().min(1, '密码不能为空'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh Token 不能为空'),
});

// ============================================
// 用户验证
// ============================================

export const updateSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'sepia']).optional(),
  fontSize: z.number().int().min(12).max(24).optional(),
  dailyGoal: z.number().int().min(100).max(100000).optional(),
  autoSave: z.boolean().optional(),
});

// ============================================
// 作品验证
// ============================================

export const createWorkSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题最长100位'),
  genre: z.string().max(50).optional(),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).max(10).optional(),
});

export const updateWorkSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  genre: z.string().max(50).optional(),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).max(10).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export const getWorksQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  pageSize: z.string().regex(/^\d+$/).transform(Number).default('20'),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

// ============================================
// 章节验证
// ============================================

export const createChapterSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题最长100位'),
  content: z.string().max(1000000, '内容最长100万字'),
  order: z.number().int().min(1, '章节顺序从1开始'),
});

export const updateChapterSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  content: z.string().max(1000000).optional(),
  status: z.enum(['draft', 'published']).optional(),
});

export const reorderChaptersSchema = z.object({
  orders: z.array(
    z.object({
      chapterId: z.string().uuid(),
      order: z.number().int().min(1),
    })
  ),
});

// ============================================
// 角色验证
// ============================================

export const createCharacterSchema = z.object({
  name: z.string().min(1, '角色名不能为空').max(50),
  age: z.number().int().min(0).max(1000).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  appearance: z.string().max(500).optional(),
  personality: z.string().max(500).optional(),
  background: z.string().max(1000).optional(),
  abilities: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export const createCharacterRelationSchema = z.object({
  characterId1: z.string().uuid(),
  characterId2: z.string().uuid(),
  relationType: z.enum(['friend', 'enemy', 'lover', 'family', 'teacher_student', 'other']),
  description: z.string().max(500).optional(),
  startChapter: z.number().int().min(1).optional(),
  endChapter: z.number().int().min(1).optional(),
});

// ============================================
// 大纲验证
// ============================================

export const generateOutlineSchema = z.object({
  chapterId: z.string().uuid(),
  chapterContent: z.string(),
  previousOutlines: z.array(
    z.object({
      chapter: z.number().int(),
      summary: z.string(),
    })
  ).optional(),
});

// ============================================
// 同步验证
// ============================================

export const syncPushSchema = z.object({
  clientId: z.string(),
  lastSyncTime: z.string().datetime(),
  changes: z.array(
    z.object({
      type: z.enum(['work', 'chapter', 'character']),
      action: z.enum(['create', 'update', 'delete']),
      id: z.string().uuid(),
      data: z.any().optional(),
      timestamp: z.string().datetime(),
      version: z.number().int(),
    })
  ),
});

export const syncPullSchema = z.object({
  clientId: z.string(),
  lastSyncTime: z.string().datetime(),
  tables: z.array(z.enum(['works', 'chapters', 'characters'])).optional(),
});

// ============================================
// 发布验证
// ============================================

export const publishSchema = z.object({
  chapterId: z.string().uuid(),
  platforms: z.array(z.enum(['qidian', 'fanqie', 'jinjiang'])).min(1),
  options: z.object({
    autoFormat: z.boolean().optional(),
    publishTime: z.string().datetime().optional(),
  }).optional(),
});

// ============================================
// 通用验证
// ============================================

export const idParamSchema = z.object({
  id: z.string().uuid('ID 格式错误'),
});

export const paginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  pageSize: z.string().regex(/^\d+$/).transform(Number).default('20'),
});
