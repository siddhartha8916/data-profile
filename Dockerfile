FROM node:lts-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# ============================

FROM base AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

# ============================

FROM gcr.io/distroless/nodejs

WORKDIR /app

COPY --from=base /app/dist ./dist/
COPY --from=production /app/node_modules ./node_modules
COPY package*.json ./
