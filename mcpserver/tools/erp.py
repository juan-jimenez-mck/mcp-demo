"""
ERP tools for the MCP server.
"""

import logging
from contextlib import asynccontextmanager

from fastmcp import FastMCP

from core.db import prisma
from prisma.models import Order, OrderItem
from prisma.types import (
    OrderCreateInput,
    OrderItemCreateInput,
    OrderItemUpdateInput,
)
from services.order import OrderService
from utils.logs import log_tool

logger = logging.getLogger("mcpserver.tools.erp")


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
    name="erp",
    instructions="This server provides ERP management tools for the ERP.",
    lifespan=lifespan,
)

# Services
order_service = OrderService(prisma)


@mcp.tool
@log_tool
async def get_orders() -> list[Order]:
    """Get the orders from the ERP in table format.

    Returns:
        list[Order]: A list of orders from the ERP.
    """
    return await order_service.get_orders()


@mcp.tool
@log_tool
async def get_order_by_id(order_id: int) -> Order:
    """Get the order from the ERP by order ID.

    Args:
        order_id: The ID of the order to get.

    Returns:
        Order: The order that was found.
    """
    return await order_service.get_order_by_id(order_id)


@mcp.tool
@log_tool
async def fuzzy_search_orders_by_account_name(
    account_name_query: str,
) -> list[Order] | str:
    """Fuzzy search the orders from the ERP by account.

    Args:
        account_name_query: The query to fuzzy search the orders by.

    Returns:
        list[Order] | str: A list of orders or a string if no orders are found.
    """
    orders = await order_service.get_orders(
        where={
            "account": {
                "name": {"contains": account_name_query, "mode": "insensitive"},
            },
        }
    )

    if not orders:
        return "No orders found. Try a different account name."

    if len(orders) == 0:
        return "No orders found. Try a different account name."

    return orders


@mcp.tool
@log_tool
async def create_order_for_account(
    account_id: int,
    sales_rep_id: int,
) -> list[Order] | str:
    """Create an order for an account. Fuzzy search the account name to get accounts details.

    Args:
        account_id: The ID of the account to create the order for.
        sales_rep_id: The ID of the sales rep to create the order for.

    Returns:
        Order: The order that was created.
    """
    try:
        order_payload = OrderCreateInput(
            account_id=account_id, sales_rep_id=sales_rep_id
        )

        return await order_service.create_order(order_payload)

    except Exception as e:
        return f"Error creating order: {e}"


@mcp.tool
@log_tool
async def add_order_item(
    order_id: int,
    product_id: int,
    quantity: int,
    price: float,
) -> OrderItem | str:
    """Create an order item for an order.
    Fuzzy search the product name to get product the product id.

    Args:
        order_id: The ID of the order to add the item to.
        product_id: The ID of the product to add to the order.
        quantity: The quantity of the product to add to the order.
        price: The price of the product to add to the order.

    Returns:
        OrderItem: The order item that was created.
    """
    try:
        order_item_payload = OrderItemCreateInput(
            order_id=order_id,
            product_id=product_id,
            quantity=quantity,
            price=price,
            total=price * quantity,
        )

        return await order_service.create_order_item(order_item_payload)
    except Exception as e:
        return f"Error creating order: {e}"


@mcp.tool
@log_tool
async def update_order_item_quantity(
    order_item_id: int,
    new_quantity: int,
) -> OrderItem | str:
    """Update the quantity of an order item.

    Args:
        order_item_id: The ID of the order item to update.
        new_quantity: The new quantity of the order item.

    Returns:
        OrderItem: The order item that was updated.
    """
    try:
        order_item = await order_service.get_order_item_by_id(order_item_id)

        if not order_item:
            return "Order item not found."

        order_item_payload = OrderItemUpdateInput(
            id=order_item_id,
            quantity=new_quantity,
            total=order_item.price * new_quantity,
        )

        return await order_service.update_order_item(order_item_payload)

    except Exception as e:
        return f"Error updating order item: {e}"


@mcp.tool
@log_tool
async def delete_order_item(order_item_id: int) -> OrderItem | str:
    """Deletes an order item. Returns the item if deleted successfully.

    Args:
        order_item_id: The ID of the order item to delete.

    Returns:
        OrderItem: The order item that was deleted.
    """
    try:
        return await order_service.delete_order_item(where={"id": order_item_id})
    except Exception as e:
        return f"Error deleting order item: {e}"


@mcp.tool
@log_tool
async def delete_order_item_by_sku_name_and_order_id(
    sku_name: str,
    order_id: int,
) -> OrderItem | str:
    """Deletes an order item by sku name and order id. Returns the item if deleted successfully.

    Args:
        sku_name: The name of the sku to delete.
        order_id: The ID of the order to delete the item from.

    Returns:
        OrderItem: The order item that was deleted.
    """
    try:
        return await order_service.delete_order_item(
            where={
                "order_id": order_id,
                "product": {
                    "name": {
                        "contains": sku_name,
                        "mode": "insensitive",
                    }
                },
            }
        )
    except Exception as e:
        return f"Error deleting order item: {e}"


@mcp.tool
@log_tool
async def fuzzy_search_order_item_by_sku_name_and_order_id(
    sku_name_query: str,
    order_id: int,
) -> list[OrderItem] | str:
    """Fuzzy search the order items from the ERP by sku name and order id.

    Args:
        sku_name_query: The query to fuzzy search the order items by.
        order_id: The ID of the order to search the items from.

    Returns:
        list[OrderItem]: A list of order items that match the query.
    """
    order_items = await order_service.get_order_items(
        where={
            "order_id": order_id,
            "product": {
                "name": {
                    "contains": sku_name_query,
                    "mode": "insensitive",
                },
            },
        }
    )

    if not order_items:
        return "No order items found. Try a different sku name or order id."

    if len(order_items) == 0:
        return "No order items found. Try a different sku name or order id."

    return order_items
