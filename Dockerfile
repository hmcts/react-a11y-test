# Multi-stage build for React A11y Test SPA
# Stage 1: Build the client application
FROM node:24.17.0-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production Express static server
FROM node:24.17.0-alpine AS production

RUN apk add --no-cache dumb-init wget

RUN addgroup -g 1001 -S nodejs \
  && adduser -S appuser -u 1001 -G nodejs

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
COPY --chown=appuser:nodejs server.js ./

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["sh", "-c", "wget -qO- http://127.0.0.1:${PORT:-3000}/health > /dev/null || exit 1"]

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
