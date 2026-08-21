# SprintDesk

A sprint management dashboard with a Kanban board, analytics, notifications, and full light/dark theming. Built with React 19, TypeScript, Vite, Tailwind CSS v4, and Zustand.

## Features

- **Authentication** — JWT-style login against the DummyJSON auth API. Access tokens live in memory only; refresh tokens are persisted (localStorage when "Remember me" is checked, otherwise sessionStorage) and rotated automatically via a single-flight silent refresh on `401` responses.
- **Kanban board** — four-column board (Backlog / In Progress / Review / Done) powered by dnd-kit with pointer and keyboard dragging, cross-column moves, in-column reordering, drag overlay, move undo, task creation, inline editing in a side drawer, comments, and deletion with confirmation.
- **Local-first persistence** — board mutations are stored in localStorage (`sprintdesk-board`) so edits survive reloads; mock data hydrates the store once.
- **Analytics** — velocity bar chart, status donut, priority breakdown, and completion trend charts built with Recharts. Chart colors resolve from CSS custom properties, so charts follow theme changes automatically.
- **Notifications** — polls JSONPlaceholder every 15 seconds with a rotating cursor, merges new items into a persisted store, shows unread badges, per-item/mark-all read, paginated bell panel and full page view.
- **Dashboard** — real-time stat cards, active sprint progress, recent activity feed, and upcoming deadlines.
- **Theming** — design-token based light/dark themes (class strategy), no flash on load, theme persisted to localStorage.

## Getting started

```bash
npm install
npm run dev
```

Open the printed URL and sign in:

| Username  | Password     |
| --------- | ------------ |
| `emilys`  | `emilyspass` |

Check **Remember me** on the login screen to keep your session across browser restarts (30-day refresh token).

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the dev server                 |
| `npm run build`   | Type-check and produce a production build |
| `npm run preview` | Preview the production build         |
| `npm test`        | Run unit tests (Vitest + RTL)        |
| `npm run lint`    | Lint with oxlint                     |

## Architecture

```
src/
├── api/            # HTTP client with token interceptor + endpoint modules
├── components/
│   ├── analytics/  # Recharts wrappers + useChartTheme
│   ├── board/      # KanbanBoard, columns, cards, drawer, create modal
│   ├── layout/     # AppLayout shell: sidebar, header, mobile nav
│   ├── notifications/
│   └── ui/         # Design-system primitives (Button, Modal, Drawer, …)
├── hooks/          # useAuth, useTask, useNotifications, useToast
├── pages/          # Route-level screens
├── routes/         # Router config + protected/public guards
├── store/          # Zustand stores (auth, board, notifications, theme, toast)
├── types/          # Shared TypeScript types
└── utils/          # cn, date helpers, storage, analytics math, constants
```

### Key decisions

- **Access token in memory only** — the Zustand auth store is not persisted; only the refresh token touches storage. A single shared refresh promise prevents parallel refresh storms after multiple concurrent `401`s.
- **Optimistic board store** — all Kanban operations mutate a normalized task array synchronously; `moveTask` re-indexes `order` values and manages `completedAt`, and keeps a snapshot for one-click undo.
- **Token-based design system** — Tailwind v4 `@theme` maps semantic CSS variables (`--canvas`, `--surface`, `--ink`, `--brand`, …); components never hard-code colors, making dark mode free.
- **Notification polling** — `_start` cursor advances by page size through JSONPlaceholder posts and wraps around; unknown ids count as unread arrivals.

## API

The app talks to two public demo services plus local static data:

- DummyJSON — `/auth/login`, `/auth/me`, `/auth/refresh`
- JSONPlaceholder — `/posts?_limit=5&_start=N` (notification feed)
- `/mock-data.json` — seeded users, sprints, tasks, comments, notifications

See [`docs/openapi.yaml`](docs/openapi.yaml) for the documented contract of each integration.

## Testing

Unit tests cover the board store's move/undo semantics, the toast lifecycle, and the authenticated fetch interceptor (bearer injection, silent refresh retry, session invalidation). Run them with `npm test`.

## Known limitations

- Data changes are local-only by design; there is no write API for tasks.
- The notification "feed" is simulated from placeholder posts.
- Sessions rely on DummyJSON demo credentials.
