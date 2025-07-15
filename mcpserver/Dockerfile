# Use Python 3.11 slim image as base
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies including wget for healthchecks
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# Install uv
RUN pip install uv

# Copy pyproject.toml and uv.lock for dependency installation
COPY pyproject.toml uv.lock ./

# Install dependencies using uv
RUN uv sync --frozen

# Copy the rest of the application code
COPY . .

# Expose the port (default 8080, can be overridden via environment)
EXPOSE 8080

# Set the default command to run prisma generate and then start the server
CMD ["sh", "-c", "uv run prisma generate && uv run python main.py"] 