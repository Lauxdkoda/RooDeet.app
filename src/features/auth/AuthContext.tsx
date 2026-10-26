import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { normalizeEmail, validateCredentials } from '../../lib/authRules'
import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import type { LearnerProfile, Profile } from '../../types/domain'

type AuthContextValue = {
  configured: boolean
  session: Session | null
  profile: Profile | null
  learnerProfile: LearnerProfile | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSessionLoading(false)
      return
    }

    let active = true

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return
      if (sessionError) setError(sessionError.message)
      setSession(data.session)
      setSessionLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setError(null)
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadLearnerIdentity() {
      if (!session?.user.id) {
        setProfile(null)
        setLearnerProfile(null)
        return
      }

      setProfileLoading(true)
      setError(null)

      const [profileResult, learnerResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('learner_profiles').select('*').eq('user_id', session.user.id).single(),
      ])

      if (cancelled) return

      if (profileResult.error) {
        setError('Your RooDeet profile could not be loaded.')
        setProfileLoading(false)
        return
      }

      if (profileResult.data.role !== 'student') {
        setError('Feature 1 currently supports student accounts only.')
        setProfileLoading(false)
        return
      }

      if (learnerResult.error) {
        setError('Your learner profile could not be loaded.')
        setProfileLoading(false)
        return
      }

      setProfile(profileResult.data as Profile)
      setLearnerProfile(learnerResult.data as LearnerProfile)
      setProfileLoading(false)
    }

    void loadLearnerIdentity()

    return () => {
      cancelled = true
    }
  }, [session?.user.id])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured yet. Add the environment variables first.')
      return false
    }

    const validation = validateCredentials(email, password)
    if (!validation.valid) {
      setError(validation.message)
      return false
    }

    setError(null)
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    })

    if (signInError || !data.session) {
      setError('Email or password is incorrect.')
      return false
    }

    setSession(data.session)
    return true
  }, [])

  const signOut = useCallback(async () => {
    setError(null)
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      setError(signOutError.message)
      return
    }
    setSession(null)
    setProfile(null)
    setLearnerProfile(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      configured: isSupabaseConfigured,
      session,
      profile,
      learnerProfile,
      loading: sessionLoading || profileLoading,
      error,
      signIn,
      signOut,
    }),
    [session, profile, learnerProfile, sessionLoading, profileLoading, error, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
