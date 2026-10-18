import { type FormEvent, useId } from 'react'
import { useComingSoon } from '@/components/coming-soon/coming-soon-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CardHead } from '@/features/home/card-head'
import './join-church-card.scss'

export function JoinChurchCard() {
  const showComingSoon = useComingSoon()
  const inputId = useId()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    showComingSoon('Joining a church')
  }

  return (
    <section aria-labelledby="join-church-heading" className="join-church">
      <CardHead
        id="join-church-heading"
        title="Join a Church"
        subtitle="Have an invitation code? Join your church and start connecting with your community."
      />
      <form className="join-church-form" onSubmit={handleSubmit}>
        <label htmlFor={inputId} className="join-church-label">
          Invitation code
        </label>
        <div className="join-church-field">
          <Input id={inputId} name="code" placeholder="Enter invitation code" autoComplete="off" />
        </div>
        <Button type="submit" variant="solid">
          Join Church
        </Button>
      </form>
    </section>
  )
}
