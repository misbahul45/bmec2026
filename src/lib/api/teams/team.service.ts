import { RegisterFormData } from "~/schemas/auth.schema"
import { AppError } from "../../utils/app-error"
import { PaginationMeta } from "../../types/pagination"
import { ServiceResponse } from "../../types/service-response"
import { CreateMemberData, QueryTeam } from "~/schemas/team.member.schema"
import { CompetitionType, Prisma } from "@prisma/client"
import * as bcrypt from "bcrypt"
import TeamRepo from "./team.repo"
import MemberRepo from "../members/member.repo"

export default class TeamService {
  private repo = new TeamRepo()
  private memberRepo=new MemberRepo()

  private generateCodeTeam(type: CompetitionType) {
    return type === "OLIMPIADE"
      ? "olm"
      : type === "INFOGRAFIS"
      ? "ifs"
      : "lk"
  }

  private sanitizeTeam(team: any) {
    const { password, ...rest } = team
    return rest
  }

  async create(payload: RegisterFormData): Promise<ServiceResponse<any>> {
    if (!payload.competitionType) {
      throw new AppError("Maff tentukan lomba yang ingin diikuti", 400)
    }

    const existing = await this.repo.findByEmail(payload.email)

    if (existing) {
      throw new AppError("Email sudah terdaftar", 400)
    }

    const uniqueName = await this.repo.findByName(payload.teamName)

    if (uniqueName) {
      throw new AppError("Nama team sudah digunakan", 400)
    }

    const count = await this.repo.countApprovedTeams()

    const code =
      this.generateCodeTeam(payload.competitionType) +
      "-" +
      String(count + 1).padStart(3, "0")

    const hashedPassword = await bcrypt.hash(payload.password, 10)

    const team = await this.repo.create({
      schoolAddress: payload.address,
      schoolName: payload.institution,
      password: hashedPassword,
      email: payload.email,
      competitionType: payload.competitionType,
      name: payload.teamName,
      phone: payload.phone,
      code,
    })

    return {
      data: this.sanitizeTeam(team),
      message: "Team created successfully",
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
      throw new AppError("Team not found", 404)
    }

    return {
      data: this.sanitizeTeam(team),
    }
  }



  async delete(id: string): Promise<ServiceResponse<null>> {
    const team = await this.repo.findById(id)

    if (!team) {
      throw new AppError("Team not found", 404)
    }

    await this.repo.delete(id)

    return {
      data: null,
      message: "Team deleted successfully",
    }
  }

  async update(
    id: string,
    payload: Partial<RegisterFormData>
  ): Promise<ServiceResponse<any>> {
    const team = await this.repo.findById(id)

    if (!team) {
      throw new AppError("Team not found", 404)
    }

    const updated = await this.repo.update(id, {
      ...(payload.teamName && {
        name: payload.teamName,
      }),
      ...(payload.institution && {
        schoolName: payload.institution,
      }),
      ...(payload.address && {
        schoolAddress: payload.address,
      }),
      ...(payload.competitionType && {
        competitionType: payload.competitionType,
      }),
    })

    return {
      data: this.sanitizeTeam(updated),
      message: "Team updated successfully",
    }
  }

  async createMember(payload: CreateMemberData) {
    const teamId = payload.members[0]?.teamId;

    if (!teamId) {
      throw new AppError('Id required', 400);
    }

    const existingTeam = await this.repo.findById(teamId);

    if (!existingTeam) {
      throw new AppError('Team not found', 404);
    }

    const studentIds = payload.members.map((m) => m.studentId);

    const existingMembers =
      await this.memberRepo.findMembersByStudentIdList(studentIds);

    if (existingMembers.length > 0) {
      const duplicatedIds = existingMembers.map((m) => m.studentId).join(', ');
      throw new AppError(`${duplicatedIds} sudah terdaftar`, 400);
    }

    const result = await this.repo.createMember(payload.members);

    return {
      data: result,
      message: "Team members have been successfully added"
    };
  }
}