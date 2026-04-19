import React, { useState } from "react"
import {
  DialogContent,
  DialogHeader,
  Dialog,
  DialogTitle,
} from "../../../ui/dialog"
import { Button } from "../../../ui/button"
import { Input } from "~/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "~/components/ui/field"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateTeamSchema } from "~/schemas/team.schema"
import { updateTeam } from "~/server/team"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  teamName: string
  teamId: string
}

const schema = updateTeamSchema
  .pick({
    password: true,
  })
  .extend({
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof schema>

const PasswordDialog: React.FC<Props> = ({
  open,
  setOpen,
  teamName,
  teamId,
}) => {
  const queryClient = useQueryClient()
  const [showNewPassword, setShowNewPassword] =
    useState(false)
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const toastId = toast.loading(
        "Mengubah password..."
      )

      try {
        const res = await updateTeam({
          data: {
            id: teamId,
            body: {
              password: data.password,
            },
          },
        })

        toast.success("Password berhasil diubah", {
          id: toastId,
        })

        return res
      } catch (err: any) {
        toast.error(
          err.message || "Terjadi kesalahan",
          {
            id: toastId,
          }
        )
        throw err
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
      setOpen(false)
      form.reset()
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Ubah sandi {teamName}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({
                field,
                fieldState,
              }) => (
                <Field
                  data-invalid={
                    fieldState.invalid
                  }
                >
                  <FieldLabel>
                    Password Baru
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Password baru"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(
                          !showNewPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showNewPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>

                  {fieldState.invalid && (
                    <FieldError
                      errors={[
                        fieldState.error,
                      ]}
                    />
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({
                field,
                fieldState,
              }) => (
                <Field
                  data-invalid={
                    fieldState.invalid
                  }
                >
                  <FieldLabel>
                    Konfirmasi Password
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Konfirmasi password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>

                  {fieldState.invalid && (
                    <FieldError
                      errors={[
                        fieldState.error,
                      ]}
                    />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              disabled={
                mutation.isPending
              }
              className="w-full"
            >
              {mutation.isPending
                ? "Menyimpan..."
                : "Simpan Password"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PasswordDialog