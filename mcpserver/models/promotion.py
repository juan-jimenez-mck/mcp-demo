from pydantic import BaseModel

from models.product import ProductResponse


class PromotionResponse(BaseModel):
    """
    Promotion response model.
    """

    id: int
    name: str
    description: str | None = None
    type: str
    status: str
    discount: float
    min_quantity: int | None = None
    base_volume: int | None = None
    product_id: int
    product: ProductResponse
