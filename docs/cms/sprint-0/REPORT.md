# Sprint 0 — Rapport de livraison

**Date :** 30 juillet 2026  
**Statut global :** ✅ Socle technique livré (backend + frontend CMS + tests)

---

## 1. Terminé

### Backend — Shared Kernel & Config
- [x] Exceptions domaine (`UnauthorizedError`, `ForbiddenError`, `NotFoundError`, etc.)
- [x] Pagination standardisée (`PaginatedResponse`)
- [x] Handlers d'erreurs globaux
- [x] Hash bcrypt + JWT access/refresh
- [x] RBAC : 7 permissions, 5 rôles système seedés
- [x] Config : JWT, bootstrap admin, media root, CORS `:5173`

### Backend — Identity
- [x] Modèles : `User`, `Role`, `Permission`, `UserSession`
- [x] Auth JWT access (15 min) + refresh HttpOnly cookie rotatif
- [x] Endpoints : `POST /login`, `POST /refresh`, `POST /logout`, `GET /me`
- [x] CMS read-only : `GET /users`, `GET /roles`
- [x] Bootstrap super admin via env

### Backend — Settings
- [x] 5 groupes : `company`, `contact`, `social`, `analytics`, `theme`
- [x] GET liste / GET groupe / PATCH groupe
- [x] Seed valeurs par défaut au startup

### Backend — Media
- [x] Upload avec validation MIME + taille max
- [x] Storage local (`MEDIA_ROOT`, défaut `storage/media/`)
- [x] Variants Pillow : `thumb_150`, `thumb_400`, `thumb_800` (WebP sauf PNG)
- [x] List, get, delete, serve files

### Backend — Audit minimal
- [x] Table `audit_logs` + listing paginé
- [x] Traces : `auth.login`, `auth.logout`, `settings.update`, `media.upload`, `media.delete`

### Backend — Migration & startup
- [x] Migration `002_sprint0_cms_core.py`
- [x] Lifespan seed (roles, admin, settings)
- [x] API legacy site préservée (`/api/lead`, `/api/capture`, etc.)

### Frontend CMS (`cms/`)
- [x] Vite + React 18 + TypeScript + Tailwind
- [x] AuthProvider (login, refresh, logout, permissions)
- [x] QueryProvider (TanStack Query)
- [x] ThemeProvider + toggle dark/light (Zustand persist)
- [x] Router + ProtectedRoute + ErrorBoundary
- [x] AuthLayout + AppLayout
- [x] Sidebar + Topbar
- [x] LoginPage
- [x] DashboardPage (vide — placeholders Sprint 1/2)
- [x] SettingsPage (5 groupes)
- [x] MediaPage (upload + table)
- [x] UsersPage (liste read-only)
- [x] AuditPage (liste logs)
- [x] Build production OK

### Tests
- [x] 5/5 tests pytest passent
- [x] `npm run build` CMS OK

---

## 2. Reste à faire (post-Sprint 0)

| Item | Priorité | Notes |
|------|----------|-------|
| Appliquer migration en environnement Docker | Haute | `alembic upgrade head` avec DB `:5433` |
| Service Docker CMS (optionnel) | Moyenne | Ajouter service `cms` dans docker-compose |
| CRUD Users (create/update/deactivate) | Sprint 1 | Lecture seule en Sprint 0 |
| Theme Builder UI complet | Sprint 1 | Toggle dark/light seulement |
| Storage S3 / CDN | Sprint ultérieur | Local OK pour dev |
| Tests E2E Playwright | Sprint 1 | — |
| Refresh token path cross-domain prod | À valider | Cookie path `/api/v1/auth` |
| README démarrage CMS | Basse | — |

---

## 3. Tests réalisés

```
backend/tests/test_sprint0.py
  ✓ test_health
  ✓ test_login_and_me
  ✓ test_settings_groups
  ✓ test_media_upload
  ✓ test_audit_logs_after_login

cms/
  ✓ npm run build (tsc + vite build)
```

**Commandes :**
```bash
cd backend && python -m pytest tests/ -q
cd cms && npm run build
```

---

## 4. Fichiers créés / modifiés

### Backend (nouveau)
```
backend/app/shared/domain/exceptions.py
backend/app/shared/presentation/{pagination.py,errors.py,deps.py}
backend/app/shared/security/{password.py,jwt.py,rbac.py}
backend/app/modules/identity/{models.py,schemas.py,service.py,router.py,cms_router.py}
backend/app/modules/settings/{models.py,schemas.py,service.py,router.py}
backend/app/modules/media/{models.py,schemas.py,service.py,storage.py,router.py}
backend/app/modules/audit/{models.py,service.py,router.py}
backend/alembic/versions/002_sprint0_cms_core.py
backend/tests/{conftest.py,test_sprint0.py}
backend/pytest.ini
```

### Backend (modifié)
```
backend/app/main.py
backend/app/config.py
backend/app/models.py
backend/requirements.txt
.env.example
.gitignore (+ storage/media/)
```

### Frontend CMS (nouveau — dossier `cms/`)
```
cms/package.json, vite.config.ts, tailwind.config.js, tsconfig*.json
cms/src/main.tsx
cms/src/app/{providers/*,layouts/*,router/*,ErrorBoundary.tsx}
cms/src/pages/{auth,dashboard,settings,media,users,audit}/*
cms/src/shared/{lib/api.ts,stores/themeStore.ts,components/{Sidebar,Topbar}.tsx}
cms/src/styles/index.css
```

### Documentation
```
docs/cms/sprint-0/PLAN.md
docs/cms/sprint-0/REPORT.md
```

---

## 5. Décisions d'architecture

| Décision | Choix | Justification |
|----------|-------|---------------|
| Access token | JWT 15 min, mémoire frontend | Limite exposition XSS |
| Refresh token | HttpOnly cookie, rotation | Sécurité vs localStorage |
| Cookie path | `/api/v1/auth` | Scope minimal |
| RBAC | Permissions granulaires + bypass `super_admin` | Aligné archi technique |
| Settings | Groupes JSON clé/valeur | Flexibilité sans migrations par champ |
| Media storage | Local filesystem Sprint 0 | Simplicité ; interface prête pour S3 |
| Variants | Pillow 150/400/800 WebP | Performance front public futur |
| Tests DB | SQLite in-memory + lifespan noop | Isolation, pas de Postgres requis |
| CMS dev | Vite `:5173` proxy `/api` | Cookie refresh same-origin en dev |
| Modules métier | **Aucun** | Respect périmètre Sprint 0 |

---

## 6. Démarrage local

```bash
# Backend (Docker DB)
docker compose up -d db
cd backend && alembic upgrade head
uvicorn app.main:app --reload --port 8000

# CMS
cd cms && npm install && npm run dev
# → http://localhost:5173
# Login : admin@bloomarone.com / BloomarCMS2026! (env)
```
