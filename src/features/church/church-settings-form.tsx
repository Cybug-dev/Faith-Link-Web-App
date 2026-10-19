import { type FormEvent, useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CardHead } from '@/features/home/card-head'
import { type ApiChurch, type ChurchRole, churchApi, type RoleLabels } from './church-api'
import { CHURCH_ROLES, DEFAULT_ROLE_LABELS } from './church-roles'
import type { ChurchAction } from './use-church-action'
import './church-settings-form.scss'

type ChurchSettingsFormProps = {
  church: ApiChurch
  action: ChurchAction
  onSaved: () => void
  onClose: () => void
}

const MAX_LABEL = 40

/** Admin-only edit of the church's details and its own names for each role (names only; abilities stay). */
export function ChurchSettingsForm({ church, action, onSaved, onClose }: ChurchSettingsFormProps) {
  const id = useId()
  const [name, setName] = useState(church.name)
  const [description, setDescription] = useState(church.description ?? '')
  const [city, setCity] = useState(church.city ?? '')
  const [country, setCountry] = useState(church.country ?? '')
  const [labels, setLabels] = useState<RoleLabels>(church.roleLabels)
  const isNameValid = name.trim().length >= 2

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isNameValid) return
    const roleLabels: RoleLabels = {}
    for (const role of CHURCH_ROLES) {
      const label = labels[role]?.trim()
      if (label) roleLabels[role] = label
    }
    const saved = await action.run(
      () =>
        churchApi.updateChurch(church.id, {
          name: name.trim(),
          description: description.trim() || null,
          city: city.trim() || null,
          country: country.trim() || null,
          roleLabels,
        }),
      'Church settings saved.',
    )
    if (saved) onSaved()
  }

  const setLabel = (role: ChurchRole, value: string) => setLabels((current) => ({ ...current, [role]: value }))

  return (
    <section aria-labelledby={`${id}-heading`} className="church-settings">
      <CardHead id={`${id}-heading`} title="Church Settings" subtitle="Changes are visible to everyone in your church." />
      <form className="church-settings-form" onSubmit={handleSubmit} noValidate>
        <div className="settings-field">
          <label htmlFor={`${id}-name`}>Church name</label>
          <Input
            id={`${id}-name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!isNameValid}
            maxLength={255}
            required
          />
        </div>
        <div className="settings-field">
          <label htmlFor={`${id}-about`}>About</label>
          <textarea
            id={`${id}-about`}
            className="settings-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={2000}
          />
        </div>
        <div className="settings-pair">
          <div className="settings-field">
            <label htmlFor={`${id}-city`}>City</label>
            <Input id={`${id}-city`} value={city} onChange={(e) => setCity(e.target.value)} maxLength={100} />
          </div>
          <div className="settings-field">
            <label htmlFor={`${id}-country`}>Country</label>
            <Input id={`${id}-country`} value={country} onChange={(e) => setCountry(e.target.value)} maxLength={100} />
          </div>
        </div>

        <fieldset className="settings-roles">
          <legend>Role names</legend>
          <p className="settings-hint">
            Rename roles to fit your church (for example “Deacon” for Leader). What each role can do stays the same.
          </p>
          {CHURCH_ROLES.map((role) => (
            <div key={role} className="settings-field">
              <label htmlFor={`${id}-role-${role}`}>{DEFAULT_ROLE_LABELS[role]}</label>
              <Input
                id={`${id}-role-${role}`}
                value={labels[role] ?? ''}
                placeholder={DEFAULT_ROLE_LABELS[role]}
                onChange={(e) => setLabel(role, e.target.value)}
                maxLength={MAX_LABEL}
              />
            </div>
          ))}
        </fieldset>

        <div className="settings-buttons">
          <Button type="submit" variant="solid" disabled={!isNameValid} loading={action.isPending}>
            Save changes
          </Button>
          <Button type="button" variant="soft" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </section>
  )
}
