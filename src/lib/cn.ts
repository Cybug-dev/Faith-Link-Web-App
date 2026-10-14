import { clsx, type ClassValue } from 'clsx'

/**
 * Joins class names. Deliberately clsx only: tailwind-merge can't see our custom
 * `text-*` role classes (typography.css) and would drop them as colour clashes.
 * Overrides go through component variants, not className fights.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
