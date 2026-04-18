import { randomUUID } from 'crypto';

/**
 * Generates a UUID v4 string using Node's built-in crypto module.
 */
export function generateUUID(): string {
  return randomUUID();
}
