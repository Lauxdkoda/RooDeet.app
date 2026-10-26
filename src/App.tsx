import { useAuth } from './features/auth/AuthContext'
import { LoginPage } from './features/auth/LoginPage'
import { LearnerProfilePage } from './features/profile/LearnerProfilePage'

export default function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <main className="center-state">
        <div className="spinner" aria-hidden="true" />
        <p>Preparing RooDeet…</p>
      </main>
    )
  }

  return session ? <LearnerProfilePage /> : <LoginPage />
}
