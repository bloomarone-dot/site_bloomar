from app.shared.infrastructure.cache import CacheService


def _auth_headers(client):
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@bloomarone.com", "password": "BloomarCMS2026!"},
    )
    token = login.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


PNG_BYTES = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01"
    b"\x00\x00\x05\x00\x01\r\n-\xdb\x00\x00\x00\x00IEND\xaeB`\x82"
)


def test_media_library_upload_and_search(client, tmp_path, monkeypatch):
    from app.config import settings

    monkeypatch.setattr(settings, "media_root", tmp_path)
    headers = _auth_headers(client)
    CacheService.clear_memory()

    response = client.post(
        "/api/v1/cms/media-library/upload",
        headers=headers,
        files={"file": ("hero.png", PNG_BYTES, "image/png")},
        data={"folder": "images/hero", "alt_text": "Hero"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["mime_type"] == "image/png"
    assert body["uuid"]
    assert body["checksum"]
    assert len(body["variants"]) >= 3
    assert body["dominant_color"]

    search = client.get("/api/v1/cms/media-library?q=hero", headers=headers)
    assert search.status_code == 200
    assert search.json()["total"] >= 1


def test_legacy_media_upload_still_works(client, tmp_path, monkeypatch):
    from app.config import settings

    monkeypatch.setattr(settings, "media_root", tmp_path)
    headers = _auth_headers(client)

    response = client.post(
        "/api/v1/cms/media/upload",
        headers=headers,
        files={"file": ("test.png", PNG_BYTES, "image/png")},
    )
    assert response.status_code == 200
    assert "access_token" not in response.json()
    assert response.json()["mime_type"] == "image/png"


def test_folders_tree(client):
    headers = _auth_headers(client)
    roots = client.get("/api/v1/cms/media-library/folders/tree", headers=headers)
    assert roots.status_code == 200
    paths = [f["path"] for f in roots.json()]
    assert "images" in paths
    images = next(f for f in roots.json() if f["path"] == "images")
    children = client.get(
        f"/api/v1/cms/media-library/folders/tree?parent_id={images['id']}",
        headers=headers,
    )
    child_paths = [f["path"] for f in children.json()]
    assert "images/hero" in child_paths


def test_tags_and_collections(client, tmp_path, monkeypatch):
    from app.config import settings

    monkeypatch.setattr(settings, "media_root", tmp_path)
    headers = _auth_headers(client)

    tag = client.post("/api/v1/cms/media-library/tags", headers=headers, json={"name": "Marketing"})
    assert tag.status_code == 200

    col = client.post(
        "/api/v1/cms/media-library/collections",
        headers=headers,
        json={"name": "Homepage", "description": "Home assets"},
    )
    assert col.status_code == 200
    collection_id = col.json()["id"]

    upload = client.post(
        "/api/v1/cms/media-library/upload",
        headers=headers,
        files={"file": ("banner.png", PNG_BYTES, "image/png")},
    )
    media_id = upload.json()["id"]

    add = client.post(
        f"/api/v1/cms/media-library/collections/{collection_id}/items/{media_id}",
        headers=headers,
    )
    assert add.status_code == 200


def test_media_usage_blocks_delete(client, tmp_path, monkeypatch):
    from app.config import settings

    monkeypatch.setattr(settings, "media_root", tmp_path)
    headers = _auth_headers(client)

    upload = client.post(
        "/api/v1/cms/media-library/upload",
        headers=headers,
        files={"file": ("used.png", PNG_BYTES, "image/png")},
    )
    media_id = upload.json()["id"]

    client.post(
        f"/api/v1/cms/media-library/{media_id}/usage",
        headers=headers,
        json={"entity_type": "page", "entity_id": 1, "entity_label": "Accueil", "field_key": "hero"},
    )

    blocked = client.delete(f"/api/v1/cms/media-library/{media_id}", headers=headers)
    assert blocked.status_code == 400

    forced = client.delete(f"/api/v1/cms/media-library/{media_id}?force=true", headers=headers)
    assert forced.status_code == 200


def test_soft_delete_and_restore(client, tmp_path, monkeypatch):
    from app.config import settings

    monkeypatch.setattr(settings, "media_root", tmp_path)
    headers = _auth_headers(client)

    upload = client.post(
        "/api/v1/cms/media-library/upload",
        headers=headers,
        files={"file": ("trash.png", PNG_BYTES, "image/png")},
    )
    media_id = upload.json()["id"]

    client.delete(f"/api/v1/cms/media-library/{media_id}", headers=headers)
    trashed = client.get("/api/v1/cms/media-library?status=trashed", headers=headers)
    assert any(m["id"] == media_id for m in trashed.json()["data"])

    restore = client.post(f"/api/v1/cms/media-library/{media_id}/restore", headers=headers)
    assert restore.status_code == 200
    assert restore.json()["status"] == "active"


def test_rename_and_move(client, tmp_path, monkeypatch):
    from app.config import settings

    monkeypatch.setattr(settings, "media_root", tmp_path)
    headers = _auth_headers(client)

    upload = client.post(
        "/api/v1/cms/media-library/upload",
        headers=headers,
        files={"file": ("move-me.png", PNG_BYTES, "image/png")},
        data={"folder": "uploads"},
    )
    media_id = upload.json()["id"]

    renamed = client.post(
        f"/api/v1/cms/media-library/{media_id}/rename",
        headers=headers,
        json={"name": "moved.png"},
    )
    assert renamed.json()["original_filename"] == "moved.png"

    moved = client.post(
        f"/api/v1/cms/media-library/{media_id}/move",
        headers=headers,
        json={"folder": "images/hero"},
    )
    assert moved.json()["folder"] == "images/hero"


def test_copy_and_update_metadata(client, tmp_path, monkeypatch):
    from app.config import settings

    monkeypatch.setattr(settings, "media_root", tmp_path)
    headers = _auth_headers(client)

    upload = client.post(
        "/api/v1/cms/media-library/upload",
        headers=headers,
        files={"file": ("copy-src.png", PNG_BYTES, "image/png")},
    )
    media_id = upload.json()["id"]

    copied = client.post(
        f"/api/v1/cms/media-library/{media_id}/copy",
        headers=headers,
        json={"folder": "images/blog"},
    )
    assert copied.status_code == 200
    assert copied.json()["folder"] == "images/blog"

    detail = client.get(f"/api/v1/cms/media-library/{media_id}", headers=headers)
    assert detail.status_code == 200

    updated = client.patch(
        f"/api/v1/cms/media-library/{media_id}",
        headers=headers,
        json={"alt_text": "Alt", "caption": "Cap", "tag_names": ["Hero"]},
    )
    assert updated.json()["alt_text"] == "Alt"
    assert any(t["name"] == "Hero" for t in updated.json()["tags"])


def test_upload_multiple_and_usage_list(client, tmp_path, monkeypatch):
    from app.config import settings

    monkeypatch.setattr(settings, "media_root", tmp_path)
    headers = _auth_headers(client)

    response = client.post(
        "/api/v1/cms/media-library/upload/multiple",
        headers=headers,
        files=[
            ("files", ("a.png", PNG_BYTES, "image/png")),
            ("files", ("b.png", PNG_BYTES, "image/png")),
        ],
        data={"folder": "uploads"},
    )
    assert response.status_code == 200
    assert len(response.json()) == 2

    media_id = response.json()[0]["id"]
    client.post(
        f"/api/v1/cms/media-library/{media_id}/usage",
        headers=headers,
        json={"entity_type": "page", "entity_id": 2, "entity_label": "Services", "field_key": "banner"},
    )
    usage = client.get(f"/api/v1/cms/media-library/{media_id}/usage", headers=headers)
    assert usage.status_code == 200
    assert len(usage.json()) == 1


def test_folder_create_delete_and_tag_rename(client):
    headers = _auth_headers(client)

    created = client.post(
        "/api/v1/cms/media-library/folders",
        headers=headers,
        json={"name": "Campaign", "parent_id": None},
    )
    assert created.status_code == 200
    folder_id = created.json()["id"]

    dup = client.post(
        "/api/v1/cms/media-library/folders",
        headers=headers,
        json={"name": "Campaign"},
    )
    assert dup.status_code == 422

    tag = client.post("/api/v1/cms/media-library/tags", headers=headers, json={"name": "Summer"})
    tag_id = tag.json()["id"]
    renamed = client.patch(
        f"/api/v1/cms/media-library/tags/{tag_id}",
        headers=headers,
        json={"name": "Summer 2026"},
    )
    assert renamed.json()["name"] == "Summer 2026"

    deleted = client.delete(f"/api/v1/cms/media-library/tags/{tag_id}", headers=headers)
    assert deleted.status_code == 200

    removed = client.delete(f"/api/v1/cms/media-library/folders/{folder_id}", headers=headers)
    assert removed.status_code == 200


def test_media_rbac_requires_auth(client):
    assert client.get("/api/v1/cms/media-library").status_code == 401


def test_serve_media_file(client, tmp_path, monkeypatch):
    from app.config import settings

    monkeypatch.setattr(settings, "media_root", tmp_path)
    headers = _auth_headers(client)
    upload = client.post(
        "/api/v1/cms/media-library/upload",
        headers=headers,
        files={"file": ("serve.png", PNG_BYTES, "image/png")},
    )
    path = upload.json()["url"].split("/media/files/")[-1]
    served = client.get(f"/api/v1/cms/media/files/{path}")
    assert served.status_code == 200


def test_legacy_list_get_and_delete(client, tmp_path, monkeypatch):
    from app.config import settings

    monkeypatch.setattr(settings, "media_root", tmp_path)
    headers = _auth_headers(client)
    upload = client.post(
        "/api/v1/cms/media/upload",
        headers=headers,
        files={"file": ("legacy-list.png", PNG_BYTES, "image/png")},
    )
    media_id = upload.json()["id"]
    listing = client.get("/api/v1/cms/media", headers=headers)
    assert listing.json()["total"] >= 1
    detail = client.get(f"/api/v1/cms/media/{media_id}", headers=headers)
    assert detail.json()["id"] == media_id
    deleted = client.delete(f"/api/v1/cms/media/{media_id}", headers=headers)
    assert deleted.status_code == 200
