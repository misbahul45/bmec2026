import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Calendar, Tag, BookOpen, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { deleteBatch } from '~/server/competition'
import { BatchForm } from './BatchForm'
import { formatMoney } from '~/lib/utils/format-money'

type Batch = {
  id: string
  name: string
  startDate: string | Date
  endDate: string | Date
  price: number
  module_bacth: string
}

type Props = {
  competition: { id: string; name: string }
  batches: Batch[]
  queryKey: unknown[]
}

const fmt = (d: string | Date) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

const isActive = (b: Batch) => {
  const now = new Date()
  return new Date(b.startDate) <= now && new Date(b.endDate) >= now
}

export function CompetitionBatchCard({ competition, batches, queryKey }: Props) {
  const [expanded, setExpanded] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const qc = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBatch({ data: id }),
    onSuccess: () => {
      toast.success('Batch dihapus')
      qc.invalidateQueries({ queryKey: queryKey as any })
    },
    onError: (e: any) => toast.error(e?.message ?? 'Gagal menghapus'),
  })

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Hapus batch "${name}"?`)) return
    deleteMutation.mutate(id)
  }

  return (
    <div className="rounded-2xl bg-background shadow border overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Tag size={14} className="text-primary" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm">{competition.name}</p>
            <p className="text-xs text-muted-foreground">{batches.length} batch</p>
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-3 border-t">
          {batches.length === 0 && (
            <p className="text-xs text-muted-foreground py-3 text-center">Belum ada batch</p>
          )}

          {batches.map((batch) => (
            <div key={batch.id}>
              {editId === batch.id ? (
                <div className="rounded-xl border bg-muted/30 p-4 mt-3">
                  <p className="text-xs font-semibold mb-3">Edit Batch</p>
                  <BatchForm
                    mode="edit"
                    competitionId={competition.id}
                    batch={batch}
                    queryKey={queryKey}
                    onClose={() => setEditId(null)}
                  />
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3 rounded-xl border bg-muted/20 px-4 py-3 mt-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold">{batch.name}</span>
                      {isActive(batch) ? (
                        <Badge className="text-[10px] h-4">Aktif</Badge>
                      ) : new Date(batch.endDate) < new Date() ? (
                        <Badge variant="secondary" className="text-[10px] h-4">Selesai</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] h-4">Belum Mulai</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar size={11} />
                      <span>{fmt(batch.startDate)} — {fmt(batch.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-bold text-primary">{formatMoney(batch.price)}</span>
                      {batch.module_bacth && (
                        <a href={batch.module_bacth} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] text-primary underline">
                          <BookOpen size={11} />Modul
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon-sm" variant="ghost" onClick={() => setEditId(batch.id)} title="Edit">
                      <Pencil size={13} />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      disabled={deleteMutation.isPending}
                      onClick={() => handleDelete(batch.id, batch.name)}
                      title="Hapus"
                    >
                      {deleteMutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {addOpen ? (
            <div className="rounded-xl border bg-muted/30 p-4 mt-3">
              <p className="text-xs font-semibold mb-3">Tambah Batch Baru</p>
              <BatchForm
                mode="create"
                competitionId={competition.id}
                queryKey={queryKey}
                onClose={() => setAddOpen(false)}
              />
            </div>
          ) : (
            <Button size="sm" variant="outline" className="w-full rounded-xl gap-1.5 mt-2" onClick={() => setAddOpen(true)}>
              <Plus size={13} />
              Tambah Batch
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
