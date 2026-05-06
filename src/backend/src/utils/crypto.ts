import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { config } from '../config';

/**
 * 密码哈希
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, config.encryption.bcryptSaltRounds);
}

/**
 * 验证密码
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * AES-256-GCM 加密
 */
export function encrypt(plaintext: string, key?: string): {
  iv: string;
  encrypted: string;
  authTag: string;
} {
  const encryptionKey = key || config.encryption.aesKey;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(encryptionKey.padEnd(32, '0').slice(0, 32)),
    iv,
  );

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    encrypted,
    authTag: authTag.toString('hex'),
  };
}

/**
 * AES-256-GCM 解密
 */
export function decrypt(
  encryptedData: { iv: string; encrypted: string; authTag: string },
  key?: string,
): string {
  const encryptionKey = key || config.encryption.aesKey;
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(encryptionKey.padEnd(32, '0').slice(0, 32)),
    Buffer.from(encryptedData.iv, 'hex'),
  );

  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * 生成随机 Token
 */
export function generateToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * 密钥派生 (PBKDF2)
 */
export function deriveKey(password: string, salt: string, iterations = 100000): Buffer {
  return crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
}
