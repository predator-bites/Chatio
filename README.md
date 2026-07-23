# 💬 Chatio — Real-Time Group Chat Application

🌐 **Live Demo (Frontend)**: [https://chatio-nine.vercel.app/](https://chatio-nine.vercel.app/)

---

## 1. Technologies

### **Frontend** (Deployed to **Vercel**)

- **URL**: [https://chatio-nine.vercel.app/](https://chatio-nine.vercel.app/)
- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v6
- **Real-Time Communication**: Socket.IO Client 4.x
- **HTTP Client**: Axios with credentials & response interceptors
- **Icons & UI**: Lucide React + custom reusable design system

### **Backend** (Deployed to **Render**)

- **Server**: Node.js + Express 5.x
- **Real-Time Engine**: Socket.IO 4.x (HTTP + WebSocket server integration)
- **Database & ORM**: PostgreSQL + Prisma ORM 7.x
- **Authentication**: Passport.js (Local Strategy) + Express Session (`@quixo3/prisma-session-store`)
- **Rate Limiting**: `express-rate-limit` (200 requests/min window)
- **Email Service**: Nodemailer (SMTP verification & password resets)

### **Monorepo & Tooling**

- **Monorepo Manager**: Nx 23.x Workspace
- **Linting & Formatting**: ESLint 9 (Flat Config) + Prettier 3

---

## 2. Architecture

### System Overview

```
                        ┌───────────────────────────────┐
                        │      Client (Browser)         │
                        │ https://chatio-nine.vercel.app│
                        └───────────────┬───────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    │                                       │
            HTTPS REST Requests                   WebSocket Connections
                    │                                       │
                    ▼                                       ▼
        ┌───────────────────────┐               ┌───────────────────────┐
        │   Vercel (Frontend)   │               │   Render (Backend)    │
        │    React 19 + Vite    │               │  Express + Socket.IO  │
        └───────────────────────┘               └───────────┬───────────┘
                                                            │
                                                     Prisma ORM (SQL)
                                                            │
                                                            ▼
                                                ┌───────────────────────┐
                                                │  PostgreSQL Database  │
                                                └───────────────────────┘
```

### Key Architectural Concepts

1. **Nx Monorepo Architecture**:
   - `apps/frontend`: Single Page Application (SPA) built with React 19, Vite, and Tailwind CSS.
   - `apps/backend`: Express 5 server providing both REST APIs and Socket.IO real-time event handlers.

2. **Shared `SocketContext` Pattern**:
   - A single `Socket.IO` connection is initialized and managed at the root level via `SocketProvider`.
   - React hooks (`useRoomMessages`, `useOnlineUsers`) consume the shared socket context via `useSocket()`, avoiding duplicate connections.

3. **Resilient Reconnection & Real-Time Sync**:
   - Automatic exponential backoff reconnection (`reconnectionDelay: 1000ms`, `reconnectionDelayMax: 5000ms`).
   - Automatically re-registers `user_online` and re-joins room (`join_room`) upon WebSocket reconnection.
   - Triggers REST API sync on reconnection to backfill any messages missed during network downtime.

4. **Security & Session Storage**:
   - Session authentication managed via `express-session` backed by PostgreSQL (`@quixo3/prisma-session-store`).
   - API rate limiting powered by `express-rate-limit`.
   - Secure password hashing with `bcrypt`.

---

## 3. Local Development Setup

### 1. Prerequisites

- **Node.js**: `>= 18.x`
- **npm**: `>= 9.x`
- **PostgreSQL**: Local instance or remote cloud database (Neon, Supabase, etc.)

---

### 2. Environment Variables Configuration

#### **Backend Environment (`apps/backend/.env`)**

Create `apps/backend/.env`:

```env
PORT=3333
MODE=development

# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/chatio?sslmode=disable"

# Session & Security
SESSION_SECRET="your-super-secret-key"
SALT_OF_ROUNDS=10

# CORS Allowed Origin
ORIGIN="http://localhost:4200"
CLIENT_ORIGIN="http://localhost:4200"

# SMTP Mailer Settings (Optional for local email verification)
SMTP_SERVER="smtp.gmail.com"
SMTP_PORT=465
SMTP_USER="your-email@gmail.com"
# Create an App password for this purpose
SMTP_PASSWORD="your-app-password"
```

#### **Frontend Environment (`apps/frontend/.env`)**

Create `apps/frontend/.env`:

```env
VITE_SERVER_URL=http://localhost:3333
VITE_API_URL=http://localhost:3333
```

---

### 3. Installation & Database Setup

1. **Install Monorepo Dependencies**:

   ```bash
   npm install
   ```

2. **Provision Free Hosted Postgres Database**:
   Get a free cloud PostgreSQL database instantly for testing without installing Postgres locally:

   ```bash
   npx create-db
   ```

   _Paste the generated database connection URL into `DATABASE_URL` inside `apps/backend/.env`._

3. **Generate Prisma Client**:

   ```bash
   npx prisma generate --schema=apps/backend/prisma/schema.prisma
   ```

4. **Push Schema to Database**:
   ```bash
   npx prisma db push --schema=apps/backend/prisma/schema.prisma
   ```

---

### 4. Running the Application Locally

#### **Run Backend Server**

Starts Express server on `http://localhost:3333`:

```bash
npx nx serve backend
```

#### **Run Frontend Server**

Starts Vite dev server on `http://localhost:4200`:

```bash
npx nx serve frontend
```

Now open `http://localhost:4200` in your browser to run the application locally!
