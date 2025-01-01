# MovieLandia24

## Project Context

MovieLandia24 is a Next.js/React application for discovering movies, TV series, actors, and crew, with user accounts, browsing, reviews, social features following, messaging, notifications system, and admin dashboard.

### Architecture

1. **Presentation:** React components (`src/components`), and App Router (`src/app`).
2. **Business Logic:** Data handling (`src/actions`, `src/hooks`, `src/utils`).
3. **Data Access:** Prisma, Zod (`prisma/schema`, `prisma/schemas`).
4. **API:** Serverless functions, API Routes Handlers (`src/app/api`).
5. **External Services:** Resend (`emails`).

### Features

- User Management (Registration, Login, Password Reset, Google OAuth, Profile).
- Content (Browsing, Search, Details, Reviews/Ratings, Bookmarking).
- Social (Following/Unfollowing, Messaging).
- Admin (Panel, CRUD, Data Export).

### Technologies

- Next.js, React, Material UI, Prisma, Zod, NextAuth.js, Resend, React Hook Form, React Toastify, Framer Motion, Zustand, `nuqs`.

## Project Structure

```

movielandia/
├── src/
│ ├── actions/
│ ├── app/
│ │ ├── (admin)/
│ │ └── (root)/
│ ├── components/
│ ├── constants/
│ ├── hooks/
│ ├── layouts/
│ ├── middleware.ts
│ ├── providers/
│ ├── store/
│ ├── types/
│ └── utils/
├── prisma/
│ ├── migrations/
│ ├── schema/
│ |── seed/
| |── config/
└── emails/

```

## General Behaviour Instructions Guidelines

- Follow requirements, reduce complexity, write full code, think step-by-step, prefer iteration, focus on readable code, implement fully, ensure completeness, include imports, be concise, state if unsure, return complete solutions, prioritize modularity.

## Coding Implementation Instructions Guidelines

- Write correct, DRY, functional code. Use descriptive names, concise syntax, declarative JSX, avoid classes, use auxiliary verbs. Implement accessibility, ensure error handling. Use const, arrow functions. Use early returns. Design for reusability. Avoid hardcoding. Use `nuqs` for URL state.

### Framework Practices

- Limit 'use client', organize files, use server actions for data.

### UI Styling Practices

- Material UI with Emotion & sx props, avoid styled-components, theme customization, responsive design, consistent spacing.

### Performance Optimization

- Optimize Web Vitals, image optimization, code splitting, caching, minimize bundle size.

### Database Practices

- Prisma for modeling, validate before CRUD, use indexing, optimize queries, handle errors, ensure data integrity.

### Git Usage

#### Commit Message Prefixes:

- **fix:** Bug fix. _Example:_ `fix: user login`
- **feat:** New feature. _Example:_ `feat: user profile update`
- **perf:** Performance improvement.

#### Rules for Git Usage:

- Use lowercase messages. _Example:_ `fix: login issue`
- Keep summary concise (under 50 chars). _Example:_ `feat: update profile`
- Reference issue numbers. _Example:_ `fix: login (fixes #123)`
