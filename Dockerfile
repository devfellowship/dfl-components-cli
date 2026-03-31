FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source
COPY . .

# Build showcase app and CLI
RUN npm run build
RUN cd packages/cli && npm run build

# Default: run the showcase dev server
EXPOSE 8080
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
