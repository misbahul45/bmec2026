import { CompetitionType, Prisma } from "@prisma/client";
import CompetitionRepo from "./competition.repo";
import { AppError } from "~/lib/utils/app-error";
import { RegistrationAction, RegistrationCompetitionData } from "~/schemas/competition.schema";
import TeamRepo from "../teams/team.repo";

export default class CompetitionService {
  private repo = new CompetitionRepo();
  private teamRepo = new TeamRepo();

  async findOneByName(name: CompetitionType) {
    const existedcompetition =
      await this.repo.findByName(name);

    if (!existedcompetition) {
      throw new AppError(
        "Competition not found"
      );
    }

    return {
      data: this.serializeCompetition(
        existedcompetition
      ),
      message: "get competition",
    };
  }

  serializeCompetition(data: any) {
    if (!data) return data;

    return {
      ...data,
      batches: data.batches.map(
        (b: any) => ({
          ...b,
          price: b.price.toNumber(),
        })
      ),
    };
  }

  async registrationCompetition(
    data: RegistrationCompetitionData
  ) {

    console.log('input',data)
    const teamAlreadyRegister =
      await this.repo.findRegistrationByTeamid(
        data.teamId
      );

    if (teamAlreadyRegister?.paymentProof) {
      throw new AppError(
        "Team already registered"
      );
    }

    console.log('team', teamAlreadyRegister)

    const created =
      await this.repo.createRegistration(
        data
      );


    return {
      data: created,
      message:
        "Successfully registered competition",
    };
  }
  async approveRegistration(data: RegistrationAction) {
    const registration = await this.repo.findRegistrationByTeamid(data.teamId)
    if (!registration) throw new AppError("Registration not found")

    const updated = await this.repo.approveRegistration(data.teamId, data.adminId)

    const firstStage = await this.repo.findFirstStageByCompetition(registration.competitionId)
    if (!firstStage) throw new AppError("Stage not found")

    await this.repo.updateTeamStage(data.teamId, firstStage.id)

    const team = await this.teamRepo.findById(data.teamId)
    if (team && team.code.startsWith('pending-')) {
      const prefixMap: Record<string, string> = { OLIMPIADE: 'olm', LKTI: 'lk', INFOGRAFIS: 'ifs' }
      const prefix = prefixMap[team.competitionType] ?? 'tm'

      let newCode = `${prefix}-001`
      const latest = await this.teamRepo.findLatestCodeByType(prefix)
      if (latest && !latest.code.startsWith('pending-')) {
        const lastNum = parseInt(latest.code.split('-')[1] ?? '0')
        newCode = `${prefix}-${String(lastNum + 1).padStart(3, '0')}`
      }

      await this.teamRepo.updateCode(data.teamId, newCode)
    }

    return { data: updated, message: "Registration approved successfully" }
  }

  async rejectRegistration(data: RegistrationAction) {
    const registration = await this.repo.findRegistrationByTeamid(data.teamId)
    if (!registration) throw new AppError("Registration not found")
    const updated = await this.repo.rejectRegistration(data.teamId, data.adminId)
    return { data: updated, message: "Registration rejected successfully" }
  }

  async getAllCompetitionsWithBatches() {
    const competitions = await this.repo.findAllWithBatches()
    return {
      data: competitions.map((c) => ({
        ...c,
        batches: c.batches.map((b) => ({ ...b, price: Number(b.price) })),
      })),
    }
  }

  async updateBatch(id: string, data: { name?: string; startDate?: Date; endDate?: Date; price?: number; module_bacth?: string }) {
    const batch = await this.repo.findBatchById(id)
    if (!batch) throw new AppError("Batch not found", 404)
    const updated = await this.repo.updateBatch(id, {
      ...(data.name && { name: data.name }),
      ...(data.startDate && { startDate: data.startDate }),
      ...(data.endDate && { endDate: data.endDate }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.module_bacth !== undefined && { module_bacth: data.module_bacth }),
    })
    return { data: { ...updated, price: Number(updated.price) }, message: "Batch updated" }
  }

  async createBatch(competitionId: string, data: { name: string; startDate: Date; endDate: Date; price: number; module_bacth: string }) {
    const created = await this.repo.createBatch({
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      price: data.price,
      module_bacth: data.module_bacth,
      competition: { connect: { id: competitionId } },
    })
    return { data: { ...created, price: Number(created.price) }, message: "Batch created" }
  }

  async deleteBatch(id: string) {
    const batch = await this.repo.findBatchById(id)
    if (!batch) throw new AppError("Batch not found", 404)
    await this.repo.deleteBatch(id)
    return { data: null, message: "Batch deleted" }
  }
}