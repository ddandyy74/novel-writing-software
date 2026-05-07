import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@stores/authStore';
import { setApiConfig } from './config/api';
import { cliConfig, printBanner } from './config/cli';
import Main from '@components/Main';

const App: React.FC = () => {
  const { isAuthenticated, accessToken } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setApiConfig({ baseUrl: cliConfig.apiUrl });
    
    if (cliConfig.debug) {
      printBanner();
    }

    setTimeout(() => setChecking(false), 100);
  }, []);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      console.log('已登录，API 地址:', cliConfig.apiUrl);
    }
  }, [isAuthenticated, accessToken]);

  if (checking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
        <div className="text-[var(--color-text-secondary)]">加载中...</div>
      </div>
    );
  }

  return <Main />;
};

export default App;
