import { ExamOptionItem } from './ExamOptionItem'

interface ExamOptionListProps {
  options: { label: string; content: string }[]
  selectedAnswer: string | null
  onSelect: (answer: string) => void
}

export function ExamOptionList({ options, selectedAnswer, onSelect }: ExamOptionListProps) {
  return (
    <div className="space-y-2">
      {options.map(({ label, content }) => (
        <ExamOptionItem
          key={label}
          label={label}
          content={content}
          isSelected={selectedAnswer === label}
          onClick={() => onSelect(label)}
        />
      ))}
    </div>
  )
}
