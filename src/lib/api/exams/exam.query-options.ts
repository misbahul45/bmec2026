import { queryOptions } from "@tanstack/react-query";
import { getExam, getExamQuestion, getExams, getExamsByCompetitionType } from "~/server/exam";

export const examsQueryOptions = () =>
  queryOptions({
    queryKey: ["exams"],
    queryFn: () => getExams(),
  });

export const examQueryOptions = (examId: string) =>
  queryOptions({
    queryKey: ["exams", examId],
    queryFn: () => getExam({ data: examId }),
  });

export const examQuestionsQueryOptions = (examId: string) =>
  queryOptions({
    queryKey: ["exam-questions", examId],
    queryFn: () => getExamQuestion({ data: examId }),
  })

export const examsByCompetitionTypeQueryOptions = (competitionType: string) =>
  queryOptions({
    queryKey: ["exams", "competition", competitionType],
    queryFn: () => getExamsByCompetitionType({ data: competitionType }),
  })