# Portfolio Main

An interactive Next.js portfolio built around a full-screen 3D scene, custom room/model components, and a separate contact flow backed by an API route and SMTP email delivery.

The repository is organized as a Turborepo. The main app lives in `apps/web`, while the root package provides workspace-level scripts that proxy through Turbo.

## What This Project Includes

- A scroll-driven 3D landing experience built with `three`, `@react-three/fiber`, and `@react-three/drei`
- Dedicated portfolio pages for projects, articles, and contact
- Custom overlay panels on the homepage for featured work
- A contact form that submits to a server-side API route and sends mail through Nodemailer
- A large asset pipeline under `public/3d` for room textures, model images, and other scene resources

## Tech Stack

- Next.js 14 with the App Router
- React 18
- TypeScript
- Tailwind CSS for styling support
- Three.js, React Three Fiber, and Drei for the 3D experience
- Nodemailer for contact email delivery
- Turborepo for workspace orchestration

## Repository Layout

```text
portfolio_main/
├── package.json
├── turbo.json
├── apps/
│   └── web/
│       ├── package.json
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   ├── api/contact/route.ts
│       │   │   ├── article/page.tsx
│       │   │   ├── contact/page.tsx
│       │   │   ├── contacts/page.tsx
│       │   │   ├── products/page.tsx
│       │   │   └── projects/page.tsx
│       │   ├── components/
│       │   ├── scenes/
│       │   ├── styles/
│       │   └── three/
│       │       ├── rooms/
│       │       └── models/
│       └── public/
│           └── 3d/
└── details_readme.md
```

## Getting Started

Install dependencies from the repository root:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

If you want to work directly inside the app package, the equivalent command is:

```bash
cd apps/web
npm run dev
```

## Available Scripts

From the repository root:

- `npm run dev` - runs the workspace development servers through Turbo
- `npm run build` - builds all workspace packages
- `npm run start` - starts production servers through Turbo
- `npm run lint` - runs linting through Turbo

From `apps/web`:

- `npm run dev` - starts the Next.js dev server
- `npm run build` - creates a production build
- `npm run start` - runs the production server
- `npm run lint` - runs Next.js linting

## Routes

Primary pages:

- `/` - interactive 3D portfolio landing page
- `/projects` - projects showcase
- `/contact` - contact form page
- `/article` - article page

Legacy or alternate routes that still exist in the app:

- `/products`
- `/contacts`

API route:

- `POST /api/contact` - validates form input and sends an email via Nodemailer

## Contact Form Configuration

The contact API requires SMTP credentials to be available in the environment.

Required variables:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

Optional variable:

- `CONTACT_FROM_EMAIL` - overrides the sender address used in outgoing mail

If any required SMTP variable is missing, the API returns a server error and the form submission will fail gracefully on the client side.

## 3D Scene Structure

The homepage uses a dynamic import for the main 3D scene to avoid server-side rendering issues. The 3D code is split into focused layers:

- `src/three/scenes` contains the scene entry points
- `src/three/rooms` contains room-level compositions such as About, Contacts, and Projects
- `src/three/models` contains reusable model assemblies for the desk, chair, wall, and related props
- `public/3d` contains the textures, images, and static assets used by those scenes

This separation keeps the scene reusable and makes it easier to optimize or replace individual room pieces without rewriting the whole portfolio.

## Notes

- The homepage is client-rendered because it depends on browser-only Three.js APIs.
- The contact page posts JSON to the API route and clears the form after a successful submission.
- Some older routes remain available for compatibility, so bookmarks and external links continue to work.

## Troubleshooting

- If the 3D scene does not load, make sure the browser supports WebGL and that the assets under `public/3d` are present.
- If contact submissions fail, verify the SMTP environment variables before checking the client form.
- If you see build issues after moving files, confirm that import paths still match the `apps/web/src` layout.

## License

No explicit license file is included in this repository.
