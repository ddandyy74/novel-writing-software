/**
 * 文件操作工具（Web 版本）
 * Tauri 版本需要安装 @tauri-apps/plugin-dialog 和 @tauri-apps/plugin-fs
 */

function isValidFilename(filename: string): boolean {
  if (!filename || filename.length === 0 || filename.length > 255) {
    return false;
  }
  
  const dangerousPattern = /(\.\.|[<>:"\/\\|?*]|\x00|\n|\r)/;
  if (dangerousPattern.test(filename)) {
    return false;
  }
  
  if (filename.startsWith('.') || filename.endsWith('.')) {
    return false;
  }
  
  return true;
}

export async function saveFile(content: string, defaultPath?: string): Promise<boolean> {
  try {
    // Web 版本：使用下载
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = defaultPath || 'untitled.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Save file error:', error);
    }
    return false;
  }
}

export async function openFile(): Promise<string | null> {
  try {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.txt,.md';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const content = await file.text();
          resolve(content);
        } else {
          resolve(null);
        }
      };
      
      input.click();
    });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Open file error:', error);
    }
    return null;
  }
}

export async function autoSaveToLocal(content: string, filename: string): Promise<boolean> {
  try {
    if (!isValidFilename(filename)) {
      throw new Error('Invalid filename');
    }
    
    // Web 版本：存储到 localStorage
    localStorage.setItem(`autosave-${filename}`, content);
    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Auto save error:', error);
    }
    return false;
  }
}
