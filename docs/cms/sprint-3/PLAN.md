# Sprint 3 — Plan détaillé (Theme Builder & Layout Builder)

> Sprint 0 (Foundation), Sprint 1 (Content Management) et Sprint 2 (Enterprise Media Library) validés — non modifiables.  
> **Ce document est le plan de conception. Aucun code ne sera écrit avant validation explicite.**

## Objectif

Construire le moteur de création de pages du CMS : l'utilisateur compose une page entière par glisser-déposer de blocs configurables, sans écrire de HTML. Le moteur doit servir de fondation extensible pour Pages, Landing Pages, Blog, Produits, Services, Portfolio, FAQ, Team et Homepage.

---

## 1. État des lieux (Sprints 0–2)

### Ce qui existe et ne doit pas être cassé

| Sprint | Capacités | Tables / API clés |
|--------|-----------|-------------------|
| S0 | Auth, RBAC, Settings KV, Media basique, Audit | `users`, `roles`, `settings`, `/api/v1/cms/media/*` |
| S1 | Pages, Sections, Versions, Publication, Preview, Navigation, Localization | `content_pages`, `content_sections`, `content_section_types`, `/api/v1/cms/content/*`, `/api/v1/public/*` |
| S2 | Media Library, MediaPicker, StorageProvider, Variants, Usage | `media_*`, `/api/v1/cms/media-library/*` |

### Modèle content actuel (Sprint 1)

```
Page (slug, locale, title, meta_*, template:string, status)
  └── Section[] (section_type_slug, sort_order, content_json, is_visible)
        └── SectionType (slug, schema_json) — registre seedé : hero, rich_text, cta, contact_form
```

### Écarts par rapport au Sprint 3

| Concept Sprint 3 | État actuel | Action |
|--------------------|-------------|--------|
| Theme / Design Tokens | 7 clés plates dans `settings.theme` | Nouveau module structuré |
| Layout | `Page.template` (string libre) | FK `layout_id` + registre layouts |
| Block | Absent — Section ≈ bloc monolithique | Nouveau niveau BlockInstance |
| Section (conteneur) | Section = bloc + contenu | Section devient conteneur de blocs |
| Styles / Responsive | Absent | Value objects + JSON typé |
| Visual editor | Textarea JSON brute | Builder drag & drop |
| MediaPicker | Composant prêt, non câblé | Wiring obligatoire S3 |
| Component Library | Absent | Nouveau registre |
| Undo / Redo / Autosave | Versions manuelles seulement | Builder state + autosave draft |

### Thème existant — deux concepts distincts

1. **Site theme** — groupe `settings.theme` (couleurs, logo, favicon) → API publique `/public/settings`
2. **CMS UI theme** — `themeStore.ts` (dark/light admin) → **hors périmètre Sprint 3**

---

## 2. Décision d'architecture

### Principe : nouveau module `builder` + extension non destructive de `content`

```
┌─────────────────────────────────────────────────────────────────┐
│                         Presentation                             │
│  builder/presentation/cms_router.py   content/cms_router.py (*)  │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                         Application                              │
│  ThemeService · LayoutService · BlockService                    │
│  ComponentLibraryService · BuilderService · StyleService        │
│  ContentApplicationService (étendu : bridge + MediaUsage)       │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                           Domain                                 │
│  Theme · Layout · BlockTemplate · BlockInstance · StylePreset     │
│  ComponentLibrary · GlobalStyle · DesignToken · ResponsiveConfig  │
│  BuilderSnapshot · BuilderHistory                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                       Infrastructure                             │
│  models · repositories · token_engine · style_resolver          │
│  block_registry · component_renderer (preview)                    │
└─────────────────────────────────────────────────────────────────┘

(*) routes Sprint 1 inchangées ; nouvelles routes builder sous /api/v1/cms/builder/*
```

**Pourquoi un module séparé ?**

- Settings KV est trop générique pour tokens versionnés, layouts et composants.
- Content possède déjà le cycle de vie Page/Publication — le builder s'y branche sans le remplacer.
- Frontière claire RBAC, events, cache, tests.
- Points d'extension futurs (Blog Builder, Product Builder…) isolés dans `builder/domain/ports/`.

