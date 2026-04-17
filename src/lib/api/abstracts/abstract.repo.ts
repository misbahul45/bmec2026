import { SubmissionStatus } from "@prisma/client"
import { prisma } from "~/lib/utils/prisma"

export default class AbstractRepo {
  findById(id: string) {
    return prisma.abstractSubmission.findUnique({
      where: { id },
    })
  }

  findByTeamId(teamId: string) {
    return prisma.abstractSubmission.findUnique({
      where: { teamId },
    })
  }

  create(payload: {
    teamId: string
    fileUrl: string
    status: SubmissionStatus
    reviewedBy?: string | null
  }) {
    return prisma.abstractSubmission.create({
      data: {
        teamId: payload.teamId,
        fileUrl: payload.fileUrl,
        status: payload.status,
        reviewedBy: payload.reviewedBy ?? null,
      },
    })
  }

  approve(id: string, adminId: string) {
    return prisma.abstractSubmission.update({
      where: { id },
      data: {
        status: SubmissionStatus.APPROVED,
        reviewedBy: adminId,
      },
    })
  }

  rejected(id: string, adminId: string) {
    return prisma.abstractSubmission.update({
      where: { id },
      data: {
        status: SubmissionStatus.REJECTED,
        reviewedBy: adminId,
      },
    })
  }
}