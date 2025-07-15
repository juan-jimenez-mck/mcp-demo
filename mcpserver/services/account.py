"""
Account service for interacting with the account.
"""

from prisma import Prisma
from prisma.models import Account, AccountInsight, ActionItem
from prisma.types import (
    AccountInsightWhereInput,
    AccountWhereInput,
    ActionItemWhereInput,
)


class AccountService:
    """Service for interacting with the account."""

    def __init__(self, db: Prisma):
        self.db = db

    async def get_accounts(
        self, where: AccountWhereInput | None = None
    ) -> list[Account]:
        """Get the accounts from the CRM.

        Args:
            where: The where clause to filter the accounts.

        Returns:
            list[Account]: The accounts from the CRM.
        """

        return await self.db.account.find_many(
            where=where,
            include={
                "sales_rep": True,
                "contact": True,
                "address": True,
                "territory": True,
                "insights": True,
                "action_items": True,
                "ordering_pattern": True,
            },
        )

    async def get_account_insights(
        self, where: AccountInsightWhereInput | None = None
    ) -> list[AccountInsight]:
        """Get the account insights from the CRM.

        Args:
            where: The where clause to filter the account insights.

        Returns:
            list[AccountInsight]: The account insights from the CRM.
        """
        return await self.db.accountinsight.find_many(
            where=where,
            include={
                "account": {
                    "include": {
                        "contact": True,
                        "address": True,
                        "territory": True,
                    },
                },
            },
        )

    async def get_action_items(
        self, where: ActionItemWhereInput | None = None
    ) -> list[ActionItem]:
        """Get the action items from the CRM.

        Args:
            where: The where clause to filter the action items.

        Returns:
            list[ActionItem]: The action items from the CRM.
        """
        return await self.db.actionitem.find_many(
            where=where,
            include={
                "account": {
                    "include": {
                        "contact": True,
                        "address": True,
                        "territory": True,
                    },
                },
            },
        )
