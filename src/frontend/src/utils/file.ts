import { save, open } from '@tauri-apps/plugin-dialog';
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';

// 保存文件
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
    console.error('Save file error:', error);
    return false;
  }
}

// 打开文件
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
    console.error('Open file error:', error);
    return null;
  }
}

// 自动保存到本地
export async function autoSaveToLocal(content: string, filename: string): Promise<boolean> {
  try {
    // 保存到应用数据目录
    const appDataDir = await getAppDataDir();
    const filePath = `${appDataDir}/${filename}`;
    await writeTextFile(filePath, content);
    return true;
  } catch (error) {
    console.error('Auto save error:', error);
    return false;
  }
}

// 获取应用数据目录
async function getAppDataDir(): Promise<string> {
  // Tauri 会自动处理应用数据目录
  return './data';
}
