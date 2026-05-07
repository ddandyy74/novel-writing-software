// @ts-nocheck
/**
 * AI 功能控制器
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AIService } from '../services/ai.service';
import { successResponse, errorResponse } from '../utils/response';

// 请求类型
interface SpellCheckBody {
  text: string;
  options?: {
    useLocal?: boolean;
    customDict?: string[];
    ignoreTypes?: Array<'错字' | '别字' | '语病' | '标点'>;
  };
}

interface OutlineGenerateBody {
  workId: string;
  chapterId: string;
  chapterTitle: string;
  chapterContent: string;
  previousOutlines?: any[];
  outputFormat?: 'json' | 'markdown';
}

interface CoverGenerateBody {
  workId: string;
  workTitle: string;
  author: string;
  genre: string;
  style: '古风' | '现代' | '玄幻' | '言情' | '科幻' | '悬疑';
  tags?: string[];
  description?: string;
  options?: {
    width?: number;
    height?: number;
    samples?: number;
  };
}

/**
 * AI 路由
 */
export async function aiRoutes(app: FastifyInstance) {
  const aiService = new AIService(app);

  // 错别字检测
  app.post('/spell-check', {
    schema: {
      body: {
        type: 'object',
        required: ['text'],
        properties: {
          text: { type: 'string' },
          options: { type: 'object' },
        },
      },
    },
  }, async (request: FastifyRequest<{ Body: SpellCheckBody }>, reply: FastifyReply) => {
    try {
      const { text, options } = request.body;

      // 验证文本长度
      if (text.length > 100000) {
        return reply.status(400).send(errorResponse('文本长度超过限制（最大10万字）', 400));
      }

      const result = await aiService.checkSpelling({ text, options });

      // 记录使用
      const userId = (request as any).user?.userId || 'anonymous';
      await aiService.logUsage({
        userId,
        service: 'spell-check',
        cost: text.length / 1000 * 0.01,
      });

      return reply.send(successResponse(result, '错别字检测完成'));
    } catch (err) {
      const errorResponseMessage = err instanceof Error ? err.message : '未知错误';
      return reply.status(500).send(errorResponse(`错别字检测失败: ${errorResponseMessage}`, 500));
    }
  });

  // 批量错别字检测
  app.post('/spell-check/batch', {
    schema: {
      body: {
        type: 'object',
        required: ['texts'],
        properties: {
          texts: {
            type: 'array',
            items: { type: 'string' },
          },
          options: { type: 'object' },
        },
      },
    },
  }, async (request: FastifyRequest<{ Body: { texts: string[]; options?: any } }>, reply: FastifyReply) => {
    try {
      const { texts, options } = request.body;

      // 验证
      if (texts.length > 100) {
        return reply.status(400).send(errorResponse('批量检测数量超过限制（最多100个文本）', 400));
      }

      const results = await aiService.batchCheckSpelling(texts, options);

      // 记录使用
      const userId = (request as any).user?.userId || 'anonymous';
      const totalLength = texts.reduce((sum, text) => sum + text.length, 0);
      await aiService.logUsage({
        userId,
        service: 'spell-check',
        cost: totalLength / 1000 * 0.01,
      });

      return reply.send(successResponse(results, '批量错别字检测完成'));
    } catch (err) {
      const errorResponseMessage = err instanceof Error ? err.message : '未知错误';
      return reply.status(500).send(errorResponse(`批量错别字检测失败: ${errorResponseMessage}`, 500));
    }
  });

  // 大纲生成
  app.post('/outline/generate', {
    schema: {
      body: {
        type: 'object',
        required: ['workId', 'chapterId', 'chapterTitle', 'chapterContent'],
        properties: {
          workId: { type: 'string' },
          chapterId: { type: 'string' },
          chapterTitle: { type: 'string' },
          chapterContent: { type: 'string' },
          previousOutlines: { type: 'array' },
          outputFormat: { type: 'string', enum: ['json', 'markdown'] },
        },
      },
    },
  }, async (request: FastifyRequest<{ Body: OutlineGenerateBody }>, reply: FastifyReply) => {
    try {
      const result = await aiService.generateOutline(request.body);

      // 记录使用
      const userId = (request as any).user?.userId || 'anonymous';
      await aiService.logUsage({
        userId,
        service: 'outline-gen',
        cost: 0.05,
      });

      return reply.send(successResponse(result, '大纲生成完成'));
    } catch (err) {
      const errorResponseMessage = err instanceof Error ? err.message : '未知错误';
      return reply.status(500).send(errorResponse(`大纲生成失败: ${errorResponseMessage}`, 500));
    }
  });

  // 封面生成
  app.post('/cover/generate', {
    schema: {
      body: {
        type: 'object',
        required: ['workId', 'workTitle', 'author', 'genre', 'style'],
        properties: {
          workId: { type: 'string' },
          workTitle: { type: 'string' },
          author: { type: 'string' },
          genre: { type: 'string' },
          style: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          description: { type: 'string' },
          options: { type: 'object' },
        },
      },
    },
  }, async (request: FastifyRequest<{ Body: CoverGenerateBody }>, reply: FastifyReply) => {
    try {
      const result = await aiService.generateCover(request.body);

      // 记录使用
      const userId = (request as any).user?.userId || 'anonymous';
      await aiService.logUsage({
        userId,
        service: 'cover-gen',
        cost: 0.2 * (request.body.options?.samples || 4),
      });

      return reply.send(successResponse(result, '封面生成完成'));
    } catch (err) {
      const errorResponseMessage = err instanceof Error ? err.message : '未知错误';
      return reply.status(500).send(errorResponse(`封面生成失败: ${errorResponseMessage}`, 500));
    }
  });

  // 获取封面风格列表
  app.get('/cover/styles', async (request: FastifyRequest, reply: FastifyReply) => {
    const styles = [
      { value: '古风', label: '古风', description: '传统水墨风格，适合武侠、仙侠小说' },
      { value: '现代', label: '现代', description: '现代都市风格，简洁时尚' },
      { value: '玄幻', label: '玄幻', description: '奇幻神秘风格，适合玄幻、奇幻小说' },
      { value: '言情', label: '言情', description: '浪漫唯美风格，适合言情小说' },
      { value: '科幻', label: '科幻', description: '未来科技风格，适合科幻小说' },
      { value: '悬疑', label: '悬疑', description: '神秘黑暗风格，适合悬疑推理小说' },
    ];

    return reply.send(successResponse(styles, '获取封面风格列表成功'));
  });

  // AI 使用统计
  app.get('/usage/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send(errorResponse('未授权', 401));
    }

    // TODO: 从数据库获取用户使用统计
    const stats = {
      userId,
      today: {
        spellCheck: { count: 5, cost: 0.05 },
        outlineGen: { count: 2, cost: 0.10 },
        coverGen: { count: 1, cost: 0.80 },
      },
      totalCost: 0.95,
    };

    return reply.send(successResponse(stats, '获取使用统计成功'));
  });
}
