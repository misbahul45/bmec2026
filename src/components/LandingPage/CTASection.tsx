import { useRef } from 'react'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useCTAAnimation } from './CTA/useCTAAnimation'
import { CTAThree } from './CTA/CTAThree'
import { Button } from '~/components/ui/button'

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  useCTAAnimation(sectionRef)

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative overflow-hidden py-16 md:py-20 w-full max-w-4xl mx-auto mb-10 rounded-2xl"
      style={{
        background: 'linear-gradient(160deg, color-mix(in srgb, var(--primary) 15%, var(--background)) 0%, var(--accent) 100%)',
      }}
    >
      <CTAThree />

      <div className="relative z-10 mx-auto text-center px-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-accent-foreground leading-snug tracking-tight mb-3">
          Jadilah Bagian dari{' '}
          <span className="text-primary">Generasi Inovator</span>{' '}
          Biomedis Indonesia
        </h2>
        <p className="text-sm text-accent-foreground/60 max-w-md mx-auto mb-8">
          Daftarkan timmu sekarang dan buktikan kemampuanmu di kompetisi Teknik Biomedis terbesar.
        </p>

        <div className="cta-actions flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="default" className="rounded-xl px-6 gap-2 text-sm" asChild>
            <Link to="/auth/register">
              Daftar Sekarang
              <ArrowRight size={14} />
            </Link>
          </Button>
          <Button size="default" variant="outline" className="rounded-xl px-6 gap-2 text-sm" asChild>
            <a href="#competition">
              <BookOpen size={14} />
              Lihat Detail Lomba
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CTASection
