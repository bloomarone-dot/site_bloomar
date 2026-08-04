# Sprint 2 — API Media Library

Base URL CMS : `/api/v1/cms/media-library`  
Auth : Bearer JWT + permission RBAC indiquée.

## Upload

| Méthode | Route | Permission | Description |
|---------|-------|------------|-------------|
| POST | `/upload` | `media.upload` | Upload simple (multipart: file, folder, folder_id, alt_text) |
| POST | `/upload/multiple` | `media.upload` | Upload multiple (files[], folder) |

## Recherche & lecture

| Méthode | Route | Permission | Query params |
|---------|-------|------------|--------------|
| GET | `/` | `media.read` | `q`, `folder_id`, `tag`, `collection_id`, `mime_type`, `status`, `sort`, `order`, `page`, `limit` |
| GET | `/{media_id}` | `media.read` | Détail média + variantes + tags |

## CRUD média

| Méthode | Route | Permission | Body |
|---------|-------|------------|------|
| PATCH | `/{media_id}` | `media.update` | `{ alt_text, caption, description, is_public, tag_names }` |
| POST | `/{media_id}/rename` | `media.update` | `{ name }` |
| POST | `/{media_id}/move` | `media.update` | `{ folder_id?, folder? }` |
| POST | `/{media_id}/copy` | `media.create` | `{ folder_id?, folder? }` |
| DELETE | `/{media_id}` | `media.delete` | Query: `force=true` pour purge malgré usage |
| POST | `/{media_id}/restore` | `media.restore` | — |

## Usage

| Méthode | Route | Permission | Description |
|---------|-------|------------|-------------|
| GET | `/{media_id}/usage` | `media.read` | Liste des ressources utilisant ce média |
| POST | `/{media_id}/usage` | `media.update` | Enregistrer usage `{ entity_type, entity_id, entity_label, field_key? }` |

## Dossiers

| Méthode | Route | Permission | Body |
|---------|-------|------------|------|
| GET | `/folders/tree` | `media.read` | Query: `parent_id` |
| POST | `/folders` | `folder.manage` | `{ name, parent_id? }` |
| DELETE | `/folders/{folder_id}` | `folder.manage` | Soft delete |

## Tags

| Méthode | Route | Permission | Body |
|---------|-------|------------|------|
| GET | `/tags` | `media.read` | — |
| POST | `/tags` | `media.manage` | `{ name }` |
| PATCH | `/tags/{tag_id}` | `media.manage` | `{ name }` |
| DELETE | `/tags/{tag_id}` | `media.manage` | — |

## Collections

| Méthode | Route | Permission | Body |
|---------|-------|------------|------|
| GET | `/collections` | `media.read` | — |
| POST | `/collections` | `collection.manage` | `{ name, description? }` |
| POST | `/collections/{id}/items/{media_id}` | `collection.manage` | — |

## Fichiers (download/preview)

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/v1/cms/media/files/{path}` | Public | Sert le fichier (preview/download) |

## API Legacy Sprint 0 (inchangée)

| Méthode | Route | Permission |
|---------|-------|------------|
| GET | `/api/v1/cms/media` | `media.read` |
| GET | `/api/v1/cms/media/{id}` | `media.read` |
| POST | `/api/v1/cms/media/upload` | `media.write` |
| DELETE | `/api/v1/cms/media/{id}` | `media.write` |

## Réponse média (exemple)

```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "abc123.png",
  "original_filename": "hero.png",
  "mime_type": "image/png",
  "size_bytes": 12345,
  "checksum": "sha256:…",
  "url": "/api/v1/cms/media/files/uploads/abc123.png",
  "width": 1920,
  "height": 1080,
  "dominant_color": "#1a2b3c",
  "status": "active",
  "folder": "images/hero",
  "variants": [
    { "variant_name": "thumbnail", "url": "…", "width": 150, "height": 84 }
  ],
  "tags": []
}
```

## Codes d'erreur

| Code | Situation |
|------|-----------|
| 400 | Média utilisé (suppression sans force) |
| 401 | Non authentifié |
| 403 | Permission RBAC manquante |
| 404 | Média/dossier/collection introuvable |
| 422 | MIME invalide, extension mismatch, fichier trop volumineux |
