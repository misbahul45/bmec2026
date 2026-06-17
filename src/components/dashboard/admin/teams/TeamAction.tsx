import React from "react"
import { Button } from "~/components/ui/button"
import { Link } from "@tanstack/react-router"

type Props = {
  team: {
    id: string
  }
}

const TeamActions: React.FC<Props> = ({
  team,
}) => {
  return (
    <div className="flex gap-2 justify-center">

      <Button
        size="sm"
        variant="outline"
        asChild
      >
        <Link
          to="/dashboard/admin/teams/$teamId"
          params={{
            teamId: team.id,
          }}
        >
          View
        </Link>
      </Button>

    </div>
  )
}

export default TeamActions
