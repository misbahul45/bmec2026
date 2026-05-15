import { useRef } from 'react'
import { Plus } from 'lucide-react'
import type { FAQItem as FAQItemType } from './faqData'
import {
  animateAccordionOpen,
  animateAccordionClose,
} from './useFAQAnimation'

interface Props {
  item: FAQItemType
  isOpen: boolean
  onToggle: (id: string) => void
}

export function FAQItem({
  item,
  isOpen,
  onToggle,
}: Props) {
  const contentRef =
    useRef<HTMLDivElement>(null)

  const iconRef =
    useRef<HTMLSpanElement>(null)

  const handleToggle = () => {
    const content =
      contentRef.current

    const icon =
      iconRef.current

    if (!content || !icon)
      return

    if (!isOpen) {
      animateAccordionOpen(
        content,
        icon
      )
    } else {
      animateAccordionClose(
        content,
        icon
      )
    }

    onToggle(item.id)
  }

  return (
    <div className="faq-item border-b border-border last:border-0">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={
          isOpen
        }
      >
        <span className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-200 leading-snug">
          {item.question}
        </span>

        <span
          ref={iconRef}
          className="shrink-0 w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary transition-colors duration-200"
          style={{
            willChange:
              'transform',
          }}
        >
          <Plus
            size={13}
            strokeWidth={2.5}
          />
        </span>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{
          height: 0,
          opacity: 0,
        }}
      >
        <div
          className="
            pb-5 pr-10 text-sm text-muted-foreground leading-relaxed
            prose prose-sm dark:prose-invert max-w-none

            prose-p:my-2
            prose-p:leading-relaxed

            prose-h4:mt-4
            prose-h4:mb-2
            prose-h4:text-sm
            prose-h4:font-semibold

            prose-ul:list-disc
            prose-ul:pl-5
            prose-ul:my-2

            prose-ol:list-decimal
            prose-ol:pl-5
            prose-ol:my-2

            prose-li:my-1
            prose-li:pl-1
            prose-li:marker:text-foreground

            prose-strong:text-foreground
            prose-headings:text-foreground

            [&_ul]:list-disc
            [&_ul]:pl-5
            [&_ol]:list-decimal
            [&_ol]:pl-5
            [&_li]:my-1
          "
          dangerouslySetInnerHTML={{
            __html:
              item.answer,
          }}
        />
      </div>
    </div>
  )
}