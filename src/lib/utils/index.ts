import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { notFound } from "@tanstack/react-router"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toggleHome = (pathName: string, href: string) => {
    return pathName === '/' ? href : '/' + href
}


export const mapCompetitionToEducation = (type: string) => {
  switch (type) {
    case "OLIMPIADE":
      return "SMA"
    case "LKTI":
      return "MAHASISWA"
    case "INFOGRAFIS":
      return "SMA"
    default:
      return "SMA"
  }
}


export function assertFound<T>(
  value: T | null | undefined
): T {
  if (!value) throw notFound()
  return value
}
