from enum import StrEnum


class MediaStatus(StrEnum):
    ACTIVE = "active"
    TRASHED = "trashed"


class StorageProvider(StrEnum):
    LOCAL = "local"
    MINIO = "minio"
    S3 = "s3"
    R2 = "r2"


class VariantName(StrEnum):
    THUMBNAIL = "thumbnail"
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    ORIGINAL = "original"
    WEBP = "webp"


# Legacy Sprint 0 names kept for backward compatibility in responses
LEGACY_VARIANT_MAP = {
    VariantName.THUMBNAIL: "thumb_150",
    VariantName.SMALL: "thumb_400",
    VariantName.MEDIUM: "thumb_800",
}

VARIANT_MAX_SIZES: dict[VariantName, int | None] = {
    VariantName.THUMBNAIL: 150,
    VariantName.SMALL: 400,
    VariantName.MEDIUM: 800,
    VariantName.LARGE: 1600,
    VariantName.ORIGINAL: None,
    VariantName.WEBP: None,
}

ALLOWED_MIME_TYPES: set[str] = {
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/svg+xml",
    "image/gif",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
    "audio/mpeg",
    "audio/wav",
    "audio/x-wav",
    "video/mp4",
    "video/webm",
}

EXTENSION_TO_MIME: dict[str, str] = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".gif": "image/gif",
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".zip": "application/zip",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
}
