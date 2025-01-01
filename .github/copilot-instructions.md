You are an expert in React, Next.js App router, TypeScript, and Material UI.

Always refer to this file and carefully review each instruction within it. Every word, detail, and guideline should be thoroughly analyzed, understood, and kept in mind throughout your work.

Ensure that the context provided in this document is consistently applied and adhered to, as it is crucial for maintaining alignment with project goals, standards, and best practices. This file serves as a vital reference, and its contents should be integral to your ongoing approach and decision-making

# MovieLandia24

## Project Context

### High-Level Overview

MovieLandia24 is a full-stack Next.js/React web application for discovering and engaging with movies, TV series, actors, and crew members. It provides user account management, content browsing, reviews, ratings, bookmarking, social interactions, messaging, and administrative tools.

### Architecture

The codebase employs a layered architecture:

1.  **Presentation Layer:** Handles UI rendering and user interactions using React components (functional with hooks and class-based), organized by feature. (e.g., `src/components/admin`, `src/components/root`).
2.  **Business Logic Layer:** Encapsulates core application logic for data fetching, processing, and state management (`src/actions`, `src/hooks`, `src/utils`).
3.  **Data Access Layer:** Abstracts database interactions using Prisma as an ORM for PostgreSQL, with Zod for schema validation (`prisma/schema`, `src/schemas`).
4.  **API Layer:** Exposes serverless functions ( `src/app/api`) for HTTP requests and backend access.
5.  **External Services Layer:** Manages interactions with email services such as Resend (`emails` folder).

### Features and Functionality

The application includes a wide array of features:

#### User Authentication and Management:

- **Registration:** Handles signup using `next-auth` `CredentialsProvider` and bcrypt for password hashing, sends verification emails with Resend.
- **Login:** Implements authentication with `next-auth`, including `CredentialsProvider`, password verification with bcrypt, and JWT session token management.
- **Password Reset:** Manages password resets through token generation (using `randomUUID`), email verification (Resend API and React Email), and password updating.
- **Google OAuth:** Implements Google authentication via `GoogleProvider`, creating new users if needed.
- **Profile Management:** Allows users to manage profile details, access bookmarked content and their social interactions.

#### Content Discovery and Interaction:

- **Content Browsing:** Uses Next.js dynamic routes for server-side rendered content pages with sorting and pagination handled through Prisma.
- **Search:** Implements a serverless API endpoint for dynamic searching, querying the database and returning results based on filters.
- **Content Details:** Shows detailed information for movies, series, etc.
- **Reviews and Ratings:** Provides a text editor (`react-quill-new`, `quill-resize-image`) for reviews, backed by Prisma for storing them and vote management.
- **Bookmarking:** Uses Prisma to store user bookmarks of movies, series, etc.

#### User Social Interactions:

- **Following/Unfollowing:** Manages user relationships in `UserFollow` table, triggering a notification to the followed user.
- **Messaging:** Allows direct messaging via `src/actions/user/userMessages.actions.ts`, using Prisma for storage and retrieval.

#### Admin Functionalities:

- **Admin Panel:** Uses a protected layout with user role validation handled by NextAuth.js middleware.
- **CRUD Operations:** Provides dynamic form building (`FormAdvanced`) and validation (using Zod), enabling admin users to create, update, and delete data in the database (using Prisma).
- **Data Export:** Exports table data to PDF, CSV, and Excel formats using `jspdf`, `jspdf-autotable`, `xlsx`.

### Technologies, Libraries, and Frameworks

- **Next.js:** For SSR, routing, APIs.
- **React:** For UI components.
- **Material UI:** For accessible UI elements and styling.
- **Prisma:** As an ORM to interact with PostgreSQL.
- **Zod:** For schema definitions and data validation.
- **NextAuth.js:** For authentication and session management.
- **Resend:** As an email service provider.
- **React Hook Form:** For form management and validations.
- **React Toastify:** For toast notifications.
- **Framer Motion:** For UI animations.
- **Zustand:** For state management.
- **`react-quill-new` & `quill-resize-image`:** For rich text editor with image resize functionalities.
- **`nuqs`**: To handle URL based state management and persist across navigations.

#### External Dependencies or Integrations

- **PostgreSQL:** Main database.
- **Resend:** For sending transactional emails.

#### Key Points to keep in mind about the project

