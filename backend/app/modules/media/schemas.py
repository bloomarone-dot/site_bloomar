from pydantic import BaseModel


class MediaVariantOut(BaseModel):
    id: int
    variant_name: str
    url: str
    width: int | None
    height: int | None
    size_bytes: int

    model_config = {"from_attributes": True}


class MediaOut(BaseModel):
    id: int
    filename: str
    original_filename: str
    mime_type: str
    size_bytes: int
    url: str
    width: int | None
    height: int | None
    alt_text: str | None
    folder: str
    variants: list[MediaVariantOut] = []

    model_config = {"from_attributes": True}
