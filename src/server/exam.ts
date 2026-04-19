import { Exam, ExamQuestion, Prisma } from "@prisma/client";
import { createServerFn } from "@tanstack/react-start";
import ExamService from "~/lib/api/exams/exam.service";
import { ApiSuccess, successResponse } from "~/lib/utils/api-response";
import { withErrorHandling } from "~/lib/utils/server-wrapper";
import { z } from "zod";
import { Uuid } from "~/schemas/general.schema";
import { examQuestionSchema } from "~/schemas/exam";
import { ExamWithStage } from "~/types/exam.type";

const examService = new ExamService();

export const getExams = createServerFn({ method: "GET" }).handler(
  withErrorHandling(async (): Promise<ApiSuccess<Exam[]>> => {
    const result = await examService.findAll();
    return successResponse<Exam[]>(result.data, result.message);
  })
);

export const getExam = createServerFn({ method: "GET" })
  .inputValidator(Uuid)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<ExamWithStage>> => {
      const result = await examService.findOneById(data);
      return successResponse<ExamWithStage>(result.data, result.message);
    })
  );


export const getExamQuestion = createServerFn({ method: "GET" })
  .inputValidator(Uuid)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<ExamQuestion[]>> => {
      const result = await examService.getExamQuestionByExamId(data)
      return successResponse<ExamQuestion[]>(result.data!, result.message)
    })
  )


export const createExamQuestion = createServerFn({ method:'POST' })
.inputValidator(examQuestionSchema)
.handler(
  withErrorHandling(async ({ data }): Promise<ApiSuccess<ExamQuestion>> => {
    const result = await examService.createExamQuestion(data)
    return successResponse<ExamQuestion>(result.data!, result.message)
  })
)

export const updateExamQuestion = createServerFn({ method: 'POST' })
  .inputValidator(examQuestionSchema)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<ExamQuestion>> => {
      const result = await examService.updateExamQuestion(data)
      return successResponse<ExamQuestion>(result.data!, result.message)
    })
  )

export const deleteExamQuestion = createServerFn({ method: 'POST' })
  .inputValidator(Uuid)
  .handler(
    withErrorHandling(async ({ data }): Promise<ApiSuccess<null>> => {
      const result = await examService.deleteExamQuestion(data)
      return successResponse<null>(result.data, result.message)
    })
  )