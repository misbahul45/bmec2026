import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import ProfileTeam from '~/components/ui/ProfileTeam'
import { teamQueryOptions } from '~/lib/api/teams/team.query-options'
import { ChevronLeft, Pencil, Trash2 } from "lucide-react"
import PasswordDialog from '~/components/dashboard/admin/teams/PasswordDialog'
import { useState } from 'react'
import { deleteTeam } from '~/server/team'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/_authed/admin/teams/$teamId')({
  component: RouteComponent,
  loader: async ({ params: { teamId }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      teamQueryOptions(teamId),
    )
    return data
  },
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { teamId } = Route.useParams()
  const { data: res } = useSuspenseQuery(teamQueryOptions(teamId))
  const [open, setOpen] = useState(false)

  const mutation = useMutation({
    mutationFn: async () => {
      const toastId = toast.loading("Menghapus tim...")
      try {
        const result = await deleteTeam({
          data: res.data?.id!,
        })

        toast.success("Tim berhasil dihapus", {
          id: toastId,
        })

        return result
      } catch (err: any) {
        toast.error(err.message || "Terjadi kesalahan", {
          id: toastId,
        })
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
      navigate({ to: "/dashboard/admin/teams" })
    },
  })

  return (
    <div className='w-full pt-20 min-h-screen pb-6 max-w-6xl mx-auto px-8'>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          className="gap-2 rounded-md"
          onClick={() => navigate({ to: "/dashboard/admin/teams" })}
        >
          <ChevronLeft size={16} />
          Back
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2 rounded-md"
            onClick={() => setOpen(true)}
          >
            <Pencil size={14} />
            Password
          </Button>

          <Button
            variant="destructive"
            className="gap-2 rounded-md"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            <Trash2 size={14} />
            {mutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <ProfileTeam data={res.data! as any} />

      <PasswordDialog
        open={open}
        setOpen={setOpen}
        teamName={res.data?.name || ""}
        teamId={res.data?.id!}
      />
    </div>
  )
}