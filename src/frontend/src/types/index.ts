export interface Chapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

export interface Work {
  id: string;
  title: string;
  author: string;
  chapters: Chapter[];
  totalWordCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  attributes: Record<string, string>;
}

export interface Outline {
  id: string;
  chapterId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EditorConfig {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  autoSave: boolean;
  autoSaveInterval: number;
  undoStackSize: number;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}
