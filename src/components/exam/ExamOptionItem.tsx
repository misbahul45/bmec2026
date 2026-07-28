import { TipTapRenderer } from './TipTapRenderer'

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
      className={`flex w-full items-start gap-3 p-4 rounded-xl border text-left cursor-pointer transition-colors select-none disabled:cursor-not-allowed disabled:opacity-60
        ${isSelected
          ? 'border-primary bg-primary/10'
          : 'border-border bg-background hover:border-primary/40 hover:bg-primary/5'
        }`}
    >
      <div
        className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
          ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
      >
        {label}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <TipTapRenderer content={content} />
      </div>
    </button>
  )
}
