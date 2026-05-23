import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const u = await prisma.user.findFirst({ where: { username: "Smartstep05618" } });
  if (!u) {
    console.log("FAIL: Admin user not found. Run: npm run db:seed");
    process.exit(1);
  }
  const ok = await bcrypt.compare("SmartTed*#1", u.passwordHash);
  console.log(ok ? "OK: Admin login credentials valid" : "FAIL: Password mismatch");
}

main()
  .catch((e) => {
    console.error("FAIL:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
