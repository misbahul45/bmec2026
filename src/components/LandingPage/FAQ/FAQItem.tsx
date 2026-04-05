import { useRef } from 'react'
import { Plus } from 'lucide-react'
import type { FAQItem as FAQItemType } from './faqData'
import { animateAccordionOpen, animateAccordionClose } from './useFAQAnimation'

interface Props {
  item: FAQItemType
  isOpen: boolean
  onToggle: (id: string) => void
}

export function FAQItem({ item, isOpen, onToggle }: Props) {
  const contentRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)
  const prevOpen = useRef(false)

  const handleToggle = () => {
    const content = contentRef.current
    const icon = iconRef.current
    if (!content || !icon) return

    if (!isOpen) {
      animateAccordionOpen(content, icon)
    } else {
      animateAccordionClose(content, icon)
    }
    prevOpen.current = !isOpen
    onToggle(item.id)
  }

  return (
    <div className="faq-item border-b border-border last:border-0">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-200 leading-snug">
          {item.question}
        </span>
        <span
          ref={iconRef}
          className="shrink-0 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary transition-colors duration-200"
          style={{ willChange: 'transform' }}
        >
          <Plus size={13} strokeWidth={2.5} />
        </span>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <p className="text-sm text-muted-foreground leading-relaxed pb-5 pr-10">
          {item.answer}
        </p>
      </div>
    </div>
  )
}
