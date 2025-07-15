"""
Entry point for running the MCP module.

Usage: uv run main
"""

import logging
import sys

from app import mcp
from core.config import settings

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format=settings.log_format,
    handlers=[logging.StreamHandler(sys.stdout)],
)

logger = logging.getLogger(__name__)


def main():
    """Main entry point for the MCP server."""
    try:
        logger.info("🚀 Starting %s v%s", settings.app_name, settings.app_version)
        logger.info("Environment: %s", settings.environment)
        logger.info("Transport: %s", settings.transport)

        if settings.transport == "sse":
            logger.info("Server URL: http://%s:%s", settings.host, settings.port)

        mcp.run(
            transport=settings.transport,
            port=settings.port if settings.transport == "sse" else None,
            host=settings.host if settings.transport == "sse" else None,
        )

    except KeyboardInterrupt:
        logger.info("Received interrupt signal")
    except Exception as e:
        logger.error("Server error: %s", e)
        raise


if __name__ == "__main__":
    main()
