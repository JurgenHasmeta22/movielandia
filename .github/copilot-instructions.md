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

- Follow requirements
- Reduce complexity
- Write full code
- Think step-by-step
- Prefer iteration
- Focus on readable code
- Implement fully
- Avoid implementing nonsensical stuff
- Remove TODOs or random comments implement all the code needed
- Ensure completeness
- Include imports
- Be concise
- Return complete solutions
- Prioritize modularity
- If you are uncertain about any aspect of the request or the correct implementation, explicitly state your uncertainty rather than making assumptions.

## Coding Implementation Instructions Guidelines

- Write correct, DRY, functional code.
- Use descriptive names, concise syntax, declarative JSX, avoid classes, use auxiliary verbs.
- Implement accessibility, ensure error handling. Use const, arrow functions.
- Use early returns. Design for reusability. Avoid hardcoding.
- Use `nuqs` for URL state.

### Framework Practices

- For optimal Next.js data flow
- Minimize 'use client'
- Maintain organized files
- Always use Server Actions for data mutation
- Leverage Route Handlers for data fetching in Client Components
- And utilize Server Actions for data fetching within Server Components.

### UI Styling Practices

- Material UI with Emotion & sx props
- Avoid styled-components
- Theme customization
- Responsive design
- Consistent spacing.

### Performance Optimization

- Optimize Web Vitals
- Image optimization
- Code splitting
- Caching
- Minimize bundle size.

### Database Practices

- Prisma for modeling
- validate before CRUD
- Use indexing
- Optimize queries
- Handle errors
- Ensure data integrity.

### Git Usage

#### Commit Message Prefixes:

- **fix:** Bug fix. _Example:_ `fix: user login`
- **feat:** New feature. _Example:_ `feat: user profile update`
- **perf:** Performance improvement.

#### Rules for Git Usage:

- Use lowercase messages. _Example:_ `fix: login issue`
- Keep summary concise (under 50 chars). _Example:_ `feat: update profile`
