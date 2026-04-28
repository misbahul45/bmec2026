import { useEffect, useRef } from "react"
import { loginSchema } from "~/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { FieldError } from "../ui/field"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Link, useNavigate, useRouteContext, useRouter } from "@tanstack/react-router"
import gsap from "gsap"
import { useMutation } from "@tanstack/react-query"
import { loginFn } from "~/server/auth"
import { toast } from "sonner"
import { ArrowRight, Loader2 } from "lucide-react"

type LoginForm = z.infer<typeof loginSchema>

const FormSignin = () => {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const navigate = useNavigate()
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".signin-el", {
        y: 20, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.08,
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const mutation = useMutation({
    mutationFn: (formData: LoginForm) => loginFn({ data: formData }),
    onError: (error: any) => toast.error(error.message),
    onSuccess: async (res) => {
      await router.invalidate()
      const rootMatch = router.state.matches.find((m) => m.routeId === "__root__")
      const newUser = rootMatch?.context?.user
      navigate({ to: newUser?.redirect ?? "/dashboard" })
      toast.success(res.message)
    },
  })

  return (
    <div ref={containerRef} className="w-full max-w-md space-y-8">
      <div className="signin-el space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">BMEC 2026</p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Masuk</h1>
        <p className="text-xs text-muted-foreground">Login ke akun tim kamu</p>
      </div>

      <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="signin-el space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-foreground/80">Email</label>
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="tim@email.com"
                autoComplete="email"
                aria-invalid={fieldState.invalid}
                className="h-10 rounded-xl text-sm border-border/60 bg-muted/30 focus:bg-background transition-colors"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="signin-el space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-foreground/80">Password</label>
              <Input
                {...field}
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
                className="h-10 rounded-xl text-sm border-border/60 bg-muted/30 focus:bg-background transition-colors"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
          )}
        />

        <div className="signin-el pt-1">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full h-10 rounded-xl text-sm font-semibold gap-2"
          >
            {mutation.isPending ? (
              <><Loader2 size={14} className="animate-spin" />Masuk...</>
            ) : (
              <>Masuk<ArrowRight size={14} /></>
            )}
          </Button>
        </div>
      </form>

      <p className="signin-el text-center text-[11px] text-muted-foreground">
        Belum daftar?{" "}
        <Link to="/auth/register" className="text-primary font-semibold hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  )
}

export default FormSignin
