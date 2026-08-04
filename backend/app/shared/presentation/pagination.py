from typing import Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=25, ge=1, le=100)

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.limit


class PaginatedResponse(BaseModel, Generic[T]):
    data: list[T]
    page: int
    limit: int
    total: int
    total_pages: int

    @classmethod
    def create(cls, data: list[T], *, page: int, limit: int, total: int) -> "PaginatedResponse[T]":
        total_pages = max(1, (total + limit - 1) // limit) if total else 1
        return cls(data=data, page=page, limit=limit, total=total, total_pages=total_pages)
