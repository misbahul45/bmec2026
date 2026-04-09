import { Controller, UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { createMembersSchema } from "~/schemas/team.schema"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "../ui/field"

import { Input } from "../ui/input"

type FormValues = z.infer<typeof createMembersSchema>

type Props = {
  form: UseFormReturn<FormValues>
  index: number
}

const FormMember = ({ form, index }: Props) => {
  return (
    <div className="mt-6">

      <FieldGroup>
        <Controller
          name={`members.${index}.name`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Nama Member {index + 1}
              </FieldLabel>

              <Input
                {...field}
                placeholder="Masukkan Nama"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name={`members.${index}.nis`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                NIS
              </FieldLabel>

              <Input
                {...field}
                placeholder="Masukkan NIS"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name={`members.${index}.documentUrl`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Dokumen
              </FieldLabel>

                <Input
                {...field}
                value={field.value ?? ""}
                placeholder="Upload / URL Dokumen"
                aria-invalid={fieldState.invalid}
                />

              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

      </FieldGroup>

    </div>
  )
}

export default FormMember