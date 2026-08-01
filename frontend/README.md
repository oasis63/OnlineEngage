# AnonChat Frontend Application 🎨

Standalone Next.js 14 Web Application for AnonChat.

## Tech Stack
- **Next.js 14** (App Router) & **TypeScript**
- **React 18** & **Tailwind CSS**
- **WebRTC** (Encrypted P2P Video & Voice Streams)
- **Socket.io-client** (Real-time WebSocket communication)
- **Zustand** (Client State Management)
- **Lucide Icons**

## Setup & Running

```bash
# 1. Install dependencies
pnpm install

# 2. Start Next.js development server
pnpm dev

# 3. Build standalone production output
pnpm build

# 4. Start production server
pnpm start
```

## Environment Variables

Copy `.env.example` to `.env`:
```env
NEXT_PUBLIC_SOCKET_URL=https://localhost:8443
NEXT_PUBLIC_APP_NAME=AnonChat
```

## Docker Build

```bash
docker build -t anonchat-frontend .
docker run -p 3000:3000 anonchat-frontend
```
