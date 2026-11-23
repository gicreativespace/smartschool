# Supabase setup

This folder contains the database migrations for one independent school's Supabase project.

## Important architecture rule
- One school repository copy = one Supabase project.
- Never add cross-school data sharing or a shared school registry.
- Do not add a `school_id` column to this single-school database.
- Each school copy has its own Auth users, database and Storage.

## Apply migrations
1. Create a new Supabase project for the school.
2. Open the project's SQL Editor.
3. Run the SQL files in `migrations/` in filename order.
4. Configure the frontend environment variables using the project's URL and anon key.

The initial migration enables Row Level Security on every table. Most tables intentionally have no access policies yet, so they remain inaccessible until the matching role-specific policies are designed and tested. Do not disable RLS to make the app work.
