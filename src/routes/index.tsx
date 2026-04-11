import { createFileRoute } from '@tanstack/react-router'
import AboutSection from '~/components/LandingPage/AboutSection'
import CTASection from '~/components/LandingPage/CTASection'
import CompetitionDetailSection from '~/components/LandingPage/CompetitionDetailSection'
import FaqSection from '~/components/LandingPage/FaqSection'
import GalerySection from '~/components/LandingPage/GalerySection'
import HeroSecttion from '~/components/LandingPage/HeroSecttion'
import TimelineSection from '~/components/LandingPage/TimelineSection'
import WhySection from '~/components/LandingPage/WhySection'
import { seo } from '~/lib/utils/seo'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      ...seo({
        title:
          'BMEC 2026 - Biomedical Engineering Competition Universitas Airlangga',
        description:
          'BMEC 2026 merupakan kompetisi Teknik Biomedis tingkat nasional yang diselenggarakan oleh Universitas Airlangga. Terdiri dari Olimpiade, LKTI, dan Infografis.',
      }),

      {
        name: 'keywords',
        content:
          'BMEC 2026, Biomedical Engineering Competition, Olimpiade Biomedis, LKTI Biomedis, Infografis Biomedis, Universitas Airlangga',
      },

      // Open Graph
      {
        property: 'og:title',
        content:
          'BMEC 2026 - Biomedical Engineering Competition Universitas Airlangga',
      },
      {
        property: 'og:description',
        content:
          'Kompetisi nasional Teknik Biomedis dengan 3 cabang lomba: Olimpiade, LKTI, dan Infografis.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:image',
        content: '/banner-bmec-2026.png',
      },

      // Twitter
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'BMEC 2026 - Biomedical Engineering Competition',
      },
      {
        name: 'twitter:description',
        content:
          'Kompetisi Teknik Biomedis Nasional 2026. Olimpiade, LKTI, dan Infografis.',
      },
    ],
  }),

  component: Home,
})

function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <HeroSecttion />
      <AboutSection />
      <WhySection />
      <TimelineSection />
      <CompetitionDetailSection />
      <GalerySection />
      <FaqSection />
      <CTASection />
    </div>
  )
}