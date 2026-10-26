import { useState, type FormEvent } from 'react'
import { useAuth } from './AuthContext'

export function LoginPage() {
  const { configured, error, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    await signIn(email, password)
    setSubmitting(false)
  }

  return (
    <main className="auth-shell">
      <section className="brand-panel" aria-label="RooDeet introduction">
        <div>
          <p className="eyebrow">ROODEET</p>
          <h1>Learn. Practise. Improve.</h1>
          <p className="brand-copy">
            Know where you are, understand what needs attention, and take the next step with purpose.
          </p>
        </div>
        <p className="brand-note">Learning • Assessment • Analytics</p>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <p className="eyebrow blue">STUDENT ACCESS</p>
          <h2>Welcome back</h2>
          <p className="muted">Sign in to continue your RooDeet learning journey.</p>

          {!configured && (
            <div className="notice" role="status">
              Supabase is not configured. Copy <code>.env.example</code> to <code>.env.local</code> and add your project values.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="student@example.com"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              required
            />

            {error && <p className="error" role="alert">{error}</p>}

            <button type="submit" disabled={submitting || !configured}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="security-note">Your password is handled by Supabase Auth and is not stored in the RooDeet application database.</p>
        </div>
      </section>
    </main>
  )
}
