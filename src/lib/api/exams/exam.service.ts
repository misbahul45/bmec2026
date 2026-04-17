import { AppError } from "~/lib/utils/app-error";
import ExamRepo from "./exam.repo";
import { ExamQuestionData } from "~/schemas/exam";
import { prisma } from "~/lib/utils/prisma";

export default class ExamService {
  private repo = new ExamRepo();

  async findAll() {
    const exams = await this.repo.getExams();

    return {
      data: exams,
      message: "Successfully fetched exams",
    };
  }

  async findOneById(id: string) {
    if (!id) {
      throw new AppError("Exam id is required");
    }

    const exam = await this.repo.getExamById(id);

    if (!exam) {
      throw new AppError("Exam not found");
    }

    return {
      data: exam,
      message: "Successfully fetched exam",
    };
  }


  async getExamQuestionByExamId(examId:string){
    const exam = await this.repo.getExamById(examId);

    if (!exam) {
      throw new AppError("Exam not found");
    }

    const examQuestions=await this.repo.getExamQuestionById(examId)

    return{
      data:examQuestions,
      message:'get all exams data'
    }
  }

  async createExamQuestion(data:ExamQuestionData){
    const exam = await this.repo.getExamById(data.examId);

    if (!exam) {
      throw new AppError("Exam not found");
    }

    const dataExamQuestion=await this.repo.createExamQuestion(data)

    return{
      message:'Successfully created',
      data:dataExamQuestion
    }
  }
  async updateExamQuestion(data: ExamQuestionData) {
    if (!data.id) throw new AppError('Question id is required')

    const question = await prisma.examQuestion.findUnique({ where: { id: data.id } })
    if (!question) throw new AppError('Question not found')

    const updated = await this.repo.updateExamQuestion(data.id, data)

    return {
      data: updated,
      message: 'Successfully updated',
    }
  }

  async deleteExamQuestion(id: string) {
    const question = await prisma.examQuestion.findUnique({ where: { id } })
    if (!question) throw new AppError('Question not found')

    await this.repo.deleteExamQuestion(id)

    return {
      data: null,
      message: 'Successfully deleted',
    }
  }
}