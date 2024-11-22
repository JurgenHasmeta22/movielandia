# MovieLandia24

A modern web application for discovering, managing, and reviewing movies, TV series, actors, crew members, seasons, and episodes.

## Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **UI Component library**: Material-UI v6 (Emotion based)
-   **Global State Management**: Zustand
-   **Database**: PostgreSQL + Prisma ORM
-   **Authentication**: NextAuth.js with Google provider
-   **Forms**: React Hook Form + Zod validation
-   **Rich Text Editor**: React Quill
-   **Email Templates**: React Email + Resend
-   **DataTables**: Material React Table V3
-   **Animations**: Framer Motion

## Key Features

-   **Content Management**:

    -   Movies, TV Series, Seasons, Episodes
    -   Actors and Crew Members
    -   Genres and Categories
    -   IMDb Ratings and Reviews

-   **User Features**:

    -   Google Authentication
    -   Profile Management
    -   Bookmarks & Favorites
    -   Reviews & Ratings
    -   Follow System

-   **Admin Dashboard**:

    -   Material React Table
    -   CRUD Operations
    -   Stats & Analytics
    -   User Management
    -   Content Management

-   **Advanced Features**:
    -   Infinite Scroll
    -   Rich Text Editor
    -   Advanced Search
    -   Sorting & Filtering
    -   Responsive Design

## Getting Started

1. **Setup environment:**

    ```bash
    git clone https://github.com/JurgenHasmeta22/movielandia.git
    cd movielandia
    npm install
    ```

2. **Configure environment variables:**
   Create `.env.local` with:

    ```
    DATABASE_URL = ""
    NEXTAUTH_URL = ""
    NEXTAUTH_SECRET = ""
    GOOGLE_CLIENT_ID = ""
    GOOGLE_CLIENT_SECRET = ""
    RESEND_API_KEY = ""
    NEXTAUTH_SECRET = ""
    POSTGRES_URL = ""
    POSTGRES_PRISMA_URL = ""
    POSTGRES_URL_NO_SSL = ""
    POSTGRES_URL_NON_POOLING = ""
    POSTGRES_HOST = ""
    POSTGRES_PASSWORD = ""
    POSTGRES_DATABASE = ""
    ```

3. **Initialize database:**

    ```bash
    npx prisma generate
    npx prisma db push 
    # or just use 
    npx prisma migrate dev
    ```

4. **Run development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:4000](http://localhost:4000)

## Project Structure

🔍 PROJECT OVERVIEW
- Web application for movie, series, and entertainment content discovery
- Full-stack Next.js application with rich user interaction features
- Developed by JurgenHasmeta22
- 250+ files with 50,000+ lines of code

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
│   └── seed/          # Seed data scripts
└── emails/            # Email templates
