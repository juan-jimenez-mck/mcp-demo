# === Build stage ===
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build arguments for environment variables
ARG VITE_API_BASE_URL
ARG NODE_ENV=production

# Set environment variables for build
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV NODE_ENV=development

# Copy dependency files
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy rest of the app
COPY . .

# Build the Vite app with environment variables
RUN npm run build

# === Serve stage ===
FROM nginx:1.25-alpine

# Install jq for JSON manipulation and gettext for environment substitution, and remove default config
RUN apk add --no-cache jq gettext && \
    rm /etc/nginx/conf.d/default.conf

# Replace with custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built app into Nginx's public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Create a template for runtime configuration
RUN mkdir -p /usr/share/nginx/html/config

# Copy runtime configuration script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port
EXPOSE 80

# Use custom entrypoint to inject runtime configuration
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
