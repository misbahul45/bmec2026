import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toggleHome = (pathName: string, href: string) => {
    return pathName === '/' ? href : '/' + href
  }