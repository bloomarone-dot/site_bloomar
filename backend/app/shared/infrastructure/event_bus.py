from collections.abc import Callable

from app.shared.domain.events import (
    CacheInvalidationRequested,
    DomainEvent,
    MediaDeleted,
    MediaMoved,
    MediaRestored,
    MediaUploaded,
    PagePublished,
)
from app.shared.infrastructure.cache import get_cache

_handlers: list[Callable[[DomainEvent], None]] = []


def _invalidate_on_publish(event: DomainEvent) -> None:
    if isinstance(event, PagePublished):
        cache = get_cache()
        cache.invalidate_pattern(f"public:page:{event.slug}:*")
        cache.invalidate_pattern("public:navigation:*")
        cache.invalidate_pattern("public:menus:*")
    if isinstance(event, CacheInvalidationRequested):
        cache = get_cache()
        for pattern in event.patterns:
            cache.invalidate_pattern(pattern)
    if isinstance(event, (MediaUploaded, MediaDeleted, MediaRestored, MediaMoved)):
        cache = get_cache()
        cache.invalidate_pattern("media:*")


_handlers.append(_invalidate_on_publish)


def dispatch_events(events: list[DomainEvent]) -> None:
    for event in events:
        for handler in _handlers:
            handler(event)
