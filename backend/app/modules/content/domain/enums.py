from enum import StrEnum


class PageStatus(StrEnum):
    DRAFT = "draft"
    REVIEW = "review"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class PublicationAction(StrEnum):
    SUBMIT_REVIEW = "submit_review"
    PUBLISH = "publish"
    ARCHIVE = "archive"
    ROLLBACK = "rollback"
    RETURN_DRAFT = "return_draft"


ALLOWED_TRANSITIONS: dict[PageStatus, set[PageStatus]] = {
    PageStatus.DRAFT: {PageStatus.REVIEW},
    PageStatus.REVIEW: {PageStatus.DRAFT, PageStatus.PUBLISHED},
    PageStatus.PUBLISHED: {PageStatus.ARCHIVED, PageStatus.DRAFT},
    PageStatus.ARCHIVED: {PageStatus.DRAFT, PageStatus.PUBLISHED},
}
