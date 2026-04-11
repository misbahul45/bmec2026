import { prisma } from "~/lib/utils/prisma";

export default class MemberRepo{
   async findMemberByNis(studentId:string){
        return await prisma.member.findUnique({
            where:{
                studentId
            }
        })
   } 
   async findMembersByStudentIdList(studentIds: string[]) {
        return await prisma.member.findMany({
            where: {
                studentId: {
                    in: studentIds,
                },
            },
        })
    }

    async findAllMemberByTeamId(teamId:string){
        return await prisma.member.findMany({
            where:{
              teamId
            }
        })
    }
}