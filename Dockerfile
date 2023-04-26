# Stage 1
FROM node:18-alpine as BUILDER
WORKDIR /app
COPY package*.json ./
RUN npm config set proxy http://34.64.111.58:80
RUN npm config set https-proxy http://34.64.111.58:80
RUN npm install && npx prisma generate
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