**Pourquoi ne pas tout mettre dans `content` ?**

- Couplage editorial (workflow publish) vs présentation (theme, tokens, styles).
- Violation SRP et difficulté de test à long terme.

---

## 3. Modèle de domaine

### Hiérarchie cible

```
Page (content — existant, étendu)
  ├── layout_id → Layout
  ├── theme_id → Theme (optionnel, hérite du theme actif par défaut)
  └── BuilderDocument
        ├── sections[] → BuilderSection (conteneur : Hero, Features, Footer…)
        │     ├── blocks[] → BlockInstance
        │     │     ├── type → BlockTemplate
        │     │     ├── props (JSON typé)
        │     │     ├── styles (StyleProps)
        │     │     ├── responsive (desktop | tablet | mobile)
        │     │     ├── animations
        │     │     ├── visibility
        │     │     ├── permissions
        │     │     ├── conditions
        │     │     └── bindings (media_id, token refs…)
        │     └── section_styles (optionnel)
        └── global_styles overrides (optionnel)
```

### Agrégats et responsabilités

| Agrégat | Module | Rôle | Persistance |
|---------|--------|------|-------------|
| **Theme** | builder | Thème nommé, statut draft/published, theme actif | `builder_themes` |
| **ThemeSettings** | builder | Config globale du thème (mode, presets) | `builder_theme_settings` ou JSON sur Theme |
| **DesignToken** | builder | Tokens sémantiques (primary, surface, spacing…) | `builder_design_tokens` |
| **GlobalStyle** | builder | Typo, boutons, radius, ombres, variables CSS | `builder_global_styles` |
| **Layout** | builder | Structure de page (régions, contraintes) | `builder_layouts` |
| **BlockTemplate** | builder | Définition d'un type de bloc (schema props/styles) | `builder_block_templates` |
| **BlockInstance** | builder | Instance d'un bloc sur une page | `builder_block_instances` |
| **BuilderSection** | builder | Conteneur de blocs (≠ Section S1) | `builder_sections` |
| **StylePreset** | builder | Presets réutilisables (card, hero, CTA…) | `builder_style_presets` |
| **ComponentLibrary** | builder | Compositions enregistrées (Hero Premium, Pricing Simple…) | `builder_components` |
| **BuilderSnapshot** | builder | État pour undo/redo/autosave | `builder_page_drafts` + PageVersion étendu |
| **Page** | content | Métadonnées, workflow, SEO — **inchangé fonctionnellement** | `content_pages` (+ colonnes) |

### Relation avec Sprint 1 Section

| Sprint 1 | Sprint 3 | Stratégie |
|----------|----------|-----------|
| `content_sections` | Legacy | **Conservées** — API et pages existantes continuent de fonctionner |
| `SectionType` seed | `BlockTemplate` seed | Migration progressive : chaque SectionType S1 → BlockTemplate + mapping |
| `content_json` | `props` + `styles` | Adaptateur lecture seule ; conversion à la première ouverture dans le Builder |

**Règle de compatibilité :** une page sans `builder_document` utilise le renderer Sprint 1. Dès qu'elle est ouverte dans le Builder, un `BuilderDocument` est créé (migration douce).

---

## 4. Bibliothèque de blocs (BlockTemplate)

### Blocs minimum (25 types)

| Catégorie | Blocs |
|-----------|-------|
| Structure | Columns, Spacer, Divider |
| Contenu | Heading, Paragraph, Rich Text, HTML, Code, Embed |
| Média | Image, Gallery, Video |
| Action | Button, Call To Action, Newsletter, Contact |
| Social proof | Testimonial, Team, LogoCloud, Stats, FAQ, Accordion, Tabs, Timeline |
| Commerce | Feature, Card, Pricing |
| Layout | Hero, Map |
| Avancé | *(Hero couvre le hero S1)* |

Chaque `BlockTemplate` définit :

