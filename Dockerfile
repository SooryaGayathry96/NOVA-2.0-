# Multi-stage production build for NOVA 2.O Junior Astronaut Mission Trainer

# 1. Build Client
FROM node:20-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# 2. Build Server
FROM node:20-alpine AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# 3. Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Copy server production artifacts & node_modules
COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=server-builder /app/server/package*.json ./server/
COPY --from=server-builder /app/server/node_modules ./server/node_modules

# Copy client built assets for static serving
COPY --from=client-builder /app/client/dist ./client/dist

# Expose server port
EXPOSE 5000

# Start server
CMD ["node", "server/dist/index.js"]
