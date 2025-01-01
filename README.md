<div align="center">
  <h1 style="color: #30969f;">🎬 MovieLandia24</h1>

  <p align="center" style="font-size: 1.1em; color: #777; line-height: 1.5;">
    <strong>MovieLandia24</strong> is a dynamic, full-stack social platform crafted for cinema enthusiasts. It empowers users to explore, rate, review, bookmark, and connect around a rich database of movies, TV series, actors, crew members, seasons, and episodes. Enjoy a seamless experience with interactive features that enhance your engagement with the world of cinema.
  </p>

  <p align="center" style="font-size: 1.05em; color: #555;">
    <a href="#tech-stack" style="margin: 0 10px; color: #30969f; text-decoration: none;">Tech Stack</a> •
    <a href="#key-features" style="margin: 0 10px; color: #30969f; text-decoration: none;">Features</a> •
    <a href="#getting-started" style="margin: 0 10px; color: #30969f; text-decoration: none;">Getting Started</a> •
    <a href="#project-structure" style="margin: 0 10px; color: #30969f; text-decoration: none;">Structure</a> •
     <a href="#performance-improvements" style="margin: 0 10px; color: #30969f; text-decoration: none;">Performance</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" style="margin: 0 5px;"/>
    <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React" style="margin: 0 5px;"/>
    <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript" style="margin: 0 5px;"/>
    <img src="https://img.shields.io/badge/MUI-6-blue?style=flat-square&logo=mui" alt="Material UI" style="margin: 0 5px;"/>
  </p>
</div>

---

<h2 style="color:#30969f;" id="tech-stack">⚡ Tech Stack</h2>
<p style="font-size:1.1em;">
  MovieLandia24 is meticulously crafted using a powerful combination of technologies. Next.js App Router and React form its foundation, which provides seamless navigation and a reactive user experience. Styling is provided via Material UI, ensuring a consistent and aesthetically pleasing platform, enhanced by Emotion. Core logic is handled by Zustand, while UI animations are managed with Framer Motion. For Email communications, MovieLandia24 uses React Email and Resend.
</p>
  <ul style="list-style-type: none; padding-left: 0;">
        <li><strong>Framework:</strong> <a href="https://nextjs.org/" style="color:#30969f;" target="_blank">Next.js 15</a> (App Router)</li>
        <li><strong>UI Components:</strong> <a href="https://mui.com/" style="color:#30969f;" target="_blank">Material-UI v6</a> with Emotion</li>
        <li><strong>State Management:</strong> <a href="https://github.com/pmndrs/zustand" style="color:#30969f;" target="_blank">Zustand</a></li>
        <li><strong>Database:</strong> PostgreSQL + <a href="https://www.prisma.io/" style="color:#30969f;" target="_blank">Prisma ORM</a></li>
        <li><strong>Authentication:</strong> <a href="https://next-auth.js.org/" style="color:#30969f;" target="_blank">NextAuth.js</a> with Google & Credentials</li>
        <li><strong>Forms & Validation:</strong> <a href="https://react-hook-form.com/" style="color:#30969f;" target="_blank">React Hook Form</a> + <a href="https://zod.dev/" style="color:#30969f;" target="_blank">Zod</a></li>
         <li><strong>Rich Text Editor:</strong> <a href="https://github.com/zenoamaro/react-quill" style="color:#30969f;" target="_blank">React Quill</a> with <a href="https://www.npmjs.com/package/quill-resize-image" style="color:#30969f;" target="_blank">quill-resize-image</a></li>
        <li><strong>Email System:</strong> <a href="https://react.email/" style="color:#30969f;" target="_blank">React Email</a> + <a href="https://resend.com/" style="color:#30969f;" target="_blank">Resend</a></li>
        <li><strong>DataTables:</strong> <a href="https://www.material-react-table.com/" style="color:#30969f;" target="_blank">Material React Table V3</a></li>
        <li><strong>Animations:</strong> <a href="https://www.framer.com/motion/" style="color:#30969f;" target="_blank">Framer Motion</a></li>
        <li><strong>PDF Generation:</strong> <a href="https://github.com/parallax/jsPDF" style="color:#30969f;" target="_blank">jsPDF</a> + <a href="https://github.com/simonbengtsson/jsPDF-AutoTable" style="color:#30969f;" target="_blank">AutoTable</a></li>
        <li><strong>Carousel:</strong> <a href="https://react-slick.neostack.com/" style="color:#30969f;" target="_blank">React Slick</a></li>
        <li><strong>Notifications:</strong> <a href="https://fkhadra.github.io/react-toastify/" style="color:#30969f;" target="_blank">React Toastify</a></li>
         <li><strong>URL State:</strong> <a href="https://www.npmjs.com/package/nuqs" style="color:#30969f;" target="_blank">nuqs</a></li>
  </ul>

<h2 style="color:#30969f;" id="key-features">🚀 Key Features</h2>

<h3 style="color:#30969f;">📺 Content Management</h3>
 <ul style="list-style-type: disc; padding-left: 20px;">
    <li>Browse and view details for Movies, TV Series, Seasons, and Episodes.</li>
    <li>Discover comprehensive information about Actors and Crew Members.</li>
    <li>Explore content by different Genres.</li>
    <li>Leverage IMDb ratings for content evaluation.</li>
      <li>Enjoy rich media support with images and trailers.</li>
 </ul>