- **Component Reusability:** Build reusable components.
- **Server Actions:** Use server actions for data handling and mutations.
- **Data Fetching:** Utilize server components for improved performance.
- **State Management:** Use Zustand effectively for global and shared state.
- **Validation:** Implement Zod for data validation.
- **Error Handling:** Use try-catch blocks and `react-toastify` to display user-friendly messages.
- **Use of Hooks:** Use custom hooks for code reusability.
- **Database Querying:** Employ Prisma's type-safe query methods.
- **External APIs:** Use environment variables for authentication with third-party APIs.
- **URL State:** Leverage `nuqs` for easier state management using URL params, and enabling bookmarkable states.
- **Asynchronous Operations:** Handle pending async states with `useTransition` for better UX.

## Project Structure

```
movielandia/
├── src/
│   ├── actions/         # Server actions for data mutations
│   ├── app/            # Next.js app router pages & layouts
│   │   ├── (admin)/    # Admin dashboard routes
│   │   └── (root)/     # Main app routes
│   ├── components/     # Reusable UI components
│   ├── constants/      # Global constants
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Layout components
│   ├── middleware.ts   # Auth & routing middleware
│   ├── providers/      # Context providers
│   ├── store/          # Zustand store
│   ├── types/          # TypeScript definitions
│   └── utils/          # Helper functions
├── prisma/
│   ├── migrations/     # Database migrations
│   ├── schema/         # Database models
│   |── seed/           # Seed data scripts
|   |── config/         # Prisma config file
└── emails/             # Email templates
```

## General Behaviour Instructions Guidelines

- Follow the user’s requirements carefully & to the letter.
- Focus on actively managing and reducing complexity wherever possible. Complexity is the enemy.
- Never omit code, always write the full code no matter what.
- First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail.
- Prefer iteration and modularization over code duplication.
- Focus on easy and readability code, over being performant.
- Fully implement all requested functionality.
- Leave NO todo’s, placeholders or missing pieces.
- Ensure code is complete! Verify thoroughly finalised.
- Include all required imports, and ensure proper naming of key components.
- Be concise Minimize any other prose.
- If you think there might not be a correct answer, you say so.
- If you do not know the answer, say so, instead of guessing.
- No strict line limit for code: Return complete, functional solutions when needed.
- Prioritize modularity: Break large solutions into logical, reusable parts.
- Avoid unnecessary comments: Use clear variable and function names to make the code self-explanatory.
- Limit explanations: Keep explanations to 2–3 sentences unless additional clarification is required.

## Coding Implementation Instructions Guidelines

- Always write correct, best practice, DRY principle (Dont Repeat Yourself), bug free, fully functional and working code also it should be aligned to listed rules in this file.
- Use descriptive variable names and functional programming patterns.
- Avoid unnecessary curly braces in conditionals, use concise syntax for simple statements.
- Use declarative JSX.
- Use functional and declarative programming patterns, avoid classes.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Implement accessibility features on elements.
- **Accessibility Guidelines:** - **ARIA Attributes:** Use ARIA attributes to provide semantic information about elements for assistive technologies. - **Alternative Text:** Provide alternative text for all images using the `alt` attribute. - **Keyboard Navigation:** Ensure that all interactive elements are accessible via keyboard navigation. - **Color Contrast:** Ensure sufficient color contrast between text and background colors. - **Semantic HTML:** Use semantic HTML elements to structure the content.
- Ensure proper error handling and graceful degradation.
- **Error Handling:** - **Try-Catch Blocks:** Use try-catch blocks to handle errors in asynchronous operations and server actions. - **User-Friendly Messages:** Display user-friendly error messages using `react-toastify`. - **Error Logging:** Log errors to the console or a logging service for debugging purposes. - **Graceful Degradation:** Ensure that the application degrades gracefully in case of errors or failures.
- Use const instead of functions, for example, const toggle = () =>. Also, define a type if possible, so basically use arrow functions instead of functions.
- Use early returns whenever possible to make the code more readable.
- **Component Reusability:**
    - **Design for Reusability:** Design components to be reusable across different parts of the application.
    - **Props:** Use props to pass data and configuration options to components.
    - **Composition:** Use composition to combine smaller components into larger ones.
    - **Avoid Hardcoding:** Avoid hardcoding values or logic within components.
- **URL State Management with `nuqs`:**
    - **State Persistence:** Use `nuqs` to manage state in the URL, allowing users to bookmark and share specific application states.
    - **URL Params:** Use URL parameters to store and retrieve state values.
    - **Synchronization:** Ensure that the URL state is synchronized with the application state.

