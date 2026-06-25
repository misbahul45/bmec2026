import { CompetitionType, PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "~/lib/utils/prisma";
import { RegistrationCompetitionData } from "~/schemas/competition.schema";

const teamInclude = Prisma.validator<Prisma.TeamInclude>()({
    members: true,
    mentor: true,
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
    currentStage: true,
})

export default class CompetitionRepo {
    findByName(name: CompetitionType) {
        const now = new Date()
        return prisma.competition.findUnique({
            where: { name },
            include: {
                batches: {
                    where: { startDate: { lte: now }, endDate: { gte: now } },
                    orderBy: { startDate: "asc" },
                    take: 1,
                },
                stages: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        })
    }

    findAllWithBatches() {
        return prisma.competition.findMany({
            include: {
                batches: { orderBy: { startDate: "asc" } },
            },
            orderBy: { name: "asc" },
        })
    }

    updateBatch(id: string, data: Prisma.BatchUpdateInput) {
        return prisma.batch.update({ where: { id }, data })
    }

    createBatch(data: Prisma.BatchCreateInput) {
        return prisma.batch.create({ data })
    }

    deleteBatch(id: string) {
        return prisma.batch.delete({ where: { id } })
    }

    findBatchById(id: string) {
        return prisma.batch.findUnique({ where: { id } })
    }

    createRegistration(data : RegistrationCompetitionData){
        return prisma.registration.create({
            data:{
                ...data
            }
        })
    }




    findRegistrationByTeamid(teamId:string){
        return prisma.registration.findUnique({
            where:{
                teamId
            }
        })
    }

    findActiveBatchByCompetitionId(competitionId: string) {
        const now = new Date()

        return prisma.batch.findFirst({
            where: {
            competitionId,
            startDate: {
                lte: now,
            },
            endDate: {
                gte: now,
            },
            },
            orderBy: {
            startDate: "asc",
            },
        })
        }

    approveRegistrationTransaction(params: {
        teamId: string
        adminId: string
        firstStageId: string
        codePrefix: string
        shouldFinalizeCode: boolean
    }) {
        return prisma.$transaction(async (tx) => {
            const updatedRegistration = await tx.registration.update({
                where: { teamId: params.teamId },
                data: {
                    status: PaymentStatus.APPROVED,
                    approvedBy: params.adminId,
                },
            })

            await tx.team.update({
                where: { id: params.teamId },
                data: { currentStageId: params.firstStageId },
            })

            if (params.shouldFinalizeCode) {
                let newCode = `${params.codePrefix}-001`
                const latest = await tx.team.findFirst({
                    where: {
                        code: {
                            startsWith: `${params.codePrefix}-`,
                        },
                    },
                    orderBy: { code: "desc" },
                    select: { code: true },
                })

                if (latest) {
                    const lastNum = Number.parseInt(latest.code.split("-")[1] ?? "0", 10)
                    if (!Number.isNaN(lastNum)) {
                        newCode = `${params.codePrefix}-${String(lastNum + 1).padStart(3, "0")}`
                    }
                }

                await tx.team.update({
                    where: { id: params.teamId },
                    data: { code: newCode },
                })
            }

            const team = await tx.team.findUnique({
                where: { id: params.teamId },
                include: teamInclude,
            })

            return {
                registration: updatedRegistration,
                team,
            }
        })
    }


        findFirstStageByCompetition(competitionId: string) {
            return prisma.stage.findFirst({
                where: { competitionId },
                orderBy: { order: "asc" },
            })
        }

    rejectRegistrationTransaction(teamId:string, adminId:string){
        return prisma.$transaction(async (tx) => {
            const updatedRegistration = await tx.registration.update({
                where: { teamId },
                data: {
                    status: PaymentStatus.REJECTED,
                    approvedBy: adminId,
                },
            })

            const team = await tx.team.update({
                where: { id: teamId },
                data: { currentStageId: null },
                include: teamInclude,
            })

            return {
                registration: updatedRegistration,
                team,
            }
        })
    }
}
