"""
User service for getting users.
"""

from prisma import Prisma
from prisma.models import User
from prisma.types import UserWhereInput


class UserService:
    """Service for getting users."""

    def __init__(self, db: Prisma):
        self.db = db

    async def get_users(self, where: UserWhereInput | None = None) -> list[User]:
        """Get all users.

        Args:
            where: The where clause to filter the users.

        Returns:
            User: The user.
        """

        return await self.db.user.find_many(
            where=where,
            include={
                "territory": True,
                "chat_sessions": True,
            },
        )

    async def get_user_by_id(self, user_id: int) -> User:
        """Get a user by ID.

        Args:
            id: The ID of the user.

        Returns:
            User: The user.
        """

        return await self.db.user.find_unique(
            where={
                "id": user_id,
            },
            include={
                "territory": True,
            },
        )
