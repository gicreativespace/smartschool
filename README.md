# SmartSchool Master

Reusable school management and communication PWA. The current demo identity is **Sri Viswa Educational Institutions**.

## Master architecture
- One master repository is copied into a separate repository for each school.
- Each school copy connects to its own independent Supabase project (Auth, database and Storage).
- There is no shared database, school registry, or school-to-school data connection.
- Keep school-specific identity in `src/config/school.config.ts`.
- Keep each deployment's Supabase URL and anon key in environment variables; never commit secrets.

## Current application
- React + Vite + TypeScript.
- Five demo workspaces: Principal, Incharge, Teacher, Office Staff and Parent.
- Responsive dashboard and role-specific navigation.
- Fictional demo records are stored locally in the browser for UI review.
- Supabase client foundation and initial database migration are prepared, but authentication and live data workflows are not connected yet.

## Run locally
Requirements: Node.js 20 LTS recommended.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app can still run in demo mode without Supabase credentials. To connect a school project, fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the local environment or deployment environment settings.

## Database setup
See [supabase/README.md](supabase/README.md). Apply migrations in order to a new, dedicated Supabase project for that school.

The initial migration creates the core school tables and enables Row Level Security. Policies are deny-by-default except a user's own profile read. This is intentional: do not use real student data until role-specific policies, account provisioning and workflows have been implemented and tested.

## Demo data and privacy
All names and records in the prototype are fictional examples. Do not enter real student, parent or staff personal information until authentication, access controls, privacy review and backup/recovery are complete.

## School branding
Edit `src/config/school.config.ts` when making a new school copy. Replace the demo name, short name, initials, location, academic year, logo path and theme as needed. The Sri Viswa logo image itself still needs to be placed in the repository's public assets when the approved image file is available.

## Development workflow
- `main`: stable published version.
- `master-development`: current development branch.
- Test changes on the development branch before merging them into `main`.
