import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Pencil, X, Check, Loader2, Upload, Trash2, Link as LinkIcon, FileText } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Field, FieldGroup, FieldLabel, FieldError } from '~/components/ui/field'
import { updateTeam } from '~/server/team'
import { deleteUpload } from '~/server/image-kit.auth'
import { uploadToImageKit } from '~/lib/api/uploads/service'
import { updateTeamSchema } from '~/schemas/team.schema'
import { cn } from '~/lib/utils'

type EditData = z.infer<typeof updateTeamSchema>

type Props = {
  team: {
    id: string
    name: string
    email: string
    phone: string
    schoolName: string
    schoolAddress: string
    twibbonUrl?: string | null
    documentUrl?: string | null
  }
  queryKey: unknown[]
}

export function EditTeamForm({ team, queryKey }: Props) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const [docFile, setDocFile] = useState<File | null>(null)
  const [uploadingDoc, setUploadingDoc] = useState(false)
  const [deletingDoc, setDeletingDoc] = useState(false)

  const form = useForm<EditData>({
    resolver: zodResolver(updateTeamSchema),
    defaultValues: {
      name: team.name,
      email: team.email,
      phone: team.phone,
      schoolName: team.schoolName,
      schoolAddress: team.schoolAddress,
      twibbonUrl: team.twibbonUrl ?? '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: EditData) => updateTeam({ data: { id: team.id, body: data } }),
    onSuccess: () => {
      toast.success('Data tim berhasil diperbarui')
      queryClient.invalidateQueries({ queryKey: queryKey as any })
      setOpen(false)
    },
    onError: (e: any) => toast.error(e?.message ?? 'Gagal memperbarui data'),
  })

  const handleUploadDoc = async () => {
    if (!docFile) return
    setUploadingDoc(true)
    try {
      const url = await uploadToImageKit(docFile)
      await updateTeam({ data: { id: team.id, body: { documentUrl: url } } })
      toast.success('Dokumen berhasil diperbarui')
      setDocFile(null)
      queryClient.invalidateQueries({ queryKey: queryKey as any })
    } catch {
      toast.error('Gagal mengunggah dokumen')
    } finally {
      setUploadingDoc(false)
    }
  }

  const handleDeleteDoc = async () => {
    if (!team.documentUrl) return
    if (!confirm('Yakin ingin menghapus dokumen ini?')) return
    setDeletingDoc(true)
    try {
      await deleteUpload({ data: { url: team.documentUrl } })
      await updateTeam({ data: { id: team.id, body: { documentUrl: null } } })
      toast.success('Dokumen berhasil dihapus')
      queryClient.invalidateQueries({ queryKey: queryKey as any })
    } catch {
      toast.error('Gagal menghapus dokumen')
    } finally {
      setDeletingDoc(false)
    }
  }

  if (!open) {
    return (
      <Button size="sm" variant="outline" className="gap-1.5 rounded-xl" onClick={() => setOpen(true)}>
        <Pencil size={13} />
        Edit Profil Tim
      </Button>
    )
  }

  return (
    <div className="rounded-2xl bg-background shadow-lg shadow-black/5 border p-5 space-y-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm">Edit Profil Tim</p>
        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X size={16} />
        </button>
      </div>

      <form id="edit-team-form" onSubmit={form.handleSubmit((d) => mutation.mutate(d))}>
        <FieldGroup className="gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Nama Tim</FieldLabel>
                  <Input {...field} className="h-9 text-xs rounded-lg" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input {...field} type="email" className="h-9 text-xs rounded-lg" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>No. Telepon</FieldLabel>
                  <Input {...field} className="h-9 text-xs rounded-lg" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="schoolName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Nama Sekolah/Universitas</FieldLabel>
                  <Input {...field} className="h-9 text-xs rounded-lg" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Controller
            name="schoolAddress"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Alamat Sekolah</FieldLabel>
                <Input {...field} className="h-9 text-xs rounded-lg" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="twibbonUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="flex items-center gap-1.5">
                  <LinkIcon size={12} />
                  Link Drive Twibbon
                </FieldLabel>
                <Input {...field} value={field.value ?? ''} placeholder="https://drive.google.com/..." className="h-9 text-xs rounded-lg" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <div className="border-t pt-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Dokumen Kelengkapan</p>

        {team.documentUrl ? (
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2.5">
            <FileText size={14} className="text-primary shrink-0" />
            <a href={team.documentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline flex-1 truncate">
              Lihat dokumen saat ini
            </a>
            <button
              type="button"
              onClick={handleDeleteDoc}
              disabled={deletingDoc}
              className="text-muted-foreground hover:text-destructive disabled:opacity-50"
              title="Hapus dokumen"
            >
              {deletingDoc ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            </button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Belum ada dokumen yang diunggah.</p>
        )}

        <div className="flex items-center gap-2">
          <label className={cn(
            'flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground cursor-pointer',
            'hover:border-primary/40 hover:bg-muted/50 transition-colors flex-1'
          )}>
            <Upload size={13} />
            {docFile ? docFile.name : team.documentUrl ? 'Ganti dokumen...' : 'Upload dokumen...'}
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {docFile && (
            <Button size="sm" className="rounded-lg gap-1.5 shrink-0" disabled={uploadingDoc} onClick={handleUploadDoc}>
              {uploadingDoc ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
              Upload
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-end border-t pt-4">
        <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={() => setOpen(false)}>
          Batal
        </Button>
        <Button type="submit" form="edit-team-form" size="sm" className="rounded-xl gap-1.5" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          Simpan
        </Button>
      </div>
    </div>
  )
}
