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
ENV PORT=4000

RUN npm install -g pnpm@9

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN pnpm install --prod

EXPOSE 4000

CMD ["node", "dist/index.js"]
