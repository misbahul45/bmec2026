import { zodResolver } from '@hookform/resolvers/zod'
import { MemberRole } from '@prisma/client'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import FormMember from '~/components/auth/FormMember'
import FormMentor from '~/components/auth/FormMentor'
import { DocumentUploadTab } from '~/components/auth/DocumentUploadTab'
import { TeamNotFound } from '~/components/errors/TeamNotFound'
import { Button } from '~/components/ui/button'
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
import { CreateMentorInput, createMentorSchema } from '~/schemas/team.mentor.schema'
import { createTeamMember, createMentor } from '~/server/team'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'

const searchSchema = z.object({
  tab: z.enum(['members', 'dokumen']).optional(),
})

export const Route = createFileRoute('/auth/register/$teamId/')({
  validateSearch: searchSchema,
  beforeLoad: async ({ context, location }) => {
    if (!context.user) {
      throw redirect({ to: '/auth/login' })
    }
    const normalize = (p: string) => p.split('?')[0].replace(/\/$/, '')
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

type MemberFormValues = z.infer<typeof createMembersSchema>
type MentorFormValues = z.infer<typeof createMentorSchema>

function RouteComponent() {
  const { teamId } = Route.useParams()
  const { tab } = Route.useSearch()
  const { data: res } = useSuspenseQuery(teamQueryOptions(teamId))
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  const initialTab =
    tab === 'dokumen' ? 'dokumen' :
    tab === 'members' ? 'member-0' :
    'mentor'

  const [activeTab, setActiveTab] = useState(initialTab)
  const [mentorSubmitted, setMentorSubmitted] = useState(tab === 'members' || tab === 'dokumen')
  const [membersSubmitted, setMembersSubmitted] = useState(tab === 'dokumen')

  const team = res.data!
  const educationLevel: 'SMA' | 'MAHASISWA' = mapCompetitionToEducation(team.competitionType)

  const mentorForm = useForm<MentorFormValues>({
    resolver: zodResolver(createMentorSchema),
    defaultValues: { name: '', email: '', phone: '', teamId },
    mode: 'onChange',
  })

  const memberForm = useForm<MemberFormValues>({
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

  const mentorMutation = useMutation({
    mutationFn: (data: CreateMentorInput) => createMentor({ data }),
    onError: (error: any) => toast.error(error.message),
    onSuccess: (res: any) => {
      toast.success(res.message)
      mentorForm.reset()
      setMentorSubmitted(true)
      setActiveTab('member-0')
    },
  })

  const memberMutation = useMutation({
    mutationFn: (data: CreateMemberData) => createTeamMember({ data }),
    onError: (error: any) => toast.error(error.message),
    onSuccess: (res) => {
      toast.success(res.message)
      memberForm.reset()
      setMembersSubmitted(true)
      setActiveTab('dokumen')
    },
  })

  const onMentorSubmit: SubmitHandler<MentorFormValues> = (data) =>
    mentorMutation.mutate(data)

  const onMembersSubmit: SubmitHandler<MemberFormValues> = (data) =>
    memberMutation.mutate(data)

  const memberTabs = [
    { value: 'member-0', label: 'Ketua' },
    { value: 'member-1', label: 'Anggota 1' },
    { value: 'member-2', label: 'Anggota 2' },
  ]

  const steps = [
    { label: 'Mentor',   done: mentorSubmitted,  active: !mentorSubmitted },
    { label: 'Data Tim', done: membersSubmitted,  active: mentorSubmitted && !membersSubmitted },
    { label: 'Dokumen',  done: false,             active: membersSubmitted },
  ]

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl shadow-xl shadow-primary/10 rounded-2xl fade-up">
        <CardHeader className="space-y-2 fade-up">
          <CardTitle className="text-base sm:text-lg md:text-2xl font-semibold text-center">
            Lengkapi Data Tim <span className="text-primary">{team.name}</span>
          </CardTitle>
          <CardDescription className="text-sm text-center">
            Isi data mentor & anggota terlebih dahulu, lalu upload dokumen kelengkapan tim.
          </CardDescription>

          <div className="flex items-center justify-center gap-2 pt-2">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  {step.done
                    ? <CheckCircle2 size={14} className="text-green-600" />
                    : (
                      <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold
                        ${step.active
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'}`}
                      >
                        {i + 1}
                      </span>
                    )
                  }
                  <span className={`text-xs font-medium
                    ${step.done ? 'text-green-600' : step.active ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 fade-up">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="mentor" disabled={mentorSubmitted}>
                <span className="flex items-center gap-1">
                  Mentor
                  {mentorSubmitted && <CheckCircle2 size={11} className="text-green-600" />}
                </span>
              </TabsTrigger>

              {memberTabs.map(({ value, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  disabled={!mentorSubmitted || membersSubmitted}
                >
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

            <TabsContent value="mentor" className="mt-6 tab-anim">
              <form onSubmit={mentorForm.handleSubmit(onMentorSubmit)} className="space-y-6">
                <FormMentor form={mentorForm} teamId={teamId} />
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    Isi data mentor pembimbing tim
                  </p>
                  <Button
                    type="submit"
                    className="active:scale-95 rounded-xl"
                    disabled={mentorMutation.isPending}
                  >
                    {mentorMutation.isPending ? 'Menyimpan...' : 'Simpan Mentor →'}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <form onSubmit={memberForm.handleSubmit(onMembersSubmit)} className="space-y-6">
              {[0, 1, 2].map((index) => (
                <TabsContent key={index} value={`member-${index}`} className="mt-6 tab-anim">
                  <FormMember form={memberForm} index={index} educationLevel={educationLevel} />
                </TabsContent>
              ))}

              {mentorSubmitted && !membersSubmitted && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    Isi semua tab anggota sebelum menyimpan
                  </p>
                  <Button
                    type="submit"
                    className="active:scale-95 rounded-xl"
                    disabled={memberMutation.isPending}
                  >
                    {memberMutation.isPending ? 'Menyimpan...' : 'Simpan Anggota →'}
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