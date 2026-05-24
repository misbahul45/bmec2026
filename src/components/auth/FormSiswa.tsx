import { CompetitionType } from '@prisma/client'
import { useServerFn } from '@tanstack/react-start'
import React, { useEffect, useState } from 'react'
import { getCompetition, registrationCompetition } from '~/server/competition'
import { CompetitionWithActiveBatch } from '~/types/competition.type'
import { Card, CardContent, CardHeader } from '../ui/card'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CreateCompetitionRegistrationData,
  createCompetitionRegistrationSchema,
} from '~/schemas/competition.schema'
import UploadImage from '../ui/UploadImage'
import { useParams, useNavigate } from '@tanstack/react-router'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '../ui/field'
import { Button } from '../ui/button'
import {
  uploadToImageKit,
  uploadPdfToImageKit,
} from '~/lib/api/uploads/service'
import CompetitionPriceCard from './CompetitionPriceCard'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { FileUploadField } from '../ui/FileUploadField'
import { Loader2, Upload, ImageIcon } from 'lucide-react'
import { upsertSubmission } from '~/server/submission'

type Props = {
  type: CompetitionType
}

const FormSiswa: React.FC<Props> = ({ type }) => {
  const fetchCompetition = useServerFn(getCompetition)
  const { teamId } = useParams({ strict: false })
  const navigate = useNavigate()

  const [file, setFile] = useState<File | undefined>()
  const [orsinalitasFile, setOrsinalitasFile] = useState<File | undefined>()
  const [uploading, setUploading] = useState(false)

  const [competition, setCompetition] =
    useState<CompetitionWithActiveBatch | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const form = useForm<CreateCompetitionRegistrationData>({
    resolver: zodResolver(createCompetitionRegistrationSchema),
    defaultValues: {
      teamId: teamId ?? '',
      competitionId: '',
      batchId: '',
      paymentProof: null,
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: CreateCompetitionRegistrationData) => {
      const toastId = toast.loading(
        'Mengunggah data pendaftaran...'
      )

      try {
        setUploading(true)

        let paymentProofUrl: string | null = null
        let fileUrl: string | null = null
        let orsinalitasUrl: string | undefined

        if (data.paymentProof) {
          paymentProofUrl = await uploadToImageKit(
            data.paymentProof
          )
        }

        if (type === 'INFOGRAFIS') {
          if (!file) {
            throw new Error(
              'Pilih file infografis terlebih dahulu'
            )
          }

          if (file.size > 10 * 1024 * 1024) {
            throw new Error(
              'Ukuran file infografis maksimal 10MB'
            )
          }

          if (
            orsinalitasFile &&
            orsinalitasFile.size >
              10 * 1024 * 1024
          ) {
            throw new Error(
              'Ukuran surat orisinalitas maksimal 10MB'
            )
          }

          const uploaded = await Promise.all([
            uploadToImageKit(file),
            orsinalitasFile
              ? uploadPdfToImageKit(
                  orsinalitasFile
                )
              : Promise.resolve(undefined),
          ])

          fileUrl = uploaded[0]
          orsinalitasUrl =
            uploaded[1] ?? undefined
        }

        const res =
          await registrationCompetition({
            data: {
              teamId: data.teamId,
              competitionId:
                data.competitionId,
              batchId: data.batchId,
              paymentProof:
                paymentProofUrl ?? '',
            },
          })

        if (
          type === 'INFOGRAFIS' &&
          fileUrl &&
          competition?.stages?.[0]?.id
        ) {
          await upsertSubmission({
            data: {
              teamId: data.teamId,
              stageId:
                competition.stages[0].id,
              title: 'Infografis',
              fileUrl,
              orsinalitasUrl,
            },
          })
        }

        toast.dismiss(toastId)

        return res
      } catch (err) {
        toast.dismiss(toastId)
        throw err
      } finally {
        setUploading(false)
      }
    },
    onError: (error: any) => {
      toast.error(
        error.message ||
          'Terjadi kesalahan'
      )
    },
    onSuccess: (res) => {
      toast.success(res.message)
      navigate({
        to: '/dashboard/team',
      })
    },
  })

  useEffect(() => {
    if (!teamId) return

    fetchCompetition({
      data: type,
    }).then((res) => {
      const comp =
        res.data ?? null

      setCompetition(comp)

      if (!comp) {
        setLoadError(
          'Kompetisi tidak ditemukan'
        )
        return
      }

      const batch =
        comp.batches?.[0]

      if (!batch) {
        setLoadError(
          'Tidak ada batch pendaftaran yang aktif saat ini'
        )
        return
      }

      form.setValue(
        'competitionId',
        comp.id
      )

      form.setValue(
        'batchId',
        batch.id
      )

      form.setValue(
        'teamId',
        teamId
      )
    })
  }, [type, teamId])

  const activeBatch =
    competition?.batches?.[0]

  const onSubmit = (
    data: CreateCompetitionRegistrationData
  ) => {
    if (!data.paymentProof) {
      toast.error(
        'Upload bukti pembayaran terlebih dahulu'
      )
      return
    }

    if (
      type === 'INFOGRAFIS' &&
      !file
    ) {
      toast.error(
        'Upload file infografis terlebih dahulu'
      )
      return
    }

    mutation.mutate(data)
  }

  const onInvalid = (
    errors: any
  ) => {
    const firstError =
      Object.values(errors)[0] as any

    toast.error(
      firstError?.message ??
        'Lengkapi form terlebih dahulu'
    )
  }

  const isSubmitting =
    mutation.isPending ||
    uploading

  return (
    <Card className="rounded-md shadow-xl">
      <CardHeader>
        {competition &&
          activeBatch && (
            <CompetitionPriceCard
              name={competition.name}
              batch={activeBatch}
            />
          )}
      </CardHeader>
      
      {
        !activeBatch?
        <CardContent>
        <div className="rounded-2xl border border-dashed p-6 text-center space-y-3">
          <h3 className="text-base font-semibold">
            Batch belum tersedia saat ini
          </h3>

          <p className="text-sm text-muted-foreground">
            Silakan login ulang atau coba kembali nanti ketika batch
            pendaftaran sudah tersedia.
          </p>

          {loadError && (
            <p className="text-xs text-destructive">
              {loadError}
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() =>
              navigate({
                to: '/dashboard/team',
              })
            }
          >
            Kembali ke Dashboard
          </Button>
        </div>
      </CardContent>
        :
        <CardContent>
        <form
          onSubmit={form.handleSubmit(
            onSubmit,
            onInvalid
          )}
          className="space-y-5"
        >
          {type ===
            'INFOGRAFIS' && (
            <div className="rounded-2xl bg-background shadow border p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-base">
                <ImageIcon
                  size={16}
                  className="text-primary"
                />
                Upload
                Infografis
              </h3>

              <div className="space-y-2">
                <p className="text-xs font-semibold">
                  File
                  Infografis{' '}
                  <span className="text-destructive">
                    *
                  </span>
                </p>

                <p className="text-[11px] text-muted-foreground">
                  Format
                  PDF.
                  Maksimal
                  10MB.
                </p>

                <FileUploadField
                  value={file}
                  onChange={
                    setFile
                  }
                  label="Pilih file infografis (PNG / JPG / PDF)"
                  accept="image/*,.pdf"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold">
                    Surat Orisinalitas{" "}
                    <span className="text-destructive">*</span>
                </p>

                <FileUploadField
                  value={
                    orsinalitasFile
                  }
                  onChange={
                    setOrsinalitasFile
                  }
                  label="Upload surat orisinalitas (.pdf)"
                  accept=".pdf"
                />
              </div>
            </div>
          )}

          <FieldGroup>
            <Controller
              name="paymentProof"
              control={
                form.control
              }
              render={({
                field,
                fieldState,
              }) => (
                <Field
                  data-invalid={
                    fieldState.invalid
                  }
                >
                  <FieldLabel>
                    Upload
                    Bukti
                    Pembayaran
                  </FieldLabel>

                  <UploadImage
                    value={
                      field.value
                    }
                    onChange={
                      field.onChange
                    }
                    disabled={
                      isSubmitting ||
                      !!loadError
                    }
                  />

                  {fieldState.invalid && (
                    <FieldError
                      errors={[
                        fieldState.error,
                      ]}
                    />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !!loadError
              }
              className="w-full rounded-xl"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2
                    size={14}
                    className="animate-spin"
                  />
                  Mengunggah...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload
                    size={14}
                  />
                  Simpan
                  Data
                </span>
              )}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
      }
    </Card>
  )
}

export default FormSiswa