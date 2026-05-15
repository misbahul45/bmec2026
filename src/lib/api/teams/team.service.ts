import { RegisterFormData } from "~/schemas/auth.schema"
import { AppError } from "../../utils/app-error"
import { PaginationMeta } from "../../types/pagination"
import { ServiceResponse } from "../../types/service-response"
import { CreateMemberData } from "~/schemas/team.member.schema"
import { CompetitionType, Prisma } from "@prisma/client"
import * as bcrypt from "bcrypt"
import TeamRepo from "./team.repo"
import { QueryTeam } from "~/schemas/team.schema"
import { prisma } from "~/lib/utils/prisma"
import { CreateMentorInput } from "~/schemas/team.mentor.schema"

export default class TeamService {
  private repo = new TeamRepo()

  private generateCodeTeam(type: CompetitionType) {
    return type === "OLIMPIADE"
      ? "olm"
      : type === "INFOGRAFIS"
      ? "ifs"
      : "lk"
  }

  async createMentor(payload: CreateMentorInput) {
    const team = await this.repo.findById(payload.teamId)
    if (!team) throw new AppError('Tim tidak ditemukan', 404)

    const existing = await this.repo.findMentorByTeamId(payload.teamId)
    if (existing) throw new AppError('Pembimbing sudah terdaftar untuk tim ini', 400)

    const mentor = await this.repo.createMentor({
      teamId: payload.teamId,
      name: payload.name,
      email: payload.email,
      phone: payload.phone
    })

    return {
      data: mentor,
      message: 'Pembimbing berhasil ditambahkan',
    }
  }

  private async generateNextCode(type: CompetitionType) {
    const prefix = this.generateCodeTeam(type)

    const latest = await this.repo.findLatestCodeByType(prefix)

    if (!latest) {
      return `${prefix}-001`
    }

    const lastNumber = parseInt(latest.code.split("-")[1])

    const nextNumber = lastNumber + 1

    return `${prefix}-${String(nextNumber).padStart(3, "0")}`
  }
  private sanitizeTeam(team: any) {
    const { password, ...rest } = team
    if (rest.registration?.batch?.price) {
      rest.registration.batch.price = Number(rest.registration.batch.price)
    }
    return rest
  }

