# Sprint 2 — Plan détaillé (Enterprise Media Library)

> Sprint 0 (Foundation) et Sprint 1 (Content Management) validés — non modifiables.  
> Sprint 2 : bibliothèque de médias professionnelle, réutilisable par tous les modules CMS.

## Objectif

Créer une Media Library comparable à Payload CMS, Directus ou Strapi, avec upload, organisation, variantes d'images, usage tracking et Media Picker réutilisable.

## Phases

| Phase | Backend | Frontend CMS | Tests |
|-------|---------|--------------|-------|
| 1 | Domaine + modèles + migration 004 | — | Modèles |
| 2 | StorageProvider + ImageProcessor | — | Storage + processor |
| 3 | MediaApplicationService (CQRS) | — | Service unit |
| 4 | API `/media-library/*` + RBAC + events | Media Library UI | API + RBAC |
| 5 | Compat Sprint 0 `/media/*` | MediaPicker | Legacy + intégration |
| 6 | Documentation + REPORT | Build CMS | Couverture ≥ 90 % |

## Dépendances

```
Identity/RBAC (S0) → MediaApplicationService → CMS API
Redis (S0/S1) ─────→ invalidation cache media:*
Audit (S0) ────────→ journal upload/delete/rename/move
Content (S1) ──────→ MediaUsage (pages, sections, SEO — Sprint 3)
StorageProvider ───→ LocalStorage (actif), S3/MinIO/R2 (stubs)
```

## Agrégats domaine

| Agrégat | Rôle |
|---------|------|
| MediaFile (`MediaAsset`) | Fichier principal + métadonnées |
| MediaFolder | Arborescence illimitée |
| MediaTag | Étiquetage |
| MediaCollection | Regroupements thématiques |
| MediaVariant | thumbnail, small, medium, large, webp |
| MediaUsage | Dépendances vers pages/modules |

## Risques

| Risque | Mitigation |
|--------|------------|
| Casser Sprint 0 `/media/*` | Facade `MediaService` + routes legacy inchangées |
| Suppression d'un média utilisé | `MediaUsage` + blocage + `force=true` |
| Fuite de fichiers | Validation MIME magic-bytes + extension + taille |
| Couplage stockage | `StorageProvider` ABC, domaine agnostique |

## Livrables fonctionnels

- [x] Upload simple et multiple
- [x] Dossiers, tags, collections
- [x] Recherche paginée + filtres
- [x] Variantes images automatiques
- [x] Usage tracking + suppression forcée
- [x] Corbeille + restauration
- [x] Media Picker composant réutilisable
- [x] RBAC granulaire
- [x] Domain Events + invalidation Redis
- [x] Audit upload/delete

## Reporté Sprint 3

- BlurHash (point d'extension prévu)
- Storage S3 / MinIO / R2 actif
- Intégration MediaPicker dans PageEditor, Hero, SEO
- UI drag & drop avancée, barre de progression, annulation/retry
- Téléchargement bulk, remplacement atomique de média
- Vidéo/audio transcoding
