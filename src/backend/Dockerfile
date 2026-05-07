FROM node:18-alpine AS builder

WORKDIR /app

COPY src/backend/package*.json ./
COPY src/backend/tsconfig.json ./
COPY src/backend/prisma ./prisma/

RUN npm install

COPY src/backend/src ./src
COPY src/ai ./src/ai

RUN npx prisma generate

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

RUN mkdir -p /var/log/backend

EXPOSE 3000

CMD ["npm", "start"]
