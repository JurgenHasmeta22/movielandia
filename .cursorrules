# MovieLandia24

## Project Context

MovieLandia24 is a robust and feature-rich full-stack web application for cinema enthusiasts, built using Next.js and React. It allows users to explore and interact with a rich database of movies, TV series, actors, and crew, offering user accounts, content browsing, review and rating functionalities, social networking features, and a dedicated admin dashboard for content and user management.

## Architecture of Codebase

1.  **Modern Next.js App Router Foundation:** Leverages Next.js App Router for a well-organized and performant structure, with clear route groups (`(admin)`, `(root)`, `(auth)`, `(home)`) for modularity and separation of concerns.
2.  **Server Actions-Centric Logic:** Employs Server Actions (`src/actions`) as the primary mechanism for handling data mutations and server-side operations, optimizing data flow and form handling directly within React components.
3.  **Layered Data Management:** Implements a robust data layer using Prisma ORM (`prisma/`) for type-safe database interactions with PostgreSQL, and Zod (`src/schemas/`) for comprehensive data validation, ensuring data integrity across the application.
4.  **Modular and Reusable Components:** Features a well-structured component library (`src/components/`) with reusable UI elements categorized by domain and function, promoting maintainability and scalability.

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
- Component Reusability: Always use reusable components to maintain consistency and reduce redundancy. Check src/components for existing components before creating new ones.
- Authentication: Implement Supabase Auth with Server-Side Rendering (SSR) sessions for all protected routes and data access.
- Security: Ensure all endpoints, database queries, and user inputs are secure (e.g., use parameterized queries, validate inputs, and enforce role-based access).

### Next.js Framework Practices

- For optimal Next.js data flow
- Minimize 'use client'
- Maintain organized files
- Always use Server Actions for data mutation
- Leverage Route Handlers for data fetching in Client Components
- And utilize Server Actions for data fetching within Server Components.

### Material UI Styling Practices

- Material UI with Emotion & sx props
- Avoid styled-components
- Theme customization
- Responsive design
- Consistent spacing.
- Responsiveness: Ensure all UI elements are fully responsive and mobile-friendly, tested across various screen sizes.

### Database Practices

- Prisma for modeling
- validate before CRUD
- Use indexing
- Optimize queries
- Handle errors
- Ensure data integrity.

## Git Usage

- Generate a concise commit message (max 70 characters) summarizing the changes from `git diff`.
- Use Conventional Commit prefixes (`docs:`, `feat:`, `fix:`, `chore:`, etc.) to categorize the change.
- Clearly describe what was modified, added, or fixed. Format: `{type}[(scope)]: {description}`.
- Use the terminal command `git diff` to retrieve the changes.
- Format the output in Markdown with a heading.
