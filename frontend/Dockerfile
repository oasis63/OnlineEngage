FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9

COPY package*.json ./
RUN pnpm install

COPY . .
RUN pnpm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
