import { createFileRoute } from '@tanstack/react-router'
import AboutSection from '~/components/LandingPage/AboutSection'
import CTASection from '~/components/LandingPage/CTASection'
import CompetitionDetailSection from '~/components/LandingPage/CompetitionDetailSection'
import FaqSection from '~/components/LandingPage/FaqSection'
import GalerySection from '~/components/LandingPage/GalerySection'
import HeroSecttion from '~/components/LandingPage/HeroSecttion'
import TimelineSection from '~/components/LandingPage/TimelineSection'
import WhySection from '~/components/LandingPage/WhySection'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title:
          'BMEC 2025 - Biomedical Engineering Competition Universitas Airlangga',
      },
      {
        name: 'description',
        content:
          'BMEC 2025 merupakan kompetisi Teknik Biomedis tingkat nasional yang diselenggarakan oleh Himpunan Mahasiswa Teknik Biomedis Universitas Airlangga. Terdiri dari Olimpiade, LKTI, dan Infografis dengan total hadiah belasan juta rupiah.',
      },

      // SEO Keywords
      {
        name: 'keywords',
        content:
          'BMEC 2025, Biomedical Engineering Competition, Lomba Teknik Biomedis, Olimpiade Biomedis, LKTI Biomedis, Infografis Biomedis, Universitas Airlangga, Kompetisi Nasional SMA',
      },

      // Open Graph (WhatsApp / Discord / LinkedIn)
      {
        property: 'og:title',
        content:
          'BMEC 2025 - Biomedical Engineering Competition Universitas Airlangga',
      },
      {
        property: 'og:description',
        content:
          'Kompetisi nasional Teknik Biomedis dengan 3 cabang lomba: Olimpiade, LKTI, dan Infografis. Raih hadiah belasan juta rupiah dan sertifikat nasional.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:image',
        content: '/banner-bmec-2025.png', // ganti dengan banner kamu
      },

      // Twitter / X Preview
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'BMEC 2025 - Biomedical Engineering Competition',
      },
      {
        name: 'twitter:description',
        content:
          'Kompetisi Teknik Biomedis Nasional 2025. Olimpiade, LKTI, dan Infografis.',
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
