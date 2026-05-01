import { useForm, Controller, useWatch } from 'react-hook-form'
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

const SOURCE_INFO_OPTIONS = [
  'Instagram',
  'Teman / Kenalan',
  'Guru / Dosen',
  'Poster / Brosur',
  'Website BMEC',
  'Lainnya',
]

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
      sourceInfo: '',
      competitionType: undefined,
      address: '',
      password: '',
    },
  })

  const competitionType = useWatch({ control: form.control, name: 'competitionType' })
  const institution = useWatch({ control: form.control, name: 'institution' })

  const isUniversityContext =
    competitionType === 'LKTI' ||
    (!competitionType &&
      (() => {
        const inst = (institution ?? '').toLowerCase()
        return (
          inst.includes('universitas') ||
          inst.includes('univ') ||
          inst.includes('politeknik') ||
          inst.includes('kampus')
        )
      })())

  // Dynamic label helpers
  const emailLabel = isUniversityContext
    ? 'Email Ketua Tim'
    : 'Email Tim (Ketua Tim)'

  const emailPlaceholder = isUniversityContext
    ? 'ketua@mahasiswa.ac.id'
    : 'email@team.com'

  const phoneLabel = isUniversityContext
    ? 'WhatsApp / Telepon Ketua'
    : 'Nomor Telepon Sekolah'

  const phonePlaceholder = isUniversityContext
    ? '08xxxxxxxxxx (ketua)'
    : '08xxxxxxxxxx (sekolah)'

  const phoneHint = isUniversityContext
    ? 'Nomor aktif ketua tim yang bisa dihubungi'
    : 'Nomor telepon kantor / resmi sekolah'

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
      return await createTeam({ data: formData })
    },
    onError: (error: any) => {
      const message =
        error?.message || error?.data?.message || 'Something went wrong'
      toast.error(message)
    },
    onSuccess: (res) => {
      toast.success(res.message)
      navigate({
        to: '/auth/register/$teamId',
        params: { teamId: res.data!.id },
      })
    },
  })

  const onSubmit = (data: RegisterFormData) => mutation.mutate(data)

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

            {/* ── Nama Tim ── */}
            <Controller
              name="teamName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="input-anim">
                  <FieldLabel htmlFor="teamName">Nama Tim</FieldLabel>
                  <Input
                    {...field}
                    id="teamName"
                    placeholder="Tim Biomedis UNAIR"
                    aria-invalid={fieldState.invalid}
                    className="rounded-md text-xs h-9 focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Jenis Lomba (lebih awal supaya label email/telp langsung berubah) ── */}
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

            {/* ── Institusi / Sekolah ── */}
            <Controller
              name="institution"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="input-anim">
                  <FieldLabel htmlFor="institution">
                    {competitionType === 'LKTI' ? 'Perguruan Tinggi' : 'Asal Sekolah'}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="institution"
                    placeholder={
                      competitionType === 'LKTI'
                        ? 'Universitas Airlangga'
                        : 'SMA Negeri 1 Surabaya'
                    }
                    aria-invalid={fieldState.invalid}
                    className="rounded-md text-xs h-9 focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Email + Telepon (label berubah sesuai konteks) ── */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="input-anim">
                    <FieldLabel htmlFor="reg-email">{emailLabel}</FieldLabel>
                    <Input
                      {...field}
                      id="reg-email"
                      type="email"
                      placeholder={emailPlaceholder}
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                      className="rounded-md text-xs h-9 focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="input-anim">
                    <FieldLabel htmlFor="phone">{phoneLabel}</FieldLabel>
                    <Input
                      {...field}
                      id="phone"
                      type="tel"
                      placeholder={phonePlaceholder}
                      aria-invalid={fieldState.invalid}
                      className="rounded-md text-xs h-9 focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    {!fieldState.invalid && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">{phoneHint}</p>
                    )}
                  </Field>
                )}
              />
            </div>


            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="input-anim">
                  <FieldLabel>
                    {competitionType === 'LKTI' ? 'Alamat Kampus' : 'Alamat Sekolah'}
                  </FieldLabel>
                  <AddressField
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="sourceInfo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="input-anim">
                  <FieldLabel htmlFor="sourceInfo">Dari Mana Tahu BMEC?</FieldLabel>
                  <select
                    {...field}
                    id="sourceInfo"
                    aria-invalid={fieldState.invalid}
                    className={[
                      'w-full rounded-md border bg-background px-3 text-xs h-9',
                      'focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all',
                      fieldState.invalid
                        ? 'border-destructive text-destructive'
                        : 'border-input text-foreground',
                    ].join(' ')}
                  >
                    <option value="" disabled>
                      Pilih sumber informasi…
                    </option>
                    {SOURCE_INFO_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Password ── */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="input-anim">
                  <FieldLabel htmlFor="password">Password Tim</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                    className="rounded-md text-xs h-9 focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  {!fieldState.invalid && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Minimal 8 karakter. Dipakai untuk login ulang.
                    </p>
                  )}
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