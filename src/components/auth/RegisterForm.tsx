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
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const RegisterForm = () => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-up', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
      })

      gsap.from('.input-anim', {
        y: 20,
        opacity: 0,
        scale: 0.98,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out',
        stagger: 0.08,
      })

      gsap.from('.button-anim', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.5,
        ease: 'power2.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const mutation = useMutation({
    mutationFn: async (formData: RegisterFormData) => {
      return await createTeam({
        data: formData,
      })
    },
    onError: (error: any) => {
      const message =
        error?.message ||
        error?.data?.message ||
        'Something went wrong'
      toast.error(message)
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
    <div ref={containerRef} className="w-full max-w-md">
      <CardHeader className="mb-6 px-0 fade-up">
        <CardTitle className="text-center font-bold text-lg">
          Daftar BMEC 2026
        </CardTitle>
        <CardDescription className="text-center text-xs">
          Isi data tim untuk mendaftarkan diri ke kompetisi
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 fade-up">
        <form id="form-register" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              name="teamName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="input-anim">
                  <FieldLabel htmlFor="teamName">Nama Tim</FieldLabel>
                  <Input {...field} id="teamName" placeholder="Tim Biomedis UNAIR" aria-invalid={fieldState.invalid} className="rounded-md text-xs h-9 focus:ring-2 focus:ring-primary/40 transition-all" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="institution"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="input-anim">
                  <FieldLabel htmlFor="institution">Institusi / Sekolah</FieldLabel>
                  <Input {...field} id="institution" placeholder="SMA Negeri 1 Surabaya" aria-invalid={fieldState.invalid} className="rounded-md text-xs h-9 focus:ring-2 focus:ring-primary/40 transition-all" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="input-anim">
                    <FieldLabel htmlFor="reg-email">Email Tim (Ketua Tim)</FieldLabel>
                    <Input {...field} id="reg-email" type="email" placeholder="email@team.com" autoComplete="email" aria-invalid={fieldState.invalid} className="rounded-md text-xs h-9 focus:ring-2 focus:ring-primary/40 transition-all" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="input-anim">
                    <FieldLabel htmlFor="phone">Nomor Telepon Sekolah</FieldLabel>
                    <Input {...field} id="phone" type="tel" placeholder="08xxxxxxxxxx" aria-invalid={fieldState.invalid} className="rounded-md text-xs h-9 focus:ring-2 focus:ring-primary/40 transition-all" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="input-anim">
                  <FieldLabel htmlFor="password">Password Team</FieldLabel>
                  <Input {...field} id="password" type="password" placeholder="••••••••" aria-invalid={fieldState.invalid} className="rounded-md text-xs h-9 focus:ring-2 focus:ring-primary/40 transition-all" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="competitionType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="input-anim">
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
                <Field data-invalid={fieldState.invalid} className="input-anim">
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

      <CardFooter className="px-0 flex-col gap-2 button-anim">
        <Button
          type="submit"
          form="form-register"
          disabled={mutation.isPending}
          className="rounded-md active:scale-95 w-full hover:scale-[1.02] transition-all"
        >
          {mutation.isPending ? 'Mendaftarkan...' : 'Daftar Sekarang'}
        </Button>
        <p className="text-center text-[10px] opacity-80">
          Sudah punya akun?{' '}
          <Link to="/auth/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </div>
  )
}

export default RegisterForm