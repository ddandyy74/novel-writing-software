import React, { useRef, useEffect, useCallback } from 'react';
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
  const onSaveRef = useRef(onSave);
  
  const { theme } = useThemeStore();
  const { updateCursorPosition } = useEditorStore();

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const debouncedOnChange = useRef(
    debounce((newContent: string) => {
      onChange(newContent);
    }, 300)
  ).current;

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: content,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history({ maxDepth: 50 }),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        
        themeCompartment.current.of(editorThemes[theme]),
        
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newContent = update.state.doc.toString();
            debouncedOnChange(newContent);
          }
          
          if (update.selectionSet) {
            const pos = update.state.selection.main.head;
            const line = update.state.doc.lineAt(pos);
            updateCursorPosition(line.number, pos - line.from + 1);
          }
        }),
        
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

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: themeCompartment.current.reconfigure(editorThemes[theme]),
      });
    }
  }, [theme]);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        onSaveRef.current?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      ref={editorRef} 
      className="h-full w-full overflow-hidden"
    />
  );
};

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export default Editor;
