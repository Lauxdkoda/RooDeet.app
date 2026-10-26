-- RooDeet Feature 1: Authentication + learner profile
-- Apply this migration to the RooDeet Supabase project before using live authentication.

create type public.user_role as enum ('student', 'teacher', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.learner_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  class_name text,
  subject text,
  school_name text,
  assigned_curriculum text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.learner_profiles enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.learner_profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant select on table public.learner_profiles to authenticated;

create policy "Learners can view their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = id);

create policy "Learners can view their own learner profile"
on public.learner_profiles
for select
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create or replace function public.handle_new_roodeet_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1), 'Learner'),
    'student'
  );

  insert into public.learner_profiles (
    user_id,
    class_name,
    subject,
    school_name,
    assigned_curriculum
  ) values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'class_name', ''),
    nullif(new.raw_user_meta_data ->> 'subject', ''),
    nullif(new.raw_user_meta_data ->> 'school_name', ''),
    nullif(new.raw_user_meta_data ->> 'assigned_curriculum', '')
  );

  return new;
end;
$$;

revoke all on function public.handle_new_roodeet_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_roodeet_user();

comment on table public.profiles is 'RooDeet application identity. Privileged roles must be provisioned by trusted administration, never self-selected by a browser client.';
comment on table public.learner_profiles is 'Learner-specific educational assignment data for Feature 1.';
