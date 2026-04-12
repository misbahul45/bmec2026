import { prisma } from "~/lib/utils/prisma";

export default class AdminRepo{
    findByEmail(email:string){
        return prisma.admin.findUnique({
            where:{
                email
            }
        })
    }

    findById(id:string){
        return prisma.admin.findUnique({
            where:{
                id
            }
        })
    }
}