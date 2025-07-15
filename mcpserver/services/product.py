"""
Product service for interacting with the product catalog.
"""

from prisma import Prisma
from prisma.models import Product
from prisma.types import ProductWhereInput


class ProductService:
    """Service for interacting with the product catalog."""

    def __init__(self, db: Prisma):
        self.db = db

    async def get_products(
        self, where: ProductWhereInput | None = None
    ) -> list[Product]:
        """Get the products from the catalog.

        Args:
            where: The where clause to filter the products.

        Returns:
            list[Product]: The products from the catalog.
        """

        return await self.db.product.find_many(
            include={
                "category": True,
                "subcategory": True,
                "promotions": True,
            },
            where=where,
        )

    async def get_product_by_id(self, product_id: int) -> Product:
        """Get the product from the catalog that matches the ID.

        Args:
            product_id: The id of the product.

        Returns:
            Product: The product from the catalog that matches the ID.
        """

        return await self.db.product.find_unique(
            where={"id": product_id},
            include={
                "category": True,
                "subcategory": True,
                "promotions": True,
            },
        )
