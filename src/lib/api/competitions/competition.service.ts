import { CompetitionType } from "@prisma/client";
import CompetitionRepo from "./competition.repo";
import { AppError } from "~/lib/utils/app-error";
import { RegistrationCompetitionData } from "~/schemas/competition.schema";

export default class CompetitionService{
    private repo = new CompetitionRepo();

    async findOneByName(name:CompetitionType){
        const existedcompetition = await this.repo.findByName(name);

        if(!existedcompetition){
            throw new AppError('Competition not found',)
        }

        return {
            data:this.serializeCompetition(existedcompetition),
            message:'get competition'
        }
    }
    serializeCompetition(data: any) {
        if (!data) return data

        return {
                ...data,
                batches: data.batches.map((b: any) => ({
                ...b,
                price: b.price.toNumber(),
            })),
        }
    }

    async registrationCompetition(data:RegistrationCompetitionData){
        const teamAlreadyRegister = await this.repo.findRegistrationByTeamid(data.teamId)

        if(teamAlreadyRegister){
            throw new AppError('Team already registered')
        }

        const created=await this.repo.createRegistration(data)

        return {
            data:created,
            message:'Successfully registered competition'
        }
    }
}