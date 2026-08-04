def test_health(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_login_and_me(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@bloomarone.com", "password": "BloomarCMS2026!"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "admin@bloomarone.com"
    assert "settings.read" in data["permissions"]

    me = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {data['access_token']}"},
    )
    assert me.status_code == 200
    assert me.json()["user"]["roles"] == ["super_admin"]


def test_settings_groups(client):
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@bloomarone.com", "password": "BloomarCMS2026!"},
    )
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    groups = client.get("/api/v1/cms/settings", headers=headers)
    assert groups.status_code == 200
    assert "contact" in groups.json()

    contact = client.get("/api/v1/cms/settings/contact", headers=headers)
    assert contact.status_code == 200
    assert contact.json()["settings"]["email"] == "contact@bloomarone.com"

    updated = client.patch(
        "/api/v1/cms/settings/contact",
        headers=headers,
        json={"settings": {"phone": "+237 652 209 999"}},
    )
    assert updated.status_code == 200
    assert updated.json()["settings"]["phone"] == "+237 652 209 999"


def test_media_upload(client, tmp_path, monkeypatch):
    from app.config import settings

    monkeypatch.setattr(settings, "media_root", tmp_path)

    login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@bloomarone.com", "password": "BloomarCMS2026!"},
    )
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    png_bytes = (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
        b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01"
        b"\x00\x00\x05\x00\x01\r\n-\xdb\x00\x00\x00\x00IEND\xaeB`\x82"
    )
    response = client.post(
        "/api/v1/cms/media/upload",
        headers=headers,
        files={"file": ("test.png", png_bytes, "image/png")},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["mime_type"] == "image/png"
    assert len(body["variants"]) >= 1

    listing = client.get("/api/v1/cms/media", headers=headers)
    assert listing.status_code == 200
    assert listing.json()["total"] >= 1


def test_audit_logs_after_login(client):
    client.post(
        "/api/v1/auth/login",
        json={"email": "admin@bloomarone.com", "password": "BloomarCMS2026!"},
    )
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@bloomarone.com", "password": "BloomarCMS2026!"},
    )
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    logs = client.get("/api/v1/cms/audit", headers=headers)
    assert logs.status_code == 200
    actions = [item["action"] for item in logs.json()["data"]]
    assert "auth.login" in actions
