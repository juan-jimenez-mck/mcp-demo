"""
Account response model.
"""

from datetime import datetime

from .base import CamelCaseModel
from .user import TerritoryResponse


class OrderingPatternResponse(CamelCaseModel):
    """
    Ordering pattern response model.
    """

    id: int
    frequency: str
    account_id: int
    average_order_value: float
    preferred_order_day: str | None = None
    seasonality: str | None = None


class AddressResponse(CamelCaseModel):
    """
    Address response model.
    """

    id: int
    street: str
    city: str
    state: str
    zip_code: str
    country: str


class ContactResponse(CamelCaseModel):
    """
    Contact response model.
    """

    id: int
    name: str
    email: str
    phone: str | None = None
    company: str | None = None


class AccountResponse(CamelCaseModel):
    """
    Account response model.
    """

    id: int
    name: str
    description: str | None = None
    notes: str | None = None
    industry: str | None = None
    credit_limit: float | None = None
    territory_id: int
    address: AddressResponse
    contact: ContactResponse
    territory: TerritoryResponse
    ordering_pattern: OrderingPatternResponse | None = None


class AccountInsightResponse(CamelCaseModel):
    """
    Account insight response model.
    """

    id: int
    account_id: int
    type: str
    priority: str
    title: str
    description: str
    confidence: float
    value: float | None
    account: AccountResponse


class ActionItemResponse(CamelCaseModel):
    """
    Action item response model.
    """

    id: int
    account_id: int
    user_id: int
    type: str
    priority: str
    title: str
    due_time: datetime | None
    completed: bool
    account: AccountResponse
