import { save, open } from '@tauri-apps/plugin-dialog';
import { writeTextFile, readTextFile, join, appDataDir } from '@tauri-apps/plugin-fs';

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
    const filePath = await save({
      defaultPath,
      filters: [
        {
          name: 'Text',
          extensions: ['txt', 'md'],
        },
      ],
    });

    if (filePath) {
      await writeTextFile(filePath, content);
      return true;
    }
    return false;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Save file error:', error);
    }
    return false;
  }
}

export async function openFile(): Promise<string | null> {
  try {
    const filePath = await open({
      multiple: false,
      filters: [
        {
          name: 'Text',
          extensions: ['txt', 'md'],
        },
      ],
    });

    if (filePath && typeof filePath === 'string') {
      const content = await readTextFile(filePath);
      return content;
    }
    return null;
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
    
    const appDataDirPath = await appDataDir();
    const filePath = await join(appDataDirPath, filename);
    await writeTextFile(filePath, content);
    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Auto save error:', error);
    }
    return false;
  }
}
