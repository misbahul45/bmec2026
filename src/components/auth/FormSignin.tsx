import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card"
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
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = (data: LoginForm) => {
    console.log(data)
  }

  return (
    <div
    className="w-full max-w-sm rounded-md bg-transparent border-none">
      <CardHeader className="mb-4">
        <CardTitle className="text-center font-bold">BMEC</CardTitle>
        <CardDescription className="text-center">
          Silakan masuk ke akun Team
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>

            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">
                    Email
                  </FieldLabel>

                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="bmec@email.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                    className="rounded"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">
                    Password
                  </FieldLabel>

                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="********"
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                    className="rounded"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal" className="w-full">
          <Button type="submit" className="rounded flex-1" form="form-login">
            Masuk
          </Button>
        </Field>
      </CardFooter>
      <p className="text-center text-[10px] opacity-65">Belum daftar lomba? <Link to="/auth/register" className="text-blue-400 hover:underline">Ayo daftar</Link></p>
    </div>
  )
}

export default FormSignin