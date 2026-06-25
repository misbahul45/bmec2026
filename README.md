
<p align="center">
  <picture>
    <img alt="BMEC 2026" src="/logo.png" width="120" height="120">
  </picture>
</p>

<h1 align="center">BMEC 2026</h1>

<p align="center">
  <strong>Biomedical Engineering Competition — Universitas Airlangga</strong>
  <br />
  Platform kompetisi Teknik Biomedis tingkat nasional dengan 3 cabang lomba:
  <em>Olimpiade, LKTI, dan Infografis</em>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react-19.x-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/tanstack_start-1.x-FF4154?logo=react" alt="TanStack Start">
  <img src="https://img.shields.io/badge/prisma-7.x-2D3748?logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/tailwind-4.x-06B6D4?logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/typescript-6.x-3178C6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/pnpm-10.x-F69220?logo=pnpm" alt="pnpm">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>

---

## Features

| Feature | Description |
|---------|-------------|
| **Landing Page** | Hero, About, Benefits, Timeline, Competition Details, Gallery (3D), FAQ, CTA |
| **Team Registration** | Multi-step registration form with mentor, members, document upload, competition selection |
| **Competition Types** | Olimpiade (multiple-choice exam), LKTI (paper submission), Infografis (infographic submission) |
| **Online Exam System** | Proctored exam with anti-cheat detection, timer, device verification, doubt marking |
| **Admin Dashboard** | Overview, teams management, exams CRUD, submissions review, scoreboard, batch management |
| **Team Dashboard** | Profile, mentor/member management, stage tracking, exam access, submission upload, invoice |
| **Exam Review** | Post-exam review with answer key, score breakdown, and difficulty badges |
| **Leaderboards** | Per-exam ranking, per-competition leaderboard |
| **Payment Flow** | Registration batch with pricing, payment proof upload, approve/reject, invoice PDF generation |
| **Role System** | Admin and Team roles with route-based authorization |
| **Dark Mode** | Full dark mode support with custom oklch color palette |

---

## Screenshots

<!-- TODO: Add actual screenshots -->
| Landing Page | Auth | Dashboard |
|:---:|:---:|:---:|
| _coming soon_ | _coming soon_ | _coming soon_ |
| Exam | Admin Dashboard | Invoice |
| _coming soon_ | _coming soon_ | _coming soon_ |

---

## Tech Stack

### Frontend

