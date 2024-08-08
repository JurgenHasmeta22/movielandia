# MovieLandia24 - Next.js Full-Stack Web Application

MovieLandia24 is a web application for discovering and sharing movies, series, seasons, episodes, genres and actors.

You can also CRUD reviews in movies, series, seasons, episodes, actors, search based on many criteria, see stuff based on genre, sort, paginate, auth many many more features.
Built using Next.js for a fast and efficient frontend, with a beautiful and responsive UI.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/JurgenHasmeta22/movielandia.git
    cd movielandia
    ```

2. **Install dependencies:**

    ```bash
    yarn install
    # or
    npm install
    ```

3. **Set up the environment variables:**

    Create a `.env and .env.local` file in the root of your project and add the following variables:

    ```plaintext
    DATABASE_URL="your-database-url"
    NEXTAUTH_URL="your-next-auth-url"
    NEXT_PUBLIC_API_URL="your-api-url"
    NEXTAUTH_URL and others
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
