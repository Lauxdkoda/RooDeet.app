import { initialsFromName } from '../../lib/authRules'
import { useAuth } from '../auth/AuthContext'

function valueOrFallback(value: string | null) {
  return value?.trim() || 'Not assigned yet'
}

export function LearnerProfilePage() {
  const { profile, learnerProfile, error, signOut } = useAuth()

  if (!profile || !learnerProfile) {
    return (
      <main className="center-state">
        <div className="spinner" aria-hidden="true" />
        <p>{error || 'Loading your learner profile…'}</p>
      </main>
    )
  }

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <span className="logo">RooDeet</span>
          <span className="tagline">LEARN • PRACTISE • IMPROVE</span>
        </div>
        <button className="secondary-button" type="button" onClick={() => void signOut()}>Sign out</button>
      </header>

      <section className="profile-hero">
        <div className="avatar" aria-hidden="true">{initialsFromName(profile.full_name)}</div>
        <div>
          <p className="eyebrow blue">LEARNER PROFILE</p>
          <h1>{profile.full_name}</h1>
          <p className="muted">Your RooDeet identity and assigned learning context.</p>
        </div>
      </section>

      <section className="profile-grid" aria-label="Learner details">
        <article className="info-card"><span>Class</span><strong>{valueOrFallback(learnerProfile.class_name)}</strong></article>
        <article className="info-card"><span>Subject</span><strong>{valueOrFallback(learnerProfile.subject)}</strong></article>
        <article className="info-card"><span>School</span><strong>{valueOrFallback(learnerProfile.school_name)}</strong></article>
        <article className="info-card"><span>Curriculum</span><strong>{valueOrFallback(learnerProfile.assigned_curriculum)}</strong></article>
      </section>

      <section className="next-step-card">
        <div>
          <p className="eyebrow teal">NEXT STEP</p>
          <h2>Baseline Assessment</h2>
          <p>Feature 2 will establish your starting point and identify the first learning gaps RooDeet should address.</p>
        </div>
        <button type="button" disabled>Coming next</button>
      </section>

      {error && <p className="error dashboard-error" role="alert">{error}</p>}
    </main>
  )
}
