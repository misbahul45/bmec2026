import { prisma } from "~/lib/utils/prisma";
import { seedCompetition } from "./seeds/competition";
import { seedAdmin } from "./seeds/admin";
import { seedTeams } from "./seeds/team";
import { seedStage } from "./seeds/stage";
import { seedExam } from "./seeds/exam";

const seeds = [
  seedCompetition,
  seedStage,
  seedAdmin,
  seedTeams,
  seedExam,
]

async function main() {
  for (const seed of seeds) {
    await seed()
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });