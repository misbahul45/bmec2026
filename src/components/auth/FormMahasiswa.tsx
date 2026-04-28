import React, { useEffect } from "react"
import { Card, CardHeader, CardContent } from "../ui/card"
import { CompetitionType } from "@prisma/client"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useParams } from "@tanstack/react-router"
import { Field, FieldGroup, FieldLabel, FieldError } from "../ui/field"
import { Button } from "../ui/button"
import { FileUploadField } from "../ui/FileUploadField"
import { uploadPdfToImageKit } from "~/lib/api/uploads/service"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { upsertSubmission } from "~/server/submission"
import { AppError } from "~/lib/utils/app-error"
import { teamQueryOptions } from "~/lib/api/teams/team.query-options"
import {
  CreateAbstractSubmissionData,
  createAbstractSubmissionSchema,
} from "~/schemas/auth.schema"

const MAX_SIZE = 4 * 1024 * 1024

type Props = {
  type: CompetitionType
}

const FormMahasiswa: React.FC<Props> = ({ type: _ }) => {
  const { teamId } = useParams({ strict: false })
  const navigate = useNavigate()

  const { data: teamRes } = useSuspenseQuery(teamQueryOptions(teamId!))
  const stageId = teamRes.data?.currentStageId

  const form = useForm<CreateAbstractSubmissionData>({
    resolver: zodResolver(createAbstractSubmissionSchema),
    defaultValues: {
      teamId: teamId ?? "",
      status: "PENDING",
      abstractFile: undefined,
      turnitinFile: undefined,
      orsinalitasFile: undefined,
    },
  })

  useEffect(() => {
    if (teamId) {
      form.setValue("teamId", teamId)
    }
  }, [teamId, form])

  const mutation = useMutation({
    mutationFn: async (data: CreateAbstractSubmissionData) => {
      if (data.abstractFile.size > MAX_SIZE) {
        throw new AppError("File abstrak maksimal 4MB")
      }

      if (data.turnitinFile && data.turnitinFile.size > MAX_SIZE) {
        throw new AppError("File turnitin maksimal 4MB")
      }

      if (data.orsinalitasFile && data.orsinalitasFile.size > MAX_SIZE) {
        throw new AppError("File orisinalitas maksimal 4MB")
      }

      const toastId = toast.loading("Mengunggah abstrak...")

      try {
        const [abstractUrl, turnitinUrl, orsinalitasUrl] = await Promise.all([
          uploadPdfToImageKit(data.abstractFile),
          data.turnitinFile
            ? uploadPdfToImageKit(data.turnitinFile)
            : Promise.resolve(null),
          data.orsinalitasFile
            ? uploadPdfToImageKit(data.orsinalitasFile)
            : Promise.resolve(null),
        ])

        if (!abstractUrl) {
          throw new AppError("Gagal mengunggah file abstrak")
        }

        if (!stageId) {
          throw new AppError("Stage tidak ditemukan")
        }

        await upsertSubmission({
          data: {
            teamId: data.teamId,
            stageId,
            title: "Abstrak LKTI",
            abstractUrl,
            turnitinUrl: turnitinUrl ?? undefined,
            orsinalitasUrl: orsinalitasUrl ?? undefined,
          },
        })

        toast.success("Abstrak berhasil dikirim", { id: toastId })
      } catch (err: any) {
        toast.error(err.message || "Terjadi kesalahan", { id: toastId })
        throw err
      }
    },

    onSuccess: () => {
      navigate({ to: "/dashboard/team" })
    },
  })

  const onSubmit = (data: CreateAbstractSubmissionData) => {
    mutation.mutate(data)
  }

  const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)[0] as any
    toast.error(firstError?.message ?? "Lengkapi form terlebih dahulu")
  }

  return (
    <Card className="rounded-md shadow-xl">
      <CardHeader>
        <div className="space-y-1 rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">
            Pengumpulan Abstrak LKTI
          </p>
          <p>
            Upload file abstrak sebagai tahap seleksi awal. Pendaftaran resmi
            dan pembayaran dilakukan setelah abstrak lolos seleksi.
          </p>
          <p className="text-[11px] font-medium text-yellow-600">
            Maksimal ukuran setiap file: 4MB
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
          <FieldGroup className="gap-4">
            <Controller
              name="abstractFile"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    File Abstrak{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>

                  <FileUploadField
                    value={field.value}
                    onChange={(file) =>
                      field.onChange(file ?? undefined)
                    }
                    label="Upload Abstrak (.pdf)"
                    accept=".pdf"
                    error={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="turnitinFile"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    File Turnitin{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>

                  <FileUploadField
                    value={field.value}
                    onChange={(file) =>
                      field.onChange(file ?? undefined)
                    }
                    label="Upload Hasil Turnitin (.pdf)"
                    accept=".pdf"
                    error={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="orsinalitasFile"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Surat Orisinalitas{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>

                  <FileUploadField
                    value={field.value}
                    onChange={(file) =>
                      field.onChange(file ?? undefined)
                    }
                    label="Upload Surat Orisinalitas (.pdf)"
                    accept=".pdf"
                    error={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-xl"
            >
              {mutation.isPending
                ? "Mengunggah..."
                : "Kirim Abstrak"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormMahasiswa