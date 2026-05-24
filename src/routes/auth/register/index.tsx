import { createFileRoute } from '@tanstack/react-router'
import RegisterForm from '~/components/auth/RegisterForm'
import { StackedCarousel } from '~/components/auth/StackedCarousel'
import CountdownWaiting from '~/components/ui/CoundownTime'

export const Route = createFileRoute('/auth/register/')({
  component: RouteComponent,
})

function RouteComponent() {
  const TARGET_DATE = new Date('2026-05-25T00:00:00')
  const isPast = TARGET_DATE.getTime() <= Date.now()
  // if (!isPast) {
  //     return <CountdownWaiting />
  // }
  return (
    <div className="min-h-screen w-full flex">
      <div className="hidden lg:flex flex-1 items-center justify-center bg-muted/30 border-r border-border px-8 py-12">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-1">Pilih Lomba Favoritmu</h2>
            <p className="text-sm text-muted-foreground">Klik card untuk melihat detail kompetisi</p>
          </div>
          <StackedCarousel />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <RegisterForm />
      </div>
    </div>
  )
}
