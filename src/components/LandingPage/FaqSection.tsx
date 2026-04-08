import { useRef, useState } from 'react'
import { faqData } from './FAQ/faqData'
import { FAQItem } from './FAQ/FAQItem'
import { useFAQAnimation, animateAccordionClose } from './FAQ/useFAQAnimation'

const FaqSection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const contentRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const iconRefs = useRef<Map<string, HTMLSpanElement>>(new Map())

  useFAQAnimation(sectionRef)

  const handleToggle = (id: string) => {
    if (openId && openId !== id) {
      const prevContent = document.querySelector<HTMLDivElement>(`[data-faq-content="${openId}"]`)
      const prevIcon = document.querySelector<HTMLSpanElement>(`[data-faq-icon="${openId}"]`)
      if (prevContent && prevIcon) animateAccordionClose(prevContent, prevIcon)
    }
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="bg-background py-20 md:py-28"
    >
      <div className="max-w-3xl mx-auto px-6">
        <div className="faq-header text-center mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl  font-bold text-foreground mb-4">
            Pertanyaan yang Sering Ditanyakan
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
            Semua yang perlu kamu tahu sebelum mendaftar BMEC 2026.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl px-6 md:px-8 shadow-sm">
          {faqData.map((item) => (
            <FAQItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FaqSection
