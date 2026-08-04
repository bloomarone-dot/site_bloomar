# Sprint 1 — Rapport de livraison

**Date :** 30 juillet 2026  
**Statut :** ✅ Sprint 1 livré — site pilotable depuis le CMS (page publiable sans modifier le HTML)

---

## 1. Fonctionnalités terminées

### Backend — Content Module
- [x] Pages (CRUD, soft delete, slug+locale unique)
- [x] Sections (CRUD, réorganisation, types hero/rich_text/cta/contact_form)
- [x] Section Types (bibliothèque seedée)
- [x] Publications (historique submit/publish/archive/rollback)
- [x] Versions (snapshots JSON, rollback)
- [x] Preview (token sécurisé, expiration, no-store)
- [x] Workflow complet : **Draft → Review → Published → Archived → Rollback**

### Backend — Navigation
- [x] Menus header / footer / mobile (seed FR)
- [x] Menu Items (CRUD, réorganisation)
- [x] Arbre hiérarchique pour API publique

### Backend — Localization
- [x] Locales FR + EN (seed)
- [x] Traductions par entité (upsert)
- [x] API CMS `/api/v1/cms/localization/*`

### Backend — Public API (lecture seule, contenu publié uniquement)
- [x] `GET /api/v1/public/pages/{slug}?locale=fr`
- [x] `GET /api/v1/public/menus?locale=fr`
- [x] `GET /api/v1/public/settings`
- [x] `GET /api/v1/public/navigation?locale=fr`
- [x] `GET /api/v1/public/preview/{token}` (brouillon, jamais en cache)

### Backend — Cache
- [x] Redis cache avec fallback in-memory (tests/dev)
- [x] ETag + Cache-Control sur endpoints publics
- [x] Invalidation automatique via Domain Events (`PagePublished`)
- [x] Service Redis dans docker-compose

### Frontend CMS
- [x] Pages — liste, création, édition, suppression logique
- [x] Éditeur — workflow publication, preview, historique versions, rollback
- [x] Sections — bibliothèque, création, édition JSON
- [x] Menus — header/footer/mobile, drag & drop, CRUD items
- [x] Localisation — édition traductions FR/EN (titre page)

### Frontend public — migration incrémentale
- [x] `public-content.js` — charge contenu publié depuis l'API
- [x] `mentions-legales.html` — fallback HTML statique si page non publiée
- [x] Site actuel continue de fonctionner sans CMS

---

## 2. Tests réalisés

```
14 passed (Sprint 0: 5 + Sprint 1: 9)

Sprint 1:
  ✓ test_public_settings (+ ETag)
  ✓ test_public_page_not_published (draft → 404)
  ✓ test_publication_workflow (draft→review→publish→live→304)
  ✓ test_preview_token (draft invisible, preview OK, no-store)
  ✓ test_rollback
  ✓ test_public_menus
  ✓ test_public_navigation
  ✓ test_section_types
  ✓ test_locales
```

### Couverture (modules Sprint 1)

| Module | Couverture |
|--------|------------|
| content (global) | ~59–93% selon couche |
| public API | 92% |
| navigation | 72–75% |
| localization | 47–85% |
| **Total Sprint 1** | **76%** |

Commande : `python -m pytest tests/ --cov=app.modules.content --cov=app.modules.public ...`

---

## 3. Migrations créées

| Fichier | Tables |
|---------|--------|
| `003_sprint0_cms_core.py` | (Sprint 0) |
| `003_sprint1_content_navigation.py` | content_*, navigation_*, localization_* |

---

## 4. Endpoints créés

### CMS (auth + RBAC)
```
GET/POST        /api/v1/cms/content/pages
GET/PATCH/DELETE /api/v1/cms/content/pages/{id}
POST            /api/v1/cms/content/pages/{id}/sections
PATCH/DELETE    /api/v1/cms/content/sections/{id}
PUT             /api/v1/cms/content/pages/{id}/sections/reorder
POST            /api/v1/cms/content/pages/{id}/submit-review
POST            /api/v1/cms/content/pages/{id}/publish
POST            /api/v1/cms/content/pages/{id}/archive
POST            /api/v1/cms/content/pages/{id}/draft
POST            /api/v1/cms/content/pages/{id}/rollback/{version_id}
GET             /api/v1/cms/content/pages/{id}/versions
POST            /api/v1/cms/content/pages/{id}/preview
GET             /api/v1/cms/content/section-types

GET             /api/v1/cms/navigation/menus
GET             /api/v1/cms/navigation/menus/{slug}
POST/PATCH/DELETE navigation items + reorder

GET             /api/v1/cms/localization/locales
GET/PUT         /api/v1/cms/localization/translations/{type}/{id}
```

