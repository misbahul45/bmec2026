import { Member, User } from "@prisma/client"
import { useEffect, useState } from "react"

interface TeamWithMembers extends User {
  members: Member[]
}

export const useRegisteredTeam = () => {
    const [team, setTeam] = useState<TeamWithMembers | null>(null)

    useEffect(()=>{
        const team=localStorage.getItem('registeredTeam')
        if(team){
            setTeam(JSON.parse(team))
        }
    },[])


    function updateTeam(newTeam: TeamWithMembers) {
        setTeam(newTeam)
        localStorage.setItem('registeredTeam', JSON.stringify(newTeam))
    }

    function clearTeam() {        setTeam(null)
        localStorage.removeItem('registeredTeam')
    }

    return { team, updateTeam, clearTeam }
}

export const getRegisteredTeam = (): TeamWithMembers | null => {
    const team = localStorage.getItem('registeredTeam')
    if (!team) return null

    return JSON.parse(team)
}