from pydantic import BaseModel, Field


class PageCreate(BaseModel):
    slug: str = Field(min_length=1, max_length=120)
    locale: str = Field(default="fr", max_length=10)
    title: str = Field(min_length=1, max_length=255)
    meta_title: str | None = None
    meta_description: str | None = None
    template: str = "default"


class PageUpdate(BaseModel):
    title: str | None = None
    meta_title: str | None = None
    meta_description: str | None = None
    template: str | None = None
    slug: str | None = None


class SectionCreate(BaseModel):
    section_type_slug: str
    content: dict = Field(default_factory=dict)
    sort_order: int | None = None
    is_visible: bool = True
    locale: str = "fr"


class SectionUpdate(BaseModel):
    section_type_slug: str | None = None
    content: dict | None = None
    sort_order: int | None = None
    is_visible: bool | None = None


class ReorderBody(BaseModel):
    ordered_ids: list[int]


class PublishNote(BaseModel):
    note: str | None = None


class PreviewRequest(BaseModel):
    version_id: int | None = None


class MenuItemCreate(BaseModel):
    label: str
    url: str
    parent_id: int | None = None
    is_external: bool = False
    sort_order: int | None = None


class MenuItemUpdate(BaseModel):
    label: str | None = None
    url: str | None = None
    parent_id: int | None = None
    is_external: bool | None = None
    sort_order: int | None = None


class TranslationUpsert(BaseModel):
    field_key: str
    locale: str
    value: str


class TranslationsUpdate(BaseModel):
    translations: list[TranslationUpsert]
