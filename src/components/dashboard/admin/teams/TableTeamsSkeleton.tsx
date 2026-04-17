'use client'

import React from 'react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "~/components/ui/table"

import { Skeleton } from '~/components/ui/skeleton'

const TableTeamsSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Sekolah/Universitas</TableHead>
              <TableHead>Kompetisi</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Abstract</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                
                {/* No */}
                <TableCell>
                  <Skeleton className="h-4 w-6" />
                </TableCell>

                {/* Team */}
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </TableCell>

                {/* Sekolah */}
                <TableCell>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </TableCell>

                {/* Kompetisi */}
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>

                {/* Member */}
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>

                {/* Document */}
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-md" />
                </TableCell>

                {/* Abstract */}
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-md" />
                </TableCell>

                {/* Created */}
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>

                {/* Action */}
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  )
}

export default TableTeamsSkeleton