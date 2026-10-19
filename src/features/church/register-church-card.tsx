import { Store } from 'lucide-react'
import './register-church-card.scss'

/** Stitch mobile "Register your congregation": opens the create form in its place. */
export function RegisterChurchCard({ onStart }: { onStart: () => void }) {
  return (
    <section aria-labelledby="register-church-heading" className="register-church">
      <span aria-hidden className="register-icon">
        <Store />
      </span>
      <div className="register-text">
        <h2 id="register-church-heading" className="register-title">
          Register your church
        </h2>
        <p className="register-subtitle">Create your church’s home, manage devotionals and members.</p>
      </div>
      <button type="button" className="register-start" onClick={onStart}>
        Start setup
      </button>
    </section>
  )
}
