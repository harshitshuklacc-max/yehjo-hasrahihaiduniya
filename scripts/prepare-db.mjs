import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Preparing database for schema sync...");

  try {
    const deleted = await prisma.$executeRawUnsafe(`DELETE FROM "TimetableSlot"`);
    console.log(`Removed legacy TimetableSlot rows: ${deleted}`);
  } catch {
    console.log("TimetableSlot cleanup skipped (table may not exist yet).");
  }
}

main()
  .catch((error) => {
    console.error("Database preparation failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
