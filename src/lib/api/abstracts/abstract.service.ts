import { SubmissionStatus } from "@prisma/client"
import AbstractRepo from "./abstract.repo"
import { AppError } from "~/lib/utils/app-error"

export default class AbstractService {
  private repo = new AbstractRepo()

  async create(payload: {
    teamId: string
    fileUrl: string
    status?: SubmissionStatus
    reviewedBy?: string | null
  }) {
    const existedAbstract = await this.repo.findByTeamId(payload.teamId)

    if (existedAbstract) {
      throw new AppError("Abstract already exist")
    }

    const createdAbstract = await this.repo.create({
      teamId: payload.teamId,
      fileUrl: payload.fileUrl,
      status: payload.status ?? SubmissionStatus.PENDING,
      reviewedBy: payload.reviewedBy ?? null,
    })

    return {
      data: createdAbstract,
      message: "Successfully created abstract",
    }
  }

  async approve(id: string, adminId: string) {
    const abstract = await this.repo.findById(id)

    if (!abstract) {
      throw new AppError("Abstract not found")
    }

    if (abstract.status !== SubmissionStatus.PENDING) {
      throw new AppError("Abstract already reviewed")
    }

    const updated = await this.repo.approve(id, adminId)

    return {
      data: updated,
      message: "Abstract approved successfully",
    }
  }

  async reject(id: string, adminId: string) {
    const abstract = await this.repo.findById(id)

    if (!abstract) {
      throw new AppError("Abstract not found")
    }

    if (abstract.status !== SubmissionStatus.PENDING) {
      throw new AppError("Abstract already reviewed")
    }

    const updated = await this.repo.rejected(id, adminId)

    return {
      data: updated,
      message: "Abstract rejected successfully",
    }
  }
}