# Stage 1
FROM node:18-alpine as BUILDER
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY .env ./
COPY --from=BUILDER /app/dist ./dist
RUN npm ci --omit=dev && npm install -g pm2 && npx prisma generate
EXPOSE 3500
CMD ["pm2-runtime", "dist/main.js"]
