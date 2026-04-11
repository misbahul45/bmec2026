import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card'
import { Field, FieldGroup, FieldError, FieldLabel } from '../ui/field'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { AddressField } from './AddressField'
import { CompetitionSelect } from './CompetitionSelect'
import { RegisterFormData, registerSchema } from '~/schemas/auth.schema'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createTeam } from '~/server/team'

const RegisterForm = () => {
  const navigate = useNavigate()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      teamName: '',
      institution: '',
      email: '',
      phone: '',
      competitionType: undefined,
      address: '',
      password: '',
    },
  })

  const mutation = useMutation({
    mutationFn: async (formData: RegisterFormData) => {
      return await createTeam({
        data: formData,
      })
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(error.message)
    },
    onSuccess: (res) => {
      toast.success(res.message)
      navigate({
        to: '/auth/register/$teamId',
        params: {
          teamId: res.data!.id,
        },
      })
    },
  })

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate(data)
  }

  return (
    <div className="w-full max-w-md">
      <CardHeader className="mb-6 px-0">
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
                    <FieldLabel htmlFor="reg-email">Email Team</FieldLabel>
                    <Input {...field} id="reg-email" type="email" placeholder="email@team.com" autoComplete="email" aria-invalid={fieldState.invalid} className="rounded text-xs" />
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
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password Team</FieldLabel>
                  <Input {...field} id="password" type="password" placeholder="••••••••" aria-invalid={fieldState.invalid} className="rounded text-xs" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

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
        <Button
          type="submit"
          form="form-register"
          disabled={mutation.isPending}
          className="rounded-md active:scale-95 w-full hover:opacity-95 cursor-pointer"
        >
          {mutation.isPending ? 'Mendaftarkan...' : 'Daftar Sekarang'}
        </Button>
        <p className="text-center text-[10px] opacity-65">
          Sudah punya team?{' '}
          <Link to="/auth/login" className="text-primary hover:underline">Masuk</Link>
        </p>
      </CardFooter>
    </div>
  )
}

export default RegisterForm