import json

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.content.infrastructure.models import Page, Section, SectionType
from app.modules.localization.infrastructure.models import Locale
from app.modules.navigation.infrastructure.models import Menu, MenuItem


def seed_sprint1_content(db: Session) -> None:
    """Idempotent seed for Sprint 1 demo + tests."""
    _seed_section_types(db)
    _seed_locales(db)
    _seed_pages(db)
    _seed_menus(db)
    db.commit()


def _seed_section_types(db: Session) -> None:
    types = [
        {
            "slug": "hero",
            "name": "Hero",
            "description": "En-tête de page avec titre et sous-titre",
            "icon": "layout",
            "schema": {
                "badge": {"type": "string"},
                "title": {"type": "string"},
                "subtitle": {"type": "string"},
                "variant": {"type": "string", "enum": ["default", "image", "dark"]},
            },
        },
        {
            "slug": "rich_text",
            "name": "Texte riche",
            "description": "Bloc de contenu HTML/texte",
            "icon": "file-text",
            "schema": {"html": {"type": "string"}},
        },
        {
            "slug": "cta",
            "name": "Call to action",
            "description": "Bouton d'action",
            "icon": "mouse-pointer",
            "schema": {
                "label": {"type": "string"},
                "url": {"type": "string"},
                "style": {"type": "string"},
            },
        },
        {
            "slug": "contact_form",
            "name": "Formulaire contact",
            "description": "Formulaire de contact intégré",
            "icon": "mail",
            "schema": {"heading": {"type": "string"}, "subheading": {"type": "string"}},
        },
    ]
    for item in types:
        existing = db.scalar(select(SectionType).where(SectionType.slug == item["slug"]))
        if existing:
            continue
        db.add(
            SectionType(
                slug=item["slug"],
                name=item["name"],
                description=item["description"],
                icon=item["icon"],
                schema_json=json.dumps(item["schema"], ensure_ascii=False),
            )
        )
    db.flush()


def _seed_locales(db: Session) -> None:
    locales = [
        {"code": "fr", "name": "Français", "is_default": True},
        {"code": "en", "name": "English", "is_default": False},
    ]
    for loc in locales:
        existing = db.scalar(select(Locale).where(Locale.code == loc["code"]))
        if existing:
            continue
        db.add(
            Locale(
                code=loc["code"],
                name=loc["name"],
                is_default=loc["is_default"],
                is_active=True,
            )
        )
    db.flush()


def _seed_pages(db: Session) -> None:
    if db.scalar(select(Page).where(Page.slug == "contact", Page.locale == "fr")):
        return
    page = Page(
        slug="contact",
        locale="fr",
        title="Contact",
        meta_title="Contact | BL∞MAR ONE",
        meta_description="Contactez Bloomarone pour vos projets digitaux.",
        template="default",
        status="draft",
    )
    db.add(page)
    db.flush()
    db.add(
        Section(
            page_id=page.id,
            section_type_slug="hero",
            sort_order=0,
            content_json=json.dumps(
                {
                    "badge": "Contact",
                    "title": "Parlons de votre projet",
                    "subtitle": "Une équipe locale, réactive et orientée résultats.",
                    "variant": "default",
                },
                ensure_ascii=False,
            ),
            is_visible=True,
            locale="fr",
        )
    )
    db.add(
        Section(
            page_id=page.id,
            section_type_slug="contact_form",
            sort_order=1,
            content_json=json.dumps(
                {"heading": "Envoyez-nous un message", "subheading": "Réponse sous 24h ouvrées."},
                ensure_ascii=False,
            ),
            is_visible=True,
            locale="fr",
        )
    )

    if not db.scalar(select(Page).where(Page.slug == "mentions-legales", Page.locale == "fr")):
        legal = Page(
            slug="mentions-legales",
            locale="fr",
            title="Mentions légales",
            meta_title="Mentions légales | BL∞MAR ONE",
            template="default",
            status="draft",
        )
        db.add(legal)
        db.flush()
        db.add(
            Section(
                page_id=legal.id,
                section_type_slug="hero",
                sort_order=0,
                content_json=json.dumps(
                    {
                        "badge": "Informations légales",
                        "title": "Mentions légales",
                        "subtitle": "Informations relatives à l'éditeur du site.",
                        "variant": "dark",
                    },
                    ensure_ascii=False,
                ),
                locale="fr",
            )
        )
        db.add(
            Section(
                page_id=legal.id,
                section_type_slug="rich_text",
                sort_order=1,
                content_json=json.dumps(
                    {
                        "html": "<p>Le site bloomarone.com est édité par BL∞MAR ONE (Bloomarone).</p>",
                    },
                    ensure_ascii=False,
                ),
                locale="fr",
            )
        )


def _seed_menus(db: Session) -> None:
    menu_defs = [
        ("header", "Navigation principale"),
        ("footer", "Pied de page"),
        ("mobile", "Menu mobile"),
    ]
    items = [
        {"label": "Accueil", "url": "/"},
        {"label": "Services", "url": "/services.html"},
        {"label": "Contact", "url": "/contact.html"},
    ]
    for slug, name in menu_defs:
        menu = db.scalar(select(Menu).where(Menu.slug == slug, Menu.locale == "fr"))
        if menu:
            continue
        menu = Menu(slug=slug, name=name, locale="fr")
        db.add(menu)
        db.flush()
        for idx, item in enumerate(items):
            db.add(
                MenuItem(
                    menu_id=menu.id,
                    label=item["label"],
                    url=item["url"],
                    sort_order=idx,
                    is_external=False,
                    locale="fr",
                )
            )
