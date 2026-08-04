# Sprint 2 — Architecture (Media Library)

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  cms_router.py (/media-library/*)  router.py (/media/* S0)  │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   Application Layer                          │
│              MediaApplicationService                         │
│   upload · search · folders · tags · collections · usage    │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Domain Layer                              │
│  enums (MediaStatus, VariantName, StorageProvider, MIME)    │
│  Domain Events (MediaUploaded, MediaDeleted, …)             │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                 Infrastructure Layer                         │
│  models · repositories · image_processor · storage/*        │
└─────────────────────────────────────────────────────────────┘
```

## Structure des fichiers

```
backend/app/modules/media/
├── domain/
│   └── enums.py                 # Statuts, variantes, MIME autorisés
├── application/
│   └── services.py              # MediaApplicationService (use cases)
├── infrastructure/
│   ├── models.py                # MediaAsset, MediaFolder, MediaTag, …
│   ├── repositories.py          # MediaFileRepository, …
│   ├── image_processor.py       # Variantes, EXIF, couleur dominante
│   └── storage/
│       ├── provider.py          # ABC StorageProvider
│       ├── local_storage.py     # Implémentation active
│       └── factory.py           # Local + stubs S3/MinIO/R2
├── presentation/
│   └── cms_router.py            # API Enterprise /media-library/*
├── router.py                    # API legacy Sprint 0 /media/*
├── service.py                   # Facade MediaService → ApplicationService
├── models.py                    # Re-exports infrastructure
└── schemas.py                   # DTO Pydantic legacy
```

## Modèle de données

### media_assets (étendu Sprint 0)

Champs ajoutés : `uuid`, `extension`, `checksum`, `storage_provider`, `storage_path`, `public_url`, `width`, `height`, `duration`, `caption`, `description`, `dominant_color`, `status`, `folder_id`, `deleted_at`, `is_public`.

### Nouvelles tables

| Table | Description |
|-------|-------------|
| `media_folders` | Arborescence (parent_id, path, slug) |
| `media_tags` | Tags (name, slug) |
| `media_asset_tags` | M2M asset ↔ tag |
| `media_collections` | Collections nommées |
| `media_collection_items` | M2M collection ↔ asset |
| `media_variants` | Variantes générées par image |
| `media_usages` | Références entity_type/entity_id/field_key |

## StorageProvider

Abstraction permettant de migrer vers le cloud sans toucher au domaine :

```python
class StorageProvider(ABC):
    def save(self, *, relative_path: str, content: bytes) -> str: ...
    def read(self, relative_path: str) -> bytes: ...
    def delete(self, relative_path: str) -> None: ...
    def move(self, source: str, destination: str) -> str: ...
    def copy(self, source: str, destination: str) -> str: ...
    def public_url(self, relative_path: str) -> str: ...
    def unique_filename(self, original: str) -> str: ...
```

- **LocalStorageProvider** : actif, fichiers sous `MEDIA_ROOT`
- **S3StorageProvider / MinIO / R2** : stubs `NotImplementedError` (Sprint 3)

## Image Processing

Pipeline post-upload (images sauf SVG) :

1. Détection MIME magic-bytes
2. Correction orientation EXIF
3. Extraction dimensions
4. Couleur dominante (échantillon 64×64)
5. Génération variantes WebP : thumbnail (150), small (400), medium (800), large (1600), webp (full)
6. Original conservé intact

Point d'extension BlurHash : `ImageProcessor.blurhash_enabled = False` (Sprint 3).

## Domain Events

| Event | Déclencheur |
|-------|-------------|
| `MediaUploaded` | Upload réussi |
| `MediaDeleted` | Soft delete ou purge force |
| `MediaRestored` | Restauration corbeille |
| `MediaMoved` | Déplacement dossier |
| `FolderCreated` | Création dossier |
| `FolderDeleted` | Suppression logique dossier |
| `CollectionCreated` | Nouvelle collection |
| `VariantGenerated` | Variantes image créées |
| `CacheInvalidationRequested` | Invalidation Redis `media:*` |

## Compatibilité Sprint 0

- Routes `/api/v1/cms/media/*` inchangées
- `MediaService` délègue à `MediaApplicationService`
- Variantes legacy mappées : `thumb_150` ↔ `thumbnail`, etc.
- `files_router` sert les fichiers locaux

## Frontend CMS

```
cms/src/
├── pages/media/MediaPage.tsx       # Media Library (grid/list, upload, trash)
└── shared/components/MediaPicker.tsx  # Modal + Field réutilisables
```

## RBAC

Permissions granulaires assignées au rôle `admin` :

`media.read`, `media.create`, `media.update`, `media.delete`, `media.restore`, `media.upload`, `media.download`, `media.manage`, `folder.manage`, `collection.manage`

Legacy `media.write` conservé pour Sprint 0.
