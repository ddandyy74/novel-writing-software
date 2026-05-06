import { v4 as uuidv4 } from 'uuid';

/**
 * 生成 UUID
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * 计算字数（中文按字数，英文按单词）
 */
export function countWords(text: string): number {
  if (!text) return 0;
  
  // 移除空白字符
  const cleanText = text.trim();
  if (!cleanText) return 0;

  // 中文字符数
  const chineseCount = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length;
  
  // 英文单词数
  const englishWords = cleanText.replace(/[\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(w => w);
  const englishCount = englishWords.length;

  return chineseCount + englishCount;
}

/**
 * 延迟函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 数据脱敏 - 邮箱
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [name, domain] = email.split('@');
  const maskedName = name.charAt(0) + '***' + name.charAt(name.length - 1);
  return `${maskedName}@${domain}`;
}

/**
 * 判断是否为空对象
 */
export function isEmpty(obj: any): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * 深拷贝
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
