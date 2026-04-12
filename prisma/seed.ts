import { prisma } from "~/lib/utils/prisma";
import { seedCompetition } from "./seeds/competition";
import { seedAdmin } from "./seeds/admin";

async function main() {
    await Promise.all([
        seedAdmin(),
        seedCompetition()
    ])
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });