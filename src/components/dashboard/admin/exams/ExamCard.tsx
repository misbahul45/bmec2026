import React, { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card"
import { Calendar, Flag, ArrowRight } from "lucide-react"
import { ExamWithStage } from "~/types/exam.type"
import { Link } from "@tanstack/react-router"
import { Badge } from "~/components/ui/badge"

type Props = {
  exam: ExamWithStage
}

const ExamCard: React.FC<Props> = ({ exam }) => {
  const [open, setOpen] = useState(false)

  const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date

    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <Card
      onClick={() => setOpen(!open)}
      className="cursor-pointer transition-all hover:shadow-2xl hover:opacity-90  rounded-md shadow-xl"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{exam.title}</CardTitle>
          <Badge variant={exam.type==='OLYMPIAD'?'default':'secondary'} className="rounded">{exam.type}</Badge>
        </div>
        <CardDescription>{exam.stage.name}</CardDescription>
      </CardHeader>

      <CardContent>
        <div
          className={`flex gap-2 text-xs transition-all duration-300 ${
            open ? "flex-row flex-wrap" : "flex-col"
          }`}
        >
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(exam.startDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(exam.endDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Flag size={14} />
            <span>{exam.stage.name}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-end gap-3">
        <Link
          to="/dashboard/admin/exams/$examId/reviews"
          params={{ examId: exam.id }}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          Lihat Hasil
          <ArrowRight size={14} />
        </Link>
        <Link
          to="/dashboard/admin/exams/$examId"
          params={{ examId: exam.id }}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Buat soal
          <ArrowRight size={14} />
        </Link>
      </CardFooter>
    </Card>
  )
}

export default ExamCard