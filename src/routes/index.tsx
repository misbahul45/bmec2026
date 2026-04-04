import { createFileRoute } from '@tanstack/react-router'
import AboutSection from '~/components/LandingPage/AboutSection'
import CTASection from '~/components/LandingPage/CTASection'
import CompetitionDetailSection from '~/components/LandingPage/CompetitionDetailSection'
import GalerySection from '~/components/LandingPage/GalerySection'
import HeroSecttion from '~/components/LandingPage/HeroSecttion'
import TimelineSection from '~/components/LandingPage/TimelineSection'
import WhySection from '~/components/LandingPage/WhySection'

export const Route = createFileRoute('/')({
  component: Home,
})


function Home() {
  return (
    <div className="min-h-screen">
      <HeroSecttion />
      <AboutSection />
      <WhySection />
      <TimelineSection />
      <CompetitionDetailSection />
      <GalerySection />
      <CTASection />
    </div>
  )
}
