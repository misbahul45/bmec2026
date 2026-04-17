import { prisma } from "~/lib/utils/prisma";
import { seedCompetition } from "./seeds/competition";
import { seedAdmin } from "./seeds/admin";
import { seedTeams } from "./seeds/team";
import { seedStage } from "./seeds/stage";
import { seedExam } from "./seeds/exxam";

async function main() {
    await Promise.all([
        seedAdmin(),
        seedCompetition(),
        seedTeams(),
        seedStage(),
        seedExam()
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