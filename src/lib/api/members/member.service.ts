import { MemberData } from "~/schemas/team.member.schema";
import MemberRepo from "./member.repo";

export default class MemberService{
    private repo = new MemberRepo()

    async create(payload:MemberData[]){
        const isallUnique=await this.repo.findMembersByStudentIdList(payload.map((p)=>p.studentId))
    }
}