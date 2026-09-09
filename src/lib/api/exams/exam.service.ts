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
      throw new AppError("ID ujian wajib diisi untuk mencari data ujian.", 400, "EXAM_ID_REQUIRED");
    }

    const exam = await this.repo.getExamById(id);

    if (!exam) {
      throw new AppError("Ujian tidak ditemukan. Pastikan ID ujian benar.", 404, "EXAM_NOT_FOUND");
    }

    return {
      data: exam,
      message: "Successfully fetched exam",
    };
  }


  async getExamQuestionByExamId(examId:string){
    const exam = await this.repo.getExamById(examId);

    if (!exam) {
      throw new AppError("Ujian tidak ditemukan. Pastikan ID ujian benar.", 404, "EXAM_NOT_FOUND");
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
      throw new AppError("Ujian tidak ditemukan. Pastikan ID ujian benar.", 404, "EXAM_NOT_FOUND");
    }

    const dataExamQuestion=await this.repo.createExamQuestion(data)

    return{
      message:'Successfully created',
      data:dataExamQuestion
    }
  }
  async updateExamQuestion(data: ExamQuestionData) {
    if (!data.id) throw new AppError('ID soal wajib diisi untuk memperbarui data soal.', 400, 'QUESTION_ID_REQUIRED')

    const question = await prisma.examQuestion.findUnique({ where: { id: data.id } })
    if (!question) throw new AppError('Soal tidak ditemukan. Pastikan ID soal benar.', 404, 'QUESTION_NOT_FOUND')

    const updated = await this.repo.updateExamQuestion(data.id, data)

    return {
      data: updated,
      message: 'Successfully updated',
    }
  }

  async deleteExamQuestion(id: string) {
    const question = await prisma.examQuestion.findUnique({ where: { id } })
    if (!question) throw new AppError('Soal tidak ditemukan. Pastikan ID soal benar.', 404, 'QUESTION_NOT_FOUND')

    await this.repo.deleteExamQuestion(id)

    return {
      data: null,
      message: 'Successfully deleted',
    }
  }

  async findByCompetitionType(competitionType: string, teamId: string) {
    const exams = await this.repo.getExamsByStageCompetitionType(competitionType, teamId)
    return { data: exams, message: 'Successfully fetched exams' }
  }
}