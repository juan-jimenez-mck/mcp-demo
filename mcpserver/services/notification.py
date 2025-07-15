"""
Notification service for interacting with the notification.
"""

from prisma import Prisma
from prisma.models import Email
from prisma.types import EmailCreateInput, EmailUpdateInput, EmailWhereInput


class NotificationService:
    """Service for interacting with the notification."""

    def __init__(self, db: Prisma):
        self.db = db

    async def get_emails(self, where: EmailWhereInput | None = None) -> list[Email]:
        """Get the emails from the CRM.

        Args:
            where: The where clause to filter the emails.

        Returns:
            list[Email]: The emails from the CRM.
        """

        return await self.db.email.find_many(
            where=where,
        )

    async def get_email_by_id(self, email_id: int) -> Email | None:
        """Get an email by id.

        Args:
            id: The id of the email.

        Returns:
            Email: The email from the CRM.
        """

        return await self.db.email.find_unique(where={"id": email_id})

    async def create_email(self, email: EmailCreateInput) -> Email:
        """Create an email.

        Args:
            email: The email to create.

        Returns:
            Email: The created email.
        """

        return await self.db.email.create(data=email)

    async def update_email(self, email: EmailUpdateInput) -> Email:
        """Update an email.

        Args:
            email: The email to update.

        Returns:
            Email: The updated email.
        """

        return await self.db.email.update(where={"id": email.get("id")}, data=email)

    async def delete_email(self, email_id: int) -> Email:
        """Delete an email.

        Args:
            email_id: The id of the email.

        Returns:
            Email: The deleted email.
        """

        return await self.db.email.delete(where={"id": email_id})
