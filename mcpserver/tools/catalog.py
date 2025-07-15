"""
Catalog tools for the MCP server.
"""

import logging
from contextlib import asynccontextmanager

from fastmcp import FastMCP

from core.db import prisma
from models.promotion import PromotionResponse
from prisma.models import Category, Product, Promotion, Subcategory
from services.category import CategoryService
from services.product import ProductService
from services.promotion import PromotionService
from utils.logs import log_tool

logger = logging.getLogger("mcpserver.tools.catalog")


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
    name="catalog",
    instructions="This server provides catalog management tools for the catalog.",
    lifespan=lifespan,
)

# Services
product_service = ProductService(prisma)
category_service = CategoryService(prisma)
promotion_service = PromotionService(prisma)


@mcp.tool
@log_tool
async def get_products() -> list[Product]:
    """Get all the products from the catalog.

    Returns:
        list[Product]: A list of products from the catalog.
    """
    return await product_service.get_products()


@mcp.tool
@log_tool
async def get_products_by_id(product_id: int) -> Product:
    """Get the product from the catalog that matches the ID.

    Args:
        product_id: The ID of the product to get.

    Returns:
        Product: The product that was found.
    """
    return await product_service.get_product_by_id(product_id)


@mcp.tool
@log_tool
async def get_product_by_sku(sku: str) -> Product:
    """Get the product from the catalog that matches the SKU.

    Args:
        sku: The SKU of the product to get.

    Returns:
        Product: The product that was found.
    """
    return await product_service.get_products(where={"sku": sku})


@mcp.tool
@log_tool
async def fuzzy_search_products_by_category_or_subcategory(
    search_term: str,
) -> list[Product]:
    """Fuzzy search for products by category or subcategory.

    Args:
        search_term: The term to fuzzy search the products by.

    Returns:
        list[Product]: A list of products that match the query.
    """
    return await product_service.get_products(
        where={
            "OR": [
                {
                    "category": {
                        "name": {"contains": search_term, "mode": "insensitive"}
                    }
                },
                {
                    "subcategory": {
                        "name": {"contains": search_term, "mode": "insensitive"}
                    }
                },
            ]
        }
    )


@mcp.tool
@log_tool
async def fuzzy_search_products_by_product_name(
    product_name_query: str,
) -> list[Product]:
    """Fuzzy search for products by product name.

    Args:
        product_name_query: The query to fuzzy search the products by.

    Returns:
        list[Product]: A list of products that match the query.
    """
    return await product_service.get_products(
        where={
            "name": {
                "contains": product_name_query,
                "mode": "insensitive",
            }
        }
    )


@mcp.tool
@log_tool
async def fuzzy_search_products_by_sku(sku_name_query: str) -> list[Product]:
    """Fuzzy search for products by sku query.

    Args:
        sku_name_query: The query to fuzzy search the products by.

    Returns:
        list[Product]: A list of products that match the query.
    """
    return await product_service.get_products(
        where={
            "sku": {
                "contains": sku_name_query,
                "mode": "insensitive",
            }
        }
    )


@mcp.tool
@log_tool
async def get_categories() -> list[Category]:
    """Get the categories from the catalog.

    Returns:
        list[Category]: A list of categories from the catalog.
    """
    return await category_service.get_categories()


@mcp.tool
@log_tool
async def get_subcategories() -> list[Subcategory]:
    """Get the subcategories from the catalog.

    Returns:
        list[Subcategory]: A list of subcategories from the catalog.
    """
    return await category_service.get_subcategories()


@mcp.tool
@log_tool
async def get_promotions() -> list[Promotion]:
    """Get the promotions from the catalog.

    Returns:
        list[Promotion]: A list of promotions from the catalog.
    """
    return await promotion_service.get_promotions()


@mcp.tool
@log_tool
async def get_promotion_by_id(promotion_id: int) -> Promotion:
    """Get the promotion from the catalog that matches the ID.

    Args:
        promotion_id: The ID of the promotion to get.

    Returns:
        Promotion: The promotion that was found.
    """
    return await promotion_service.get_promotion_by_id(promotion_id)


@mcp.tool
@log_tool
async def fuzzy_search_promotions_by_name(
    promotion_name_query: str,
) -> list[Promotion]:
    """Fuzzy search for promotions by promotion name.

    Args:
        promotion_name_query: The query to fuzzy search the promotions by.

    Returns:
        list[Promotion]: A list of promotions that match the query.
    """
    return await promotion_service.get_promotions(
        where={
            "name": {
                "contains": promotion_name_query,
                "mode": "insensitive",
            }
        }
    )


@mcp.tool
@log_tool
async def fuzzy_search_promotions_by_product_name(
    product_name_query: str,
) -> list[PromotionResponse]:
    """Fuzzy search for promotions by product name.

    Args:
        product_name_query: The query to fuzzy search the promotions by.

    Returns:
        list[PromotionResponse]: A list of promotions that match the query.
    """
    return await promotion_service.get_promotions(
        where={
            "product": {
                "name": {
                    "contains": product_name_query,
                    "mode": "insensitive",
                }
            }
        }
    )


@mcp.tool
@log_tool
async def fuzzy_search_promotions_by_product_sku(
    product_sku_query: str,
) -> list[PromotionResponse]:
    """Fuzzy search for promotions by product sku.

    Args:
        product_sku_query: The query to fuzzy search the promotions by.

    Returns:
        list[PromotionResponse]: A list of promotions that match the query.
    """
    return await promotion_service.get_promotions(
        where={
            "product": {
                "sku": {
                    "contains": product_sku_query,
                    "mode": "insensitive",
                }
            }
        }
    )
