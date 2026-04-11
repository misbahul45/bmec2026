import { zodResolver } from '@hookform/resolvers/zod'
import { MemberRole } from '@prisma/client'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

import FormMember from '~/components/auth/FormMember'
import { NotFound } from '~/components/NotFound'
import { TeamNotFound } from '~/components/errors/TeamNotFound'
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
import { teamQueryOptions } from '~/lib/api/teams/team.query-options'
import { mapCompetitionToEducation } from '~/lib/utils'

import { CreateMemberData, createMembersSchema } from '~/schemas/team.member.schema'
import { createTeamMember } from '~/server/team'
import { toast } from 'sonner'

export const Route = createFileRoute('/auth/register/$teamId/')({
  component: RouteComponent,
  loader: async ({ params: { teamId }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      teamQueryOptions(teamId),
    )
    return data;
  },
  errorComponent:TeamNotFound
})

type FormValues = z.infer<typeof createMembersSchema>

function RouteComponent() {
  const { teamId } = Route.useParams()
  const { data: res } = useSuspenseQuery(teamQueryOptions(teamId))

  const team = res.data!

  const educationLevel: "SMA" | "MAHASISWA" =
    mapCompetitionToEducation(team.competitionType)


  const members: FormValues["members"] = [
    MemberRole.KETUA,
    MemberRole.ANGGOTA,
    MemberRole.ANGGOTA,
  ].map((role) => ({
    name: '',
    studentId: '',
    role,
    teamId,
    educationLevel,
  }))

  const form = useForm<FormValues>({
    resolver: zodResolver(createMembersSchema),
    defaultValues: {
      members,
    },
  })
  
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async (formData: CreateMemberData) => {
      return await createTeamMember({
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
        to: '/auth/register/$teamId/completed',
        params: {
          teamId
        },
      })

      form.reset()
    },
  })


  const onSubmit: SubmitHandler<FormValues> = (data) => {
    mutation.mutate(data)
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-6">

      <Card className="w-full max-w-4xl shadow-3xl shadow-primray/80 rounded-2xl s">

        <CardHeader className="space-y-2">
          <CardTitle className="text-base sm:text-lg md:text-2xl lg:text-4xl font-semibold text-center">
            Lengkapi Data Anggota Tim <span className='text-primary'>{team.name}</span>
          </CardTitle>

          <CardDescription className='text-sm md:text-base'>
            Lengkapi seluruh data tim dengan benar.
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
                  {index === 0 ? 'Ketua' : `Anggota ${index}`}
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
                    educationLevel={educationLevel}
                  />
                </TabsContent>
              ))}


              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="active:scale-95 rounded-md hover:opacity-95"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Menyimpan...':'Simpan & Lanjutkan'}
                </Button>
              </div>

            </form>

          </Tabs>

        </CardContent>

      </Card>

    </div>
  )
}