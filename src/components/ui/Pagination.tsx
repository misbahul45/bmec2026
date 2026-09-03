'use client'

import React from "react"
import { Button } from "~/components/ui/button"

interface Props {
  page: number
  totalPages: number
  setPage: (page: number) => void
}

const Pagination: React.FC<Props> = ({
  page,
  totalPages,
  setPage,
}) => {
  if (totalPages <= 1) return null

  const handlePageChange = (p: number) => {
    const clamped = Math.max(1, Math.min(p, totalPages))
    setPage(clamped)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const getPageRange = () => {
    const delta = 1
    const range: (number | '...')[] = []
    const left = Math.max(2, page - delta)
    const right = Math.min(totalPages - 1, page + delta)

    range.push(1)

    if (left > 2) {
      range.push('...')
    }

    for (let i = left; i <= right; i++) {
      range.push(i)
    }

    if (right < totalPages - 1) {
      range.push('...')
    }

    if (totalPages > 1) {
      range.push(totalPages)
    }

    return range
  }

  const pages = getPageRange()

  return (
    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
      <Button
        size="sm"
        variant="outline"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        Prev
      </Button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm">
            ...
          </span>
        ) : (
          <Button
            key={p}
            size="sm"
            variant={p === page ? "default" : "outline"}
            onClick={() => handlePageChange(p)}
          >
            {p}
          </Button>
        ),
      )}

      <Button
        size="sm"
        variant="outline"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination