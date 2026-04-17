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

  const pages = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  )

  const handlePageChange = (p: number) => {
    setPage(p)

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div className="flex justify-center gap-2 mt-6 flex-wrap">
      <Button
        size="sm"
        variant="outline"
        disabled={page === 1}
        onClick={() =>
          handlePageChange(page - 1)
        }
      >
        Prev
      </Button>

      {pages.map((p) => (
        <Button
          key={p}
          size="sm"
          variant={
            p === page
              ? "default"
              : "outline"
          }
          onClick={() =>
            handlePageChange(p)
          }
        >
          {p}
        </Button>
      ))}

      <Button
        size="sm"
        variant="outline"
        disabled={page === totalPages}
        onClick={() =>
          handlePageChange(page + 1)
        }
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination