# Stage 1
FROM node:18-alpine as BUILDER
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json prisma ./

# Install the npm dependencies and generate prisma client
RUN npm install && npx prisma generate

# Copy project files
COPY . .

# build
RUN npm run build

# Stage 2
FROM node:18-alpine
WORKDIR /app

# Copy AWS credentials file
RUN mkdir -p /root/.aws
COPY credentials /root/.aws/credentials

# Copy the env, package*.json and prisma files
RUN mkdir logs # for logging
COPY package*.json prisma ./
COPY .env ./

# Install the dependencies and generate prisma client
RUN npm ci --omit=dev && npm install -g pm2 && npx prisma generate

# Copy the js files from builder state
COPY --from=BUILDER /app/dist ./dist

# Run the Server
EXPOSE 3500
CMD ["pm2-runtime", "dist/main.js"]
