import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent } from '../ui/card'
import { CompetitionType } from '@prisma/client'
import { useServerFn } from '@tanstack/react-start'
import { getCompetition, registrationCompetition } from '~/server/competition'
import { CompetitionWithActiveBatch } from '~/types/competition.type'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CreateCompetitionRegistrationData,
  createCompetitionRegistrationSchema,
} from '~/schemas/competition.schema'
import { useNavigate, useParams } from '@tanstack/react-router'
import CompetitionPriceCard from './CompetitionPriceCard'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '../ui/field'
import { Button } from '../ui/button'
import { FileUploadField } from '../ui/FileUploadField'
import { uploadPdfToImageKit } from '~/lib/api/uploads/service'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

type Props = {
  type: CompetitionType
}

const FormMahasiswa: React.FC<Props> = ({ type }) => {
  const fetchCompetition = useServerFn(getCompetition)
  const { teamId } = useParams({ strict: false })
  const navigate = useNavigate()

  const [competition, setCompetition] =
    useState<CompetitionWithActiveBatch | null>(null)

  const form = useForm<CreateCompetitionRegistrationData>({
    resolver: zodResolver(createCompetitionRegistrationSchema),

  })

  const mutation = useMutation({
    mutationFn: async (data: CreateCompetitionRegistrationData) => {
      let abstractUrl: string | null = null

      // if (data.abstractFile) {
      //   abstractUrl = await uploadPdfToImageKit(data.abstractFile)
      // }

      // return registrationCompetition({
      //   data: {
      //     ...data,
      //     abstractFile: abstractUrl ?? '',
      //   },
      // })
    },

    onSuccess: (res) => {
      // toast.success(res.message)
      navigate({ to: '/dashboard/team' })
    },

    onError: (err: any) => {
      toast.error(err.message || 'Terjadi kesalahan')
    },
  })

  useEffect(() => {
    fetchCompetition({ data: type }).then((res) => {
      const comp = res.data ?? null
      setCompetition(comp)

      if (comp) {
        form.reset({
          batchId: comp.batches[0]?.id,
          competitionId: comp.id,
          teamId,
        })
      }
    })
  }, [type, teamId])

  const activeBatch = competition?.batches?.[0]

  const onSubmit = (data: CreateCompetitionRegistrationData) => {
    mutation.mutate(data)
  }

  return (
    <Card className="rounded-md shadow-xl">
      <CardHeader>
        <div className="mb-6 rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">
            Pengumpulan Abstrak LKTI
          </p>

          <p>
            Peserta <b>wajib mengunggah file abstrak</b> terlebih dahulu
            sebagai tahap seleksi awal. Upload bukti pembayaran akan
            dilakukan setelah abstrak dinyatakan lolos seleksi.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                ? 'Mengunggah...'
                : 'Kirim Abstrak'}
            </Button>

          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormMahasiswa