# Stage 1
FROM node:18-alpine as BUILDER
WORKDIR /app
COPY package*.json prisma ./
RUN npm install && npx prisma generate
COPY . .
RUN npm run build

# Stage 2
FROM node:18-alpine
WORKDIR /app
COPY package*.json prisma ./
COPY .env ./
RUN npm ci --omit=dev && npm install -g pm2 && npx prisma generate
COPY --from=BUILDER /app/dist ./dist
EXPOSE 3500
CMD ["pm2-runtime", "dist/main.js"]
