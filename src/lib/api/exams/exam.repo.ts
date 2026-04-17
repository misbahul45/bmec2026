import { prisma } from "~/lib/utils/prisma";
import { ExamType } from "@prisma/client";

export default class ExamRepo {
  getExams() {
    return prisma.exam.findMany({
      include: {
        stage: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });
  }

  getExamById(id: string) {
    return prisma.exam.findUnique({
      where: { id },
      include: {
        stage: true,
        questions: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  getActiveExams() {
    const now = new Date();

    return prisma.exam.findMany({
      where: {
        startDate: {
          lte: now,
        },
        endDate: {
          gte: now,
        },
      },
      include: {
        stage: true,
      },
    });
  }
}