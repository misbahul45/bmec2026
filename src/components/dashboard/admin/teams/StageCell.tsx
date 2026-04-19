import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateTeamStage } from '~/server/team'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

interface Stage {
  id: string
  name: string
  order: number
}

interface Props {
  teamId: string
  currentStageId: string | null
  stages: Stage[]
  queryKey: unknown[]
}

export function StageCell({ teamId, currentStageId, stages, queryKey }: Props) {
  const qc = useQueryClient()
  const [value, setValue] = useState(currentStageId ?? '')

  const mutation = useMutation({
    mutationFn: (stageId: string) => updateTeamStage({ data: { teamId, stageId } }),
    onSuccess: () => {
      toast.success('Stage berhasil diperbarui')
      qc.invalidateQueries({ queryKey })
    },
    onError: (e: any) => toast.error(e?.message ?? 'Error'),
  })

  if (!stages.length) {
    return <span className="text-xs text-muted-foreground">—</span>
  }

  return (
    <Select
      value={value}
      onValueChange={(v) => {
        setValue(v)
        mutation.mutate(v)
      }}
      disabled={mutation.isPending}
    >
      <SelectTrigger className="h-7 text-xs w-32 rounded-lg">
        <SelectValue placeholder="Pilih stage" />
      </SelectTrigger>
      <SelectContent>
        {stages.map((s) => (
          <SelectItem key={s.id} value={s.id} className="text-xs">
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
