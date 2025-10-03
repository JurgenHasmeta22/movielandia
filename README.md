<div align="center">
  <h1 align="center">🎬 MovieLandia24</h1>

  <p align="center">
    <a href="#tech">⚙️ Tech</a> •
    <a href="#start">🚀 Quick Start</a> •
    <a href="#structure">📂 Structure</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/MUI-6-blue?style=for-the-badge&logo=mui" alt="Material UI" />
  </p>
</div>

<hr>

<h2 id="tech">⚙️ Technology Stack</h2>

<table>
  <tr>
    <td><b>Frontend</b></td>
    <td>
      <a href="https://nextjs.org/">Next.js 15</a> (App Router),
      <a href="https://mui.com/">Material UI v6</a>,
      <a href="https://www.framer.com/motion/">Framer Motion</a>
    </td>
  </tr>
  <tr>
    <td><b>State Management</b></td>
    <td>
      <a href="https://github.com/pmndrs/zustand">Zustand</a>,
      <a href="https://www.npmjs.com/package/nuqs">nuqs</a> (URL state)
    </td>
  </tr>
  <tr>
    <td><b>Database</b></td>
    <td>
      PostgreSQL with <a href="https://www.prisma.io/">Prisma ORM</a>
    </td>
  </tr>
  <tr>
    <td><b>Authentication</b></td>
    <td>
      <a href="https://next-auth.js.org/">NextAuth.js</a>
    </td>
  </tr>
  <tr>
    <td><b>Forms & Validation</b></td>
    <td>
      <a href="https://react-hook-form.com/">React Hook Form</a>,
      <a href="https://zod.dev/">Zod</a>
    </td>
  </tr>
  <tr>
    <td><b>Email System</b></td>
    <td>
      <a href="https://react.email/">React Email</a>,
      <a href="https://resend.com/">Resend</a>
    </td>
  </tr>
</table>

<h2 id="start">🚀 Quick Start</h2>

```bash
# Clone the repository
git clone https://github.com/JurgenHasmeta22/movielandia.git

# Navigate to project directory
cd movielandia

# Install dependencies
npm install

# Set up environment variables (.env.local)
# Required: DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, etc.

# Initialize database
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev
```

Visit [http://localhost:4000](http://localhost:4000) to see the app in action!

<h2 id="structure">Env variables</h2>
<p>Create a <code>.env.local</code> with the following variables:</p>
<pre style="background-color:#f0f0f0; padding:10px; overflow:auto">
    <code>
        OPTIMIZE_API_KEY  = eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ3aWQiOiJjbTdhNzd0N28wMDc0b3d1MzZ4ZDNhMG9tIiwidWlkIjoiY203YTc3dDN6MDA3MG93dTMyOWhpdDJnaSIsInRzIjoxNzM5ODY2NTM1NDcxfQ.ugkQ_di5t8SP_QB9cruDP45vSAFQpf6_jd1gIW0D3tt7uhQ3JIAM7ZRUm67HLaOqaWslKWLhUOrOqPk-f1ZJBw
		RESEND_API_KEY = 
		GOOGLE_CLIENT_SECRET = 
		GOOGLE_CLIENT_ID =
		POSTGRES_DATABASE =
		POSTGRES_HOST = 
		POSTGRES_PASSWORD = 
		POSTGRES_USER = 
		POSTGRES_PRISMA_URL = 
		POSTGRES_URL_NO_SSL = 
		POSTGRES_URL_NON_POOLING = 
		POSTGRES_URL = 
		DATABASE_URL = 
		NEXTAUTH_SECRET =
		NEXT_PUBLIC_PROJECT_URL=https://movielandia-avenger22s-projects.vercel.app
		NEXTAUTH_URL = https://movielandia-avenger22s-projects.vercel.app
		TWITTER_SITE = https://movielandia-avenger22s-projects.vercel.app
		SITE_NAME = MovieLandia24
		TWITTER_CREATOR = @movieLandia24
		COMPANY_NAME = MovieLandia24
    </code>
</pre>

<div align="center">
  <p>
    <a href="https://github.com/JurgenHasmeta22">
      Created by Jurgen Hasmeta
    </a>
  </p>
</div>
