import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { cn } from "~/lib/utils"

interface Question {
  id: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  optionE: string
  correctAnswer: string
}

interface Props {
  data: Question
  number: number
}

const QuestionCard = ({ data, number }: Props) => {
  const options = [
    { key: "A", value: data.optionA },
    { key: "B", value: data.optionB },
    { key: "C", value: data.optionC },
    { key: "D", value: data.optionD },
    { key: "E", value: data.optionE },
  ]

  return (
    <Card className="rounded-lg border">
      <CardHeader>
        <CardTitle className="prose max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: `<strong>${number}.</strong> ${data.question}`,
            }}
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {options.map((opt) => (
          <div
            key={opt.key}
            className={cn(
              "p-2 rounded-md border prose max-w-none",
              opt.key === data.correctAnswer &&
                "bg-green-100 border-green-400 text-green-700"
            )}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: `<strong>${opt.key}.</strong> ${opt.value}`,
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default QuestionCard