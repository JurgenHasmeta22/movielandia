# MovieLandia Full-Stack

## Description

MovieLandia Frontend is a modern web application for discovering and sharing movies and TV series. Built using Next.js for a fast and efficient frontend, with a beautiful and responsive UI.

## Features

-   **User Authentication**: Secure login and registration using NextAuth.js.
-   **Movie and Series Database**: Browse, search, and filter movies and series.
-   **Genres**: Discover content by genres.
-   **Responsive Design**: Optimized for both desktop and mobile devices.
-   **User Reviews and Ratings**: Share your thoughts and rate movies/series.
-   **Infinite Scrolling**: Seamless content loading with infinite scroll.
-   **Interactive UI**: Beautiful animations and transitions with Framer Motion.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/movielandia-frontend.git
    cd movielandia-frontend
    ```

2. **Install dependencies:**

    ```bash
    yarn install
    # or
    npm install
    ```

3. **Set up the environment variables:**

    Create a `.env` file in the root of your project and add the following variables:

    ```plaintext
    DATABASE_URL="your-database-url"
    NEXTAUTH_URL="your-next-auth-url"
    NEXT_PUBLIC_API_URL="your-api-url"
    ```

## Running the Project

1. **Start the development server:**

    ```bash
    yarn dev
    # or
    npm run dev
    ```

2. **Open your browser:**

    Navigate to `http://localhost:4000` to see the application in action.

## Project Structure

```plaintext
movielandia/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   ├── pages/           # Next.js pages
│   ├── styles/          # CSS and SCSS files
│   ├── utils/           # Utility functions
│   ├── prisma/          # Prisma schema and client
│   └── hooks/           # Custom hooks
├── .eslintrc.js         # ESLint configuration
├── .prettierrc          # Prettier configuration
├── next.config.js       # Next.js configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies and scripts
```

## Environment Variables

Ensure you set up the following environment variables in your .env file:

```DATABASE_URL: Connection string for your database.
NEXTAUTH_URL: URL for NextAuth.js authentication.
NEXT_PUBLIC_API_URL: Public API URL for the application.
API Documentation
For API interactions, refer to the backend's Swagger documentation available at http://localhost:4000/api-docs once the server is running.
```

## Available Scripts

```yarn dev or npm run dev: Starts the development server.
yarn build or npm run build: Builds the application for production.
yarn start or npm run start: Starts the production server.
yarn lint or npm run lint: Lints the code with ESLint.
yarn format or npm run format: Formats the code with Prettier.
```
