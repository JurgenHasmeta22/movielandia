# MovieLandia24

## Project Context

MovieLandia24 is a robust and feature-rich full-stack web application for cinema enthusiasts, built using Next.js and React. It allows users to explore and interact with a rich database of movies, TV series, actors, and crew, offering user accounts, content browsing, review and rating functionalities, social networking features, and a dedicated admin dashboard for content and user management.

### Architecture

1.  **Modern Next.js App Router Foundation:** Leverages Next.js App Router for a well-organized and performant structure, with clear route groups (`(admin)`, `(root)`, `(auth)`, `(home)`) for modularity and separation of concerns.
2.  **Server Actions-Centric Logic:** Employs Server Actions (`src/actions`) as the primary mechanism for handling data mutations and server-side operations, optimizing data flow and form handling directly within React components.
3.  **Layered Data Management:** Implements a robust data layer using Prisma ORM (`prisma/`) for type-safe database interactions with PostgreSQL, and Zod (`src/schemas/`) for comprehensive data validation, ensuring data integrity across the application.
4.  **Modular and Reusable Components:** Features a well-structured component library (`src/components/`) with reusable UI elements categorized by domain and function, promoting maintainability and scalability.
5.  **React Email & Resend for Modern Emails:** The application implements a robust email system using React Email for template creation (`emails/`) and Resend for email sending, highlighting a modern approach to transactional emails within a React application.

### Features (Enhanced Descriptions)

- **User Management:** Comprehensive user account system including registration, login, password reset, Google OAuth integration, and customizable user profiles.
- **Content Discovery & Engagement:** Feature-rich content browsing, advanced search capabilities, detailed content pages, user review and rating system, and bookmarking functionality for various content types.
- **Social Networking:** Integrated social features enabling users to follow/unfollow others, direct messaging between users, and a notification system to enhance user interaction and community building.
- **Admin Dashboard:** Robust admin panel featuring dynamic data tables (Material React Table), full CRUD operations, role-based user management, content moderation, and data export capabilities, providing robust backend control.

### Technologies

- **Frontend Framework:** Next.js 15 (App Router), React 19
- **UI Library:** Material UI v6
- **ORM:** Prisma
- **Validation:** Zod
- **Authentication:** NextAuth.js (Google OAuth, Credentials)
- **Email:** React Email, Resend
- **Form Handling:** React Hook Form
- **State Management:** `Zustand` Global State Management, `nuqs` URL State Management
- **Enhancements:** `Framer Motion` (animations), `Material React Table v3` (data grids), `React Hook Form`, `React Toastify`, `React Quill`, `jsPDF` & `AutoTable` (PDF generation), `React Slick` (carousel).

## Project Structure (Concise Overview)

```
movielandia/
├── src/
│   ├── actions/         # Business logic & Server Actions for data operations
│   ├── app/            # Next.js App Router: routes, layouts, UI components
│   │   ├── (admin)/    # Route group for Admin Dashboard features
│   │   └── (root)/     # Main application route group
│   ├── components/     # Reusable & modular UI components
│   ├── constants/      # Application-wide constants
│   ├── hooks/          # Custom React Hooks for reusable logic
│   ├── layouts/        # Layout components for page structure
│   ├── middleware.ts   # Authentication & route protection middleware
│   ├── providers/      # React Context Providers
│   ├── store/          # Zustand store for global application state
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper functions, utilities, theme configuration
├── prisma/
│   ├── schema/         # Database schema definitions (Prisma)
│   └── ...             # Prisma migrations, seed data, config
└── emails/             # React Email templates
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