```typescript
{
  slug: string;
  name: string;
  category: string;
  icon: string;
  props_schema: JSONSchema;      // champs éditables (texte, media, url…)
  styles_schema: JSONSchema;     // couleurs, spacing, border…
  default_props: object;
  default_styles: object;
  responsive_config: boolean;
  media_fields: string[];        // champs liés au MediaPicker
  extension_key?: string;        // point d'extension futur
}
```

### Champs communs BlockInstance

```
id, type, props, styles, responsive, animations, visibility,
permissions, conditions, bindings
```

Implémentés comme value objects typés côté domaine, sérialisés en JSONB côté infra.

---

## 5. Design Tokens & Global Theme

### Moteur de tokens

Tokens primitifs → tokens sémantiques → variables CSS exportées.

| Catégorie | Exemples |
|-----------|----------|
| Couleurs | `primary`, `secondary`, `danger`, `success`, `warning`, `background`, `surface`, `text`, `border` |
| Typographie | `font.family`, `font.size.sm`, `font.weight.bold` |
| Espacement | `spacing.xs` … `spacing.2xl` |
| Radius | `radius.sm`, `radius.md`, `radius.lg` |
| Ombres | `shadow.sm`, `shadow.md`, `shadow.lg` |

### Modes

- **Light Mode** / **Dark Mode** — chaque token peut avoir une valeur par mode.
- Export public : `GET /api/v1/public/theme` → CSS variables + JSON tokens.
- Migration : valeurs actuelles `settings.theme` importées dans le theme par défaut au seed.

### GlobalStyle

Regroupe : typographie globale, styles boutons, espacements par défaut, transitions. Référencé par le Theme actif.

---

## 6. Component Library

Compositions enregistrées par l'utilisateur :

```
ComponentLibrary
  ├── name ("Hero Premium", "Pricing Enterprise", "Restaurant Hero")
  ├── category
  ├── thumbnail (media_id)
  ├── document_snapshot (sections + blocks figés)
  └── is_global (réutilisable cross-pages)
```

Actions : enregistrer, dupliquer, insérer dans une page, supprimer.

---

## 7. Styles & Responsive

### StyleProps (value object)

```
colors, typography, spacing, margin, padding, border, radius, shadow,
opacity, background, gradient, position, flex, grid, alignment,
zIndex, overflow, width, height, maxWidth, animations, transitions
```

### ResponsiveConfig

```json
{
  "desktop": { "display": true, "styles": {}, "props": {} },
  "tablet":  { "display": true, "styles": {}, "props": {} },
  "mobile":  { "display": false, "styles": {}, "props": {} }
}
```

Résolution côté application via `StyleResolver` avant preview/render public.

---

## 8. Frontend CMS

### Nouvelles routes

