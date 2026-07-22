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
