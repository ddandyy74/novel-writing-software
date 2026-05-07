import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

const baseHighlightStyle = HighlightStyle.define([
  { tag: t.heading1, fontWeight: '700', fontSize: '1.875rem' },
  { tag: t.heading2, fontWeight: '700', fontSize: '1.5rem' },
  { tag: t.heading3, fontWeight: '600', fontSize: '1.25rem' },
  { tag: t.strong, fontWeight: '700' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.link, color: 'var(--color-primary-500)', textDecoration: 'underline' },
]);

export interface DynamicThemeOptions {
  fontFamily: string;
  fontSize: number;
  bgColor: string;
  lineHeight: number;
  showLineNumbers: boolean;
}

export function createDynamicTheme(options: DynamicThemeOptions) {
  const { fontFamily, fontSize, bgColor, lineHeight, showLineNumbers } = options;

  const isDark = bgColor === '#0f0f10';
  const textColor = isDark ? '#e4e4e7' : '#1f2937';
  const cursorColor = isDark ? '#6366f1' : '#3b82f6';
  const selectionColor = isDark ? '#4338ca' : '#bfdbfe';
  const lineNumberColor = isDark ? '#52525b' : '#9ca3af';

  const theme = EditorView.theme({
    '&': {
      backgroundColor: bgColor,
      color: textColor,
      height: '100%',
    },
    '.cm-content': {
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: String(lineHeight),
      padding: '32px 0',
    },
    '.cm-line': {
      padding: '0 16px',
      textIndent: '2em',
    },
    '.cm-cursor': {
      borderLeftColor: cursorColor,
      borderLeftWidth: '2px',
    },
    '.cm-selectionBackground': {
      backgroundColor: selectionColor,
    },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      color: lineNumberColor,
      border: 'none',
      display: showLineNumbers ? 'block' : 'none',
    },
  }, { dark: isDark });

  return [
    theme,
    syntaxHighlighting(baseHighlightStyle),
  ];
}

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
    textIndent: '2em',
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
}, { dark: false });

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
}, { dark: false });

export const eyeCareEditorTheme = [
  eyeCareTheme,
  syntaxHighlighting(defaultHighlightStyle),
];

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
}, { dark: true });

export const darkEditorTheme = [
  darkTheme,
  syntaxHighlighting(defaultHighlightStyle),
];

export const editorThemes = {
  'default': defaultEditorTheme,
  'eye-care': eyeCareEditorTheme,
  'dark': darkEditorTheme,
};
