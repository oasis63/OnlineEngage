# AnonChat — Anonymous Video, Voice & Text Chat

AnonChat is an anonymous, 1-on-1 text, voice, and video chat platform. The application is divided into two **completely independent repositories**:

- [`./backend`](./backend): Autonomous Node.js (Express + Socket.io + Redis) matchmaking server.
- [`./frontend`](./frontend): Autonomous Next.js 14 Web Application (React + WebRTC + Zustand).

---

## 📁 Independent Repository Structure

```
├── backend/            # Independent Git Repo: Express + Socket.io + Redis
│   ├── src/            # Backend entrypoint, socket handlers & services
│   ├── Dockerfile      # Multi-stage production build for backend
│   ├── package.json    # Backend dependencies
│   ├── tsconfig.json   # Backend TypeScript configuration
│   └── README.md       # Backend setup guide
│
├── frontend/           # Independent Git Repo: Next.js 14 App Router
│   ├── src/            # Pages, UI components, Zustand stores, Socket/WebRTC hooks
│   ├── Dockerfile      # Multi-stage production build for frontend
│   ├── package.json    # Frontend dependencies
│   ├── tsconfig.json   # Frontend TypeScript configuration
│   └── README.md       # Frontend setup guide
│
├── docker/             # Nginx reverse proxy SSL certs & Coturn TURN configuration
└── docker-compose.yml  # Docker orchestration for local full-stack execution
```

---

## 🛠️ Running Services Independently

### 1. Backend Server (`./backend`)
```bash
cd backend
pnpm install
pnpm dev       # Development server at http://localhost:4000
pnpm build     # Compile TypeScript output to ./dist
```

### 2. Frontend Application (`./frontend`)
```bash
cd frontend
pnpm install
pnpm dev       # Next.js dev server at http://localhost:3000
pnpm build     # Next.js production build
```

---

## 🐳 Running Full-Stack via Docker Compose

```bash
docker-compose up -d --build
```

Access the application via Nginx HTTPS proxy at **`https://localhost:8443/`** or your LAN IP.
