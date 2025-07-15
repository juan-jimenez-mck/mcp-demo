"""
User route models.
"""

from datetime import datetime

from prisma.enums import OrderStatus, PaymentStatus

from .account import AccountResponse
from .base import CamelCaseModel
from .product import ProductResponse


class OrderItemResponse(CamelCaseModel):
    """
    Order item response model.
    """

    id: int
    quantity: int
    price: float
    product_id: int
    price: float
    total: float
    order_id: int
    product: ProductResponse


class OrderResponse(CamelCaseModel):
    """
    Order response model.
    """

    id: int
    account_id: int
    sales_rep_id: int
    account: AccountResponse
    payment_status: PaymentStatus
    status: OrderStatus
    notes: str | None = None
    created_at: datetime
    updated_at: datetime | None = None
    collection_date: datetime | None = None
    items: list[OrderItemResponse] = []
