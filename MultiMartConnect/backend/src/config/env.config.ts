/**
 * Reads a required environment variable and fails fast when it is missing,
 * so the server never boots with an insecure default.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const JWT_ACCESS_SECRET = requireEnv('JWT_ACCESS_SECRET');
