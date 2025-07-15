"""
CRM tools for the MCP server.
"""

import logging
from contextlib import asynccontextmanager

from fastmcp import FastMCP

from core.db import prisma
from models.account import ActionItemResponse
from prisma.models import Account, AccountInsight, User
from services.account import AccountService
from services.user import UserService
from utils.logs import log_tool

logger = logging.getLogger("mcpserver.tools.crm")


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
    name="crm",
    instructions="This server provides CRM management tools for the CRM.",
    lifespan=lifespan,
)

# Services
account_service = AccountService(prisma)
user_service = UserService(prisma)


@mcp.tool
@log_tool
async def get_accounts() -> list[Account]:
    """Get the accounts from the CRM in table format.

    Returns:
        list[Account]: A list of accounts from the CRM.
    """
    return await account_service.get_accounts()


@mcp.tool
@log_tool
async def get_sales_rep_accounts(sales_rep_id: int) -> list[Account]:
    """Get sales rep accounts by sales rep id.

    Args:
        sales_rep_id: The ID of the sales rep to get accounts for.

    Returns:
        list[Account]: A list of accounts for the sales rep.
    """
    return await account_service.get_accounts(where={"sales_rep_id": sales_rep_id})


@mcp.tool
@log_tool
async def fuzzy_search_accounts(account_name_query: str) -> list[Account]:
    """Fuzzy search the accounts from the CRM.

    Args:
        account_name_query: The query to fuzzy search the accounts by.

    Returns:
        list[Account]: A list of accounts that match the query.
    """
    accounts = await account_service.get_accounts(
        where={
            "OR": [
                {"name": {"contains": account_name_query, "mode": "insensitive"}},
                {
                    "description": {
                        "contains": account_name_query,
                        "mode": "insensitive",
                    }
                },
            ]
        }
    )

    if not accounts:
        return "No accounts found. Try a different account name."

    if len(accounts) == 0:
        return "No accounts found. Try a different account name."

    return accounts


@mcp.tool
@log_tool
async def get_user_by_id(user_id: int) -> User:
    """Get a user by ID. This could be a sales rep or an admin.

    Args:
        user_id: The ID of the user to get.

    Returns:
        User: The user that was found.
    """
    return await user_service.get_user_by_id(user_id)


@mcp.tool
@log_tool
async def fuzzy_search_account_insights_by_account_name(
    account_name: str,
) -> list[AccountInsight]:
    """Get the account insights for an account by fuzzy search name.

    Args:
        account_name: The query to fuzzy search the account insights by.

    Returns:
        list[AccountInsight]: A list of account insights that match the query.
    """
    insights = await account_service.get_account_insights(
        where={
            "account": {
                "name": {
                    "contains": account_name,
                    "mode": "insensitive",
                }
            }
        }
    )
    return insights


@mcp.tool
@log_tool
async def get_sales_rep_action_items(
    sales_rep_id: int,
) -> list[ActionItemResponse]:
    """Get the action items for a sales rep by sales rep id.

    Args:
        sales_rep_id: The ID of the sales rep to get action items for.

    Returns:
        list[ActionItemResponse]: A list of action items for the sales rep.
    """
    action_items = await account_service.get_action_items(
        where={
            "user_id": sales_rep_id,
        }
    )
    return [
        ActionItemResponse.model_validate(action_item) for action_item in action_items
    ]