| Route | Composant | Rôle |
|-------|-----------|------|
| `/builder/pages/:id` | `PageBuilderPage` | Éditeur principal (remplace progressivement l'éditeur JSON) |
| `/themes` | `ThemeManagerPage` | Liste, activer, import/export, duplicate, reset |
| `/themes/:id` | `ThemeBuilderPage` | Tokens, global styles, preview light/dark |
| `/components` | `ComponentLibraryPage` | Bibliothèque composants |

L'éditeur JSON Sprint 1 (`/pages/:id`) reste accessible en fallback jusqu'à validation utilisateur.

### Layout éditeur (PageBuilderPage)

```
┌──────────────┬─────────────────────────────┬──────────────┐
│ Block        │     Canvas (DnD)            │  Inspector   │
│ Library      │  ┌─────────────────────┐    │  - Props     │
│ (palette)    │  │ Section Hero        │    │  - Styles    │
│              │  │  [Heading][Image]   │    │  - Responsive│
│ Components   │  └─────────────────────┘    │  - SEO       │
│              │  [Desktop|Tablet|Mobile]    │  - CSS class │
├──────────────┴─────────────────────────────┴──────────────┤
│ History Panel (undo/redo) · Autosave indicator · Preview │
└───────────────────────────────────────────────────────────┘
```

### Stack frontend

- **DnD :** `@dnd-kit/core` + `@dnd-kit/sortable`
- **État builder :** Zustand store (`builderStore`) avec historique immutable (undo/redo)
- **Autosave :** debounce 3s → `PATCH /builder/pages/:id/draft`
- **Preview :** iframe `/api/v1/cms/builder/preview/:pageId?device=desktop|tablet|mobile`
- **Médias :** `MediaPickerField` exclusivement — aucun upload direct dans le builder
- **Typage :** TypeScript strict, types générés depuis schemas backend

### Composants à créer

```
cms/src/features/builder/
├── components/
│   ├── BuilderCanvas.tsx
│   ├── BlockLibrary.tsx
│   ├── InspectorPanel.tsx
│   ├── ResponsiveToolbar.tsx
│   ├── HistoryPanel.tsx
│   ├── ThemeManager.tsx
│   └── blocks/           # 25 renderers CMS (preview)
├── stores/builderStore.ts
├── hooks/useAutosave.ts, useUndoRedo.ts
├── lib/blockRegistry.ts
├── lib/styleResolver.ts
└── types/builder.types.ts
```

---

## 9. API

### Préfixe : `/api/v1/cms/builder`

| Domaine | Endpoints |
|---------|-----------|
| **Themes** | `GET/POST /themes`, `GET/PATCH/DELETE /themes/{id}`, `POST /themes/{id}/publish`, `POST /themes/{id}/duplicate`, `POST /themes/{id}/reset`, `GET/POST /themes/import`, `GET /themes/{id}/export`, `POST /themes/{id}/activate` |
| **Tokens** | `GET/PATCH /themes/{id}/tokens`, `GET /themes/{id}/css` |
| **Layouts** | `GET/POST /layouts`, `GET/PATCH/DELETE /layouts/{id}`, `POST /layouts/{id}/duplicate` |
| **Blocks** | `GET /block-templates`, `GET /block-templates/{slug}` |
| **Builder** | `GET/PATCH /pages/{pageId}/document`, `POST /pages/{pageId}/sections`, `PATCH/DELETE /sections/{id}`, `POST /sections/{id}/blocks`, `PATCH/DELETE /blocks/{id}`, `POST /blocks/{id}/duplicate`, `POST /blocks/reorder`, `POST /sections/reorder` |
| **Styles** | `GET/POST /style-presets`, `GET/PATCH/DELETE /style-presets/{id}` |
| **Components** | `GET/POST /components`, `GET/PATCH/DELETE /components/{id}`, `POST /components/{id}/insert` |
| **Preview** | `GET /preview/{pageId}?device=&token=` |
| **Draft** | `GET/PUT /pages/{pageId}/draft` (autosave), `POST /pages/{pageId}/undo`, `POST /pages/{pageId}/redo` |
| **Publish bridge** | `POST /pages/{pageId}/publish-builder` → délègue au workflow content S1 |

### API publique (extensions)

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/public/theme` | Theme actif + CSS variables |
| `GET /api/v1/public/pages/{slug}` | **Étendu** — inclut `builder_document` résolu si publié |

Routes Sprint 1 `/api/v1/cms/content/*` et `/api/v1/public/*` restent compatibles.

---

## 10. RBAC

Nouvelles permissions (ajout à `rbac.py`, assignées à `admin` + `editor`) :

| Permission | Rôle |
|------------|------|
| `theme.read` | Consulter themes et tokens |
| `theme.update` | Modifier themes, tokens, global styles |
| `theme.publish` | Publier / activer un theme |
| `layout.manage` | CRUD layouts |
| `block.manage` | CRUD blocs et sections builder |
| `component.manage` | CRUD component library |
| `style.manage` | CRUD style presets |

Permissions content S1 (`content.page.*`) restent requises pour publish workflow.

---

## 11. Domain Events & Cache

### Nouveaux events (`shared/domain/events.py`)

| Event | Invalidation cache |
|-------|-------------------|
| `ThemeUpdated` | `public:theme:*`, `public:settings` |
| `ThemePublished` | idem + `public:page:*` |
| `LayoutUpdated` | `public:page:*`, `builder:layout:*` |
| `BlockCreated` | `builder:page:{id}` |
| `BlockDeleted` | `builder:page:{id}` |
| `ComponentSaved` | `builder:components:*` |

Pattern existant : `CacheInvalidationRequested(patterns=[...])` via UnitOfWork.

---

## 12. Audit

Actions journalisées (via `AuditService` existant) :

| Action | Trigger |
|--------|---------|
| `builder.theme.create/update/publish` | Theme CRUD |
| `builder.layout.create/update/delete` | Layout CRUD |
| `builder.block.create/delete/move/duplicate` | Block operations |
| `builder.component.save/delete` | Component library |
| `builder.page.publish` | Publication via builder |

---

## 13. Migration base de données

### Fichier : `005_sprint3_builder_theme.py`

**Nouvelles tables :**

```
builder_themes
builder_theme_settings
builder_design_tokens
builder_global_styles
builder_layouts
builder_sections
builder_block_templates        (seed 25 blocs)
builder_block_instances
builder_style_presets
builder_components
builder_page_drafts            (autosave + undo stack)
```

**Alterations tables existantes :**

```sql
ALTER TABLE content_pages
  ADD COLUMN layout_id INTEGER REFERENCES builder_layouts(id),
  ADD COLUMN theme_id INTEGER REFERENCES builder_themes(id),
  ADD COLUMN builder_migrated BOOLEAN DEFAULT FALSE;

-- template conservé pour compat ; layout_id prioritaire si présent
```

**Seed initial :**

- Theme « Bloomar Default » (importe `settings.theme`)
- Layout « Default » + « Full Width » + « Landing »
- 25 BlockTemplates
- 3 ComponentLibrary presets (Hero Premium, CTA, Pricing Simple)
- Mapping SectionType S1 → BlockTemplate

**Rollback :** downgrade supprime tables builder ; colonnes `content_pages` nullable → pas de perte content S1.

---

## 14. Intégration Media (Sprint 2)

### Règle absolue

Tout champ image/video/file dans un bloc → `MediaPickerField` → `media_id` dans `props`.

### MediaUsage automatique

Lors de `BuilderService.saveBlock()` :

```python
if media_id := block.props.get("media_id"):
    media_service.register_usage(
        media_id,
        entity_type="builder_block",
        entity_id=block.id,
        entity_label=f"{page.title} / {block.type}",
        field_key="media",
    )
```

Désenregistrement si media remplacé ou bloc supprimé.

---

## 15. History : Undo / Redo / Autosave / Draft

| Mécanisme | Implémentation |
|-----------|----------------|
| **Autosave** | `builder_page_drafts` — debounce 3s, status `draft` |
| **Undo/Redo** | Stack JSON patches dans `builder_page_drafts.history_json` (max 50 états) |
| **Draft vs Published** | Draft = builder_page_drafts ; Published = snapshot dans PageVersion (workflow S1) |
| **Conflits** | Last-write-wins + indicateur « modifications distantes » (S3 simple) |

La publication passe par le workflow S1 existant : `draft → review → published`.

---

## 16. Preview responsive

| Device | Largeur iframe | Comportement |
|--------|----------------|--------------|
| Desktop | 1280px | styles desktop |
| Tablet | 768px | styles tablet + visibility |
| Mobile | 375px | styles mobile + visibility |

Preview utilise le token du Preview S1 (`PreviewToken`) — jamais mis en cache (`Cache-Control: no-store`).

---

## 17. Points d'extension (préparés, non implémentés)

Interfaces/domain ports créés vides ou avec implémentation stub :

```
builder/domain/ports/
├── EntityBuilderPort.py      # entity_type: page | blog | product | landing | email | form
├── BlockRegistryPort.py      # enregistrement dynamique de blocs par module futur
├── RendererPort.py           # rendu public extensible
├── FormBuilderAdapter.py     # stub — Form Builder futur
├── EmailBuilderAdapter.py    # stub — Email Builder futur
└── ProductBuilderAdapter.py  # stub — Product Builder futur
```

Chaque adapter expose : `supported_entity_types`, `get_block_templates()`, `validate_publish()`.

Aucune UI ni route pour Blog/Product/Email/Form dans Sprint 3.

---

## 18. Dépendances

```
Identity/RBAC (S0)
    └── builder permissions

Settings (S0)
    └── migration theme → builder_themes (one-time seed)

Content (S1)
    ├── Page (layout_id, theme_id)
    ├── Publication workflow (publish builder snapshot)
    ├── PreviewToken (preview responsive)
    └── PageVersion (snapshot étendu)

Media (S2)
    ├── MediaPicker (frontend)
    └── MediaUsage (backend auto-register)

Redis (S0/S1)
    └── invalidation builder:*, public:theme:*

Audit (S0)
    └── builder actions
```

### Dépendances npm (frontend)

```
@dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
zustand (déjà présent)
```

---

## 19. Risques et mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Casser pages S1 existantes | Élevé | Dual renderer ; `builder_migrated` flag ; API S1 intacte |
| Complexité 25 blocs | Moyen | BlockTemplate registry + renderers génériques ; implémenter par vagues |
| Performance autosave | Moyen | Debounce + diff patches, pas full document |
| Scope creep (Blog Builder…) | Élevé | Ports/extension points seulement ; checklist stricte |
| JSON styles non typé | Moyen | JSON Schema validation backend + TypeScript types miroir |
| Undo stack volumineux | Faible | Limite 50 états, compression |
| Theme actif vs draft | Moyen | Séparation `status` theme ; seul theme published+active exposé publiquement |
| MediaUsage orphelins | Faible | Cleanup on block delete + replace |

---

## 20. Critères d'acceptation

### Fonctionnels

- [ ] Créer une page visuellement sans HTML
- [ ] Ajouter / déplacer / dupliquer / supprimer blocs par drag & drop
- [ ] Modifier props, styles, responsive via Inspector
- [ ] 25 block templates disponibles dans la palette
- [ ] Theme global avec Design Tokens (light + dark)
- [ ] Preview Desktop / Tablet / Mobile sans publication
- [ ] Enregistrer et réinsérer un composant depuis Component Library
- [ ] MediaPicker sur tous les champs média (aucun upload direct)
- [ ] Undo / Redo / Autosave draft
- [ ] Import / Export / Duplicate / Reset theme
- [ ] Publier via workflow S1 (draft → published)
- [ ] Pages S1 non migrées continuent de s'afficher publiquement

### Non-fonctionnels

- [ ] Architecture DDD stricte (domain/application/infrastructure/presentation)
- [ ] Code TypeScript strict côté CMS
- [ ] Tests backend ≥ 90 % module `builder`
- [ ] Tests frontend : composants builder + hooks (Vitest + Testing Library)
- [ ] Aucune régression S0/S1/S2 (suite complète verte)
- [ ] Documentation complète dans `docs/cms/sprint-3/`

---

## 21. Ordre d'implémentation

### Phase 0 — Fondations (backend)

| # | Tâche | Livrable |
|---|-------|----------|
| 0.1 | Migration `005_sprint3_builder_theme.py` + models | Tables + seed |
| 0.2 | Domain enums + value objects (StyleProps, ResponsiveConfig, DesignToken) | `builder/domain/` |
| 0.3 | BlockTemplate registry + seed 25 blocs | `builder/application/block_registry.py` |
| 0.4 | Repositories + UnitOfWork | `builder/infrastructure/repositories.py` |

### Phase 1 — Theme & Tokens (backend + frontend)

| # | Tâche | Livrable |
|---|-------|----------|
| 1.1 | ThemeService + API themes/tokens | Endpoints CRUD + publish |
| 1.2 | Migration settings.theme → theme default | Seed |
| 1.3 | ThemeManagerPage + ThemeBuilderPage | UI tokens + preview light/dark |
| 1.4 | `GET /api/v1/public/theme` | CSS variables publiques |
| 1.5 | RBAC + events ThemeUpdated/ThemePublished | |

### Phase 2 — Layouts & Block Templates (backend)

| # | Tâche | Livrable |
|---|-------|----------|
| 2.1 | LayoutService + API layouts | CRUD + duplicate |
| 2.2 | BlockTemplate API (read-only registry) | GET /block-templates |
| 2.3 | StylePreset CRUD | API + seed presets |
| 2.4 | Extension Page : layout_id, theme_id | Alter content_pages |

### Phase 3 — Builder Document (backend)

| # | Tâche | Livrable |
|---|-------|----------|
| 3.1 | BuilderService (sections + blocks CRUD, reorder, duplicate) | Application layer |
| 3.2 | Builder API `/pages/{id}/document` | Endpoints complets |
| 3.3 | Draft/autosave + undo/redo stack | builder_page_drafts |
| 3.4 | MediaUsage wiring | Intégration media S2 |
| 3.5 | Bridge publication → ContentService.publish | Workflow S1 |
| 3.6 | Preview endpoint responsive | device param |

### Phase 4 — Frontend Builder (CMS)

| # | Tâche | Livrable |
|---|-------|----------|
| 4.1 | builderStore + useAutosave + useUndoRedo | État |
| 4.2 | BlockLibrary + BuilderCanvas (DnD) | @dnd-kit |
| 4.3 | InspectorPanel (props, styles, responsive) | Formulaires schema-driven |
| 4.4 | 25 block renderers (preview CMS) | `blocks/*.tsx` |
| 4.5 | MediaPickerField intégré | Tous champs media |
| 4.6 | ResponsiveToolbar + iframe preview | 3 devices |
| 4.7 | HistoryPanel | Undo/redo UI |
| 4.8 | ComponentLibraryPage + insert flow | |
| 4.9 | Route `/builder/pages/:id` + lien depuis PagesList | |

### Phase 5 — Component Library & Migration S1

| # | Tâche | Livrable |
|---|-------|----------|
| 5.1 | ComponentLibraryService + API | CRUD + insert |
| 5.2 | Adaptateur Section S1 → BuilderDocument | Migration douce à l'ouverture |
| 5.3 | Public renderer étendu (`public-content.js`) | Rendu builder blocks |
| 5.4 | 3 presets seed (Hero Premium, CTA, Pricing Simple) | |

### Phase 6 — Qualité & Documentation

| # | Tâche | Livrable |
|---|-------|----------|
| 6.1 | Tests backend (domain, app, infra, API, RBAC) | ≥ 90 % builder |
| 6.2 | Tests frontend (stores, hooks, composants clés) | Vitest |
| 6.3 | Suite régression S0–S2 | 100 % vert |
| 6.4 | Docs ARCHITECTURE, API, TESTS, REPORT | `docs/cms/sprint-3/` |

---

## 22. Estimation et périmètre

| Phase | Complexité | Dépendances |
|-------|------------|-------------|
| 0 — Fondations | Moyenne | — |
| 1 — Theme & Tokens | Moyenne | Phase 0 |
| 2 — Layouts | Faible | Phase 0 |
| 3 — Builder backend | Élevée | Phases 0–2 |
| 4 — Frontend Builder | Élevée | Phase 3 |
| 5 — Components & Migration | Moyenne | Phases 3–4 |
| 6 — Qualité | Moyenne | Tout |

**Hors périmètre Sprint 3 (explicitement) :**

- Blog Builder, Product Builder, Landing Builder, Email Builder, Form Builder (ports seulement)
- WYSIWYG rich text avancé (Tiptap/ProseMirror — rich_text bloc basique suffit)
- Animations timeline complexes (keyframes simples seulement)
- Conditions dynamiques avancées (visibility booléenne par device suffit)
- Collaboration temps réel multi-utilisateurs

---

## 23. Validation requise

Avant tout développement, merci de valider ou ajuster :

1. **Nom du module** : `builder` vs `theme` — recommandation : `builder`
2. **Stratégie Section S1** : migration douce à l'ouverture vs migration batch Alembic
3. **Éditeur JSON S1** : conserver en parallèle vs redirection automatique vers Builder
4. **Priorité des 25 blocs** : tous en S3 ou MVP avec 12 blocs + extension progressive ?
5. **Theme unique vs multi-theme** : multi-theme avec un actif (recommandé)
6. **Preview** : iframe backend vs renderer React inline dans CMS

---

**Statut :** 🟡 En attente de validation — aucun code Sprint 3 ne sera produit avant confirmation.
