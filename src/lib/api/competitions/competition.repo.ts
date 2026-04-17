import { CompetitionType, PaymentStatus } from "@prisma/client";
import { prisma } from "~/lib/utils/prisma";
import { RegistrationCompetitionData } from "~/schemas/competition.schema";

export default class CompetitionRepo{
    findByName(name: CompetitionType) {
        const now = new Date()

        return prisma.competition.findUnique({
            where: {
                name,
            },
            include: {
                batches: {
                    where: {
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
                    take: 1,
                },
            },
        })
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

    approveRegistration(teamId:string, adminId:string){
        return prisma.registration.update({
            where:{
                teamId
            },
            data:{
                status:PaymentStatus.APPROVED,
                approvedBy:adminId
            }
        })
    }

    rejectRegistration(teamId:string, adminId:string){
        return prisma.registration.update({
            where:{
                teamId
            },
            data:{
                status:PaymentStatus.REJECTED,
                approvedBy:adminId
            }
        })
    }
}