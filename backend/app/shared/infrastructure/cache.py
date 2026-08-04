import hashlib
import json
import logging
from typing import Any

from app.config import settings

logger = logging.getLogger(__name__)


class CacheService:
    """Redis cache with in-memory fallback for tests and dev without Redis."""

    _memory: dict[str, tuple[str, bytes]] = {}

    def __init__(self) -> None:
        self._redis = None
        if settings.redis_url:
            try:
                import redis

                self._redis = redis.from_url(settings.redis_url, decode_responses=False)
                self._redis.ping()
            except Exception as exc:  # noqa: BLE001
                logger.warning("Redis unavailable, using in-memory cache: %s", exc)
                self._redis = None

    @staticmethod
    def compute_etag(payload: Any) -> str:
        raw = json.dumps(payload, sort_keys=True, default=str).encode()
        return f'"{hashlib.md5(raw).hexdigest()}"'  # noqa: S324

    def get(self, key: str) -> bytes | None:
        if self._redis:
            return self._redis.get(key)
        entry = self._memory.get(key)
        return entry[1] if entry else None

    def set(self, key: str, value: bytes, ttl: int | None = None) -> None:
        if self._redis:
            self._redis.set(key, value, ex=ttl or settings.cache_default_ttl)
            return
        self._memory[key] = ("memory", value)

    def delete(self, key: str) -> None:
        if self._redis:
            self._redis.delete(key)
        self._memory.pop(key, None)

    def invalidate_pattern(self, pattern: str) -> int:
        if self._redis:
            keys = self._redis.keys(pattern)
            if keys:
                return self._redis.delete(*keys)
            return 0
        prefix = pattern.rstrip("*")
        to_delete = [k for k in self._memory if k.startswith(prefix)]
        for k in to_delete:
            del self._memory[k]
        return len(to_delete)

    @staticmethod
    def clear_memory() -> None:
        CacheService._memory.clear()


_cache: CacheService | None = None


def get_cache() -> CacheService:
    global _cache
    if _cache is None:
        _cache = CacheService()
    return _cache
