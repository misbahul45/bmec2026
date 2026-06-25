import { CompetitionType, PaymentStatus, Prisma } from "@prisma/client";
import CompetitionRepo from "./competition.repo";
import { AppError } from "~/lib/utils/app-error";
import { RegistrationAction, RegistrationCompetitionData } from "~/schemas/competition.schema";
import TeamRepo from "../teams/team.repo";
import { prisma } from "~/lib/utils/prisma";

export default class CompetitionService {
  private repo = new CompetitionRepo();
  private teamRepo = new TeamRepo();

  private getCompetitionPrefix(type: CompetitionType) {
    if (type === "OLIMPIADE") return "olm";
    if (type === "INFOGRAFIS") return "ifs";
    if (type === "LKTI") return "lk";
    return "tm";
  }

  private async generateUniqueTeamCodeTx(
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

  private isUniqueCodeError(error: unknown) {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;

    const target = error.meta?.target;
    const targetIncludesCode = Array.isArray(target)
      ? target.includes("code")
      : target === "code";

    return error.code === "P2002" && targetIncludesCode;
  }

  async findOneByName(name: CompetitionType) {
    const existedcompetition =
      await this.repo.findByName(name);

    if (!existedcompetition) {
      throw new AppError(
        "Competition not found"
      );
    }

    return {
      data: this.serializeCompetition(
        existedcompetition
      ),
      message: "get competition",
    };
  }

  serializeCompetition(data: any) {
    if (!data) return data;

    return {
      ...data,
      batches: data.batches.map(
        (b: any) => ({
          ...b,
          price: b.price.toNumber(),
        })
      ),
    };
  }

  async registrationCompetition(
    data: RegistrationCompetitionData
  ) {
    const teamAlreadyRegister =
      await this.repo.findRegistrationByTeamid(
        data.teamId
      );

    if (teamAlreadyRegister?.paymentProof) {
      throw new AppError(
        "Team already registered"
      );
    }

    const activeBatch= this.repo.findActiveBatchByCompetitionId(data.competitionId)
    if (!activeBatch) {
      throw new AppError(
        "Pendaftaran untuk kompetisi ini belum dibuka atau sudah ditutup",
        400
      )
    }
    const created =
      await this.repo.createRegistration(
        data
      );


    return {
      data: created,
      message:
        "Successfully registered competition",
    };
  }
  async approveRegistration(data: RegistrationAction) {
    if (data.action !== "APPROVED") {
      throw new AppError("Invalid registration action")
    }

    const registration = await this.repo.findRegistrationByTeamid(data.teamId)
    if (!registration) throw new AppError("Registration not found", 404)

    const firstStage = await this.repo.findFirstStageByCompetition(registration.competitionId)
    if (!firstStage) throw new AppError("Stage not found", 404)

    const team = await this.teamRepo.findById(data.teamId)
    if (!team) throw new AppError("Team not found", 404)

    const maxRetries = 5

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await prisma.$transaction(async (tx) => {
          const freshTeam = await tx.team.findUnique({
            where: { id: data.teamId },
            select: {
              id: true,
              code: true,
              competitionType: true,
            },
          })

          if (!freshTeam) throw new AppError("Team not found", 404)

          let finalCode: string | undefined

          if (freshTeam.code.startsWith("pending-")) {
            const prefix = this.getCompetitionPrefix(freshTeam.competitionType)
            finalCode = await this.generateUniqueTeamCodeTx(tx, prefix)
          }

          const updatedRegistration = await tx.registration.update({
            where: { teamId: data.teamId },
            data: {
              status: PaymentStatus.APPROVED,
              approvedBy: data.adminId,
            },
          })

          const updatedTeam = await tx.team.update({
            where: { id: data.teamId },
            data: {
              currentStageId: firstStage.id,
              ...(finalCode ? { code: finalCode } : {}),
            },
            include: {
              members: true,
              mentor: true,
              currentStage: true,
              registration: {
                include: {
                  batch: true,
                  competition: {
                    include: {
                      stages: {
                        orderBy: { order: "asc" },
                      },
                    },
                  },
                },
              },
            },
          })

          return {
            registration: updatedRegistration,
            team: updatedTeam,
          }
        })

        return {
          data: result,
          message: "Registration approved successfully",
        }
      } catch (error) {
        if (this.isUniqueCodeError(error) && attempt < maxRetries) {
          continue
        }

        if (this.isUniqueCodeError(error)) {
          throw new AppError("Gagal generate kode tim unik. Coba approve lagi.", 409)
        }

        throw error
      }
    }

    throw new AppError("Gagal approve registration", 500)
  }

  async rejectRegistration(data: RegistrationAction) {
    if (data.action !== "REJECTED") {
      throw new AppError("Invalid registration action")
    }

    const registration = await this.repo.findRegistrationByTeamid(data.teamId)
    if (!registration) throw new AppError("Registration not found", 404)

    const result = await prisma.$transaction(async (tx) => {
      const updatedRegistration = await tx.registration.update({
        where: { teamId: data.teamId },
        data: {
          status: PaymentStatus.REJECTED,
          approvedBy: data.adminId,
        },
      })

      const updatedTeam = await tx.team.update({
        where: { id: data.teamId },
        data: {
          currentStageId: null,
        },
        include: {
          members: true,
          mentor: true,
          currentStage: true,
          registration: {
            include: {
              batch: true,
              competition: {
                include: {
                  stages: {
                    orderBy: { order: "asc" },
                  },
                },
              },
            },
          },
        },
      })

      return {
        registration: updatedRegistration,
        team: updatedTeam,
      }
    })

    return { data: result, message: "Registration rejected successfully" }
  }

  async getAllCompetitionsWithBatches() {
    const competitions = await this.repo.findAllWithBatches()
    return {
      data: competitions.map((c) => ({
        ...c,
        batches: c.batches.map((b) => ({ ...b, price: Number(b.price) })),
      })),
    }
  }

  async updateBatch(id: string, data: { name?: string; startDate?: Date; endDate?: Date; price?: number; module_bacth?: string }) {
    const batch = await this.repo.findBatchById(id)
    if (!batch) throw new AppError("Batch not found", 404)
    const updated = await this.repo.updateBatch(id, {
      ...(data.name && { name: data.name }),
      ...(data.startDate && { startDate: data.startDate }),
      ...(data.endDate && { endDate: data.endDate }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.module_bacth !== undefined && { module_bacth: data.module_bacth }),
    })
    return { data: { ...updated, price: Number(updated.price) }, message: "Batch updated" }
  }

  async createBatch(competitionId: string, data: { name: string; startDate: Date; endDate: Date; price: number; module_bacth: string }) {
    const created = await this.repo.createBatch({
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      price: data.price,
      module_bacth: data.module_bacth,
      competition: { connect: { id: competitionId } },
    })
    return { data: { ...created, price: Number(created.price) }, message: "Batch created" }
  }

  async deleteBatch(id: string) {
    const batch = await this.repo.findBatchById(id)
    if (!batch) throw new AppError("Batch not found", 404)
    await this.repo.deleteBatch(id)
    return { data: null, message: "Batch deleted" }
  }
}
