"""
Chat route models.
"""

from datetime import datetime

from .base import CamelCaseModel, SnakeCaseModel


class ChatMessageResponse(CamelCaseModel):
    """
    Chat message response model.
    """

    id: int
    content: str
    role: str
    metadata: str | None = None
    context: str | None = None
    session_id: int
    created_at: datetime
    updated_at: datetime | None = None


class ChatSessionResponse(CamelCaseModel):
    """
    Chat session response model.
    """

    id: int
    title: str | None = None
    user_id: int
    created_at: datetime
    updated_at: datetime | None = None
    messages: list[ChatMessageResponse]


class ChatRequest(SnakeCaseModel):
    """
    Chat request model.
    """

    message: str
    user_id: int
    session_id: int | None = None
    context: str | None = None
