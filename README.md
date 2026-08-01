# AnonChat — Anonymous Video, Voice & Text Chat Platform 🚀

AnonChat is a modern, privacy-first, 1-on-1 anonymous messaging and multimedia platform designed for real-time connection across India.

The project is structured into **two 100% independent Git repositories** (`backend` and `frontend`) that can be deployed, scaled, and maintained completely separately.

---

## ✨ Features

- **🎥 HD Video Chat**: 50/50 Dual Equal View and PIP Overlay View with zero WebRTC feed interruptions.
- **🎙️ Crystal-Clear Voice Chat**: Low-latency peer-to-peer audio calls using STUN/TURN (Coturn) servers.
- **💬 Text Chat**: Instant messaging with bright emerald scrollbars, partner typing indicators, and rate-limit protection.
- **❤️ Gender Preference Matching**: Prioritizes user's interested gender (Female, Male, Other, Anyone) with automatic fallback.
- **🌐 8 Indian Languages Filter**: Filter matches by Hindi, English, Hinglish, Tamil, Telugu, Kannada, Malayalam, or Marathi.
- **✨ Shared Interest Matching**: Tag-based matchmaking with shared interest highlights.
- **🔒 Privacy & Zero Sign-Up**: No personal data, email, or login required. Temporary session storage only.
- **📱 Mobile Secure Context Support**: Built-in Mobile Chrome flag setup guide (`chrome://flags/#unsafely-treat-insecure-origin-as-secure`) for IP/HTTPS access.

---

## 🏗️ Architecture & Independent Repository Structure

```
OnlineEngage/
├── backend/            # Independent Git Repo (Node.js + Express + Socket.io + Redis)
│   ├── src/
│   │   ├── config/     # Environment configuration
│   │   ├── middleware/ # Rate limiters & error handlers
│   │   ├── services/   # Redis matchmaking engine
│   │   ├── shared/     # Local schemas & constants
│   │   ├── types/      # Local TypeScript interfaces
│   │   └── utils/      # Pino logger & helpers
│   ├── Dockerfile      # Independent multi-stage Docker build
│   ├── package.json    # Backend dependencies
│   ├── tsconfig.json   # Backend TypeScript configuration
│   └── README.md       # Backend setup guide
│
├── frontend/           # Independent Git Repo (Next.js 14 App Router)
│   ├── src/
│   │   ├── app/        # App Router pages (Home, About, Settings)
│   │   ├── components/ # VideoChat, VoiceChat, TextChat, RightSidebar, UI primitives
│   │   ├── hooks/      # useSocket, useWebRTC, useMediaDevices
│   │   ├── shared/     # Local schemas & constants
│   │   ├── stores/     # Zustand state stores
│   │   └── types/      # Local TypeScript interfaces
│   ├── Dockerfile      # Independent Next.js standalone Docker build
│   ├── package.json    # Frontend dependencies
│   ├── tsconfig.json   # Frontend TypeScript configuration
│   └── README.md       # Frontend setup guide
│
├── docker/             # Nginx reverse proxy SSL certs & Coturn TURN configuration
└── docker-compose.yml  # Multi-container orchestration for local stack
```

---

## 🛠️ Pushing to Separate Remote Git Repositories

Because `backend` and `frontend` are independent Git repositories (`.git`), you can push them to separate GitHub/GitLab repositories independently:

### Push Backend Repo
```bash
cd backend
git remote add origin https://github.com/your-username/anonchat-backend.git
git branch -M main
git push -u origin main
```

### Push Frontend Repo
```bash
cd frontend
git remote add origin https://github.com/your-username/anonchat-frontend.git
git branch -M main
git push -u origin main
```

---

## 💻 Standalone Local Development

### 1. Run Backend Server (`./backend`)
```bash
cd backend
pnpm install
pnpm dev       # Starts Express + Socket.io server on http://localhost:4000
```

### 2. Run Frontend Application (`./frontend`)
```bash
cd frontend
pnpm install
pnpm dev       # Starts Next.js dev server on http://localhost:3000
```

---

## 🐳 Docker Deployment (Full Stack)

Run all 5 containers (Backend, Frontend, Redis, Coturn, Nginx) with a single command:

```bash
docker-compose up -d --build
```

Access the live application at:
- **HTTPS Reverse Proxy**: `https://localhost:8443` or `https://<YOUR_LOCAL_IP>:8443`
- **HTTP Proxy**: `http://localhost:8080`
