import React, { useRef, useEffect } from 'react';
import { EditorState, Transaction } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { useEditorStore } from '@stores/editorStore';
import { useThemeStore } from '@stores/themeStore';
import { editorThemes } from '@themes/editorThemes';
import { Compartment } from '@codemirror/state';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave?: () => void;
}

const Editor: React.FC<EditorProps> = ({ content, onChange, onSave }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const themeCompartment = useRef(new Compartment());
  
  const { theme } = useThemeStore();
  const { updateCursorPosition } = useEditorStore();

  // 初始化编辑器
  useEffect(() => {
    if (!editorRef.current) return;

    // 创建编辑器状态
    const startState = EditorState.create({
      doc: content,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history({ maxDepth: 50 }), // 支持撤销 50 步
        keymap.of([...defaultKeymap, ...historyKeymap]),
        
        // 主题
        themeCompartment.current.of(editorThemes[theme]),
        
        // 监听内容变化
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newContent = update.state.doc.toString();
            onChange(newContent);
          }
          
          // 更新光标位置
          if (update.selectionSet) {
            const pos = update.state.selection.main.head;
            const line = update.state.doc.lineAt(pos);
            updateCursorPosition(line.number, pos - line.from + 1);
          }
        }),
        
        // 编辑器样式
        EditorView.theme({
          '&': {
            height: '100%',
          },
          '.cm-scroller': {
            overflow: 'auto',
          },
        }),
      ],
    });

    // 创建编辑器视图
    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    // 清理
    return () => {
      view.destroy();
    };
  }, []);

  // 切换主题
  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: themeCompartment.current.reconfigure(editorThemes[theme]),
      });
    }
  }, [theme]);

  // 外部内容更新
  useEffect(() => {
    if (viewRef.current) {
      const currentValue = viewRef.current.state.doc.toString();
      if (content !== currentValue) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: content,
          },
        });
      }
    }
  }, [content]);

  // 保存快捷键 (Cmd/Ctrl + S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        onSave?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSave]);

  return (
    <div 
      ref={editorRef} 
      className="h-full w-full overflow-hidden"
    />
  );
};

export default Editor;
