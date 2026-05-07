import { useEffect, useState } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

interface UpdateInfo {
  version: string;
  date?: string;
  body?: string;
}

export function useUpdater() {
  const [checking, setChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState<UpdateInfo | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadedBytes, setDownloadedBytes] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const checkForUpdate = async () => {
    setChecking(true);
    setError(null);

    try {
      const update = await check();

      if (update) {
        setUpdateAvailable({
          version: update.version,
          date: update.date,
          body: update.body,
        });
      } else {
        setUpdateAvailable(null);
      }
    } catch (e: any) {
      setError(e.message || '检查更新失败');
    } finally {
      setChecking(false);
    }
  };

  const downloadAndInstall = async () => {
    if (!updateAvailable) return;

    setDownloading(true);
    setDownloadedBytes(0);
    setError(null);

    try {
      const update = await check();

      if (!update) {
        setError('更新不存在');
        return;
      }

      let totalBytes = 0;
      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started':
            totalBytes = 0;
            break;
          case 'Progress':
            totalBytes += event.data.chunkLength;
            setDownloadedBytes(totalBytes);
            break;
          case 'Finished':
            break;
        }
      });

      await relaunch();
    } catch (e: any) {
      setError(e.message || '更新失败');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    checkForUpdate();
  }, []);

  return {
    checking,
    updateAvailable,
    downloading,
    downloadedBytes,
    error,
    checkForUpdate,
    downloadAndInstall,
  };
}
