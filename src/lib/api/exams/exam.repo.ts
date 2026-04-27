import { prisma } from "~/lib/utils/prisma";
import { ExamType } from "@prisma/client";
import { ExamQuestionData } from "~/schemas/exam";

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
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: { stage: true },
    });
  }

  getExamsByStageCompetitionType(competitionType: string) {
    return prisma.exam.findMany({
      where: {
        stage: {
          competition: { name: competitionType as any },
        },
      },
      include: { stage: true },
      orderBy: { startDate: 'asc' },
    })
  }

  getExamQuestionById(examId:string){
    return prisma.examQuestion.findMany({
      where:{
        examId
      }
    })
  }

  createExamQuestion(data:ExamQuestionData){
    return prisma.examQuestion.create({
      data:{
        ...data
      }
    })
  }
  updateExamQuestion(id: string, data: ExamQuestionData) {
    return prisma.examQuestion.update({
      where: { id },
      data,
    })
  }

  deleteExamQuestion(id: string) {
    return prisma.examQuestion.delete({
      where: { id },
    })
  }
}