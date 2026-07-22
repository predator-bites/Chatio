# 💬 Chatio — Real-Time Group Chat Application

**Chatio** is a full-stack, real-time group messaging web application built as an **Nx Monorepo**. It features instant WebSocket messaging, online/offline presence tracking, room invitation links, typing indicators, and flexible authentication (email/password + Google OAuth 2.0).

---

## 🚀 Tech Stack

### **Frontend** (Deployed to **Vercel**)
- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v6
- **Real-Time Communication**: Socket.IO Client 4.x
- **HTTP Client**: Axios with credentials & unified response interceptors

### **Backend** (Deployed to **Render**)
- **Server**: Node.js + Express 5.x
- **Real-Time Engine**: Socket.IO 4.x (HTTP + WebSocket server integration)
- **Database & ORM**: PostgreSQL + Prisma ORM 7.x
- **Authentication**: Passport.js (Local & Google OAuth 2.0) + Express Session (`@quixo3/prisma-session-store`)
- **Email Service**: Nodemailer (SMTP verification & password resets)

### **Monorepo & Tooling**
- **Monorepo Manager**: Nx 23.x Workspace
- **Linting & Formatting**: ESLint 9 (Flat Config) + Prettier 3
- **Shared Libraries**: `@chatio/shared-types`

---

## 📐 Architecture Overview

```
                        ┌───────────────────────────────┐
                        │      Client (Browser)         │
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
                                                │ (Neon / Render / etc) │
                                                └───────────────────────┘
```

---

## 🔑 Environment Variables Configuration

### **Frontend Environment (`apps/frontend/.env`)**
Create `apps/frontend/.env` (or configure in Vercel Environment Variables):

```env
SERVER_URL=https://your-backend-service.onrender.com
VITE_API_URL=https://your-backend-service.onrender.com
```

### **Backend Environment (`apps/backend/.env`)**
Create `apps/backend/.env` (or configure in Render Environment Variables):

```env
PORT=3333
MODE=production

# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-example-123456.us-east-1.aws.neon.tech/chatio?sslmode=require"

# Session Security
SESSION_SECRET="your-super-secret-random-key"
SALT_OF_ROUNDS=10

# CORS & Origins (Your Vercel deployment URL)
ORIGIN="https://your-frontend.vercel.app"
CLIENT_ORIGIN="https://your-frontend.vercel.app"

# Google OAuth 2.0 Credentials
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="https://your-backend-service.onrender.com/auth/google/callback"

# SMTP Mailer Settings
SMTP_SERVER="smtp.gmail.com"
SMTP_PORT=465
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

---

## 🛠 Local Development Setup

### 1. Prerequisites
- **Node.js**: `>= 18.x`
- **npm**: `>= 9.x`
- **PostgreSQL**: Local instance or cloud database (Neon, Supabase, Render PostgreSQL)

### 2. Installation
Clone the repository and install workspace dependencies:

```bash
git clone https://github.com/your-username/chatio.git
cd chatio
npm install
```

### 3. Database Migration & Prisma Generation
Configure your local `DATABASE_URL` in `apps/backend/.env` and sync the schema:

```bash
# Generate Prisma Client
npx prisma generate --schema=apps/backend/prisma/schema.prisma

# Push schema to database
npx prisma db push --schema=apps/backend/prisma/schema.prisma
```

### 4. Running Locally
Run both backend and frontend concurrently with Nx:

```bash
# Run backend (listening on http://localhost:3333)
npx nx serve backend

# Run frontend (listening on http://localhost:4200)
npx nx serve frontend
```

---

## 🌐 Deployment Guide: Vercel (Frontend) + Render (Backend)

### **Part 1: Deploy Database (PostgreSQL)**
1. Create a free PostgreSQL instance on [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Render PostgreSQL](https://render.com).
2. Copy the connection string (`DATABASE_URL`) with `?sslmode=require`.

---

### **Part 2: Deploy Backend to Render**

1. Sign in to [Render](https://render.com) and click **New +** → **Web Service**.
2. Connect your Git repository.
3. Configure the Web Service settings:
   - **Name**: `chatio-backend`
   - **Environment**: `Node`
   - **Region**: Select closest to your users
   - **Branch**: `main`
   - **Root Directory**: `.` (leave blank or `.`)
   - **Build Command**:
     ```bash
     npm install && npx prisma generate --schema=apps/backend/prisma/schema.prisma && npx nx build backend
     ```
   - **Start Command**:
     ```bash
     node dist/apps/backend/main.js
     ```
4. Add all **Backend Environment Variables** under **Environment Settings**:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `ORIGIN` = `https://your-app.vercel.app`
   - `CLIENT_ORIGIN` = `https://your-app.vercel.app`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CALLBACK_URL` = `https://chatio-backend.onrender.com/auth/google/callback`
   - `SMTP_SERVER`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
   - `SALT_OF_ROUNDS` = `10`
5. Click **Create Web Service**. Render will build and deploy the Node.js WebSocket API.

---

### **Part 3: Deploy Frontend to Vercel**

1. Sign in to [Vercel](https://vercel.com) and click **Add New** → **Project**.
2. Import your `chatio` Git repository.
3. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npx nx build frontend`
   - **Output Directory**: `dist/apps/frontend`
4. Add **Environment Variables**:
   - `SERVER_URL` = `https://chatio-backend.onrender.com` (Your Render URL)
5. Click **Deploy**. Vercel will build and serve your SPA on a high-speed CDN.

---

### **Part 4: Google OAuth Authorization Callback Setup**
In your [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
1. Go to **Credentials** → Select your OAuth 2.0 Client ID.
2. Add under **Authorized JavaScript origins**:
   - `https://your-app.vercel.app`
3. Add under **Authorized redirect URIs**:
   - `https://chatio-backend.onrender.com/auth/google/callback`

---

## 🧪 Code Formatting & Verification

To maintain code readability, the workspace follows strict statement padding rules and formatting standards:

```bash
# Run Prettier code formatting
npm run format

# Verify formatting without writing changes
npm run format:check

# Run ESLint across monorepo
npx eslint .
```

---

## 📜 License
This project is licensed under the **MIT License**.
