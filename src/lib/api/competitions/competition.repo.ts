import { CompetitionType } from "@prisma/client";
import { prisma } from "~/lib/utils/prisma";

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
}