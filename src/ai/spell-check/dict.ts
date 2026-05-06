/**
 * 自定义词典管理
 * 支持添加专有名词、人名、地名等，避免误报
 */

export class CustomDictionary {
  private dict: Set<string>;
  private patterns: RegExp[];

  constructor(initialWords: string[] = []) {
    this.dict = new Set(initialWords);
    this.patterns = [];
  }

  /**
   * 添加单词到词典
   */
  addWord(word: string): void {
    if (word && word.trim()) {
      this.dict.add(word.trim());
    }
  }

  /**
   * 批量添加单词
   */
  addWords(words: string[]): void {
    words.forEach((word) => this.addWord(word));
  }

  /**
   * 移除单词
   */
  removeWord(word: string): void {
    this.dict.delete(word);
  }

  /**
   * 检查单词是否在词典中
   */
  has(word: string): boolean {
    return this.dict.has(word);
  }

  /**
   * 获取所有单词
   */
  getAllWords(): string[] {
    return Array.from(this.dict);
  }

  /**
   * 清空词典
   */
  clear(): void {
    this.dict.clear();
    this.patterns = [];
  }

  /**
   * 从 JSON 文件加载词典
   */
  static async loadFromFile(filePath: string): Promise<CustomDictionary> {
    const fs = await import('fs/promises');
    const content = await fs.readFile(filePath, 'utf-8');
    const words = JSON.parse(content);
    return new CustomDictionary(words);
  }

  /**
   * 保存词典到 JSON 文件
   */
  async saveToFile(filePath: string): Promise<void> {
    const fs = await import('fs/promises');
    await fs.writeFile(
      filePath,
      JSON.stringify(this.getAllWords(), null, 2),
      'utf-8',
    );
  }
}

// 默认网文专有名词词典
export const DEFAULT_WEBNOVEL_DICT = [
  // 常见玄幻小说用词
  '修仙',
  '筑基',
  '金丹',
  '元婴',
  '化神',
  '渡劫',
  '大乘',
  '炼气',
  '灵气',
  '灵石',
  '丹药',
  '阵法',
  '符箓',
  '神识',
  '储物袋',
  '飞剑',
  '法宝',
  '灵兽',
  '宗门',
  '长老',
  '掌门',
  '道友',
  '前辈',
  '晚辈',
  '本座',
  '老夫',
  
  // 常见都市小说用词
  '总裁',
  'CEO',
  '总监',
  '经理',
  '董事长',
  '秘书',
  '助理',
  '别墅',
  '跑车',
  '名媛',
  '富二代',
  '官二代',
  '星二代',
  
  // 常见言情用词
  '王妃',
  '丞相',
  '将军',
  '公主',
  '皇子',
  '后宫',
  '嫔妃',
  '太监',
  '宫女',
  '侍卫',
  '王爷',
  '世子',
  
  // 网络流行语
  '给力',
  '吐槽',
  '安利',
  '种草',
  '拔草',
  '翻车',
  '打call',
  '氪金',
  '肝帝',
  '肝游戏',
];

// 创建默认词典实例
export const defaultDictionary = new CustomDictionary(DEFAULT_WEBNOVEL_DICT);
