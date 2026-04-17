import React from "react"
import { Badge } from "./badge"
import { CompetitionType } from "@prisma/client"

type Props = {
  type: CompetitionType
}

const CompetitionBadge: React.FC<Props> = ({ type }) => {
  switch (type) {
    case "OLIMPIADE":
      return (
        <Badge variant="default">
          Olimpiade
        </Badge>
      )

    case "LKTI":
      return (
        <Badge variant="secondary">
          LKTI
        </Badge>
      )

    case "INFOGRAFIS":
      return (
        <Badge variant="outline">
          Infografis
        </Badge>
      )

    default:
      return (
        <Badge variant="ghost">
          Unknown
        </Badge>
      )
  }
}

export default CompetitionBadge