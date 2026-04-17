import { Exam } from "@prisma/client";
import { createServerFn } from "@tanstack/react-start";
import ExamService from "~/lib/api/exams/exam.service";
import { ApiSuccess, successResponse } from "~/lib/utils/api-response";
import { withErrorHandling } from "~/lib/utils/server-wrapper";
import { z } from "zod";
import { Uuid } from "~/schemas/general.schema";

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
    withErrorHandling(async ({ data }): Promise<ApiSuccess<Exam>> => {
      const result = await examService.findOneById(data);
      return successResponse<Exam>(result.data, result.message);
    })
  );