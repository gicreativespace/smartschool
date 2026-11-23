-- SmartSchool Master: initial per-school database foundation.
-- Every school copy gets a separate Supabase project. There is intentionally
-- no school_id column and no cross-school connection in this schema.

create extension if not exists pgcrypto;

do $$ begin
  create type public.school_role as enum ('principal', 'incharge', 'teacher', 'office', 'parent');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  mobile text,
  role public.school_role not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academic_years (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  starts_on date not null,
  ends_on date not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  constraint academic_year_dates_valid check (ends_on > starts_on)
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete restrict,
  name text not null,
  class_teacher_id uuid references public.profiles(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (class_id, name)
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  admission_number text not null unique,
  full_name text not null,
  date_of_birth date,
  gender text,
  section_id uuid references public.sections(id) on delete set null,
  admission_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.parent_student (
  parent_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  relationship text not null default 'Parent',
  created_at timestamptz not null default now(),
  primary key (parent_id, student_id)
);

create table if not exists public.staff (
  id uuid primary key references public.profiles(id) on delete cascade,
  employee_number text unique,
  designation text,
  joining_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  attendance_date date not null,
  status text not null check (status in ('present', 'absent', 'late', 'leave')),
  marked_by uuid not null references public.profiles(id) on delete restrict,
  remarks text,
  created_at timestamptz not null default now(),
  unique (student_id, attendance_date)
);

create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete cascade,
  subject text,
  entry_date date not null default current_date,
  classwork text,
  homework text,
  created_by uuid not null references public.profiles(id) on delete restrict,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text not null default 'school',
  section_id uuid references public.sections(id) on delete set null,
  created_by uuid not null references public.profiles(id) on delete restrict,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'published')),
  published_at timestamptz,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid not null references public.profiles(id) on delete cascade,
  submission_type text not null,
  title text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sections_class_id_idx on public.sections(class_id);
create index if not exists students_section_id_idx on public.students(section_id);
create index if not exists attendance_date_idx on public.attendance(attendance_date);
create index if not exists attendance_student_date_idx on public.attendance(student_id, attendance_date);
create index if not exists diary_section_date_idx on public.diary_entries(section_id, entry_date);
create index if not exists notices_status_created_idx on public.notices(status, created_at desc);
create index if not exists submissions_owner_status_idx on public.submissions(submitted_by, status);

-- Enable Row Level Security everywhere. Policies are intentionally deny-by-default
-- until role-specific access rules are added and tested for each module.
alter table public.profiles enable row level security;
alter table public.academic_years enable row level security;
alter table public.classes enable row level security;
alter table public.sections enable row level security;
alter table public.students enable row level security;
alter table public.parent_student enable row level security;
alter table public.staff enable row level security;
alter table public.attendance enable row level security;
alter table public.diary_entries enable row level security;
alter table public.notices enable row level security;
alter table public.submissions enable row level security;

-- A signed-in user can read only their own profile. Account creation and role
-- assignment will be performed through a trusted admin workflow, not public signup.
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));
