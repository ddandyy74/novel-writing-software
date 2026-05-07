import { useState, useEffect, useCallback } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';

interface UseFullscreenResult {
  isFullscreen: boolean;
  toggleFullscreen: () => Promise<void>;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
}

export function useFullscreen(): UseFullscreenResult {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const appWindow = getCurrentWindow();

    const checkFullscreen = async () => {
      try {
        const fullscreen = await appWindow.isFullscreen();
        setIsFullscreen(fullscreen);
      } catch (error) {
        console.error('Failed to check fullscreen state:', error);
      }
    };

    checkFullscreen();

    const unlisten = appWindow.onResized(async () => {
      await checkFullscreen();
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  const enterFullscreen = useCallback(async () => {
    try {
      const appWindow = getCurrentWindow();
      await appWindow.setFullscreen(true);
      setIsFullscreen(true);
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      const appWindow = getCurrentWindow();
      await appWindow.setFullscreen(false);
      setIsFullscreen(false);
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      const appWindow = getCurrentWindow();
      const fullscreen = await appWindow.isFullscreen();
      await appWindow.setFullscreen(!fullscreen);
      setIsFullscreen(!fullscreen);
    } catch (error) {
      console.error('Failed to toggle fullscreen:', error);
    }
  }, []);

  return {
    isFullscreen,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
  };
}

export function useFullscreenShortcut(
  toggleFullscreen: () => Promise<void>,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        e.stopPropagation();
        await toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [toggleFullscreen, enabled]);
}
