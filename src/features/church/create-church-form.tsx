import { type FormEvent, type ReactNode, useId, useState } from 'react'
import { Building2, Globe, MapPin, Rocket, ShieldCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { churchApi } from './church-api'
import { SAMPLE_LOCATIONS } from './church-page-sample-data'
import { slugify } from './church-roles'
import type { ChurchAction } from './use-church-action'
import './create-church-form.scss'

type CreateChurchFormProps = {
  action: ChurchAction
  onCreated: () => void
  onCancel: () => void
  isModal?: boolean
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const COUNTRIES = Object.keys(SAMPLE_LOCATIONS)

function FieldLabel({ htmlFor, children, isRequired = false, aside }: { htmlFor: string; children: ReactNode; isRequired?: boolean; aside?: string }) {
  return (
    <div className="create-label-row">
      <label htmlFor={htmlFor} className="create-label">
        {children}
        {isRequired && (
          <span aria-hidden className="create-required">
            {' '}*
          </span>
        )}
      </label>
      {aside && <span className="create-aside">{aside}</span>}
    </div>
  )
}

/** Starts a church (Stitch "Plant or register"); the backend makes the creator its admin and protected primary admin. */
export function CreateChurchForm({ action, onCreated, onCancel, isModal = false }: CreateChurchFormProps) {
  const id = useId()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [isSlugEdited, setIsSlugEdited] = useState(false)
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [description, setDescription] = useState('')

  const effectiveSlug = isSlugEdited ? slug : slugify(name)
  const isNameValid = name.trim().length >= 2
  const isSlugValid = effectiveSlug.length >= 2 && SLUG_PATTERN.test(effectiveSlug)
  const cities = SAMPLE_LOCATIONS[country] ?? []
  const canSubmit = isNameValid && isSlugValid && country !== '' && city !== ''

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return
    const created = await action.run(
      () =>
        churchApi.createChurch({
          name: name.trim(),
          slug: effectiveSlug,
          city,
          country,
          description: description.trim() || undefined,
        }),
      `${name.trim()} is ready. You are its admin.`,
    )
    if (created) onCreated()
  }

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className={isModal ? 'create-church create-church-modal-content' : 'create-church'}
    >
      <div className="create-head">
        <div className="create-head-text">
          <div className="create-title-row">
            <span aria-hidden className="create-title-icon">
              <Building2 />
            </span>
            <h2 id={`${id}-heading`} className="create-title">
              Plant or register a church
            </h2>
          </div>
          <p className="create-subtitle">
            Set up your church’s space on FaithLink. You become its admin and can invite your pastors, leaders and
            members.
          </p>
        </div>
        <button type="button" className="create-cancel" onClick={onCancel}>
          <X aria-hidden className="create-cancel-icon" />
          Cancel
        </button>
      </div>

      <form className="create-church-form" onSubmit={handleSubmit} noValidate>
        <div className="create-pair">
          <div className="create-field">
            <FieldLabel htmlFor={`${id}-name`} isRequired>
              Church name
            </FieldLabel>
            <Input
              id={`${id}-name`}
              className="create-input"
              placeholder="e.g. Living Word Tabernacle"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={255}
              required
            />
          </div>
          <div className="create-field">
            <FieldLabel htmlFor={`${id}-slug`} isRequired>
              Web address
            </FieldLabel>
            <div className="create-slug">
              <span aria-hidden className="create-slug-prefix">
                faithlink.org/church/
              </span>
              <input
                id={`${id}-slug`}
                className="create-slug-input"
                placeholder="living-word-lagos"
                value={effectiveSlug}
                onChange={(e) => {
                  setIsSlugEdited(true)
                  setSlug(e.target.value.toLowerCase())
                }}
                aria-invalid={effectiveSlug.length > 0 && !isSlugValid}
                aria-describedby={`${id}-slug-hint`}
                maxLength={100}
              />
            </div>
            <small id={`${id}-slug-hint`} className="create-hint">
              Lowercase letters, numbers and hyphens.
            </small>
          </div>
        </div>

        <div className="create-pair">
          <div className="create-field">
            <FieldLabel htmlFor={`${id}-country`} isRequired>
              Country
            </FieldLabel>
            <div className="create-select">
              <Globe aria-hidden className="create-select-icon" />
              <Select
                id={`${id}-country`}
                className="create-select-field"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value)
                  setCity('')
                }}
                required
              >
                <option value="" disabled>
                  Choose a country
                </option>
                {COUNTRIES.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </Select>
            </div>
          </div>
          {/* Opens once a country is chosen, as Stitch shows it waiting. */}
          <div className={country ? 'create-field create-field-ready' : 'create-field create-field-waiting'}>
            <FieldLabel htmlFor={`${id}-city`} isRequired>
              City
            </FieldLabel>
            <div className="create-select">
              <MapPin aria-hidden className="create-select-icon" />
              <Select
                id={`${id}-city`}
                className="create-select-field"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!country}
                required
              >
                <option value="" disabled>
                  {country ? 'Choose a city' : 'Choose a country first'}
                </option>
                {cities.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <div className="create-field">
          <FieldLabel htmlFor={`${id}-about`} aside="Optional">
            About
          </FieldLabel>
          <textarea
            id={`${id}-about`}
            className="create-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={2000}
          />
        </div>

        <div className="create-footer">
          <p className="create-note">
            <ShieldCheck aria-hidden className="create-note-icon" />
            You become the church’s admin and can invite your leaders.
          </p>
          <div className="create-actions">
            <Button type="button" variant="ghost" className="create-footer-cancel" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="create-submit" disabled={!canSubmit} loading={action.isPending}>
              <Rocket aria-hidden className="create-submit-icon" />
              Create church
            </Button>
          </div>
        </div>
      </form>
    </section>
  )
}
