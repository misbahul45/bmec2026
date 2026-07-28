import { ExamOptionItem } from './ExamOptionItem'

interface ExamOptionListProps {
  options: { label: string; content: string }[]
  selectedAnswer: string | null
  onSelect: (answer: string) => void
  disabled?: boolean
}

export function ExamOptionList({ options, selectedAnswer, onSelect, disabled = false }: ExamOptionListProps) {
  return (
    <div className="space-y-2" role="radiogroup" aria-label="Pilihan jawaban">
      {options.map(({ label, content }) => (
        <ExamOptionItem
          key={label}
          label={label}
          content={content}
          isSelected={selectedAnswer === label}
          onClick={() => onSelect(label)}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
