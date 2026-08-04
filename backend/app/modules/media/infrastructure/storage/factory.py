from app.modules.media.domain.enums import StorageProvider as StorageProviderEnum
from app.modules.media.infrastructure.storage.local_storage import LocalStorageProvider
from app.modules.media.infrastructure.storage.provider import StorageProvider


class S3StorageProvider(StorageProvider):
    """Prepared for Sprint 3 — not active."""

    def save(self, *, relative_path: str, content: bytes) -> str:
        raise NotImplementedError("S3 storage not configured")

    def save_stream(self, *, relative_path: str, stream) -> str:
        raise NotImplementedError("S3 storage not configured")

    def read(self, relative_path: str) -> bytes:
        raise NotImplementedError("S3 storage not configured")

    def delete(self, relative_path: str) -> None:
        raise NotImplementedError("S3 storage not configured")

    def exists(self, relative_path: str) -> bool:
        raise NotImplementedError("S3 storage not configured")

    def resolve_path(self, relative_path: str):
        raise NotImplementedError("S3 storage not configured")

    def copy(self, source: str, destination: str) -> str:
        raise NotImplementedError("S3 storage not configured")

    def move(self, source: str, destination: str) -> str:
        raise NotImplementedError("S3 storage not configured")

    def public_url(self, relative_path: str) -> str:
        raise NotImplementedError("S3 storage not configured")

    def unique_filename(self, original: str) -> str:
        raise NotImplementedError("S3 storage not configured")


MinIOStorageProvider = S3StorageProvider
R2StorageProvider = S3StorageProvider


def get_storage_provider(provider: str | StorageProviderEnum = StorageProviderEnum.LOCAL) -> StorageProvider:
    key = str(provider)
    if key in (StorageProviderEnum.LOCAL, "local"):
        return LocalStorageProvider()
    if key in (StorageProviderEnum.S3, "s3"):
        return S3StorageProvider()
    if key in (StorageProviderEnum.MINIO, "minio"):
        return MinIOStorageProvider()
    if key in (StorageProviderEnum.R2, "r2"):
        return R2StorageProvider()
    return LocalStorageProvider()
