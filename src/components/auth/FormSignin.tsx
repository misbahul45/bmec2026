import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card"
import { loginSchema } from "~/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { Field, FieldGroup, FieldError, FieldLabel } from "../ui/field"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Link } from "@tanstack/react-router"

type LoginForm = z.infer<typeof loginSchema>

const FormSignin = () => {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = (data: LoginForm) => {
    console.log(data)
  }

  return (
    <div className="w-full max-w-sm">
      <CardHeader className="mb-4 px-0">
        <CardTitle className="text-center font-bold">BMEC</CardTitle>
        <CardDescription className="text-center text-xs">
          Silakan masuk ke akun Tim
        </CardDescription>
      </CardHeader>

      <CardContent className="px-0">
        <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="bmec@email.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                    className="rounded text-xs"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="********"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                    className="rounded text-xs"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="px-0 flex-col gap-2">
        <Button type="submit" className="rounded w-full" form="form-login">
          Masuk
        </Button>
        <p className="text-center text-[10px] opacity-65">
          Belum daftar lomba?{' '}
          <Link to="/auth/register" className="text-primary hover:underline">Ayo daftar</Link>
        </p>
      </CardFooter>
    </div>
  )
}

export default FormSignin
