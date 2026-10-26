import { access } from 'node:fs/promises'

const required = [
  '.env.example',
  'src/lib/supabase.ts',
  'src/features/auth/AuthContext.tsx',
  'src/features/auth/LoginPage.tsx',
  'src/features/profile/LearnerProfilePage.tsx',
  'supabase/migrations/001_feature_1_auth_and_learner_profile.sql',
  'docs/AUTHENTICATION.md',
]

const missing = []
for (const path of required) {
  try {
    await access(path)
  } catch {
    missing.push(path)
  }
}

if (missing.length) {
  console.error(`Missing required Feature 1 files:\n${missing.join('\n')}`)
  process.exit(1)
}

console.log(`Feature 1 structure check passed (${required.length} required files).`)
