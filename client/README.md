# React Client Service

This service provides the React frontend application for the commerce-copilot project.

## Features

- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **Nginx** for serving static files
- **Runtime configuration** injection for API endpoints

## Build Process

The client uses a multi-stage Docker build:

1. **Build Stage**: Uses Node.js to install dependencies and build the React app
2. **Serve Stage**: Uses Nginx to serve the built static files

## Configuration

### Environment Variables

- `VITE_API_BASE_URL`: The base URL for the API (defaults to `http://api:3000/api`)
- `NODE_ENV`: Build environment (defaults to `production`)
- `CLIENT_PORT`: Port to expose the client on (defaults to `80`)

### Runtime Configuration

The client supports runtime configuration injection through the `entrypoint.sh` script, which creates a `config.js` file that can be loaded by the React app.

## Usage

The client is automatically started as part of the docker-compose setup and will be available at:

- **Local**: `http://localhost:80` (or whatever port you set in `CLIENT_PORT`)
- **Container**: `http://client:80`

## Dependencies

The client depends on the API service being healthy before starting.

## Development

For local development:

```bash
cd client
npm install
npm run dev
```

## Build

To build the client locally:

```bash
cd client
npm run build
npm run preview
```
