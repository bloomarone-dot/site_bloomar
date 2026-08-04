# Sprint 1 — Plan détaillé (Content & Publication)

> Sprint 0 validé — non modifiable. Sprint 1 : piloter le site depuis le CMS.

## Objectif

Modifier une page du site depuis le CMS sans toucher au HTML. Migration publique incrémentale.

## Phases

| Phase | Backend | Frontend CMS | Public |
|-------|---------|--------------|--------|
| 1 | Content module (Pages, Sections, Versions, Preview) | Pages CRUD + workflow | — |
| 2 | Navigation (Menus, Items) | Menus DnD | Navigation API |
| 3 | Localization (Locales, Translations) | Éditeur traductions FR/EN | Locale param |
| 4 | Public API + Cache Redis | Preview panel | public-content.js |
| 5 | Tests + rapport | Build CMS | mentions-legales migrée |

## Dépendances

```
Identity/RBAC (S0) → Content → Publication workflow → Public API
Settings (S0) ─────────────────────────────→ GET /public/settings
Navigation ────────────────────────────────→ GET /public/menus|navigation
Localization ──→ traductions pages ─────→ locale query param
Redis (optional) → cache + invalidation on PagePublished event
```

## Risques

| Risque | Mitigation |
|--------|------------|
| Draft visible publiquement | Public API filtre `status=published` uniquement |
| Preview leak | Token signé + expiration + no-store |
| Migration casse le site | Fallback HTML statique si API 404 |
| SQLite datetime naive | Normalisation UTC dans PreviewTokenRepository |

## Tests

- Workflow publication (draft→review→published→404 public→200)
- Preview token (draft invisible, preview OK)
- Rollback
- Public menus/navigation/settings + ETag 304
- Section types + locales
