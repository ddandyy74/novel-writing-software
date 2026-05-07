/**
 * API 配置
 * 支持环境变量和运行时配置
 */

interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 30000,
};

let runtimeConfig: Partial<ApiConfig> = {};

export function setApiConfig(config: Partial<ApiConfig>) {
  runtimeConfig = { ...runtimeConfig, ...config };
}

export function getApiConfig(): ApiConfig {
  return {
    ...DEFAULT_CONFIG,
    ...runtimeConfig,
  };
}

export const API_BASE_URL = () => getApiConfig().baseUrl;
