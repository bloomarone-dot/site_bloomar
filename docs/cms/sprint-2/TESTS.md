# Sprint 2 — Tests

## Résultat global

```
39 passed (Sprint 0: 5 + Sprint 1: 9 + Sprint 2: 25)
```

## Fichiers de test

| Fichier | Tests | Couverture cible |
|---------|-------|------------------|
| `tests/test_sprint2.py` | API intégration media-library | Endpoints, RBAC, workflow |
| `tests/test_sprint2_media_unit.py` | Domaine + infra unitaires | Processor, storage, validation |
| `tests/test_sprint0.py::test_media_upload` | Compat legacy | Sprint 0 non régressé |

## Scénarios Sprint 2

### API (`test_sprint2.py`)

- `test_media_library_upload_and_search` — upload PNG, variantes, recherche
- `test_legacy_media_upload_still_works` — route `/media/upload` Sprint 0
- `test_folders_tree` — arborescence seedée (images/hero, …)
- `test_tags_and_collections` — CRUD tags + collections + ajout item
- `test_media_usage_blocks_delete` — blocage suppression + force purge
- `test_soft_delete_and_restore` — corbeille + restauration
- `test_rename_and_move` — renommage + déplacement dossier
- `test_copy_and_update_metadata` — copie + PATCH métadonnées + tags
- `test_upload_multiple_and_usage_list` — batch upload + GET usage
- `test_folder_create_delete_and_tag_rename` — dossiers + rename/delete tag
- `test_media_rbac_requires_auth` — 401 sans token
- `test_serve_media_file` — servir fichier via files_router
- `test_legacy_list_get_and_delete` — routes Sprint 0 list/get/delete

### Unitaires (`test_sprint2_media_unit.py`)

- `test_safe_filename` — sanitization noms
- `test_detect_mime_variants` — magic-bytes PNG/JPEG/PDF/SVG
- `test_image_processor_svg_skips_variants` — SVG sans variantes
- `test_image_processor_generates_variants` — thumbnail + webp
- `test_extract_dominant_color` — couleur dominante
- `test_apply_exif_orientation_no_exif` — pas d'EXIF
- `test_storage_provider_local` — save/read/move/copy/delete
- `test_storage_factory` — local + S3 NotImplementedError
- `test_storage_factory_cloud_stubs` — minio/r2/s3 stubs
- `test_validate_upload_rejects_bad_mime` — MIME interdit
- `test_validate_upload_rejects_mismatch` — extension ≠ contenu
- `test_validate_upload_rejects_oversized` — taille max

## Couverture module `app.modules.media`

```
TOTAL: 913 statements, 91 missed → 90%
```

| Fichier | Couverture |
|---------|------------|
| application/services.py | 90% |
| presentation/cms_router.py | 98% |
| router.py | 100% |
| service.py | 100% |
| infrastructure/models.py | 100% |
| domain/enums.py | 100% |
| storage/provider.py | 100% |
| storage/local_storage.py | 90% |
| infrastructure/repositories.py | 88% |
| infrastructure/image_processor.py | 72% |
| storage/factory.py | 76% |
| storage.py (alias legacy) | 0% (re-export) |

## Commande

```bash
cd backend
python -m pytest tests/ -q --cov=app.modules.media --cov-report=term-missing
```

## CMS build

```bash
cd cms
npm run build   # ✓ OK
```
