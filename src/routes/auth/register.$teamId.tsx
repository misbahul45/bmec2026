import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import FormMember from '~/components/auth/FormMember'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui/tabs'

import { createMembersSchema } from '~/schemas/team.schema'

export const Route = createFileRoute('/auth/register/$teamId')({
  component: RouteComponent,
})

type FormValues = z.infer<typeof createMembersSchema>

function RouteComponent() {
  const { teamId } = Route.useParams()

  const form = useForm<FormValues>({
    resolver: zodResolver(createMembersSchema),
    defaultValues: {
      members: [
        { name: '', nis: '', documentUrl: '' },
        { name: '', nis: '', documentUrl: '' },
        { name: '', nis: '', documentUrl: '' },
      ],
    },
  })

  const onSubmit = (data: FormValues) => {
    console.log('Submit Members', data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">

      <Card className="w-full max-w-4xl shadow-3xl shadow-primray/80 rounded-2xl s">

        <CardHeader className="space-y-2">
          <CardTitle className="text-base sm:text-lg md:text-2xl lg:text-4xl font-semibold text-center">
            Lengkapi Data Anggota Tim
          </CardTitle>

          <CardDescription>
            Lengkapi seluruh data dan dokumen anggota tim dengan benar.
            Pastikan setiap anggota mengisi informasi yang valid sebelum
            melanjutkan ke tahap berikutnya.
          </CardDescription>
        </CardHeader>


        <CardContent className="space-y-6">

          <Tabs defaultValue="member-0">

            <TabsList className="grid grid-cols-3 w-full">
              {[0, 1, 2].map((index) => (
                <TabsTrigger
                  key={index}
                  value={`member-${index}`}
                >
                  Member {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>


            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >

              {[0, 1, 2].map((index) => (
                <TabsContent
                  key={index}
                  value={`member-${index}`}
                  className="mt-6"
                >
                  <FormMember
                    form={form}
                    index={index}
                  />
                </TabsContent>
              ))}


              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="active:scale-95"
                >
                  Simpan & Lanjutkan
                </Button>
              </div>

            </form>

          </Tabs>

        </CardContent>

      </Card>

    </div>
  )
}