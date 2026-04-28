import { createFileRoute } from '@tanstack/react-router'
import FormSignin from '~/components/auth/FormSignin'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen w-full flex">
      <div className="flex-1 flex items-center justify-center px-8 py-12 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-accent/8 blur-3xl" />
        </div>
        <div className="relative z-10 w-full max-w-xs">
          <FormSignin />
        </div>
      </div>

      <div 
      className="hidden animated-border bg-muted/30 lg:flex flex-1 shrink-0 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative z-10">
          <p className="text-black text-xs font-semibold uppercase tracking-widest">BMEC 2026</p>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-2xl font-bold text-black leading-snug">
            Biomedical Engineering Competition
          </h2>
          <p className="text-sm text-black leading-relaxed">
            Kompetisi nasional Teknik Biomedis untuk inovasi teknologi kesehatan masa depan.
          </p>

          <div className="flex gap-8 pt-2">
            {[['3', 'Cabang Lomba'], ['Rp19.5jt', 'Total Hadiah'], ['2026', 'Tahun Ini']].map(([val, lbl]) => (
              <div key={lbl}>
                <p className="text-lg font-bold text-black">{val}</p>
                <p className="text-[10px] text-black/70 uppercase tracking-wide">{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-[10px] text-black/60">Universitas Airlangga · Surabaya</p>
        </div>
      </div>
    </div>
  )
}