### Public (sans auth)
```
GET /api/v1/public/pages/{slug}
GET /api/v1/public/menus
GET /api/v1/public/settings
GET /api/v1/public/navigation
GET /api/v1/public/preview/{token}
```

---

## 5. Composants React créés

| Composant | Route |
|-----------|-------|
| `PagesListPage` | `/pages` |
| `PageEditorPage` | `/pages/:id` |
| `MenusPage` | `/menus` |

API client étendu : `contentApi`, `navigationApi`, `localizationApi`

---

## 6. Fichiers créés / modifiés

### Backend (nouveau)
```
app/modules/content/application/{services.py, seed.py}
app/modules/content/presentation/schemas.py
app/modules/localization/application/services.py
app/modules/localization/infrastructure/models.py
app/modules/localization/presentation/cms_router.py
docs/cms/sprint-1/PLAN.md
docs/cms/sprint-1/REPORT.md
tests/test_sprint1.py (existait, validé)
```

### Backend (modifié — intégration Sprint 1, Sprint 0 intact)
```
app/main.py (+ routers Sprint 1, seed)
app/models.py (+ imports Alembic S1)
app/config.py (+ redis, cache, preview)
app/shared/security/rbac.py (+ permissions S1)
tests/conftest.py (+ seed S1)
requirements.txt (+ redis, pytest-cov)
docker-compose.yml (+ redis)
.env.example (+ REDIS_URL, CACHE_DEFAULT_TTL)
```

### CMS
```
cms/src/pages/content/{PagesListPage,PageEditorPage}.tsx
cms/src/pages/navigation/MenusPage.tsx
cms/src/shared/lib/api.ts (content, navigation, localization)
cms/src/app/router/index.tsx
cms/src/shared/components/Sidebar.tsx
```

### Frontend public
```
frontend/assets/js/core/public-content.js
frontend/mentions-legales.html (migration incrémentale)
```

---

## 7. Décisions techniques

| Décision | Choix |
|----------|-------|
| Architecture | DDD en couches : domain → application → infrastructure → presentation |
| Persistence | Repository Pattern + UnitOfWork + Domain Events |
| Publication | Snapshots JSON versionnés ; public lit `status=published` uniquement |
| Preview | Token opaque 32 bytes, expiration configurable, `Cache-Control: no-store` |
| Cache | Redis prod / dict in-memory tests ; invalidation par event bus |
| Public API prefix | `/api/v1/public/*` (cohérent Sprint 0) |
| Migration publique | Opt-in par page via `#cms-page-content` + fallback statique |
| Permissions | `content.page.*`, `navigation.menu.*`, `localization.*` |

---

## 8. Difficultés rencontrées

1. **Scaffolding partiel** — routers/models existaient sans `services.py` ni `schemas.py` → implémentation complète
2. **SQLite datetime naive** — comparaison preview token → normalisation UTC
3. **Import cassé** — `MenuRepository` class header supprimé par erreur → corrigé
4. **Hooks React** — violation rules-of-hooks dans workflow → mutations top-level

---

## 9. Améliorations prévues Sprint 2

- Éditeur visuel de sections (WYSIWYG vs JSON brut)
- Drag & drop sections dans PageEditor
- Migration pages restantes (contact, services, index)
- Navigation publique injectée via API dans `layout.js`
- Traductions appliquées côté Public API
- Tests E2E Playwright CMS + site public
- UI Theme Builder (Sprint 0 toggle seulement)

---

## 10. Démarrage

```bash
docker compose up -d db redis
cd backend && alembic upgrade head && uvicorn app.main:app --reload --port 8000

cd cms && npm run dev   # :5173

# Publier mentions-legales depuis CMS → /pages → publish
# Le site charge alors le contenu CMS sur mentions-legales.html
```

**Modules NON développés (conformément au périmètre) :** CRM, Leads, Chatbot, Analytics, Blog, Portfolio, FAQ, Tarifs, Produits, Services.
