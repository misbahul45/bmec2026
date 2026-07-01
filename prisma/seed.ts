import { prisma } from "~/lib/utils/prisma";
import { seedAdmin } from "./seeds/admin";
import { seedStage } from "./seeds/stage";
import { seedCompetitionOrsinil } from "./seeds/orisinil/competition.orsinil";
import { seedExamOrsinil } from "./seeds/orisinil/exam.orsinil";
import { seedTeams } from "./seeds/data";

const seeds = [
  // seedCompetitionOrsinil,
  // seedStage,
  // seedAdmin,
  // seedExamOrsinil,
  seedTeams
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