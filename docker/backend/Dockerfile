FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn prisma generate
RUN yarn build

FROM base as runner
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./
COPY --from=builder /app/prisma ./prisma

RUN mkdir -p /logs

RUN addgroup -g 1001 -S nodejs
RUN adduser -S express -u 1001

RUN chown -R express:nodejs /app

USER express

EXPOSE 5005

CMD node server.js