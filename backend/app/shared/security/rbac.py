from app.shared.domain.exceptions import ForbiddenError

PERMISSIONS: list[dict[str, str]] = [
    {"code": "identity.user.read", "resource": "user", "action": "read", "description": "View users"},
    {"code": "identity.user.write", "resource": "user", "action": "write", "description": "Manage users"},
    {"code": "settings.read", "resource": "settings", "action": "read", "description": "View settings"},
    {"code": "settings.write", "resource": "settings", "action": "write", "description": "Edit settings"},
    {"code": "media.read", "resource": "media", "action": "read", "description": "View media library"},
    {"code": "media.write", "resource": "media", "action": "write", "description": "Legacy upload/manage (Sprint 0)"},
    {"code": "media.create", "resource": "media", "action": "create", "description": "Create media"},
    {"code": "media.update", "resource": "media", "action": "update", "description": "Update media metadata"},
    {"code": "media.delete", "resource": "media", "action": "delete", "description": "Delete media"},
    {"code": "media.restore", "resource": "media", "action": "restore", "description": "Restore trashed media"},
    {"code": "media.upload", "resource": "media", "action": "upload", "description": "Upload files"},
    {"code": "media.download", "resource": "media", "action": "download", "description": "Download files"},
    {"code": "media.manage", "resource": "media", "action": "manage", "description": "Manage tags and settings"},
    {"code": "folder.manage", "resource": "folder", "action": "manage", "description": "Manage folders"},
    {"code": "collection.manage", "resource": "collection", "action": "manage", "description": "Manage collections"},
    {"code": "audit.read", "resource": "audit", "action": "read", "description": "View audit logs"},
    {"code": "content.page.read", "resource": "page", "action": "read", "description": "View pages"},
    {"code": "content.page.write", "resource": "page", "action": "write", "description": "Edit pages and sections"},
    {"code": "content.page.publish", "resource": "page", "action": "publish", "description": "Publish and archive pages"},
    {"code": "navigation.menu.read", "resource": "menu", "action": "read", "description": "View menus"},
    {"code": "navigation.menu.write", "resource": "menu", "action": "write", "description": "Edit menus"},
    {"code": "localization.read", "resource": "localization", "action": "read", "description": "View locales and translations"},
    {"code": "localization.write", "resource": "localization", "action": "write", "description": "Edit translations"},
]

MEDIA_FULL = [
    "media.read", "media.write", "media.create", "media.update", "media.delete",
    "media.restore", "media.upload", "media.download", "media.manage",
    "folder.manage", "collection.manage",
]

ROLE_DEFINITIONS: dict[str, list[str]] = {
    "super_admin": [p["code"] for p in PERMISSIONS],
    "admin": [
        "identity.user.read",
        "settings.read",
        "settings.write",
        *MEDIA_FULL,
        "audit.read",
        "content.page.read",
        "content.page.write",
        "content.page.publish",
        "navigation.menu.read",
        "navigation.menu.write",
        "localization.read",
        "localization.write",
    ],
    "editor": [
        "settings.read",
        *MEDIA_FULL,
        "content.page.read",
        "content.page.write",
        "content.page.publish",
        "navigation.menu.read",
        "localization.read",
        "localization.write",
    ],
    "marketing": [
        "settings.read",
        "media.read", "media.write", "media.upload", "media.update", "media.create",
        "content.page.read",
        "content.page.write",
        "localization.read",
    ],
    "support": ["settings.read", "media.read", "content.page.read"],
}


def require_permission(user_permissions: set[str], required: str) -> None:
    if required not in user_permissions and "super_admin" not in user_permissions:
        if required not in user_permissions:
            raise ForbiddenError(f"Missing permission: {required}")
