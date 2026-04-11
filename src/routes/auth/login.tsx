import { createFileRoute } from '@tanstack/react-router'
import FormSignin from '~/components/auth/FormSignin'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      <div className="flex-1 flex items-center justify-center px-6 py-12 order-2 lg:order-1">
        <FormSignin />
      </div>

      <div className="lg:flex-1 bg-secondary/30 relative overflow-hidden flex items-center justify-center px-8 py-16 order-1 lg:order-2 min-h-50 lg:min-h-screen">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-[60%_40%_55%_45%/55%_60%_40%_45%] bg-primary/40 blur-3xl animate-pulse" />
          <div className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full bg-accent/30 blur-2xl" />
        </div>

        <div className="relative z-10 text-center max-w-sm">
          <h1 className="text-xl lg:text-2xl font-bold text-foreground leading-tight mb-4">
            Biomedical Engineering Competition 2026
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Kompetisi nasional Teknik Biomedis untuk inovasi teknologi kesehatan masa depan.
          </p>

          <div className="flex justify-center gap-6 mt-8">
            {[['3', 'Cabang Lomba'], ['Rp19,5jt', 'Total Hadiah'], ['∞', 'Potensimu']].map(([val, lbl]) => (
              <div key={lbl} className="flex flex-col items-center">
                <span className="text-base font-bold text-foreground">{val}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
