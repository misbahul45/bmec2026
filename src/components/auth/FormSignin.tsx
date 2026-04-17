import { useEffect, useRef } from "react"
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card"
import { loginSchema } from "~/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { Field, FieldGroup, FieldError, FieldLabel } from "../ui/field"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Link, useNavigate } from "@tanstack/react-router"
import gsap from "gsap"
import { useMutation } from "@tanstack/react-query"
import { loginFn } from "~/server/auth"
import { toast } from "sonner"
import { useRouteContext } from "@tanstack/react-router"
import { useRouter } from "@tanstack/react-router"

type LoginForm = z.infer<typeof loginSchema>

const FormSignin = () => {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const navigate=useNavigate()
  const router = useRouter()


  const containerRef = useRef<HTMLDivElement>(null)

  const { user } = useRouteContext({ from:'__root__' })


  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-up", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
      })

      gsap.from(".input-anim", {
        scale: 0.95,
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out",
        stagger: 0.1,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])


  const mutation = useMutation({
      mutationFn: async (formData: LoginForm) => {
        return await loginFn({
          data: formData,
        })
      },
      onError: (error: any) => {
        console.log(error)
        toast.error(error.message)
      },
      onSuccess: async (res) => {
        await router.invalidate()

        const rootMatch = router.state.matches.find(
          (m) => m.routeId === "__root__"
        )

        const newUser = rootMatch?.context?.user

        navigate({
          to: newUser?.redirect ?? "/dashboard",
        })

        toast.success(res.message)
      }
    })

  const onSubmit = (data: LoginForm) => {
     mutation.mutate(data)
  }

  return (
    <div ref={containerRef} className="w-full max-w-sm">
      <CardHeader className="mb-6 px-0 fade-up">
        <CardTitle className="text-center text-xl tracking-tight">
          BMEC
        </CardTitle>
        <CardDescription className="text-center text-xs opacity-70">
          Silakan masuk ke akun Tim
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0 fade-up">
        <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="input-anim">
                  <FieldLabel htmlFor="email" className="text-xs">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="bmec@email.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                    className="rounded-md text-xs h-9 focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="input-anim">
                  <FieldLabel htmlFor="password" className="text-xs">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="********"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                    className="rounded-md text-xs h-9 focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="px-0 flex-col gap-3 mt-4 fade-up">
        <Button
          type="submit"
          form="form-login"
          disabled={mutation.isPending}
          className="rounded-md w-full h-9 text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {mutation.isPending?'signin to your account...':'Masuk'}
        </Button>
        <p className="text-center text-[10px]">
          <span className="opacity-90">Belum daftar lomba?{" "}</span>
          <Link to="/auth/register" className="text-primary font-semibold hover:underline">
            Ayo daftar
          </Link>
        </p>
      </CardFooter>
    </div>
  )
}

export default FormSignin