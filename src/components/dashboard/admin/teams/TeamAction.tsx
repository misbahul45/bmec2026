import React from "react"
import { Button } from "~/components/ui/button"
import { TeamWithRelations } from "~/types/team.type"
import { Link, useRouteContext } from "@tanstack/react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  approveRegistration,
  rejectRegistration
} from "~/server/registration"
import { PaymentStatus } from "@prisma/client"

type Props = {
  team: TeamWithRelations
}

const TeamActions: React.FC<Props> = ({
  team,
}) => {
  const queryClient = useQueryClient()

  const { user } = useRouteContext({
    from: "__root__",
  })

  const adminId = user?.userId!

  const approveMutation = useMutation({
    mutationFn: () =>
      approveRegistration({
        data: {
          teamId: team.id,
          adminId,
          action: PaymentStatus.APPROVED,
        },
      }),

    onSuccess: () => {
      toast.success("Tim berhasil di approve")

      queryClient.invalidateQueries({
        queryKey: ["teams"],
      })
    },

    onError: () => {
      toast.error("Gagal approve tim")
    },
  })


  const rejectMutation = useMutation({
    mutationFn: () =>
      rejectRegistration({
        data: {
          teamId: team.id,
          adminId,
          action: PaymentStatus.REJECTED,
        },
      }),

    onSuccess: () => {
      toast.success("Tim berhasil di reject")
      queryClient.invalidateQueries({
        queryKey: ["teams"],
      })
    },

    onError: () => {
      toast.error("Gagal reject tim")
    },
  })


  const canApproveReject =
    team.registration &&
    team.registration.status ===
      PaymentStatus.PENDING


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

      {canApproveReject && (
        <>
          <Button
            size="sm"
            onClick={() =>
              approveMutation.mutate()
            }
            disabled={
              approveMutation.isPending
            }
          >
            {approveMutation.isPending
              ? "Approving..."
              : "Approve"}
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() =>
              rejectMutation.mutate()
            }
            disabled={
              rejectMutation.isPending
            }
          >
            {rejectMutation.isPending
              ? "Rejecting..."
              : "Reject"}
          </Button>
        </>
      )}

    </div>
  )
}

export default TeamActions