<h3 style="color:#30969f;">👤 User Features</h3>
 <ul style="list-style-type: disc; padding-left: 20px;">
        <li>Multi-provider authentication with Google OAuth and email/password credentials, managed with NextAuth.js.</li>
        <li>Personalize your experience by customizing your user profile.</li>
        <li>Save and access favorite content through the bookmarking functionality.</li>
        <li>Rate and submit reviews to share your thoughts about movies, series, and actors.</li>
        <li>Connect with other users using the follow/unfollow mechanism.</li>
        <li>Securely recover account passwords through a password reset flow.</li>
          <li>Activate your account through email verification to access more features.</li>
 </ul>

<h3 style="color:#30969f;">🛠 Admin Dashboard</h3>
  <ul style="list-style-type: disc; padding-left: 20px;">
        <li>Utilizes Material React Table for dynamic data displays.</li>
        <li>Enables advanced Create, Read, Update, Delete (CRUD) operations.</li>
        <li>Offers robust user management with customizable roles.</li>
        <li>Provides content moderation tools to control user-generated content.</li>
        <li>Exports data to PDF, CSV, and Excel for data reporting and sharing.</li>
  </ul>
  
 <h3 style="color:#30969f;">🎯 Advanced Features</h3>
  <ul style="list-style-type: disc; padding-left: 20px;">
      <li>Use of rich text editor powered by react-quill to format text when submitting data.</li>
        <li>Use a serverless API endpoint to search across various content types.</li>
      <li>Smart sorting and filtering provides a dynamic view of results.</li>
       <li>Responsive layouts ensure compatibility across various devices.</li>
        <li>Image optimization uses `next/image` to deliver smaller optimized sizes images.</li>
     <li>SEO optimization to ensure that your site is easily discoverable.</li>
       <li>Utilize client side validation with `zod` and server side validation.</li>
  </ul>

 <h3 style="color:#30969f;">💻 Developer Experience</h3>
  <ul style="list-style-type: disc; padding-left: 20px;">
      <li>TypeScript is used for static typing, catching bugs earlier and improving overall code quality.</li>
      <li>ESLint is used to maintain consistent and clean code using predefined rules.</li>
      <li>Prettier is used to format the code automatically.</li>
       <li>Includes development tools that enhance the developer experience
         <ul>
             <li>Turbo Mode: Enables faster build times and incremental changes in the codebase.</li>
             <li>Hot Reload: To update the view when a change is made without requiring a full reload.</li>
              <li>React Dev Tools: To view the react component tree, and inspect props and state within your components.</li>
              <li>Performance Monitoring: Browser based performance insights which can show the current performance bottlenecks.</li>
         </ul>
       </li>
        <li>A modular architecture to enable better separation of concerns, better organization and promote code reusability.</li>
       <li>Code splitting to help decrease bundle size and improve performance.</li>
      <li>Nextjs `Route groups` for better organization of routes.</li>
     <li>Server actions enable performing server actions from client components, while still running the function on server side.</li>
    <li> API routes for custom backend logic.</li>
  </ul>

 <h3 style="color:#30969f;">🔒 Security Features</h3>
  <ul style="list-style-type: disc; padding-left: 20px;">
      <li>JWT authentication to secure the API routes and user sessions.</li>
        <li>Secure password hashing to prevent user passwords from being stolen.</li>
        <li>Protected routes for user and admin only pages.</li>
       <li>Role based access to enable different authorization levels for users with different roles.</li>
       <li>Input validation through `zod` to prevent malicious user provided data.</li>
  </ul>

<h2 style="color:#30969f;" id="getting-started">🏁 Getting Started</h2>

<ol style="padding-left: 20px;">
  <li><strong>Clone & Install:</strong>
    <pre style="overflow: auto; background-color:#f0f0f0; padding:10px;"><code>git clone https://github.com/JurgenHasmeta22/movielandia.git
cd movielandia
npm install</code></pre>
  </li>
   <li><strong>Environment Setup:</strong>
    <p>
        Create a <code>.env.local</code> with the following variables:
        </p>
       <pre style="background-color:#f0f0f0; padding:10px; overflow:auto"><code>
        DATABASE_URL=""
        NEXTAUTH_URL=""
        NEXTAUTH_SECRET=""
        GOOGLE_CLIENT_ID=""
        GOOGLE_CLIENT_SECRET=""
        RESEND_API_KEY=""
        POSTGRES_URL=""
        POSTGRES_PRISMA_URL=""
        POSTGRES_URL_NO_SSL=""
        POSTGRES_URL_NON_POOLING=""
        POSTGRES_HOST=""
        POSTGRES_PASSWORD=""
        POSTGRES_DATABASE=""
    </code></pre>
  </li>
   <li><strong>Database Initialization:</strong>
    <pre style="overflow: auto; background-color:#f0f0f0; padding:10px;"><code>npx prisma generate
npx prisma migrate dev</code></pre>
  </li>
   <li><strong>Development Server:</strong>
     <pre style="overflow: auto; background-color:#f0f0f0; padding:10px;"><code>npm run dev</code></pre>
    <p>Visit <a href="http://localhost:4000" style="color:#30969f;" target="_blank">http://localhost:4000</a></p>
  </li>
 </ol>
 <h2 style="color:#30969f;" id="project-structure">📁 Project Structure</h2>

<pre style="overflow: auto; background-color: #f0f0f0; padding: 10px;"><code>
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
</code></pre>

---

<div align="center">
  <p style="color: #777; font-size: 1em;">Developed with ❤️ by <a href="https://github.com/JurgenHasmeta22" style="color:#30969f;">JurgenHasmeta22</a></p>
</div>
