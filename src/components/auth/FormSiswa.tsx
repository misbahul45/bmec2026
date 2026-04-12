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
import { useParams } from '@tanstack/react-router'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from '../ui/field'
import { Button } from '../ui/button'
import { uploadToImageKit } from '~/lib/api/uploads/service'
import CompetitionPriceCard from './CompetitionPriceCard'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

type Props = {
  type: CompetitionType
}

const FormSiswa: React.FC<Props> = ({ type }) => {
  const fetchCompetition = useServerFn(getCompetition)
  const { teamId } = useParams({ strict: false })

  const navigate=useNavigate()

  const [competition, setCompetition] =
    useState<CompetitionWithActiveBatch | null>(null)

  const form = useForm<CreateCompetitionRegistrationData>({
    resolver: zodResolver(createCompetitionRegistrationSchema),
  })

  const mutation = useMutation({
    mutationFn: async (data: CreateCompetitionRegistrationData) => {
      let imageUrl: string | null = null

      if (data.paymentProof) {
        imageUrl = await uploadToImageKit(data.paymentProof)
      }

      return await registrationCompetition({
        data: {
          ...data,
          paymentProof: imageUrl ?? '',
        },
      })
    },
    onError: (error: any) => {
      console.error(error)
      toast.error(error.message || 'Terjadi kesalahan')
    },
    onSuccess: (res) => {
      toast.success(res.message)
      navigate({
        to:'/dashboard/team'
      })
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
        {competition && activeBatch && (
          <CompetitionPriceCard
            name={competition.name}
            batch={activeBatch}
          />
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>

            <Controller
              name="paymentProof"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Upload Bukti Pembayaran</FieldLabel>

                  <UploadImage
                    value={field.value}
                    onChange={field.onChange}
                    disabled={mutation.isPending}
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
              className="w-full rounded-xl hover:opacity-90 cursor-pointer active:scale-95"
            >
              {mutation.isPending ? 'Menyimpan...' : 'Simpan data'}
            </Button>

          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormSiswa