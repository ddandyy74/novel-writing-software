import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

// 默认主题
const defaultTheme = EditorView.theme({
  '&': {
    backgroundColor: 'var(--editor-bg)',
    color: 'var(--editor-text)',
    height: '100%',
  },
  '.cm-content': {
    fontFamily: 'Source Han Serif SC, Noto Serif SC, Songti SC, SimSun, serif',
    fontSize: '18px',
    lineHeight: '2.0',
    padding: '32px 0',
  },
  '.cm-line': {
    padding: '0 16px',
    textIndent: '2em', // 首行缩进
  },
  '.cm-cursor': {
    borderLeftColor: 'var(--editor-cursor)',
    borderLeftWidth: '2px',
  },
  '.cm-selectionBackground': {
    backgroundColor: 'var(--editor-selection)',
  },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    color: 'var(--editor-line-number)',
    border: 'none',
  },
  '.cm-activeLineGutter': {
    color: 'var(--editor-line-number-active)',
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--editor-line-highlight)',
  },
}, { dark: false });

// 默认语法高亮
const defaultHighlightStyle = HighlightStyle.define([
  { tag: t.heading1, fontWeight: '700', fontSize: '1.875rem' },
  { tag: t.heading2, fontWeight: '700', fontSize: '1.5rem' },
  { tag: t.heading3, fontWeight: '600', fontSize: '1.25rem' },
  { tag: t.strong, fontWeight: '700' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.link, color: 'var(--color-primary-500)', textDecoration: 'underline' },
]);

export const defaultEditorTheme = [
  defaultTheme,
  syntaxHighlighting(defaultHighlightStyle),
];

// 护眼主题
const eyeCareTheme = EditorView.theme({
  '&': {
    backgroundColor: '#fffef5',
    color: '#3f3f1e',
    height: '100%',
  },
  '.cm-content': {
    fontFamily: 'Source Han Serif SC, Noto Serif SC, Songti SC, SimSun, serif',
    fontSize: '18px',
    lineHeight: '2.0',
    padding: '32px 0',
  },
  '.cm-line': {
    padding: '0 16px',
    textIndent: '2em',
  },
  '.cm-cursor': {
    borderLeftColor: '#22c55e',
    borderLeftWidth: '2px',
  },
  '.cm-selectionBackground': {
    backgroundColor: '#d1fae5',
  },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    color: '#9ca377',
    border: 'none',
  },
  '.cm-activeLineGutter': {
    color: '#16a34a',
  },
  '.cm-activeLine': {
    backgroundColor: '#fef3c7',
  },
}, { dark: false });

export const eyeCareEditorTheme = [
  eyeCareTheme,
  syntaxHighlighting(defaultHighlightStyle),
];

// 深色主题
const darkTheme = EditorView.theme({
  '&': {
    backgroundColor: '#0f0f10',
    color: '#e4e4e7',
    height: '100%',
  },
  '.cm-content': {
    fontFamily: 'Source Han Serif SC, Noto Serif SC, Songti SC, SimSun, serif',
    fontSize: '18px',
    lineHeight: '2.0',
    padding: '32px 0',
  },
  '.cm-line': {
    padding: '0 16px',
    textIndent: '2em',
  },
  '.cm-cursor': {
    borderLeftColor: '#6366f1',
    borderLeftWidth: '2px',
  },
  '.cm-selectionBackground': {
    backgroundColor: '#4338ca',
  },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    color: '#52525b',
    border: 'none',
  },
  '.cm-activeLineGutter': {
    color: '#6366f1',
  },
  '.cm-activeLine': {
    backgroundColor: '#18181b',
  },
}, { dark: true });

export const darkEditorTheme = [
  darkTheme,
  syntaxHighlighting(defaultHighlightStyle),
];

// 主题映射
export const editorThemes = {
  'default': defaultEditorTheme,
  'eye-care': eyeCareEditorTheme,
  'dark': darkEditorTheme,
};
