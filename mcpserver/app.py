"""
MCP root server.

This module bootstraps all MCP servers into a root server.
"""

import logging

from fastmcp import FastMCP
from starlette.requests import Request
from starlette.responses import PlainTextResponse

from core.config import settings
from tools.catalog import mcp as catalog_mcp
from tools.crm import mcp as crm_mcp
from tools.erp import mcp as erp_mcp
from tools.notification import mcp as notification_mcp

# Configure logger
logger = logging.getLogger(__name__)

# Create main MCP server
mcp = FastMCP(
    name=settings.app_name,
)


logger.info("✅ MCP server instance created")

mcp.mount(catalog_mcp.name, catalog_mcp)
mcp.mount(crm_mcp.name, crm_mcp)
mcp.mount(erp_mcp.name, erp_mcp)
mcp.mount(notification_mcp.name, notification_mcp)


@mcp.custom_route("/health", methods=["GET"])
async def health_check(_: Request) -> PlainTextResponse:
    """
    Health check endpoint.

    This endpoint is used to check if the MCP server is running.

    Returns:
        PlainTextResponse: "OK" if the MCP server is running, "ERROR" otherwise.
    """
    logger.info("✅ MCP server health check")
    return PlainTextResponse("OK", status_code=200)


logger.info("✅ Global tools registered")
