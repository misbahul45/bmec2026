import { CompetitionType } from '@prisma/client'
import { useServerFn } from '@tanstack/react-start'
import React, { useEffect, useState } from 'react'
import { getCompetition } from '~/server/competition'
import { CompetitionWithActiveBatch } from '~/types/competition.type'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
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

type Props = {
  type: CompetitionType
}

const FormSiswa: React.FC<Props> = ({ type }) => {
  const fetchCompetition = useServerFn(getCompetition)
  const { teamId } = useParams({ strict: false })

  const [competition, setCompetition] =
    useState<CompetitionWithActiveBatch | null>(null)

  const form = useForm<CreateCompetitionRegistrationData>({
    resolver: zodResolver(createCompetitionRegistrationSchema),
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
  }, [type])


  const activeBatch = competition?.batches?.[0]

  const onSubmit = async (data: CreateCompetitionRegistrationData) => {
    let imageUrl: string | null = null

    if (data.paymentProof) {
      imageUrl = await uploadToImageKit(data.paymentProof)
    }

    const payload = {
      ...data,
      paymentProof: imageUrl,
    }

    console.log(payload)
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
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" className="w-full rounded-xl hover:opacity-90 cursor-pointer active:scale-95">
              Daftar Sekarang
            </Button>

          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormSiswa