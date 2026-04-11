import { Controller, UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { createMembersSchema } from "~/schemas/team.member.schema"
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
  educationLevel: "SMA" | "MAHASISWA"
}

const FormMember = ({ form, index, educationLevel }: Props) => {
  const studentLabel =
  educationLevel === "MAHASISWA" ? "NIM" : "NIS"

  return (
    <div className="mt-6">
      <FieldGroup>
        <Controller
          name={`members.${index}.name`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                {index === 0
                  ? 'Nama Ketua'
                  : `Nama Anggota ${index}`}
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
          name={`members.${index}.studentId`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                {studentLabel}
              </FieldLabel>

              <Input
                {...field}
                placeholder={`Masukkan ${studentLabel}`}
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