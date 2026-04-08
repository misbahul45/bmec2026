import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card'
import { Field, FieldGroup, FieldError, FieldLabel } from '../ui/field'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { AddressField } from './AddressField'
import { CompetitionSelect } from './CompetitionSelect'
import { FileUploadField } from './FileUploadField'
import { RegisterFormData, registerSchema } from '~/schemas/auth.schema'

const RegisterForm = () => {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      teamName: '',
      institution: '',
      email: '',
      phone: '',
      competitionType: undefined,
      address: '',
      proposal: undefined,
      infographic: undefined,
    },
  })

  const competitionType = form.watch('competitionType')

  const onSubmit = (data: RegisterFormData) => {
    console.log(data)
  }

  return (
    <div className="w-full max-w-md">
      <CardHeader className="mb-1 px-0">
        <CardTitle className="text-center font-bold text-lg">Daftar BMEC 2026</CardTitle>
        <CardDescription className="text-center text-xs">
          Isi data tim untuk mendaftarkan diri ke kompetisi
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <form id="form-register" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="teamName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="teamName">Nama Tim</FieldLabel>
                  <Input {...field} id="teamName" placeholder="Tim Biomedis UNAIR" aria-invalid={fieldState.invalid} className="rounded text-xs" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="institution"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="institution">Institusi / Sekolah</FieldLabel>
                  <Input {...field} id="institution" placeholder="SMA Negeri 1 Surabaya" aria-invalid={fieldState.invalid} className="rounded text-xs" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="reg-email">Email</FieldLabel>
                    <Input {...field} id="reg-email" type="email" placeholder="email@sekolah.com" autoComplete="email" aria-invalid={fieldState.invalid} className="rounded text-xs" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="phone">No. Telepon</FieldLabel>
                    <Input {...field} id="phone" type="tel" placeholder="08xxxxxxxxxx" aria-invalid={fieldState.invalid} className="rounded text-xs" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="competitionType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Jenis Lomba</FieldLabel>
                  <CompetitionSelect
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    error={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {competitionType === 'LKTI' && (
              <Controller
                name="proposal"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Upload Proposal</FieldLabel>
                    <FileUploadField
                      value={field.value}
                      onChange={field.onChange}
                      accept=".pdf,.doc,.docx"
                      label="Pilih file proposal (PDF/DOC)"
                      error={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            )}

            {competitionType === 'INFOGRAFIS' && (
              <Controller
                name="infographic"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Upload Infografis</FieldLabel>
                    <FileUploadField
                      value={field.value}
                      onChange={field.onChange}
                      accept=".jpg,.jpeg,.png,.pdf"
                      label="Pilih file infografis (JPG/PNG/PDF)"
                      error={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            )}

            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Alamat Sekolah</FieldLabel>
                  <AddressField
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="px-0 flex-col gap-2">
        <Button type="submit" className="rounded w-full" form="form-register">
          Daftar Sekarang
        </Button>
        <p className="text-center text-[10px] opacity-65">
          Sudah punya akun?{' '}
          <Link to="/auth/login" className="text-primary hover:underline">Masuk</Link>
        </p>
      </CardFooter>
    </div>
  )
}

export default RegisterForm
