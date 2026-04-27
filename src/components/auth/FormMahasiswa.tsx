import React, { useEffect } from "react"
import { Card, CardHeader, CardContent } from "../ui/card"
import { CompetitionType, SubmissionStatus } from "@prisma/client"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CreateAbstractSubmissionData,
  createAbstractSubmissionSchema,
} from "~/schemas/abstract.schema"
import { useNavigate, useParams } from "@tanstack/react-router"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "../ui/field"
import { Button } from "../ui/button"
import { FileUploadField } from "../ui/FileUploadField"
import { uploadPdfToImageKit } from "~/lib/api/uploads/service"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { createAbstract } from "~/server/abstract"
import { AppError } from "~/lib/utils/app-error"

type Props = {
  type: CompetitionType
}

const FormMahasiswa: React.FC<Props> = ({ type: _ }) => {
  const { teamId } = useParams({ strict: false })
  const navigate = useNavigate()

  const form = useForm<CreateAbstractSubmissionData>({
    resolver: zodResolver(createAbstractSubmissionSchema),
    defaultValues: {
      teamId: teamId ?? '',
      status: "PENDING",
      abstractFile: undefined,
    },
  })

  useEffect(() => {
    if (teamId) form.setValue("teamId", teamId)
  }, [teamId])

  const mutation = useMutation({
    mutationFn: async (data: CreateAbstractSubmissionData) => {
      const toastId = toast.loading("Mengunggah abstrak...")
      try {
        const abstractUrl = await uploadPdfToImageKit(data.abstractFile)
        if (!abstractUrl) throw new AppError("Gagal mengunggah file, coba lagi")

        const res = await createAbstract({
          data: {
            fileUrl: abstractUrl,
            teamId: data.teamId,
            status: SubmissionStatus.PENDING,
          },
        })

        toast.success("Abstrak berhasil dikirim", { id: toastId })
        return res
      } catch (err: any) {
        toast.error(err.message || "Terjadi kesalahan", { id: toastId })
        throw err
      }
    },
    onSuccess: () => {
      navigate({ to: "/dashboard/team" })
    },
  })

  const onSubmit = (data: CreateAbstractSubmissionData) => mutation.mutate(data)

  const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)[0] as any
    toast.error(firstError?.message ?? "Lengkapi form terlebih dahulu")
  }

  return (
    <Card className="rounded-md shadow-xl">
      <CardHeader>
        <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Pengumpulan Abstrak LKTI</p>
          <p>
            Upload file abstrak sebagai tahap seleksi awal. Pendaftaran resmi dan pembayaran akan dilakukan setelah abstrak dinyatakan lolos seleksi melalui dashboard tim.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
          <FieldGroup>
            <Controller
              name="abstractFile"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Upload File Abstrak</FieldLabel>
                  <FileUploadField
                    value={field.value}
                    onChange={(file) => field.onChange(file ?? undefined)}
                    label="Upload Abstract (.pdf / .doc / .docx)"
                    accept=".pdf,.doc,.docx"
                    error={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Button type="submit" disabled={mutation.isPending} className="w-full rounded-xl">
              {mutation.isPending ? "Mengunggah..." : "Kirim Abstrak"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormMahasiswa