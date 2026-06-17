import { CompetitionType, Prisma } from "@prisma/client";
import { prisma } from "../src/lib/utils/prisma";

function getCompetitionPrefix(type: CompetitionType) {
  if (type === "OLIMPIADE") return "olm";
  if (type === "INFOGRAFIS") return "ifs";
  if (type === "LKTI") return "lk";
  return "tm";
}

async function generateUniqueTeamCodeTx(
  tx: Prisma.TransactionClient,
  prefix: string
) {
  const teams = await tx.team.findMany({
    where: {
      code: {
        startsWith: `${prefix}-`,
      },
    },
    select: {
      code: true,
    },
  });

  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const codePattern = new RegExp(`^${escapedPrefix}-(\\d+)$`);

  const maxNumber = teams.reduce((max, team) => {
    const match = team.code.match(codePattern);
    if (!match) return max;

    const num = Number(match[1]);
    if (!Number.isFinite(num)) return max;

    return Math.max(max, num);
  }, 0);

  return `${prefix}-${String(maxNumber + 1).padStart(3, "0")}`;
}

function isUniqueCodeError(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;

  const target = error.meta?.target;
  const targetIncludesCode = Array.isArray(target)
    ? target.includes("code")
    : target === "code";

  return error.code === "P2002" && targetIncludesCode;
}

async function repairTeam(teamId: string) {
  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await prisma.$transaction(async (tx) => {
        const freshTeam = await tx.team.findUnique({
          where: { id: teamId },
          select: {
            id: true,
            name: true,
            code: true,
            competitionType: true,
            registration: {
              select: {
                status: true,
              },
            },
          },
        });

        if (!freshTeam) return null;
        if (freshTeam.registration?.status !== "APPROVED") return null;
        if (!freshTeam.code.startsWith("pending-")) return freshTeam;

        const prefix = getCompetitionPrefix(freshTeam.competitionType);
        const code = await generateUniqueTeamCodeTx(tx, prefix);

        return tx.team.update({
          where: { id: freshTeam.id },
          data: { code },
          select: {
            id: true,
            name: true,
            code: true,
            competitionType: true,
          },
        });
      });
    } catch (error) {
      if (isUniqueCodeError(error) && attempt < maxRetries) {
        continue;
      }

      throw error;
    }
  }

  throw new Error(`Failed to repair team code after ${maxRetries} retries`);
}

async function main() {
  const brokenTeams = await prisma.team.findMany({
    where: {
      code: {
        startsWith: "pending-",
      },
      registration: {
        status: "APPROVED",
      },
    },
    select: {
      id: true,
      name: true,
      code: true,
      competitionType: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  console.log(`Found ${brokenTeams.length} approved team(s) with pending code`);

  for (const team of brokenTeams) {
    const repaired = await repairTeam(team.id);
    if (!repaired) {
      console.log(`Skipped ${team.name} (${team.id})`);
      continue;
    }

    console.log(`${team.name}: ${team.code} -> ${repaired.code}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
