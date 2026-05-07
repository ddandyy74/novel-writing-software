/**
 * CLI 配置
 * 支持环境变量和运行时配置
 */

interface CliConfig {
  apiUrl: string;
  debug: boolean;
  theme: 'light' | 'dark';
}

function loadConfig(): CliConfig {
  return {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
    debug: import.meta.env.VITE_DEBUG === 'true',
    theme: 'light',
  };
}

export const cliConfig = loadConfig();

export function printBanner() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         网文作者码字软件 v1.0.0                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

配置信息:
  API 地址: ${cliConfig.apiUrl}
  调试模式: ${cliConfig.debug ? '开启' : '关闭'}
  主题: ${cliConfig.theme}

环境变量:
  VITE_API_URL     设置后端 API 地址
  VITE_DEBUG=true  开启调试模式

示例:
  VITE_API_URL=http://10.77.77.1:3000/api/v1 npm run dev
`);
}

if (cliConfig.debug) {
  printBanner();
}