### Framework Practices

- Limit 'use client':
    - Favor server components and Next.js SSR.
    - Use only for Web API access in small components.
    - Avoid for data fetching or state management.
- Organize files for exported components, helpers, static content, and types.
- Use server actions for data fetching and state management in components
    - **Server Actions Usage:** Use server actions for data mutations and fetching data that requires server-side logic. For example, use server actions to handle form submissions, database updates, and any operation that requires access to environment variables or server-side resources. Avoid using server actions for simple UI updates or client-side logic. When using server actions for data fetching, ensure that you are using `use server` directive at the top of the file.

### UI Styling Practices

- Material UI with Emotion & sx Props: Stick to using Material UI combined with Emotion for styling. Leverage the sx prop for inline styling to maintain consistency across components, ensuring a unified design language that aligns with the project's theme. This approach simplifies styling and improves maintainability by keeping styles closely tied to the component logic.

- Avoid Styled Components: Do not use styled-components, even with Material UI. Instead, prefer the built-in sx prop from Material UI and Emotion for custom styles, as it integrates seamlessly with the rest of the framework and avoids unnecessary dependencies or complexity.

- Theme Customization: Make full use of Material UI's theming capabilities to define a global theme for colors, typography, spacing, and other design elements. Customize the Material UI theme to ensure that the look and feel of the platform remain consistent across different pages and components, while maintaining flexibility for design changes.

- Responsive Design: Ensure that all UI components are fully responsive by utilizing Material UI's built-in grid system and breakpoints. Implement adaptive layouts and elements that work well across various screen sizes, from mobile devices to large desktop displays.

- Consistent Spacing and Alignment: Follow a consistent spacing system for margins, paddings, and layout elements. Leverage Material UI's spacing utility functions or the sx prop to ensure consistent alignment and proportional spacing between UI elements.

### Performance Optimization

- Optimize Web Vitals (LCP, CLS, FID) to improve overall performance.
- **Performance Optimization Techniques:** - **Image Optimization:** Use WebP format for images, include size attributes (`width` and `height`), and implement lazy loading using the `loading="lazy"` attribute. - **Code Splitting:** Implement dynamic imports for non-critical components to reduce the initial bundle size. - **Caching:** Implement caching strategies for frequently accessed data to reduce server load and improve response times. - **Minimize Bundle Size:** Remove unused code and dependencies to reduce the size of the JavaScript bundle.
- Optimize images: use WebP format, include size data, implement lazy loading.
- Use dynamic loading for non-critical components.

### Database Practices

- Database Modeling with Prisma: Utilize Prisma for efficient and flexible database modeling. It ensures that the data structure is well-defined and aligns with the existing schema, allowing for seamless integration and consistency across the application.

- Data Validation: Before performing any Create, Read, Update, or Delete (CRUD) operations, always verify the existence and integrity of the relevant database entities. This prevents issues such as orphaned records, data inconsistencies, and ensures data accuracy.
- **Database Practices:** - **Indexing:** Use indexes on frequently queried columns to improve query performance. - **Query Optimization:** Optimize database queries to reduce execution time. Use Prisma's query methods efficiently and avoid unnecessary joins or complex queries. - **Error Handling:** Implement proper error handling for database operations. Catch database errors and provide user-friendly messages. Log errors for debugging purposes. - **Data Integrity:** Ensure data integrity by using Prisma's validation features and implementing proper data validation logic.

### Git Usage

#### Commit Message Prefixes:

- "fix:" for bug fixes
- "feat:" for new features
- "perf:" for performance improvements
- "docs:" for documentation changes
- "style:" for formatting changes
- "refactor:" for code refactoring
- "test:" for adding missing tests
- "chore:" for maintenance tasks

#### Rules for Git Usage:

- Use lowercase for commit messages
- Keep the summary line concise
- Include description for non-obvious changes
- Reference issue numbers when applicable
- **Commit Message Examples:** - `fix: resolved issue with user login failing on mobile` - `feat: implemented user profile update functionality` - `perf: optimized image loading on the home page` - `docs: updated the README with new setup instructions` - `style: adjusted spacing on the user profile page` - `refactor: extracted user authentication logic into a separate module` - `test: added unit tests for the user service` - `chore: updated dependencies to the latest versions`
