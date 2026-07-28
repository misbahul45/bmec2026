import { ExamRichText } from './ExamRichText'
import {
  examOptionLabelClassName,
  examOptionSurfaceClassName,
} from './exam-content.styles'

interface ExamOptionItemProps {
  label: string
  content: string
  isSelected: boolean
  onClick: () => void
  disabled?: boolean
}

export function ExamOptionItem({ label, content, isSelected, onClick, disabled = false }: ExamOptionItemProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      disabled={disabled}
      onClick={onClick}
      className={`${examOptionSurfaceClassName} cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-60
        ${isSelected
          ? 'border-primary bg-primary/10'
          : 'border-border bg-background hover:border-primary/40 hover:bg-primary/5'
        }`}
    >
      <div
        className={`${examOptionLabelClassName}
          ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
      >
        {label}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <ExamRichText content={content} />
      </div>
    </button>
  )
}
