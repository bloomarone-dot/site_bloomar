# Sprint 0 — Plan détaillé (Socle technique Bloomar CMS)

> Documents validés (non modifiables) : architecture fonctionnelle, UX/UI, architecture technique.

## Objectif

Mettre en place le socle technique backend + frontend CMS, sans aucun module métier (Pages, Services, CRM, Chatbot, Analytics dashboard).

---

## Découpage en tâches

### Phase A — Backend Shared Kernel & Config

| ID | Tâche | Livrable |
|----|-------|----------|
| A1 | Exceptions domaine | `shared/domain/exceptions.py` |
| A2 | Pagination & erreurs API | `shared/presentation/pagination.py`, `errors.py` |
| A3 | Dépendances FastAPI (auth, RBAC) | `shared/presentation/deps.py` |
| A4 | Sécurité (password, JWT, RBAC seed) | `shared/security/*` |
| A5 | Configuration étendue | `config.py` (JWT, bootstrap admin, media, CORS) |

**Dépendances :** A5 → A4 → A3 → A2 → A1

---

### Phase B — Identity (Auth JWT + RBAC)

| ID | Tâche | Livrable |
|----|-------|----------|
| B1 | Modèles User, Role, Permission, UserSession | `modules/identity/models.py` |
| B2 | Service login / refresh / logout / seed | `modules/identity/service.py` |
| B3 | Routes auth (`/api/v1/auth/*`) | `modules/identity/router.py` |
| B4 | Routes CMS users/roles (lecture) | `modules/identity/cms_router.py` |
| B5 | Migration Alembic + seed startup | `002_sprint0_cms_core.py`, `main.py` lifespan |

**Dépendances :** Phase A → B1 → B2 → B3/B4 → B5

---

### Phase C — Settings

| ID | Tâche | Livrable |
|----|-------|----------|
| C1 | Modèle Setting (groupes clé/valeur JSON) | `modules/settings/models.py` |
| C2 | Service + seed (company, contact, social, analytics, theme) | `modules/settings/service.py` |
| C3 | Routes CRUD groupes | `modules/settings/router.py` |

**Groupes Sprint 0 :** `company`, `contact`, `social`, `analytics`, `theme`

**Dépendances :** Phase B (auth) → C1 → C2 → C3

---

### Phase D — Media

| ID | Tâche | Livrable |
|----|-------|----------|
| D1 | Modèles MediaAsset + MediaVariant | `modules/media/models.py` |
| D2 | Storage local + validation MIME/taille | `modules/media/storage.py` |
| D3 | Upload + compression Pillow (150/400/800) | `modules/media/service.py` |
| D4 | Routes upload/list/delete/serve | `modules/media/router.py` |

**Dépendances :** Phase B → D1 → D2 → D3 → D4

---

### Phase E — Audit minimal

| ID | Tâche | Livrable |
|----|-------|----------|
| E1 | Modèle AuditLog | `modules/audit/models.py` |
| E2 | Service log + list paginée | `modules/audit/service.py` |
| E3 | Route GET `/api/v1/cms/audit` | `modules/audit/router.py` |
| E4 | Instrumentation auth, settings, media | hooks dans routers |

**Dépendances :** Phase B → E1 → E2 → E3 → E4

---

### Phase F — Frontend CMS Shell

| ID | Tâche | Livrable |
|----|-------|----------|
| F1 | Scaffold Vite + React + TS + Tailwind | `cms/` |
| F2 | Providers (Auth, Query, Theme) | `cms/src/app/providers/*` |
| F3 | Router + ProtectedRoute + ErrorBoundary | `cms/src/app/router/*` |
| F4 | Layouts (AuthLayout, AppLayout) | `cms/src/app/layouts/*` |
| F5 | Sidebar + Topbar | `cms/src/shared/components/*` |
| F6 | Pages : Login, Dashboard vide, Settings, Media, Users, Audit | `cms/src/pages/*` |
| F7 | Client API (JWT + refresh cookie) | `cms/src/shared/lib/api.ts` |

**Dépendances :** Phase B (API auth) → F1 → F2 → F7 → F3 → F4 → F5 → F6

---

### Phase G — Tests & validation

| ID | Tâche | Livrable |
|----|-------|----------|
| G1 | conftest SQLite in-memory | `backend/tests/conftest.py` |
| G2 | Tests auth, settings, media, audit | `backend/tests/test_sprint0.py` |
| G3 | Build production CMS | `npm run build` |

---

## Graphe de dépendances (résumé)

```
Config/Shared Kernel
        │
        ▼
   Identity (JWT/RBAC)
    ┌───┼───┬───────┐
    ▼   ▼   ▼       ▼
Settings Media  Audit  CMS Shell (React)
    │       │       │
    └───────┴───────┘
            ▼
         Tests
```

---

## Risques identifiés

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Cookie refresh cross-origin (dev) | Refresh échoue hors proxy | Proxy Vite `/api` → `:8000`, cookie path `/api/v1/auth` |
| Storage local non scalable | Prod limitée | Interface `LocalMediaStorage`, migration S3 Sprint ultérieur |
| Bootstrap admin en env | Fuite credentials | `.env.example` documenté, mot de passe à changer en prod |
| psycopg2 + Python 3.14 local | Install dev difficile | Docker pour prod ; tests SQLite sans Postgres |
| Lifespan startup vs tests | Tests connectent Postgres | Lifespan noop en tests + seed via fixture |
| RBAC incomplet (CRUD users) | Sprint 0 lecture seule users | CRUD users prévu Sprint 1 |

---

## Stratégie de tests

### Backend (pytest)

- `test_health` — API disponible
- `test_login_and_me` — JWT + permissions super_admin
- `test_settings_groups` — GET/PATCH settings contact
- `test_media_upload` — upload PNG + variants + listing
- `test_audit_logs_after_login` — trace `auth.login`

### Frontend

- `npm run build` — compilation TypeScript + bundle Vite
- Tests E2E : **hors scope Sprint 0** (Playwright Sprint 1)

### Migration

- `alembic upgrade head` contre PostgreSQL Docker (port 5433)

---

## Hors scope (interdit Sprint 0)

Pages, Sections, Produits, Services, Tarifs, FAQ, Réalisations, Leads UI, Chatbot, Analytics dashboard.
