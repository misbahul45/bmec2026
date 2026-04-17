import { AppError } from "~/lib/utils/app-error";
import ExamRepo from "./exam.repo";

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

}