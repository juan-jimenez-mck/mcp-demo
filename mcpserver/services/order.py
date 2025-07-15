"""
Order service for interacting with the order.
"""

from prisma import Prisma
from prisma.models import Order, OrderItem
from prisma.types import (
    OrderCreateInput,
    OrderItemCreateInput,
    OrderItemUpdateInput,
    OrderItemWhereInput,
    OrderWhereInput,
)


class OrderService:
    """Service for interacting with the order."""

    def __init__(self, db: Prisma):
        self.db = db

    async def get_orders(self, where: OrderWhereInput | None = None) -> list[Order]:
        """Get the orders from the ERP.

        Args:
            where: The where clause to filter the orders.

        Returns:
            list[Order]: The orders from the ERP.
        """

        return await self.db.order.find_many(
            where=where,
            include={
                "account": {
                    "include": {
                        "address": True,
                        "contact": True,
                        "territory": True,
                    },
                },
                "items": {
                    "include": {
                        "product": {
                            "include": {
                                "category": True,
                                "subcategory": True,
                            },
                        },
                        "promotion": True,
                    },
                },
            },
        )

    async def get_order_by_id(self, order_id: int) -> Order:
        """Get an order from the ERP.

        Args:
            order_id: The id of the order.

        Returns:
            Order: The order from the ERP.
        """

        print("ORDER ID")
        print(order_id)

        return await self.db.order.find_unique(
            where={"id": order_id},
            include={
                "account": {
                    "include": {
                        "address": True,
                        "contact": True,
                        "territory": True,
                    },
                },
                "items": {
                    "include": {
                        "promotion": True,
                        "product": {
                            "include": {
                                "category": True,
                                "subcategory": True,
                            },
                        },
                    },
                },
            },
        )

    async def create_order(self, payload: OrderCreateInput) -> Order:
        """Create an order in the ERP.

        Args:
            payload: The payload of the order.

        Returns:
            Order: The order from the ERP.
        """
        print("CREATING ORDER")
        print(payload)
        try:
            return await self.db.order.create(
                data={
                    "account_id": payload.get("account_id"),
                    "sales_rep_id": payload.get("sales_rep_id"),
                },
                include={
                    "account": True,
                    "items": {
                        "include": {
                            "product": True,
                        },
                    },
                },
            )
        except Exception as e:
            print("ERROR CREATING ORDER")
            print(e)
            raise e

    async def get_order_items(
        self, where: OrderItemWhereInput | None = None
    ) -> list[OrderItem]:
        """Get the order items from the ERP.

        Args:
            where: The where clause to filter the order items.

        Returns:
            list[OrderItem]: The order items from the ERP.
        """
        return await self.db.orderitem.find_many(
            where=where,
            include={
                "product": True,
                "promotion": True,
            },
        )

    async def get_order_item_by_id(self, order_item_id: int) -> OrderItem:
        """Get an order item from the ERP.

        Args:
            order_item_id: The id of the order item.

        Returns:
            OrderItem: The order item from the ERP.
        """
        return await self.db.orderitem.find_unique(
            where={"id": order_item_id},
            include={
                "product": True,
                "promotion": True,
            },
        )

    async def create_order_item(self, payload: OrderItemCreateInput) -> OrderItem:
        """Create an order item in the ERP.

        Args:
            payload: The payload of the order item.

        Returns:
            OrderItem: The order item from the ERP.
        """
        print("CREATING ORDER ITEM")
        print(payload)
        return await self.db.orderitem.create(data=payload)

    async def update_order_item(self, payload: OrderItemUpdateInput) -> OrderItem:
        """Update an order item in the ERP.

        Args:
            payload: The payload of the order item.

        Returns:
            OrderItem: The order item from the ERP.
        """
        print("UPDATING ORDER ITEM")
        print(payload)
        return await self.db.orderitem.update(
            data=payload, where={"id": payload.get("id")}
        )

    async def delete_order_item(self, where: OrderItemWhereInput) -> OrderItem:
        """Delete an order item in the ERP.

        Args:
            where: The where clause to filter the order item.

        Returns:
            OrderItem: The order item from the ERP.
        """
        print("DELETING ORDER ITEM")
        print(where)
        return await self.db.orderitem.delete(where=where)
