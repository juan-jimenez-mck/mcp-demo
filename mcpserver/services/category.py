"""
Product service for interacting with the product catalog.
"""

from prisma import Prisma
from prisma.models import Category, Subcategory
from prisma.types import CategoryWhereInput, SubcategoryWhereInput


class CategoryService:
    """Service for interacting with the product catalog."""

    def __init__(self, db: Prisma):
        self.db = db

    async def get_categories(
        self, where: CategoryWhereInput | None = None
    ) -> list[Category]:
        """Get the categories from the catalog.

        Args:
            where: The where clause to filter the categories.

        Returns:
            list[Category]: The categories from the catalog.
        """

        return await self.db.category.find_many(
            where=where,
            include={
                "subcategories": True,
            },
        )

    async def get_subcategories(
        self, where: SubcategoryWhereInput | None = None
    ) -> list[Subcategory]:
        """Get the subcategories from the catalog.

        Args:
            where: The where clause to filter the subcategories.

        Returns:
            list[Subcategory]: The subcategories from the catalog.
        """

        return await self.db.subcategory.find_many(
            where=where,
            include={
                "category": True,
            },
        )

    async def fuzzy_search_by_category(self, category: str) -> list[Category]:
        """Fuzzy search for categories by category name.

        Args:
            category: The category to search for.

        Returns:
            list[Category]: The categories from the catalog that match the category.
        """

        return await self.db.category.find_many(
            include={
                "subcategories": True,
            },
            where={
                "category": {
                    "name": {
                        "contains": category,
                        "mode": "insensitive",
                    }
                }
            },
        )
