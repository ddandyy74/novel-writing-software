const SENSITIVE_KEYS = [
  'apiKey',
  'api_key',
  'authorization',
  'token',
  'secret',
  'password',
  'credential',
];

export function sanitizeForLog(obj: any): any {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForLog(item));
  }
  
  const sanitized = { ...obj };
  
  for (const key of Object.keys(sanitized)) {
    const lowerKey = key.toLowerCase();
    
    if (SENSITIVE_KEYS.some(sk => lowerKey.includes(sk))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeForLog(sanitized[key]);
    }
  }
  
  return sanitized;
}

export function safeStringify(obj: any): string {
  try {
    return JSON.stringify(sanitizeForLog(obj), null, 2);
  } catch {
    return '[Unable to stringify]';
  }
}

export function createSafeLogger(prefix: string) {
  return {
    info: (message: string, data?: any) => {
      console.log(`[${prefix}] ${message}`, data ? safeStringify(data) : '');
    },
    warn: (message: string, data?: any) => {
      console.warn(`[${prefix}] ${message}`, data ? safeStringify(data) : '');
    },
    error: (message: string, error?: Error, data?: any) => {
      console.error(`[${prefix}] ${message}`, {
        error: error?.message,
        ...(data ? sanitizeForLog(data) : {}),
      });
    },
  };
}
