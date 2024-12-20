You are an expert in React, Next.js App router, TypeScript, and Material UI.

Always refer to this file and carefully review each instruction within it. Every word, detail, and guideline should be thoroughly analyzed, understood, and kept in mind throughout your work.

Ensure that the context provided in this document is consistently applied and adhered to, as it is crucial for maintaining alignment with project goals, standards, and best practices. This file serves as a vital reference, and its contents should be integral to your ongoing approach and decision-making

# MovieLandia24

## Project Context

MovieLandia24 is a dynamic social media platform designed for cinema enthusiasts. It allows users to explore, review, and engage with content related to movies, TV series, actors, crew members, seasons, and episodes. Users can also upvote or downvote reviews, bookmark their favorite content, and take advantage of many other interactive features within the platform.

## Tech Stack

The application is built using the Next.js App Router and React, ensuring seamless navigation and a responsive user experience. For styling, it leverages Material UI, offering a modern and consistent design across the platform. Zustand is used for global state management, providing efficient handling of application state. Animations are powered by Framer Motion, delivering smooth and engaging transitions. For email functionality, the platform integrates React Email and Resend, while React Hook Form combined with Zod is used for robust form validation, ensuring a user-friendly and reliable experience.

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
- Ensure proper error handling and graceful degradation.
- Use const instead of functions, for example, const toggle = () =>. Also, define a type if possible, so basically use arrow functions instead of functions.
- Use early returns whenever possible to make the code more readable.

### Framework Practices

- Limit 'use client':
    - Favor server components and Next.js SSR.
    - Use only for Web API access in small components.
    - Avoid for data fetching or state management.
- Organize files for exported components, helpers, static content, and types.
- Use server actions for data fetching and state management in components

### UI Styling Practices

- Material UI with Emotion & sx Props: Stick to using Material UI combined with Emotion for styling. Leverage the sx prop for inline styling to maintain consistency across components, ensuring a unified design language that aligns with the project's theme. This approach simplifies styling and improves maintainability by keeping styles closely tied to the component logic.

- Avoid Styled Components: Do not use styled-components, even with Material UI. Instead, prefer the built-in sx prop from Material UI and Emotion for custom styles, as it integrates seamlessly with the rest of the framework and avoids unnecessary dependencies or complexity.

- Theme Customization: Make full use of Material UI's theming capabilities to define a global theme for colors, typography, spacing, and other design elements. Customize the Material UI theme to ensure that the look and feel of the platform remain consistent across different pages and components, while maintaining flexibility for design changes.

- Responsive Design: Ensure that all UI components are fully responsive by utilizing Material UI's built-in grid system and breakpoints. Implement adaptive layouts and elements that work well across various screen sizes, from mobile devices to large desktop displays.

- Consistent Spacing and Alignment: Follow a consistent spacing system for margins, paddings, and layout elements. Leverage Material UI's spacing utility functions or the sx prop to ensure consistent alignment and proportional spacing between UI elements.

### Performance Optimization

- Optimize Web Vitals (LCP, CLS, FID) to improve overall performance.
- Optimize images: use WebP format, include size data, implement lazy loading.
- Use dynamic loading for non-critical components.

### Database Practices

- Database Modeling with Prisma: Utilize Prisma for efficient and flexible database modeling. It ensures that the data structure is well-defined and aligns with the existing schema, allowing for seamless integration and consistency across the application.

- Data Validation: Before performing any Create, Read, Update, or Delete (CRUD) operations, always verify the existence and integrity of the relevant database entities. This prevents issues such as orphaned records, data inconsistencies, and ensures data accuracy.

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

##### Example of Git Usage:

<strong>style:</strong> Added new theme styling changes to the project
<strong>fix:</strong> Fixed the issue with the login form not submitting
<strong>feat:</strong> Added a feature to see the followers of a user after clicking its button and opening a new page there where i can follow them
