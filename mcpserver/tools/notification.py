"""
Notification tools for the MCP server.
"""

import logging
from contextlib import asynccontextmanager

from fastmcp import FastMCP

from core.db import prisma
from prisma.enums import EmailStatus
from prisma.models import Email
from prisma.types import EmailCreateInput, EmailUpdateInput
from services.notification import NotificationService
from utils.logs import log_tool

logger = logging.getLogger("mcpserver.tools.notification")


@asynccontextmanager
async def lifespan(_: FastMCP):
    """Application lifespan manager."""
    # Startup
    logger.info("Starting up application...")
    await prisma.connect()
    logger.info("Database initialized")

    yield

    # Shutdown
    logger.info("Shutting down application...")
    await prisma.disconnect()
    logger.info("Database connections closed")


mcp = FastMCP(
    name="notification",
    instructions="This server provides notification management tools for the notification.",
    lifespan=lifespan,
)

# Services
notification_service = NotificationService(prisma)


@mcp.tool
@log_tool
async def get_emails() -> list[Email]:
    """Get the emails from the CRM in table format.

    Returns:
        list[Email]: A list of emails from the CRM.
    """
    return await notification_service.get_emails()


@mcp.tool
@log_tool
async def get_email_by_id(email_id: int) -> Email:
    """Get an email by id.

    Args:
        email_id: The ID of the email to get.

    Returns:
        Email: The email that was found.
    """
    return await notification_service.get_email_by_id(email_id)


@mcp.tool
@log_tool
async def create_email(subject: str, body: str) -> Email:
    """Create an email with the given subject and body.

    Args:
        subject: The subject of the email.
        body: The body of the email.

    Returns:
        Email: The email that was created.
    """
    email = EmailCreateInput(subject=subject, body=body)
    return await notification_service.create_email(email)


@mcp.tool
@log_tool
async def update_email_by_id(email_id: int, subject: str, body: str) -> Email:
    """Update an email with the given subject and body.

    Args:
        email_id: The ID of the email to update.
        subject: The subject of the email.
        body: The body of the email.

    Returns:
        Email: The email that was updated.
    """
    email = EmailUpdateInput(id=email_id, subject=subject, body=body)
    return await notification_service.update_email(email)


@mcp.tool
@log_tool
async def delete_email_by_id(email_id: int) -> Email:
    """Delete an email by email id.

    Args:
        email_id: The ID of the email to delete.

    Returns:
        Email: The email that was deleted.
    """
    return await notification_service.delete_email(email_id)


@mcp.tool
@log_tool
async def send_email_by_id(email_id: int) -> Email:
    """Send an email by email id.

    Args:
        email_id: The ID of the email to send.

    Returns:
        Email: The email that was sent.
    """
    return await notification_service.update_email(
        EmailUpdateInput(id=email_id, status=EmailStatus.SENT)
    )
