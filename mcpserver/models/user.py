"""
User route models.
"""

from .base import CamelCaseModel
from .chat import ChatSessionResponse


class TerritoryResponse(CamelCaseModel):
    """
    Territory response model.
    """

    id: int
    name: str
    description: str | None = None


class UserResponse(CamelCaseModel):
    """
    User response model.
    """

    id: int
    first_name: str
    last_name: str
    email: str
    role: str
    territory_id: int | None = None
    territory: TerritoryResponse | None = None
    chatSessions: list[ChatSessionResponse] | None = None
