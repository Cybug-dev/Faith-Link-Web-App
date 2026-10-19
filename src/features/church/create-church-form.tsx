import { type FormEvent, useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CardHead } from '@/features/home/card-head'
import { churchApi } from './church-api'
import { slugify } from './church-roles'
import type { ChurchAction } from './use-church-action'
import './create-church-form.scss'

type CreateChurchFormProps = { action: ChurchAction; onCreated: () => void }

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Starts a church; the backend makes the creator its admin and protected primary admin. */
export function CreateChurchForm({ action, onCreated }: CreateChurchFormProps) {
  const id = useId()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [isSlugEdited, setIsSlugEdited] = useState(false)
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [description, setDescription] = useState('')

  const effectiveSlug = isSlugEdited ? slug : slugify(name)
  const isNameValid = name.trim().length >= 2
  const isSlugValid = effectiveSlug.length >= 2 && SLUG_PATTERN.test(effectiveSlug)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isNameValid || !isSlugValid) return
    const created = await action.run(
      () =>
        churchApi.createChurch({
          name: name.trim(),
          slug: effectiveSlug,
          city: city.trim() || undefined,
          country: country.trim() || undefined,
          description: description.trim() || undefined,
        }),
      `${name.trim()} is ready. You are its admin.`,
    )
    if (created) onCreated()
  }

  return (
    <section aria-labelledby={`${id}-heading`} className="create-church">
      <CardHead
        id={`${id}-heading`}
        title="Create a church"
        subtitle="Start your church’s space. You become its admin and can invite your leaders."
      />
      <form className="create-church-form" onSubmit={handleSubmit} noValidate>
        <div className="create-field">
          <label htmlFor={`${id}-name`}>Church name</label>
          <Input id={`${id}-name`} value={name} onChange={(e) => setName(e.target.value)} maxLength={255} required />
        </div>
        <div className="create-field">
          <label htmlFor={`${id}-slug`}>Web address</label>
          <Input
            id={`${id}-slug`}
            value={effectiveSlug}
            onChange={(e) => {
              setIsSlugEdited(true)
              setSlug(e.target.value.toLowerCase())
            }}
            aria-invalid={effectiveSlug.length > 0 && !isSlugValid}
            aria-describedby={`${id}-slug-hint`}
            maxLength={100}
          />
          <small id={`${id}-slug-hint`}>Lowercase letters, numbers and hyphens, e.g. grace-chapel-lagos.</small>
        </div>
        <div className="create-pair">
          <div className="create-field">
            <label htmlFor={`${id}-city`}>City</label>
            <Input id={`${id}-city`} value={city} onChange={(e) => setCity(e.target.value)} maxLength={100} />
          </div>
          <div className="create-field">
            <label htmlFor={`${id}-country`}>Country</label>
            <Input id={`${id}-country`} value={country} onChange={(e) => setCountry(e.target.value)} maxLength={100} />
          </div>
        </div>
        <div className="create-field">
          <label htmlFor={`${id}-about`}>About (optional)</label>
          <textarea
            id={`${id}-about`}
            className="create-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={2000}
          />
        </div>
        <Button type="submit" variant="solid" disabled={!isNameValid || !isSlugValid} loading={action.isPending}>
          Create church
        </Button>
      </form>
    </section>
  )
}
