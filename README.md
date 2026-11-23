# SchoolOS — Premium School PWA Starter

A premium, responsive school-management PWA prototype based on the supplied School PWA Master Blueprint.

## Included
- Five role workspaces: Principal, Incharge, Teacher, Office Staff, Parent
- Responsive premium dashboard UI, mobile navigation, light/dark theme
- Role-based menus and demo login role selector
- Overview cards, recent activity, quick actions
- Approval workflow (approve/reject), notice board and local PNG poster generation
- Diary, attendance, staff, students, fees, bus routes, exam schedule/marks, calendar, leave, events and Smart Learning sample modules
- Add-record modal, search, CSV export, local browser persistence
- Parent children switcher and Telugu-language toggle control
- PWA manifest and basic service worker
- GI Creative Space footer and WhatsApp contact link

## Run locally
Requirements: Node.js 18.18+ (Node 20 LTS recommended).

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Demo access
The sign-in page is a UI demo. Enter any mobile number and PIN, choose a role, and continue. No credentials are verified.

## Important: Supabase is intentionally NOT connected
This repository is a frontend-first functional prototype. Data is stored in the current browser using localStorage. It is suitable for UI review and workflow discussion only.

Before real school use, the next phase must implement:
1. Supabase Auth with secure account provisioning and password/PIN reset.
2. PostgreSQL schema, migrations, indexes, constraints and Row Level Security.
3. Server-side authorization and role/class/parent-child access checks.
4. Auditable approval and fee transactions.
5. Secure student data handling, backup and recovery.
6. Proper file/photo strategy and external link validation.
7. Production hosting, monitoring and privacy/security review.

The DOB arithmetic PIN scheme from the blueprint is not implemented because it is not safe for real authentication. Do not enter real student or staff personal data in this demo.

## Notes
- Sample records and dates are fictional/demo content.
- Some modules are represented by a reusable record-management interface and need workflow-specific forms and validation in the implementation phase.
- CSV export and poster generation run locally in the browser.
- The service worker is a starter cache only, not a complete offline data-sync strategy.

## Project layout
```text
school-pwa/
├── public/
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── data/seed.ts
│   ├── lib/storage.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
