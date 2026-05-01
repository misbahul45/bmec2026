import { Controller, UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { createMentorSchema } from "~/schemas/team.mentor.schema"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"

type FormValues = z.infer<typeof createMentorSchema>

type Props = {
  form: UseFormReturn<FormValues>
  teamId: string
}

const FormMentor = ({ form }: Props) => {
  return (
    <div className="mt-6">
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Nama Mentor</FieldLabel>
              <Input
                {...field}
                placeholder="Masukkan nama mentor"
                aria-invalid={fieldState.invalid}
              />
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
              <Input
                {...field}
                type="email"
                placeholder="mentor@email.com"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Nomor HP</FieldLabel>
              <Input
                {...field}
                type="tel"
                placeholder="08xxxxxxxxxx"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  )
}

export default FormMentor