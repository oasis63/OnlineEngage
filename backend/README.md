# AnonChat Backend Service ⚡

Standalone Express, Socket.io, and Redis matchmaking server for AnonChat.

## Tech Stack
- **Node.js 20+** & **TypeScript**
- **Express.js** (HTTP API & Health Check)
- **Socket.io** (Real-time Matchmaking, Messaging & WebRTC Signaling)
- **Redis (IORedis)** (High-performance matchmaking queues)
- **Pino** (Structured logging) & **Zod** (Data validation)

## Setup & Running

```bash
# 1. Install dependencies
pnpm install

# 2. Start development server
pnpm dev

# 3. Compile TypeScript for production
pnpm build

# 4. Start production build
pnpm start
```

## Environment Variables

Copy `.env.example` to `.env`:
```env
PORT=4000
NODE_ENV=development
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=*
LOG_LEVEL=info
```

## Docker Build

```bash
docker build -t anonchat-backend .
docker run -p 4000:4000 anonchat-backend
```