| Library | Purpose |
|---------|---------|
| [React 19](https://react.dev/) | UI framework |
| [TanStack Router](https://tanstack.com/router) | File-based routing with SSR integration |
| [TanStack Query](https://tanstack.com/query) | Server state management & caching |
| [TanStack Start](https://tanstack.com/start) | Full-stack React framework (SSR, server functions) |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS with CSS-first configuration |
| [Radix UI](https://www.radix-ui.com/) | Accessible UI primitives |
| [shadcn/ui](https://ui.shadcn.com/) | Component design system |
| [GSAP](https://gsap.com/) | Animation library |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | 3D rendering for gallery |
| [Recharts](https://recharts.org/) | Charting library |
| [TipTap](https://tiptap.dev/) | Rich text editor (ProseMirror-based) |
| [React Hook Form](https://react-hook-form.com/) | Form management |
| [Zod](https://zod.dev/) | Schema validation |
| [Sonner](https://sonner.emilkowal.ski/) | Toast notifications |
| [Phosphor Icons](https://phosphoricons.com/) | Icon library |

### Backend

| Library | Purpose |
|---------|---------|
| [Prisma](https://prisma.io/) | ORM with PostgreSQL |
| [TanStack Start Server Functions](https://tanstack.com/start) | Server-side logic |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Password hashing |
| [Better Auth (Session)](https://github.com/nicnocquee/start-authjs) | Session-based authentication |
| [ImageKit](https://imagekit.io/) | File/image upload management |
| [jsPDF](https://github.com/parallax/jsPDF) | PDF invoice generation |
| [xlsx](https://sheetjs.com/) | Excel export |

### Infrastructure

| Tool | Purpose |
|------|---------|
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [pnpm](https://pnpm.io/) | Package manager |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Husky](https://typicode.github.io/husky/) | Git hooks |
| [PostgreSQL](https://www.postgresql.org/) | Database |
| [Prisma](https://prisma.io/) | Migration & schema management |

---

## Architecture

### High-Level Architecture

```mermaid
graph TB
    A[Browser / Client] --> B[Vite Dev Server / Nitro Production Server]
    B --> C[TanStack Start SSR]
    C --> D[Server Functions]
    D --> E[Service Layer]
    E --> F[Repository Layer]
    F --> G[Prisma ORM]
    G --> H[PostgreSQL]

    D --> I[Middleware Auth]
    I --> D

    C --> J[TanStack Query Client]
    J --> K[Server Functions]
    K --> D

    subgraph "Frontend"
        A
    end

    subgraph "Server"
        C
        D
        I
        E
        F
        G
    end

    subgraph "Database"
        H
    end
```

### File-Based Routing

```mermaid
graph LR
    A[routes/] --> B[__root.tsx]
    A --> C[index.tsx]
    A --> D[auth/]
    A --> E[dashboard/]

    D --> F[login.tsx]
    D --> G[register/]

    G --> H[index.tsx]
    G --> I[$teamId/index.tsx]
    G --> J[$teamId/completed.tsx]

    E --> K[_authed.tsx]
    K --> L[admin/]
    K --> M[team/]

    L --> N[index.tsx]
    L --> O[teams/]
    L --> P[exams/]
    L --> Q[submissions/]
    L --> R[scoreboard/]
    L --> S[competitions/]

    M --> T[index.tsx]
    M --> U[exam/$examId/index.tsx]
    M --> V[exam/$examId/review.tsx]
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant RouteGuard
    participant Session
    participant Auth
    participant Database

    User->>RouteGuard: Access protected route
    RouteGuard->>Session: Check session cookie
    Session->>RouteGuard: Return session data or null

    alt No session
        RouteGuard->>User: Redirect to /auth/login
    else Session exists
        RouteGuard->>Auth: fetchUser()
        Auth->>Database: Lookup team/admin
        Database->>Auth: Return user data
        Auth->>RouteGuard: Return user + redirect path
        RouteGuard->>User: Redirect to appropriate dashboard
    end

    User->>Auth: Login (email + password)
    Auth->>Database: Verify credentials
    Database->>Auth: User data
    Auth->>Session: Update session
    Session->>User: Set cookie

    User->>Auth: Logout
    Auth->>Session: Clear session
    Session->>User: Remove cookie
```

### Data Flow

```mermaid
sequenceDiagram
    participant Component
    participant QueryClient
    participant ServerFn
    participant Service
    participant Repo
    participant DB

    Component->>QueryClient: useSuspenseQuery(options)
    QueryClient->>ServerFn: Execute server function
    ServerFn->>Service: Process request
    Service->>Repo: Query/transform data
    Repo->>DB: Prisma query
    DB->>Repo: Raw data
    Repo->>Service: Processed data
    Service->>ServerFn: ServiceResponse
    ServerFn->>QueryClient: ApiResponse
    QueryClient->>Component: Cache & return data

    Component->>ServerFn: Mutation (createServerFn POST)
    ServerFn->>Service: Handle mutation
    Service->>Repo: Write operation
    Repo->>DB: Prisma mutation
    DB->>Repo: Result
    Repo->>Service: Result
    Service->>ServerFn: ServiceResponse
    ServerFn->>Component: ApiResponse
    Component->>QueryClient: invalidateQueries
```

---

## Folder Structure

```
bmec2026/
├── prisma/
│   ├── schema.prisma              # Database schema (13 models, 9 enums)
│   ├── migrations/                # Auto-generated migrations
│   ├── seed.ts                    # Seed runner
│   └── seeds/                     # Seed files (admin, competition, exam, stage, questions)
├── public/                        # Static assets (favicon, logo, manifest)
├── scripts/                       # Utility scripts
├── src/
│   ├── components/
│   │   ├── auth/                  # Registration & login forms, carousel, competition cards
│   │   ├── dashboard/
│   │   │   ├── admin/             # Admin: overview, teams, exams, submissions, scoreboard
│   │   │   └── team/              # Team: olimpiade, LKTI, infografis sections, edit forms
│   │   ├── editor/                # RichText editor wrapper (Quill-based)
│   │   ├── errors/                # Error boundary components (TeamNotFound, etc.)
│   │   ├── exam/                  # Exam shell, timer, sidebar, question viewer, navigator
│   │   ├── LandingPage/           # Hero, About, Why, Timeline, Competition, Gallery, FAQ
│   │   ├── layout/                # Header, Footer, MobileMenu, NavIndicator, ToggleUser
│   │   └── ui/                    # 40+ reusable UI components (shadcn-style)
│   ├── contants/                  # Constants (nav items, competitions, WhatsApp links)
│   ├── hooks/
│   │   ├── exam/                  # Timer, submit, anti-cheat, answers, navigation, device verification
│   │   └── useStackedCarousel.ts  # Animated carousel hook
│   ├── lib/
│   │   ├── api/                   # Repo-Service pattern per domain
│   │   │   ├── admins/            # Admin repository
│   │   │   ├── competitions/      # Competition service, repo, query-options
│   │   │   ├── dashboard/         # Dashboard service, repo, query-options
│   │   │   ├── exam-attempts/     # Attempt service, repo, query-options (2 sets)
│   │   │   ├── exams/             # Exam service, repo, query-options
│   │   │   ├── submissions/       # Submission service, repo, query-options
│   │   │   ├── teams/             # Team service, repo, query-options
│   │   │   └── uploads/           # ImageKit upload service
│   │   ├── exam/                  # Local storage helpers, device ID, constants
│   │   ├── invoice/               # Invoice template, PDF generator, helpers
│   │   ├── types/                 # PaginationMeta, ServiceResponse
│   │   └── utils/                 # cn(), prisma client, session, error handling, seo, money formatting, excel export
│   ├── middleware/
│   │   ├── auth.middleware.ts     # Session-based auth middleware
│   │   └── admin.middleware.ts    # Role-based admin middleware
│   ├── routes/                    # File-based routing (TanStack Router)
│   ├── schemas/                   # Zod validation schemas
│   ├── server/                    # TanStack Start server functions
│   ├── styles/
│   │   └── app.css                # Tailwind v4 + custom theme (oklch color space)
│   └── types/                     # TypeScript interfaces & types
├── components.json                # shadcn configuration
├── prisma.config.ts               # Prisma config (migrations, seed)
├── vite.config.ts                 # Vite + TanStack Start + Tailwind + Nitro
├── tsconfig.json                  # Strict TypeScript config
└── package.json                   # Dependencies & scripts
```

---

## Database Schema

```mermaid
erDiagram
    Team {
        string id PK
        string name UK
        string code UK
        string password
        string email UK
        string phone
        string schoolName
        string schoolAddress
        string documentUrl
        string sourceInfo
        enum competitionType
        datetime createdAt
        datetime updatedAt
        string currentStageId FK
        string twibbonUrl
    }

    Mentor {
        string id PK
        string name
        string email
        string phone
        string teamId FK, UK
    }

    Member {
        string id PK
        string name
        enum role
        string email UK
        string phone
        string major
        string faculty
        string teamId FK
    }

    Admin {
        string id PK
        string name
        string email UK
        string password
    }

    Competition {
        string id PK
        string name UK
    }

    Batch {
        string id PK
        string name
        datetime startDate
        datetime endDate
        decimal price
        string module_bacth
        string competitionId FK
    }

    Stage {
        string id PK
        enum name
        int order
        string competitionId FK
    }

    Registration {
        string id PK
        string competitionId FK
        string batchId FK
        string paymentProof
        enum status
        string approvedBy FK
        string teamId FK, UK
    }

    Submission {
        string id PK
        string teamId FK
        string stageId FK
        string title
        string fileUrl
        enum status
        string reviewedBy FK
        string feedback
        int score
        string orsinalitasUrl
        string turnitinUrl
        string abstractUrl
    }

    Exam {
        string id PK
        string title
        enum type
        datetime startDate
        datetime endDate
        int duration
        string stageId FK
    }

    ExamQuestion {
        string id PK
        string question
        string optionA-E
        int order
        string correctAnswer
        int correctScore
        int wrongScore
        int emptyScore
        enum difficulty
        string examId FK
    }

    ExamAttempt {
        string id PK
        string teamId FK
        string examId FK
        int totalScore
        datetime startTime
        datetime endTime
        boolean finished
        string reviewedBy FK
        string deviceId
        string ipAddress
        string userAgent
        int cheatCount
        boolean flagged
        int suspiciousScore
    }

    ExamAnswer {
        string id PK
        string attemptId FK
        string questionId FK
        string answer
        boolean isCorrect
        datetime answeredAt
    }

    ExamEventLog {
        string id PK
        string attemptId FK
        enum type
        json metadata
        datetime createdAt
    }

    File {
        string url
        string fileId UK
    }

    Team ||--o{ Member : members
    Team ||--o{ ExamAttempt : attempts
    Team ||--o{ Submission : submissions
    Team ||--|{ Registration : registration
    Team ||--o| Mentor : mentor
    Team }o--o| Stage : currentStage
    Mentor ||--|| Team : team
    Member }o--|| Team : team
    Competition ||--o{ Batch : batches
    Competition ||--o{ Registration : registrations
    Competition ||--o{ Stage : stages
    Batch ||--o{ Registration : registrations
    Batch }o--|| Competition : competition
    Stage ||--o{ Exam : exams
    Stage ||--o{ Submission : submissions
    Stage }o--|| Competition : competition
    Registration }o--|| Competition : competition
    Registration }o--|| Batch : batch
    Registration ||--|| Team : team
    Registration }o--o| Admin : admin
    Submission }o--|| Stage : stage
    Submission }o--|| Team : team
    Submission }o--o| Admin : admin
    Exam ||--o{ ExamAttempt : attempts
    Exam ||--o{ ExamQuestion : questions
    Exam }o--|| Stage : stage
    ExamQuestion ||--o{ ExamAnswer : answers
    ExamQuestion }o--|| Exam : exam
    ExamAttempt ||--o{ ExamAnswer : answers
    ExamAttempt ||--o{ ExamEventLog : events
    ExamAttempt }o--|| Team : team
    ExamAttempt }o--|| Exam : exam
    ExamAttempt }o--o| Admin : admin
    ExamAnswer }o--|| ExamAttempt : attempt
    ExamAnswer }o--|| ExamQuestion : question
    ExamEventLog }o--|| ExamAttempt : attempt
```

**Enums:** `CompetitionType` (OLIMPIADE, LKTI, INFOGRAFIS), `MemberRole` (KETUA, ANGGOTA), `ExamEventType` (TAB_SWITCH, WINDOW_BLUR, COPY, PASTE, FULLSCREEN_EXIT, MULTIPLE_LOGIN, NETWORK_CHANGE, DEVTOOLS_OPEN), `PaymentStatus` (PENDING, APPROVED, REJECTED), `SubmissionStatus` (PENDING, APPROVED, REJECTED), `StageType` (PENYISIHAN, SEMIFINAL, FINAL), `ExamType` (TRYOUT, OLYMPIAD), `QuestionDifficulty` (EASY, MEDIUM, HARD).

---

## Competition Flow

```mermaid
flowchart TB
    A[Registration Open] --> B[Team Creates Account]
    B --> C[Select Competition Type]
    C --> D{Olimpiade / LKTI / Infografis}

    D -->|Olimpiade| E[Register + Pay]
    D -->|LKTI| F[Upload Abstract + Register]
    D -->|Infografis| G[Register + Pay]

    E --> H[Admin Approves]
    F --> H
    G --> H

    H --> I[Team Gets Code & Invoice]
    I --> J[Stage: Penyisihan]
    J --> K{Olimpiade?}

    K -->|Yes| L[Take Online Exam Tryout]
    K -->|No| M[Upload Submission File]

    L --> N[Exam Graded Automatically]
    M --> O[Admin Reviews & Scores]

    N --> P[Stage: Semifinal]
    O --> P

    P --> Q[Stage: Final]
    Q --> R[Winner Announcement]
```

---

## Installation

### Requirements

- **Node.js** >= 22
- **pnpm** >= 10
- **PostgreSQL** >= 14

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bmec2026"

# Auth
AUTH_SECRET="your-secret-key-min-32-characters"

# ImageKit (file upload)
IMAGEKIT_PUBLIC_KEY="your_public_key"
IMAGEKIT_PRIVATE_KEY="your_private_key"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your-endpoint"
```

> **Note:** All environment variables are required. Copy `.env.example` if available.

### Getting Started

```bash
# Clone repository
git clone https://github.com/username/bmec2026.git
cd bmec2026

# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# Seed database
pnpm prisma db seed

# Start development server
pnpm dev
```

Visit **http://localhost:3000**

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start Vite development server on port 3000 |
| `pnpm build` | Build for production + TypeScript type check |
| `pnpm preview` | Preview production build |
| `pnpm start` | Start production server (Node.js) |
| `pnpm reset` | Reset database, re-run migrations and seeds |
| `pnpm prepare` | Install Husky git hooks |

---

## Project Flow

### Landing Page

The landing page at `/` consists of:

1. **Hero Section** — BMEC branding, tagline, and primary CTA
2. **About Section** — What is BMEC, competition overview
3. **Why Section** — Benefits of participating (animated cards with flow path)
4. **Timeline Section** — Event timeline with animated path
5. **Competition Detail Section** — Three competition cards (Olimpiade, LKTI, Infografis)
6. **Gallery Section** — 3D ambient gallery with carousel (Three.js + GSAP)
7. **FAQ Section** — Accordion FAQ with animation
8. **CTA Section** — Call-to-action to register

### Authentication

- **Login** (`/auth/login`) — Email/password form with role-based redirect
- **Register** (`/auth/register/`) — Multi-step form:
  1. Team name, email, password, competition selection
  2. If redirected to `/$teamId/`: mentor data → members data → document upload
  3. Completion page (`/completed`) with competition registration & payment
- **Session** — Cookie-based session (`app-session`), auto-redirect based on onboarding progress

### Team Dashboard (`/dashboard/team`)

- **Profile Card** — Team info, code, type, stage
- **Edit Team** — Update team data (name, email, school, etc.)
- **Pembimbing/Pendamping Form** — Mentor CRUD
- **Stage Progress** — Visual stage badges (Penyisihan → Semifinal → Final)
- **Competition Section** — Competition-specific actions:
  - **Olimpiade**: View exam list, take tryouts/olympiad exams, download module
  - **LKTI**: Submit abstract, upload paper, pay registration
  - **Infografis**: Submit infographic files per stage
- **Registration Status Card** — Pending/Approved/Rejected badge
- **Invoice Dialog** — Auto-shows on approval, view/download invoice PDF

### Online Exam System (`/dashboard/team/exam/$examId/`)

The exam system is a full-featured proctored testing environment:

- **Exam Shell** — Full-screen locked interface
- **Exam Timer** — Real-time countdown with warning/critical thresholds
- **Question Navigator Grid** — Grid of question numbers with status colors
- **Question Viewer** — TipTap-rendered rich text questions with 5 options (A-E)
- **Answer Management** — Save, doubt-mark, navigate between questions
- **Anti-Cheat System**:
  - Tab switch detection (via `visibilitychange`)
  - Window blur/focus tracking
  - Copy/paste prevention
  - Full-screen exit tracking
  - DevTools detection (F12, Ctrl+Shift+I/J/C)
  - Multiple login detection (device ID)
  - All events logged to `ExamEventLog` with weighted suspicious scoring
- **Device Verification** — Device ID binding per attempt
- **Auto-Submit** — On timer expiry
- **Post-Exam Review** — Review answers with correct/wrong indicators, score breakdown

### Admin Dashboard (`/dashboard/admin`)

- **Overview** — Summary cards (teams, members, exams, etc.), status distribution charts, recent activity, quick actions
- **Teams Management** (`/teams`) — List, search, view detail, delete, reset password
- **Exams Management** (`/exams`) — List exams, view questions, add/edit/delete questions, review attempts
- **Submissions Review** (`/submissions`) — Filter by status/competition, approve/reject, score
- **Scoreboard** (`/scoreboard`) — Leaderboards per competition type
- **Batch Management** (`/competitions`) — CRUD batches with pricing per competition

### Admin Features

| Feature | Description |
|---------|-------------|
| **Dashboard Overview** | Real-time stats: total teams, members, registrations, submissions, exam attempts |
| **Registration Approval** | Approve/reject team registrations with auto code generation |
| **Exam Question CRUD** | Add, edit, delete questions with TipTap rich text editor |
| **Attempt Review** | View each attempt's answers, event logs, cheat detection data |
| **Submission Review** | Approve/reject submissions, assign scores with feedback |
| **Scoreboard** | Per-competition, per-stage leaderboard |
| **Batch Management** | Create/update/delete competition batches with pricing and dates |
| **Export** | Excel export for data analysis |

---

## API Layer

### Server Functions Pattern

All server-side logic is implemented as **TanStack Start Server Functions** (`createServerFn`):

```typescript
// Pattern
export const getSomething = createServerFn({ method: "GET" })
  .inputValidator(schema)     // Zod validation
  .middleware([authMiddleware]) // Optional middleware
  .handler(
    withErrorHandling(async ({ data, context }) => {
      // Business logic
      return successResponse(data, "Success message")
    })
  )
```

### Domain Modules

| Module | Server Functions |
|--------|-----------------|
| **auth** | `loginFn`, `logoutFn`, `fetchUser` |
| **team** | `getTeams`, `getTeam`, `createTeam`, `createMentor`, `updateTeam`, `deleteTeam`, `createTeamMember`, `updateTeamStage`, `getTeamDashboard` |
| **competition** | `getCompetition`, `registrationCompetition`, `getAllCompetitionsWithBatches`, `updateBatch`, `createBatch`, `deleteBatch` |
| **exam** | `getExams`, `getExam`, `getExamQuestion`, `createExamQuestion`, `updateExamQuestion`, `deleteExamQuestion`, `getExamsByCompetitionType` |
| **exam-attempt** | `startExam`, `verifyDevice`, `getExamSession`, `saveAnswer`, `finishExam`, `getExamResult`, `logExamEvent`, `getExamReview` |
| **submission** | `getSubmissions`, `approveSubmission`, `rejectSubmission`, `updateSubmissionScore`, `getSubmissionLeaderboard`, `upsertSubmission`, `submitWithPayment` |
| **attempt** | `getExamAttempts`, `getAttemptDetail`, `getExamLeaderboard` |
| **dashboard** | `getDashboardSummary` |
| **registration** | `approveRegistration`, `rejectRegistration` |
| **image-kit** | `imagekitAuth`, `saveUpload`, `deleteUpload` |

---

## Coding Standards

### Conventions

| Aspect | Convention |
|--------|------------|
| **Language** | TypeScript strict mode |
| **Naming** | camelCase for variables/functions, PascalCase for components/types, kebab-case for files |
| **Imports** | Path aliases: `~/` maps to `./src/` |
| **Components** | Functional components with named exports |
| **Forms** | React Hook Form + Zod resolver |
| **Data Fetching** | TanStack Query with query options factory pattern |
| **Server Logic** | Service → Repository pattern with dependency injection |
| **Error Handling** | `withErrorHandling` wrapper, `AppError` class, `ApiResponse` union type |
| **Styling** | Tailwind CSS v4 with `cn()` utility (clsx + tailwind-merge) |

### Patterns

- **Repo-Service Pattern**: `lib/api/{domain}/` contains `*.repo.ts`, `*.service.ts`, `*.query-options.ts`
- **Server Function Pattern**: `server/{domain}.ts` exports typed server functions
- **Query Options Factory**: `query-options.ts` files return `queryOptions()` objects for TanStack Query
- **Route Middleware**: `beforeLoad` guards in route definitions + server middleware for server functions
- **Error Boundary**: `DefaultCatchBoundary` and `NotFound` components at root level

---

## Security

| Measure | Implementation |
|---------|---------------|
| **Password Hashing** | bcrypt with 10 salt rounds |
| **Session Auth** | Encrypted cookie (`httpOnly`, `sameSite: lax`, `secure` in production) |
| **Role-Based Access** | Admin middleware with role check, route-level beforeLoad guards |
| **Input Validation** | Zod schemas on all server function inputs |
| **Anti-Cheat** | Event logging, suspicious score tracking, device binding, devtools detection |
| **CSRF** | TanStack Start built-in CSRF protection |
| **XSS** | React's default XSS protection, TipTap sanitized content |
| **File Upload** | Server-side authentication via ImageKit signed tokens (HMAC-SHA1) |

---

## Performance

| Strategy | Implementation |
|----------|---------------|
| **SSR** | Server-side rendering via TanStack Start |
| **Suspense** | `Suspense` boundaries around data-dependent components |
| **Query Caching** | TanStack Query with `staleTime` configuration |
| **Route Preloading** | `defaultPreload: 'intent'` in router config |
| **Code Splitting** | File-based route splitting (TanStack Router) |
| **Image Optimization** | @unpic/react for optimized images |
| **Lazy Loading** | React Suspense for dashboard sections |
| **Debouncing** | Debounced anti-cheat event handlers |

---

## Roadmap

- [ ] Notification system (email) for registration status changes
- [ ] Live proctoring dashboard for admins
- [ ] Automated scoring for Olimpiade exams
- [ ] Multiple exam sessions per stage
- [ ] Team invitations via email
- [ ] Certificate generation
- [ ] Public API documentation
- [ ] End-to-end testing suite
- [ ] PWA support
- [ ] i18n (English support)

---

## Future Improvements

Based on codebase analysis:

| Area | Issue | Suggestion |
|------|-------|------------|
| **Error Handling** | `any` type usage in some error catches | Use typed error handling throughout |
| **Code Duplication** | `findByEmail`/`findByName` queries with identical includes | Extract reusable Prisma include objects |
| **Type Safety** | Some `as any` casts in components | Define proper TypeScript interfaces |
| **Testing** | No test files found | Add Vitest/Playwright test suite |
| **CI/CD** | No CI configuration | Add GitHub Actions for lint + typecheck + build |
| **Constants** | Hardcoded WhatsApp links in invoice | Move all configurable values to env vars |
| **Localization** | Mix of Indonesian and English in codebase | Separate i18n layer |
| **API Rate Limiting** | No rate limiting on server functions | Add throttling for auth endpoints |
| **Audit Log** | No centralized activity logging | Implement admin audit log |
| **Monitoring** | No error tracking | Integrate Sentry or similar |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code restructuring
- `style:` — Formatting, styling
- `docs:` — Documentation
- `chore:` — Maintenance

---

## License

This project is private and property of **BMEC 2026 — Universitas Airlangga**.

---

## Acknowledgements

- **Universitas Airlangga** — Organizer of BMEC 2026
- **All Contributors** — Developers, designers, and organizers
- **Open Source Community** — For the incredible tools and libraries used in this project

---

## Authors

- **Lead Developer** — [@misbahul45](https://github.com/misbahul45)
- **BMEC 2026 Team** — Biomedical Engineering Competition Universitas Airlangga

---

## Contact

- **Website:** [https://bmec2026.com](https://bmec2026.com)
- **Email:** bmec@unair.ac.id (example — update as needed)
- **Instagram:** @bmec2026 (example — update as needed)

---

## FAQ

**Q: What is BMEC?**  
A: BMEC (Biomedical Engineering Competition) is a national biomedical engineering competition organized by Universitas Airlangga.

**Q: Who can participate?**  
A: Olimpiade and Infografis are for SMA/sederajat students. LKTI is for university students (Mahasiswa).

**Q: How many members per team?**  
A: Each team consists of 1 Ketua (leader) and up to 2 Anggota (members), plus 1 Pembimbing/Pendamping (mentor).

**Q: What competition types are available?**  
A: Olimpiade (multiple-choice exam), LKTI (scientific paper), and Infografis (infographic design).

**Q: How does the exam work?**  
A: Olimpiade uses an online proctored exam system with anti-cheat detection, timer, and device verification.
