import React from 'react';
import { useEditorStore } from '@stores/editorStore';
import { useThemeStore } from '@stores/themeStore';
import Editor from '@editor/Editor';

const App: React.FC = () => {
  const { content, updateContent } = useEditorStore();
  const { theme } = useThemeStore();

  return (
    <div className="h-screen w-screen overflow-hidden" data-theme={theme}>
      <div className="h-full flex flex-col">
        {/* 工具栏 */}
        <div className="h-12 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-light)] flex items-center px-4">
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
            网文作者码字软件
          </h1>
        </div>

        {/* 主编辑器 */}
        <div className="flex-1 overflow-hidden">
          <Editor
            content={content}
            onChange={updateContent}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
