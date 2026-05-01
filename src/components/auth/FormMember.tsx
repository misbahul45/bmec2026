import { Controller, UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { createMembersSchema } from "~/schemas/team.member.schema"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"

type FormValues = z.infer<typeof createMembersSchema>

type Props = {
  form: UseFormReturn<FormValues>
  index: number
  educationLevel: "SMA" | "MAHASISWA"
}

const FormMember = ({ form, index, educationLevel }: Props) => {
  const isMahasiswa = educationLevel === "MAHASISWA"
  const studentLabel = isMahasiswa ? "NIM" : "NIS"
  const nameLabel = index === 0 ? "Nama Ketua" : `Nama Anggota ${index}`

  return (
    <div className="mt-6">
      <FieldGroup>
        <Controller
          name={`members.${index}.name`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{nameLabel}</FieldLabel>
              <Input
                {...field}
                placeholder="Masukkan nama lengkap"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name={`members.${index}.email`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Email</FieldLabel>
              <Input
                {...field}
                type="email"
                placeholder="nama@email.com"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name={`members.${index}.phone`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Nomor WhatsApp</FieldLabel>
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

        <Controller
          name={`members.${index}.studentId`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>{studentLabel}</FieldLabel>
              <Input
                {...field}
                placeholder={`Masukkan ${studentLabel}`}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {isMahasiswa && (
          <>
            <Controller
              name={`members.${index}.faculty`}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Fakultas</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Masukkan fakultas"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name={`members.${index}.major`}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Program Studi</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Masukkan program studi"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </>
        )}
      </FieldGroup>
    </div>
  )
}

export default FormMember