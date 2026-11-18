# MovieLandia24 Frontend PRD

## 1. Purpose and status

MovieLandia24 is a responsive cinema discovery and community application. This document describes the user-facing product, its current route structure, and the frontend requirements that guide its implementation. It complements the [Backend PRD](./BACKEND_PRD.md), which documents the current data model and backend behavior.

The route and technology inventory below is based on the current `src/app/` tree and `package.json`. Feature requirements describe expected user-visible behavior; the presence of a route does not by itself guarantee that every edge case is complete.

## 2. Product goals

1. Help visitors discover movies, series, seasons, episodes, actors, crew, and genres.
2. Let members record preferences and opinions, organize content into lists, and connect with other members.
3. Provide a community forum for discussions about entertainment.
4. Give administrators tools to manage catalog data, users, and the forum.
5. Keep discovery and community experiences usable on mobile, tablet, and desktop.

## 3. Users and permissions

| User | Primary needs |
|---|---|
| Visitor | Browse and search public catalog content, read public profiles and discussions, and learn about the service. |
| Registered member | Manage a profile, favorites, ratings, reviews, lists, follows, messages, notifications, and forum contributions. |
| Administrator | Manage catalog records and users through the administration area. |
| Forum moderator | Moderate assigned forum categories and their discussions, subject to the permissions implemented by the application. |

Private lists, account actions, and member-only interactions must not be presented as public operations. Mutations must be authorized on the server; hiding a control in the UI is not an authorization check.

## 4. Information architecture and routes

Route groups such as `(root)` and `(admin)` are internal App Router organization and do not appear in browser URLs.

| Area | Route patterns | Access and purpose |
|---|---|---|
| Home and information | `/`, `/about-us`, `/contact-us`, `/privacy`, `/terms` | Public landing page, service information, contact form, and legal pages. |
| Authentication | `/login`, `/register`, `/change-password`, `/reset-password`, `/verify-register`, `/verify-reset-password`, `/register-verification-sent`, `/reset-password-verification-sent` | Sign-in, registration, account verification, and password recovery. |
| Catalog | `/movies`, `/series`, `/actors`, `/crew`, `/genres` | Browse and filter catalog collections. |
| Catalog details | `/movies/[movieId]/[movieTitle]`, `/series/[serieId]/[serieTitle]`, `/actors/[actorId]/[actorFullname]`, `/crew/[crewId]/[crewFullname]`, `/genres/[genreId]/[genreName]` | View a catalog entity, relevant relationships, and supported member interactions. |
| Episodic content | `/series/[serieId]/[serieTitle]/seasons/[seasonId]/[seasonTitle]` and nested `/episodes/[episodeId]/[episodeTitle]` | Browse season and episode details under a series. |
| Reviews | Catalog detail routes with `/reviews/[reviewId]/upvotes` or `/reviews/[reviewId]/downvotes` | View the members who voted on a review. |
| Search | `/search` | Search across supported catalog and member types. |
| Member area | `/dashboard`, `/notifications`, `/messages`, `/messages/[messageId]` | View personal activity, notifications, and private messages. |
| Profiles | `/users/[userId]/[userName]`, with `/followers`, `/following`, `/followersRequests`, and `/lists` subroutes | Browse profile content, social connections, and member lists subject to visibility. |
| Lists | Profile list routes, including `/lists/create`, `/lists/[listId]/[listName]`, and `/add-items` | Create, view, curate, reorder, and share supported content lists. |
| Forum | `/forum`, `/forum/search`, `/forum/categories/[categoryId]/[categorySlug]`, nested topic routes, and post edit/create routes | Browse and search discussions; create and manage topics, posts, and replies. |
| Administration | `/admin` and `/admin/{movies,series,seasons,episodes,actors,crews,genres,users}` with detail/create routes | Manage catalog data and user records. |

The route tree is authoritative for exact path segments and any new routes.

## 5. Functional requirements

### 5.1 Discovery and catalog

- Visitors can browse and search supported catalog types without signing in.
- Collection pages expose relevant filtering, sorting, and pagination controls.
- Detail pages identify the entity and show available related information, such as cast, crew, genres, seasons, episodes, and reviews.
- Search results make the result type clear and link to the corresponding detail page.
- Empty results, invalid identifiers, loading states, and recoverable errors have clear user-facing states.

### 5.2 Accounts and profiles

- Members can register, sign in, verify an account, and request a password reset.
- Forms provide field-level validation and preserve user input when a recoverable error occurs.
- Members can view and update supported profile information and manage their avatar.
- Public profile pages show only information intended to be public; private account information is limited to its owner and authorized administrators.
- Follow requests and follower lists reflect the relationship state shown by the application.

### 5.3 Reviews, ratings, and favorites

- Signed-in members can create, edit, and remove supported reviews and ratings, and can add or remove favorites.
- A member has at most one review per target entity, consistent with the database uniqueness constraints.
- Review voting clearly indicates the signed-in member's current vote and prevents conflicting upvote/downvote state.
- The UI displays validation and authorization errors without implying a failed mutation succeeded.
- The accepted rating scale and rating precision remain product decisions; do not hardcode a scale that is not defined by the product.