  async create(payload: RegisterFormData): Promise<ServiceResponse<any>> {
    if (!payload.competitionType) {
      throw new AppError("Maff tentukan lomba yang ingin diikuti", 400)
    }

    const existing = await this.repo.findByEmail(payload.email)
    if (existing) throw new AppError("Email sudah terdaftar", 400)

    const uniqueName = await this.repo.findByName(payload.teamName)
    if (uniqueName) throw new AppError("Nama team sudah digunakan", 400)

    const hashedPassword = await bcrypt.hash(payload.password, 10)

    const tempCode = `pending-${Date.now()}`

    const team = await this.repo.create({
      schoolAddress: payload.address,
      schoolName: payload.institution,
      password: hashedPassword,
      email: payload.email,
      competitionType: payload.competitionType,
      name: payload.teamName,
      phone: payload.phone,
      code: tempCode,
      sourceInfo: payload.sourceInfo,
    })

    const competition = await prisma.competition.findFirst({
      where: { name: payload.competitionType as any },
    })

    if (competition) {
      const firstStage = await this.repo.getFirstStageByCompetitionId(competition.id)
      if (firstStage) {
        await this.repo.updateStage(team.id, firstStage.id)
      }
    }

    return {
      data: this.sanitizeTeam(team),
      message: "data Team berhasil dibuat, silakan lanjutkan dengan mengisi data lainnya",
    }
  }
  async findAll(
    query: QueryTeam
  ): Promise<ServiceResponse<{ teams: any[]; meta: PaginationMeta }>> {
    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const skip = (page - 1) * limit

    const where: Prisma.TeamWhereInput = {}

    if (query.search) {
      where.OR = [
        {
          name: {
            contains: query.search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          schoolName: {
            contains: query.search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ]
    }

    if (query.competitionType) {
      where.competitionType = query.competitionType
    }

    if (query.registrationStatus) {
      if (query.registrationStatus === 'NONE') {
        where.registration = { is: null }
      } else {
        where.registration = { status: query.registrationStatus as any }
      }
    }

    const [teams, total] = await Promise.all([
      this.repo.findAll(where, skip, limit),
      this.repo.count(where),
    ])

    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }

    return {
      data: {
        teams: teams.map((t) => this.sanitizeTeam(t)),
        meta,
      },
    }
  }

  async findOne(id: string): Promise<ServiceResponse<any>> {
    const team = await this.repo.findById(id)

    if (!team) {
      throw new AppError('Tim tidak ditemukan', 404)
    }

    return {
      data: this.sanitizeTeam(team),
    }
  }



  async delete(id: string): Promise<ServiceResponse<null>> {
    const team = await this.repo.findById(id)

    if (!team) {
      throw new AppError('Tim tidak ditemukan', 404)
    }

    await this.repo.delete(id)

    return {
      data: null,
      message: 'Tim berhasil dihapus',
    }
  }

  async update(
    id: string,
    payload: Partial<RegisterFormData>
  ): Promise<ServiceResponse<any>> {
    const team = await this.repo.findById(id)

    if (!team) {
      throw new AppError('Tim tidak ditemukan', 404)
    }

    if(payload.password){
      payload.password=bcrypt.hashSync(payload.password,10)
    }
    const updated = await this.repo.update(id, {
      ...(payload.teamName && { name: payload.teamName }),
      ...(payload.institution && { schoolName: payload.institution }),
      ...(payload.address && { schoolAddress: payload.address }),
      ...(payload.competitionType && { competitionType: payload.competitionType }),
      ...('documentUrl' in payload && { documentUrl: payload.documentUrl as string | null }),
      ...('twibbonUrl' in payload && { twibbonUrl: payload.twibbonUrl as string | null }),
      ...('password' in payload && {password:payload.password})
    })

    return {
      data: this.sanitizeTeam(updated),
      message: 'Data tim berhasil diperbarui',
    }
  }

  async createMember(payload: CreateMemberData) {
    const teamId = payload.members[0]?.teamId;

    if (!teamId) {
      throw new AppError('Id required', 400);
    }

    const existingTeam = await this.repo.findById(teamId);

    if (!existingTeam) {
      throw new AppError('Tim tidak ditemukan', 404);
    }
    const result = await this.repo.createMember(payload.members);

    return {
      data: result,
      message: 'Anggota tim berhasil ditambahkan',
    };
  }

  async updateStage(teamId: string, stageId: string): Promise<ServiceResponse<any>> {
    const team = await this.repo.findById(teamId)
    if (!team) throw new AppError('Tim tidak ditemukan', 404)

    const stage = await prisma.stage.findUnique({ where: { id: stageId } })
    if (!stage) throw new AppError('Stage tidak ditemukan', 404)

    const updated = await this.repo.updateStage(teamId, stageId)
    return { data: this.sanitizeTeam(updated), message: 'Stage berhasil diperbarui' }
  }

  async getStagesForTeam(teamId: string): Promise<ServiceResponse<any>> {
    const team = await this.repo.findById(teamId)
    if (!team) throw new AppError('Tim tidak ditemukan', 404)

    const competition = await prisma.competition.findFirst({
      where: { name: team.competitionType as any },
    })

    if (!competition) return { data: [] }

    const stages = await this.repo.getStagesByCompetitionId(competition.id)
    return { data: stages }
  }

  async updateMentor(teamId: string, payload: { name?: string; email?: string; phone?: string }) {
    const existing = await this.repo.findMentorByTeamId(teamId)
    if (!existing) throw new AppError('Pembimbing tidak ditemukan', 404)

    const updated = await this.repo.updateMentor(teamId, payload)
    return {
      data: updated,
      message: 'Data pembimbing berhasil diperbarui',
    }
  }

  async getDashboard(teamId: string): Promise<ServiceResponse<any>> {
    const team = await this.repo.findDashboard(teamId)
    if (!team) throw new AppError('Tim tidak ditemukan', 404)
    const { password, ...rest } = team as any
    if (rest.registration?.batch?.price) {
      rest.registration.batch.price = Number(rest.registration.batch.price)
    }
    return { data: rest }
  }
}