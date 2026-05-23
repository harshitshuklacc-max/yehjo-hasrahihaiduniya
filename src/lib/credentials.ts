import { prisma } from "./prisma";

export function generateUsername(prefix: string, name: string) {
  const base = name
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6)
    .toLowerCase();
  const rand = Math.random().toString(36).slice(2, 6);
  return `${prefix}${base}${rand}`;
}

export function generatePassword(length = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }
  return pass;
}

export async function uniqueUsername(prefix: string, name: string) {
  let username = generateUsername(prefix, name);
  let attempts = 0;
  while (attempts < 10) {
    const exists = await prisma.user.findUnique({ where: { username } });
    if (!exists) return username;
    username = generateUsername(prefix, name);
    attempts++;
  }
  return `${prefix}${Date.now().toString(36)}`;
}
