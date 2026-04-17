import { queryOptions } from "@tanstack/react-query";
import { getExam, getExams } from "~/server/exam";

export const examsQueryOptions = () =>
  queryOptions({
    queryKey: ["exams"],
    queryFn: () => getExams(),
  });

export const examQueryOptions = (examId: string) =>
  queryOptions({
    queryKey: ["exams", examId],
    queryFn: () =>
      getExam({
        data: examId,
      }),
  });