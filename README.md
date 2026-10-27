RooDeet.app

RooDeet is a learning, assessment and educational analytics platform that helps learners identify learning gaps, practise deliberately, measure improvement and receive targeted learning support.

Learning Cycle

Assess → Analyse → Learn → Practise → Reassess → Improve → Repeat

RooDeet is designed around one central question:

«What should this learner do next to improve?»

Current Development Milestone

Feature 1 — User Login & Learner Profile

Feature 1 establishes the learner's protected RooDeet identity.

It includes:

- React + TypeScript + Vite application foundation
- Supabase email/password authentication
- Authenticated session persistence
- Learner profile loading
- PostgreSQL Row Level Security
- Learner-only profile access
- Student account provisioning
- Authentication validation tests
- Authentication architecture documentation

Authentication documentation:

"docs/AUTHENTICATION.md"

Feature 1 Authentication Flow

Student
   ↓
Enters email + password
   ↓
RooDeet Login Page
   ↓
Supabase Auth
   ↓
Credentials verified
   ↓
Authenticated session created
   ↓
JWT access token
   ↓
RooDeet requests learner profile
   ↓
PostgreSQL Row Level Security
   ↓
auth.uid() matches learner?
   │
   ├── YES → Return learner data
   │
   └── NO  → Deny access

Technology Stack

- React
- TypeScript
- Vite
- Supabase Auth
- PostgreSQL
- Supabase Row Level Security

Local Development

Install the project dependencies:

npm install

Create a local environment file named:

.env.local

Add your Supabase project configuration:

VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY

Run the authentication tests:

npm test

Run the project structure check:

npm run check

Start the RooDeet development server:

npm run dev

Security

- Never commit ".env.local".
- Never place Supabase secret or service-role keys in frontend code.
- Learner passwords are handled by Supabase Auth.
- RooDeet does not store learner passwords in its profile tables.
- Database access is protected by PostgreSQL Row Level Security.
- Learners can only access authorised data.
- Use fictional learner data during development and testing.

MVP Build Order

1. User Login & Learner Profile
2. Baseline Assessment
3. Assessment Scoring & Storage
4. Learning-Gap Detection
5. Learning Activity Assignment
6. Practical Activity
7. Follow-up Assessment
8. Progress Comparison
9. Recommendation Engine

Next Feature

Feature 2 — Baseline Assessment

Feature 2 will establish the learner's starting point through curriculum-linked assessment before RooDeet identifies learning gaps and recommends targeted support.

---

RooDeet

LEARN • PRACTISE • IMPROVE
