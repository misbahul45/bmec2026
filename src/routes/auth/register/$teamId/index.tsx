import { zodResolver } from '@hookform/resolvers/zod'
import { MemberRole } from '@prisma/client'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import FormMember from '~/components/auth/FormMember'
import { DocumentUploadTab } from '~/components/auth/DocumentUploadTab'
import { TeamNotFound } from '~/components/errors/TeamNotFound'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/auth/register/$teamId/')({
  beforeLoad: async ({ context, location }) => {
    if (!context.user) {
      throw redirect({ to: '/auth/login' })
    }
    const normalize = (p: string) => p.replace(/\/$/, '')
    if (normalize(context.user.redirect) !== normalize(location.pathname)) {
      throw redirect({ to: context.user.redirect })
    }
    return { user: context.user }
  },
  component: RouteComponent,
  loader: async ({ params: { teamId }, context }) => {
    return context.queryClient.ensureQueryData(teamQueryOptions(teamId))
  },
  errorComponent: TeamNotFound,
})

type FormValues = z.infer<typeof createMembersSchema>

function RouteComponent() {
  const { teamId } = Route.useParams()
  const { data: res } = useSuspenseQuery(teamQueryOptions(teamId))
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState('member-0')
  const [membersSubmitted, setMembersSubmitted] = useState(false)

  const team = res.data!
  const educationLevel: 'SMA' | 'MAHASISWA' = mapCompetitionToEducation(team.competitionType)

  const form = useForm<FormValues>({
    resolver: zodResolver(createMembersSchema),
    defaultValues: {
      members: [MemberRole.KETUA, MemberRole.ANGGOTA, MemberRole.ANGGOTA].map((role) => ({
        name: '',
        studentId: '',
        role,
        teamId,
        educationLevel,
      })),
    },
    mode: 'onChange',
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-up', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 })
      gsap.from('.tab-anim', { scale: 0.96, opacity: 0, duration: 0.6, delay: 0.2, ease: 'power2.out', stagger: 0.08 })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const mutation = useMutation({
    mutationFn: (formData: CreateMemberData) => createTeamMember({ data: formData }),
    onError: (error: any) => toast.error(error.message),
    onSuccess: (res) => {
      toast.success(res.message)
      form.reset()
      setMembersSubmitted(true)
      setActiveTab('dokumen')
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => mutation.mutate(data)

  const memberTabs = [
    { value: 'member-0', label: 'Ketua' },
    { value: 'member-1', label: 'Anggota 1' },
    { value: 'member-2', label: 'Anggota 2' },
  ]

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl shadow-xl shadow-primary/10 rounded-2xl fade-up">
        <CardHeader className="space-y-2 fade-up">
          <CardTitle className="text-base sm:text-lg md:text-2xl font-semibold text-center">
            Lengkapi Data Tim <span className="text-primary">{team.name}</span>
          </CardTitle>
          <CardDescription className="text-sm text-center">
            Isi data anggota terlebih dahulu, lalu upload dokumen kelengkapan tim.
          </CardDescription>

          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-1.5">
              {membersSubmitted
                ? <CheckCircle2 size={14} className="text-green-600" />
                : <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">1</span>
              }
              <span className={`text-xs font-medium ${membersSubmitted ? 'text-green-600' : 'text-foreground'}`}>Data Anggota</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${membersSubmitted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</span>
              <span className={`text-xs font-medium ${membersSubmitted ? 'text-foreground' : 'text-muted-foreground'}`}>Upload Dokumen</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 fade-up">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              {memberTabs.map(({ value, label }) => (
                <TabsTrigger key={value} value={value} disabled={membersSubmitted}>
                  {label}
                </TabsTrigger>
              ))}
              <TabsTrigger value="dokumen" disabled={!membersSubmitted}>
                <span className="flex items-center gap-1">
                  Dokumen
                  {membersSubmitted && <CheckCircle2 size={11} className="text-green-600" />}
                </span>
              </TabsTrigger>
            </TabsList>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {[0, 1, 2].map((index) => (
                <TabsContent key={index} value={`member-${index}`} className="mt-6 tab-anim">
                  <FormMember form={form} index={index} educationLevel={educationLevel} />
                </TabsContent>
              ))}

              {!membersSubmitted && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    Isi semua tab anggota sebelum menyimpan
                  </p>
                  <Button
                    type="submit"
                    className="active:scale-95 rounded-xl"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? 'Menyimpan...' : 'Simpan Anggota →'}
                  </Button>
                </div>
              )}
            </form>

            <TabsContent value="dokumen" className="mt-6 tab-anim">
              <DocumentUploadTab
                teamId={teamId}
                existingDocumentUrl={team.documentUrl}
                onSuccess={() =>
                  navigate({ to: '/auth/register/$teamId/completed', params: { teamId } })
                }
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
