/** Browser-only PBKDF2 password hashing (suitable for a tiny internal demo; use a real backend for production). */

const ITER = 120000;
const SALT_BYTES = 16;

function bytesToB64(buf: ArrayBuffer): string {
  const u8 = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]!);
  return btoa(s);
}

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return `${ITER}.${bytesToB64(salt.buffer)}.${bytesToB64(bits)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(".");
  if (parts.length !== 3) return false;
  const iter = parseInt(parts[0]!, 10);
  const salt = b64ToBytes(parts[1]!);
  const expected = b64ToBytes(parts[2]!);
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: iter, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const out = new Uint8Array(bits);
  if (out.length !== expected.length) return false;
  let ok = 0;
  for (let i = 0; i < out.length; i++) ok |= out[i]! ^ expected[i]!;
  return ok === 0;
}
