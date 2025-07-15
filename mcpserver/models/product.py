"""
Product route models.
"""

from .base import CamelCaseModel


class CategoryResponse(CamelCaseModel):
    """
    Category response model.
    """

    id: int
    name: str
    description: str | None = None


class SubcategoryResponse(CamelCaseModel):
    """
    Subcategory response model.
    """

    id: int
    name: str
    description: str | None = None


class ProductResponse(CamelCaseModel):
    """
    Product response model.
    """

    id: int
    sku: str
    name: str
    description: str | None = None
    size: str | None = None
    unit: str | None = None
    price: float
    currency: str
    cost: float | None = None
    category: CategoryResponse
    subcategory: SubcategoryResponse
