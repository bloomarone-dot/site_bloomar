import json

from app.shared.infrastructure.cache import CacheService


def _auth_headers(client):
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@bloomarone.com", "password": "BloomarCMS2026!"},
    )
    token = login.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_public_settings(client):
    response = client.get("/api/v1/public/settings")
    assert response.status_code == 200
    data = json.loads(response.content)
    assert "contact" in data
    assert response.headers.get("etag")
    assert "max-age" in response.headers.get("cache-control", "")


def test_public_page_not_published(client):
    response = client.get("/api/v1/public/pages/contact?locale=fr")
    assert response.status_code == 404


def test_publication_workflow(client):
    headers = _auth_headers(client)
    CacheService.clear_memory()

    pages = client.get("/api/v1/cms/content/pages", headers=headers)
    assert pages.status_code == 200
    contact = next((p for p in pages.json()["data"] if p["slug"] == "contact"), None)
    assert contact is not None
    page_id = contact["id"]

    public = client.get("/api/v1/public/pages/contact?locale=fr")
    assert public.status_code == 404

    review = client.post(f"/api/v1/cms/content/pages/{page_id}/submit-review", headers=headers, json={})
    assert review.status_code == 200
    assert review.json()["status"] == "review"

    still_public = client.get("/api/v1/public/pages/contact?locale=fr")
    assert still_public.status_code == 404

    published = client.post(f"/api/v1/cms/content/pages/{page_id}/publish", headers=headers, json={})
    assert published.status_code == 200
    assert published.json()["status"] == "published"

    live = client.get("/api/v1/public/pages/contact?locale=fr")
    assert live.status_code == 200
    body = json.loads(live.content)
    assert body["slug"] == "contact"
    assert len(body["sections"]) >= 1
    assert live.headers.get("etag")

    etag = live.headers["etag"]
    cached = client.get("/api/v1/public/pages/contact?locale=fr", headers={"If-None-Match": etag})
    assert cached.status_code == 304


def test_preview_token(client):
    headers = _auth_headers(client)
    pages = client.get("/api/v1/cms/content/pages", headers=headers)
    page_id = next(p["id"] for p in pages.json()["data"] if p["slug"] == "contact")

    client.post(f"/api/v1/cms/content/pages/{page_id}/draft", headers=headers, json={})

    preview = client.post(f"/api/v1/cms/content/pages/{page_id}/preview", headers=headers, json={})
    assert preview.status_code == 200
    token = preview.json()["token"]

    public_draft = client.get("/api/v1/public/pages/contact?locale=fr")
    assert public_draft.status_code == 404

    preview_resp = client.get(f"/api/v1/public/preview/{token}")
    assert preview_resp.status_code == 200
    snapshot = json.loads(preview_resp.content)
    assert "sections" in snapshot
    assert preview_resp.headers.get("cache-control", "").startswith("no-store")


def test_rollback(client):
    headers = _auth_headers(client)
    pages = client.get("/api/v1/cms/content/pages", headers=headers)
    page_id = next(p["id"] for p in pages.json()["data"] if p["slug"] == "contact")

    client.patch(
        f"/api/v1/cms/content/pages/{page_id}",
        headers=headers,
        json={"title": "Contact Modifié"},
    )
    client.post(f"/api/v1/cms/content/pages/{page_id}/submit-review", headers=headers, json={})
    client.post(f"/api/v1/cms/content/pages/{page_id}/publish", headers=headers, json={"note": "v2"})

    versions = client.get(f"/api/v1/cms/content/pages/{page_id}/versions", headers=headers)
    assert versions.status_code == 200
    version_list = versions.json()
    assert len(version_list) >= 2
    first_version = version_list[-1]["id"]

    client.post(f"/api/v1/cms/content/pages/{page_id}/rollback/{first_version}", headers=headers)
    page = client.get(f"/api/v1/cms/content/pages/{page_id}", headers=headers)
    assert page.json()["status"] == "published"


def test_public_menus(client):
    response = client.get("/api/v1/public/menus?locale=fr")
    assert response.status_code == 200
    data = json.loads(response.content)
    assert "header" in data
    assert len(data["header"]["items"]) >= 1


def test_public_navigation(client):
    response = client.get("/api/v1/public/navigation?locale=fr")
    assert response.status_code == 200
    data = json.loads(response.content)
    assert "header" in data and "footer" in data and "mobile" in data


def test_section_types(client):
    headers = _auth_headers(client)
    response = client.get("/api/v1/cms/content/section-types", headers=headers)
    assert response.status_code == 200
    slugs = [s["slug"] for s in response.json()]
    assert "hero" in slugs


def test_locales(client):
    headers = _auth_headers(client)
    response = client.get("/api/v1/cms/localization/locales", headers=headers)
    assert response.status_code == 200
    codes = [l["code"] for l in response.json()]
    assert "fr" in codes and "en" in codes
