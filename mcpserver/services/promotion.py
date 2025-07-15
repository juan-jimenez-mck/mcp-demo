"""
Promotion service for interacting with the promotion catalog.
"""

from prisma import Prisma
from prisma.models import Promotion
from prisma.types import PromotionWhereInput


class PromotionService:
    """Service for interacting with the promotion catalog."""

    def __init__(self, db: Prisma):
        self.db = db

    async def get_promotions(
        self, where: PromotionWhereInput | None = None
    ) -> list[Promotion]:
        """Get the promotions from the catalog.

        Args:
            where: The where clause to filter the promotions.

        Returns:
            list[Promotion]: The promotions from the catalog.
        """

        return await self.db.promotion.find_many(
            include={
                "product": True,
            },
            where=where,
        )

    async def get_promotion_by_id(self, promotion_id: int) -> Promotion:
        """Get the promotion from the catalog that matches the ID.

        Args:
            promotion_id: The id of the promotion.

        Returns:
            Promotion: The promotion from the catalog that matches the ID.
        """

        return await self.db.promotion.find_unique(
            where={"id": promotion_id},
            include={
                "product": True,
            },
        )
