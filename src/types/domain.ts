export type UserRole = 'student' | 'teacher' | 'admin'

export interface Profile {
  id: string
  full_name: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface LearnerProfile {
  user_id: string
  class_name: string | null
  subject: string | null
  school_name: string | null
  assigned_curriculum: string | null
  created_at: string
  updated_at: string
}
