# AnonChat Backend Service

Autonomous Express + Socket.io + Redis Backend for AnonChat.

## Tech Stack
- Node.js 20+
- Express.js
- Socket.io (WebSockets)
- Redis (IORedis) & Matchmaking Engine
- Pino Logging & Zod Validation
- TypeScript

## Quick Start (Standalone)

```bash
# 1. Install dependencies
pnpm install

# 2. Run in development mode
pnpm dev

# 3. Build for production
pnpm build

# 4. Start production server
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
