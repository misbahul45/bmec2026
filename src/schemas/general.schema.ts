import z from "zod";

export const Uuid = z.string().uuid()

export const competitionTypes = ["OLIMPIADE", "LKTI", "INFOGRAFIS"] as const;

export const CompetitionTypeSchema = z.enum(competitionTypes);

export type CompetitionType = z.infer<typeof CompetitionTypeSchema>;