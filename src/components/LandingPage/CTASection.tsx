import { useRef } from 'react'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useCTAAnimation } from './CTA/useCTAAnimation'
import { CTAThree } from './CTA/CTAThree'
import { Button } from '~/components/ui/button'

const stats = [
  { value: '3', label: 'Cabang Lomba' },
  { value: 'Rp19,5jt', label: 'Total Hadiah' },
  { value: '100+', label: 'Soal Eksklusif' },
  { value: '∞', label: 'Potensimu' },
]

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  useCTAAnimation(sectionRef)

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative overflow-hidden py-28 md:py-40"
      style={{
        background: 'linear-gradient(180deg, transparent 0%, var(--accent) 100%)',
        backgroundColor: 'var(--background)',
      }}
    >
      <CTAThree />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="cta-headline text-4xl md:text-6xl lg:text-7xl font-bold text-accent-foreground leading-[1.05] tracking-tight mb-6">
          Jadilah Bagian dari<br />
          <span className="text-accent-foreground/80">Generasi Inovator</span><br />
          <span className="text-accent-foreground">Biomedis Indonesia</span>
        </h2>

        <p className="cta-sub text-accent-foreground/65 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
          BMEC 2026 bukan sekadar kompetisi. Ini adalah panggung untuk membuktikan bahwa kamu siap membawa inovasi ke dunia kesehatan masa depan.
        </p>

        <div className="cta-stats flex flex-wrap justify-center gap-3 mb-12">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center bg-accent-foreground/10 border border-accent-foreground/20 rounded-2xl px-5 py-3 min-w-[90px]"
            >
              <span className="text-xl font-bold text-accent-foreground">{s.value}</span>
              <span className="text-[10px] text-accent-foreground/55 uppercase tracking-wide mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="cta-actions flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="rounded-xl px-8 gap-2" asChild>
            <Link to="/auth/register">
              Daftar Sekarang
              <ArrowRight size={15} />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="rounded-xl px-8 gap-2" asChild>
            <a href="#competition">
              <BookOpen size={15} />
              Lihat Detail Lomba
            </a>
          </Button>
        </div>

        <p className="cta-footnote text-xs text-accent-foreground/45 mt-7">
          Sertifikat untuk semua peserta · Gratis tryout · Soal dari dosen UNAIR
        </p>
      </div>
    </section>
  )
}

export default CTASection
