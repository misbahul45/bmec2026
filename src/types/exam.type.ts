import { Prisma } from "@prisma/client";

export type ExamWithStage = Prisma.ExamGetPayload<{
    include:{
        stage:true
    }
}>