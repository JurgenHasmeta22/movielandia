<div align="center">
  <h1>🎬 MovieLandia24</h1>
  
  <p align="center">
    <strong>MovieLandia24</strong> is a dynamic social media platform designed for cinema enthusiasts. It allows users to explore, review, and engage with content related to movies, TV series, actors, crew members, seasons, and episodes. Users can also upvote or downvote reviews, bookmark their favorite content, and take advantage of many other interactive features within the platform.
  </p>

  <p align="center">
    <a href="#-key-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-project-structure">Structure</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/MUI-6-blue?style=flat-square&logo=mui" alt="Material UI" />
  </p>
</div>

---

## ⚡ Tech Stack

The application is built using the Next.js App Router and React, ensuring seamless navigation and a responsive user experience. For styling, it leverages Material UI, offering a modern and consistent design across the platform.

Zustand is used for global state management, providing efficient handling of application state. Animations are powered by Framer Motion, delivering smooth and engaging transitions.

For email functionality, the platform integrates React Email and Resend, while React Hook Form combined with Zod is used for robust form validation, ensuring a user-friendly and reliable experience.

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **UI Components:** [Material-UI v6](https://mui.com/) with Emotion
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Database:** PostgreSQL + [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) with Google & Credentials
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Rich Text Editor:** [React Quill](https://github.com/zenoamaro/react-quill)
- **Email System:** [React Email](https://react.email/) + [Resend](https://resend.com/)
- **DataTables:** [Material React Table V3](https://www.material-react-table.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **PDF Generation:** [jsPDF](https://github.com/parallax/jsPDF) + [AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- **Carousel:** [React Slick](https://react-slick.neostack.com/)
- **Notifications:** [React Toastify](https://fkhadra.github.io/react-toastify/)

## 🚀 Key Features

### 📺 Content Management

- Movies, TV Series, Seasons & Episodes
- Actors and Crew Members
- Genres
- IMDb Ratings Integration
- Rich Media Support

### 👤 User Features

- Multi-provider Authentication (Google & Email)
- Profile Management & Customization
- Bookmarks
- Reviews & Ratings System
- User Following System
- Password Reset Flow
- Account Activation

### 🛠 Admin Dashboard

- Material React Table Integration
- Advanced CRUD Operations
- User Management & Roles
- Content Moderation
- Export to PDF/Excel

### 🎯 Advanced Features

- Infinite Scroll Implementation
- Rich Text Editor with Media Support
- Advanced Search with Filters
- Smart Sorting & Filtering
- Responsive Design
- Image Optimization
- SEO Optimization
- Form Validation

### 💻 Developer Experience

- TypeScript Support
- ESLint Configuration
- Prettier Code Formatting
- Development Tools
    - Turbo Mode
    - Hot Reload
    - React Dev Tools
    - Performance Monitoring
- Modular Architecture
- Code Splitting
- Route Groups
- Server Actions
- API Routes

### 🔒 Security Features

- JWT Authentication
- Password Hashing
- Protected Routes
- Role-based Access
- Input Validation

## 🏁 Getting Started

1. **Clone & Install**

```bash
git clone https://github.com/JurgenHasmeta22/movielandia.git
cd movielandia
npm install
```

2. **Environment Setup**

Create `.env.local` with the following variables:

```env
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
```

3. **Database Initialization**

```bash
npx prisma generate
npx prisma migrate dev
```

4. **Development Server**

```bash
npm run dev
```

Visit [http://localhost:4000](http://localhost:4000)

## 📁 Project Structure

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

---

<div align="center">
  <p>Developed with ❤️ by <a href="https://github.com/JurgenHasmeta22">JurgenHasmeta22</a></p>
</div>
