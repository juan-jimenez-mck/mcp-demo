"""
Base models for API responses with automatic camelCase conversion.
"""

import re

from pydantic import BaseModel, ConfigDict


def to_camel_case(string: str) -> str:
    """Convert snake_case to camelCase."""
    components = string.split("_")
    return components[0] + "".join(word.capitalize() for word in components[1:])


def to_snake_case(string: str) -> str:
    """Convert camelCase to snake_case."""
    # Insert an underscore before any uppercase letter that follows a lowercase letter
    s1 = re.sub("([a-z0-9])([A-Z])", r"\1_\2", string)
    return s1.lower()


class CamelCaseModel(BaseModel):
    """
    Base model for snake_case field names that outputs camelCase in JSON.

    Use this when:
    - Your model fields are defined in snake_case
    - You want JSON output to use camelCase
    - You want to accept both snake_case and camelCase input
    """

    model_config = ConfigDict(
        alias_generator=to_camel_case,
        populate_by_name=True,  # Allow both snake_case and camelCase when parsing input
        from_attributes=True,  # Allow creation from ORM objects
    )


class SnakeCaseModel(BaseModel):
    """
    Base model for camelCase field names that outputs snake_case in JSON.

    Use this when:
    - Your model fields are defined in camelCase
    - You want JSON output to use snake_case
    - You want to accept both camelCase and snake_case input
    """

    model_config = ConfigDict(
        alias_generator=to_snake_case,
        populate_by_name=True,  # Allow both camelCase and snake_case when parsing input
        from_attributes=True,  # Allow creation from ORM objects
    )
