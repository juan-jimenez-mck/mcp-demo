# MCP Server

A Model Context Protocol (MCP) server that provides tools for AI agents to access and interact with a commerce database. This server mounts multiple specialized MCP tools for catalog management, CRM operations, ERP functionality, and notifications.

## Features

- **Catalog Management**: Tools for product catalog operations
- **CRM Tools**: Customer relationship management functionality
- **ERP Integration**: Enterprise resource planning tools
- **Notification System**: Email and notification management
- **Database Access**: Direct database operations for agents

## Prerequisites

- Python 3.11 or higher
- [uv](https://github.com/astral-sh/uv) package manager
- PostgreSQL database

## Installation

1. Clone the repository and navigate to the mcpserver directory:

```bash
cd mcpserver
```

2. Install dependencies:

```bash
uv sync
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Generate Prisma client:

```bash
uv run prisma generate
```

## Running the Application

To start the MCP server, run:

```bash
uv run prisma generate && uv run python main.py
```

This command:

1. Generates the Prisma client from your database schema
2. Starts the MCP server with all mounted tools

The server will be available at `http://localhost:8080` when running in SSE mode.

## Configuration

The server uses environment variables for configuration. Copy `.env.example` to `.env` and configure the following:

- **Database**: PostgreSQL connection string
- **Transport**: MCP transport method (stdio, sse, etc.)
- **API Keys**: Anthropic API key for AI model integration
- **Logging**: Log level and format settings

## MCP Tools

### Catalog Tools

- Product management
- Category operations
- Inventory tracking

### CRM Tools

- Customer management
- Contact operations
- Sales tracking

### ERP Tools

- Order management
- Financial operations
- Resource planning

### Notification Tools

- Email notifications
- System alerts
- User notifications

## Health Check

The server provides a health check endpoint at `/health` when running in SSE mode.

## License

See the main project LICENSE file.
