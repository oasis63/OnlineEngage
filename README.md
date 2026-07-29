# AnonChat - Anonymous Random Chat Platform (India)

**AnonChat** is a production-quality, high-performance, anonymous random video, voice, and text chat platform inspired by Omegle, engineered specifically for the Indian market. Built with zero signup requirements, zero persistent database storage, sub-second Redis priority matchmaking, and peer-to-peer WebRTC encrypted media streams.

---

## 📖 About AnonChat

AnonChat connects strangers across India for instant, 100% anonymous conversations. Whether you want to text, voice call, or video chat, AnonChat pairs you with like-minded users based on shared interests and regional Indian languages—with zero data collection or account creation.

### 🌟 Key Features

- **100% Anonymous & Secure**: No signups, no passwords, no email verification, no tracking cookies, and no persistent database storage.
- **Indian Regional Languages Support**: Native support for English, Hindi (`हिन्दी`), Tamil (`தமிழ்`), Kannada (`<ctrl42>ಕನ್ನಡ`), Malayalam (`മലയാളം`), Telugu (`తెలుగు`), Marathi (`मराठी`), and Gujarati (`ગુજરાતી`).
- **Interest-Based Matchmaking**: Priority Redis matchmaking engine pairs users who share similar interest tags (`#coding`, `#bollywood`, `#cricket`, etc.) before falling back to random match.
- **Multi-Mode Support**:
  - **Text Chat**: Real-time Socket.IO chat with typing indicators, message timestamps, auto-scrolling, and unread counters.
  - **Video Chat**: High-definition WebRTC video with local floating preview, remote full-screen mode, mute mic, turn camera on/off, and mirror toggles.
  - **Voice Chat**: Audio-only WebRTC mode with animated audio frequency indicators.
- **Instant Skip / Next**: One-click "Next Stranger" disconnects current stranger and instantly queues you for a new match.
- **Enterprise Security & Rate Limiting**: Built-in sliding-window rate limiters for messages and queue joins, Helmet HTTP security headers, and strict CORS rules.

---

## 💻 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, `@anonchat/ui`, Zustand, Socket.IO Client, WebRTC
- **Backend**: Node.js, Express, TypeScript, Socket.IO Server, Redis (`ioredis`), Pino Logger
- **Infrastructure**: Docker, Docker Compose, Redis 7, Coturn (TURN/STUN), Nginx Reverse Proxy
- **Testing**: Vitest (Unit tests), Playwright (E2E tests)

---

## 🚀 How to Run the App

### Option A: Running Locally (Development Mode)

#### Prerequisites
- Node.js `v18+` or `v20+`
- `pnpm` (recommended) or `npm`

#### 1. Clone & Install Dependencies
```bash
# Install dependencies across all monorepo workspaces
pnpm install
# OR using npm
npm install
```

#### 2. Build Monorepo Shared Packages
```bash
pnpm run build:packages
# OR using npm
npm run build:packages
```

#### 3. Start Redis Server (Optional)
Redis is used for queue matchmaking. If Redis is not running locally, the server automatically falls back to its built-in in-memory queue.
To run Redis via Docker:
```bash
docker run -d -name anonchat-redis -p 6379:6379 redis:7-alpine
```

#### 4. Start Development Servers (Backend + Frontend)
```bash
pnpm run dev
# OR using npm
npm run dev
```

- **Web Frontend**: `http://localhost:3000`
- **Backend Socket Server**: `http://localhost:4000`

---

### Option B: Single Command Setup with Docker Compose (Recommended)

Yes! You can run the **entire full-stack application** (Frontend, Backend, Redis, Coturn TURN server, and Nginx proxy) with **a single command** from the project root:

```bash
docker-compose up -d --build
```
*(Or `docker compose up -d --build`)*

This single command automatically builds and launches all 5 services:
1. **Next.js Web Frontend** (accessible at `http://localhost:3000` or via Nginx at `http://localhost`)
2. **Node.js Socket Backend** (listening on `http://localhost:4000`)
3. **Redis Matchmaking Store** (`redis://localhost:6379`)
4. **Coturn TURN/STUN Media Server** (listening on `port 3478`)
5. **Nginx Reverse Proxy** (`http://localhost:80`)

---

## 🧪 Running Tests

### Unit Tests (Vitest)
Runs unit tests for the Redis matchmaking priority algorithm:
```bash
pnpm run test
```

### End-to-End Tests (Playwright)
Runs E2E browser test flows:
```bash
pnpm run test:e2e
```

---

## 📁 Monorepo Folder Structure

```
OnlineEngage/
├── package.json               # Root monorepo workspace configuration
├── pnpm-workspace.yaml        # Workspace package mapping
├── tsconfig.json              # Shared TypeScript base configuration
├── apps/
│   ├── server/                # Backend Socket.IO & Express application
│   │   ├── src/
│   │   │   ├── services/
│   │   │   │   └── matchmaking.service.ts # Priority match algorithm
│   │   │   ├── sockets/       # Socket handlers (chat, queue, webrtc)
│   │   │   └── index.ts       # Express server entry point
│   │   └── tests/             # Vitest test suite
│   └── web/                   # Next.js 14 App Router frontend
│       ├── src/
│       │   ├── app/           # Next.js pages (/, /settings, /about)
│       │   ├── components/    # Chat UI components (Text, Video, Voice, Controls)
│       │   ├── hooks/         # Custom hooks (useSocket, useWebRTC, useMediaDevices)
│       │   └── stores/        # Zustand state management
│       └── e2e/               # Playwright tests
├── packages/
│   ├── types/                 # Shared TypeScript event interfaces
│   ├── shared/                # Validation schemas & language constants
│   └── ui/                    # Dark glassmorphism component system
└── docker/                    # Dockerfiles, Compose, Nginx, and Coturn configs
```
