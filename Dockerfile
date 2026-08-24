# Stage 1: Build stage
FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.17.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml prisma/schema.prisma ./

ENV CI=true

RUN pnpm ci

COPY . .

RUN pnpm run build

# Stage 2: Production runtime stage
FROM node:24-alpine AS runner

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["sh", "-c", "npx prisma migrate deploy && node .output/server/index.mjs"]