### 5.4 Lists and sharing

- Members can create, edit, and delete lists; add and remove supported content; and reorder items.
- List visibility is respected when viewing, sharing, and searching for lists.
- Owners can share a list and manage collaborator permissions. Collaborators can edit only when granted edit access.
- The interface distinguishes an empty list from a loading or failed list request.

### 5.5 Community and communication

- Forum visitors can browse public categories, topics, posts, and replies and search discussions.
- Authenticated members can create and manage contributions, vote, bookmark, and watch supported topics.
- Moderation controls are available only to authorized moderators or administrators.
- Members can view their notifications and private conversations; private messages are accessible only to conversation participants.
- Forum rich text and user-submitted content must be rendered safely.

### 5.6 Administration

- The admin area provides create, read, update, and delete workflows for supported catalog entities and user management.
- Admin forms validate fields, identify destructive actions, and report successful or failed operations.
- Administrative pages and operations require server-verified administrator privileges.

## 6. Core user journeys

### Discover and review

1. Visit a catalog page or search.
2. Refine results with available filters, sorting, or pagination.
3. Open an entity detail page.
4. Sign in when prompted to add a favorite, rating, or review.
5. Submit the interaction and see its resulting state or an actionable error.

### Create and share a list

1. Sign in and open the member's lists.
2. Create a list and choose its visibility.
3. Add supported catalog items and reorder them.
4. Optionally share the list and grant read or edit access.
5. Confirm that the owner and collaborator views reflect the granted permissions.

### Participate in the forum

1. Browse or search categories and topics.
2. Sign in to create a topic, post, or reply.
3. Edit or remove owned contributions where allowed.
4. Use voting, bookmarking, and watching controls where available.
5. Report or moderate content only through supported, authorized workflows.

## 7. UX, accessibility, and responsive requirements

- Use the shared application shell and design system consistently across public, member, and admin areas.
- Layouts must adapt from narrow mobile screens through desktop widths without requiring horizontal scrolling for ordinary page content.
- Interactive elements must be keyboard operable, have accessible names, expose focus state, and communicate errors and status changes to assistive technology.
- Use semantic headings, landmarks, labels, and tables where appropriate; do not rely on color alone to convey state.
- Forms must associate validation messages with their fields and provide a clear submission state.
- Destructive actions require an understandable confirmation or equivalent safeguard.
- Respect reduced-motion preferences for non-essential animation.

These are product requirements, not a claim that every existing screen has already been audited against them.

## 8. Frontend architecture baseline

Declared versions below come from `package.json`; the package manifest is authoritative if this table becomes stale.

| Concern | Current baseline |
|---|---|
| Framework and rendering | Next.js 16 App Router and React 19; server components are used where appropriate, with client components for interactive UI. |
| Language | TypeScript. |
| UI | Material UI 9, with application theme and shared providers. |
| Authentication | NextAuth.js 4. |
| Data and mutations | Prisma with PostgreSQL; server data access is implemented through server-side modules, Server Actions, and a small set of Route Handlers. |
| Forms and validation | React Hook Form and Zod. |
| Client state | Zustand; `nuqs` is available for URL-backed state. |
| Rich text and lists | React Quill and dnd-kit are used for rich text and drag-and-drop list interactions. |
| Email UI | React Email templates are sent through Resend. |
| Testing | Vitest and Testing Library for unit/component tests; Playwright for browser tests. |

Keep database access and authorization on the server. Prefer server-rendered page data; use client-side state for genuinely interactive or transient UI. Share URL state for filters and sorting when it improves navigation and link sharing.

## 9. Quality and acceptance criteria

- Every route in the current information architecture resolves to its intended page or a deliberate not-found state.
- Public catalog browsing does not require authentication; protected member and admin operations enforce access on the server.
- Search, filtering, sorting, and pagination preserve understandable context when navigating between results and details.
- Mutations show an accurate pending, success, or error state and do not report success when the server rejects an operation.
- Empty, loading, error, and not-found states are distinguishable.
- Key flows are covered by focused automated tests; changes to critical authentication, list, review, and forum journeys include regression coverage.
- `npm run test` and the relevant Playwright checks pass for changes affecting those flows.
- Responsive layouts and keyboard interaction are verified for key journeys before release.

The repository does not declare a product analytics provider or quantitative conversion targets. Agree on those separately before adding measurement requirements or instrumentation.

## 10. Implementation references

- App routes and page composition: `src/app/(root)/` and `src/app/(admin)/`
- Shared components and layouts: `src/components/`, `src/layouts/`
- Providers and client state: `src/providers/`, `src/store/`
- Validation: `src/schemas/`
- Server Actions: `src/actions/`
- Route Handlers: `src/app/api/`
- Database schema: `prisma/schema/`
- Automated tests: `src/**/*.test.ts`, `src/**/*.test.tsx`, and `tests/`
