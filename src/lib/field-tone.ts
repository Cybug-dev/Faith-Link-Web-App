import type { FieldMessageTone } from '@/components/ui/form-field'

/**
 * Live validation shows guidance while someone is still typing in a field, and
 * only becomes an error once they've left that field or tried to submit.
 */
export function fieldTone(touched: boolean | undefined, submitted: boolean): FieldMessageTone {
  return touched || submitted ? 'error' : 'guide'
}
