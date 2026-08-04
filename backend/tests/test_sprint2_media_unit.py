import io

import pytest
from PIL import Image

from app.modules.media.application.services import MediaApplicationService, _safe_filename
from app.modules.media.domain.enums import StorageProvider
from app.modules.media.infrastructure.image_processor import (
    ImageProcessor,
    apply_exif_orientation,
    detect_mime,
    extract_dominant_color,
)
from app.modules.media.infrastructure.storage.factory import get_storage_provider
from app.modules.media.infrastructure.storage.local_storage import LocalStorageProvider
from app.shared.domain.exceptions import ValidationError


PNG_BYTES = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01"
    b"\x00\x00\x05\x00\x01\r\n-\xdb\x00\x00\x00\x00IEND\xaeB`\x82"
)

PDF_BYTES = b"%PDF-1.4 minimal"
SVG_BYTES = b'<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"></svg>'


def _make_jpeg() -> bytes:
    img = Image.new("RGB", (32, 32), color=(255, 0, 0))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def test_safe_filename():
    assert _safe_filename("../../etc/passwd") == "passwd"
    assert _safe_filename("my file (1).png") == "my_file__1_.png"


def test_detect_mime_variants():
    assert detect_mime(PNG_BYTES, "x.png") == "image/png"
    assert detect_mime(_make_jpeg(), "x.jpg") == "image/jpeg"
    assert detect_mime(PDF_BYTES, "doc.pdf") == "application/pdf"
    assert detect_mime(SVG_BYTES, "icon.svg") == "image/svg+xml"
    assert detect_mime(b"unknown", "file.bin") is None


def test_image_processor_svg_skips_variants(tmp_path):
    storage = LocalStorageProvider(root=tmp_path)
    processor = ImageProcessor()
    w, h, color, variants = processor.process(
        SVG_BYTES, base_name="icon", folder="brand", storage=storage
    )
    assert w == h == 0
    assert color is None
    assert variants == []


def test_image_processor_generates_variants(tmp_path):
    storage = LocalStorageProvider(root=tmp_path)
    processor = ImageProcessor()
    w, h, color, variants = processor.process(
        _make_jpeg(), base_name="photo", folder="images", storage=storage
    )
    assert w == 32 and h == 32
    assert color
    names = {v["variant_name"] for v in variants}
    assert "thumbnail" in names
    assert "webp" in names


def test_extract_dominant_color():
    img = Image.new("RGB", (10, 10), color=(10, 20, 30))
    assert extract_dominant_color(img) == "#0a141e"


def test_apply_exif_orientation_no_exif():
    img = Image.new("RGB", (4, 4))
    assert apply_exif_orientation(img).size == (4, 4)


def test_storage_provider_local(tmp_path):
    storage = LocalStorageProvider(root=tmp_path)
    rel = storage.save(relative_path="uploads/test.txt", content=b"hello")
    assert storage.exists(rel)
    assert storage.read(rel) == b"hello"
    url = storage.public_url(rel)
    assert url.endswith("test.txt")
    dest = storage.unique_filename("photo.png")
    assert dest.endswith(".png")
    moved = storage.move(rel, "archive/test.txt")
    assert storage.read(moved) == b"hello"
    copied = storage.copy(moved, "copy/test.txt")
    assert storage.read(copied) == b"hello"
    storage.delete(copied)
    storage.delete(moved)


def test_storage_factory():
    assert isinstance(get_storage_provider(StorageProvider.LOCAL), LocalStorageProvider)
    with pytest.raises(NotImplementedError):
        get_storage_provider(StorageProvider.S3).save(relative_path="x", content=b"")


def test_validate_upload_rejects_bad_mime(db_session):
    service = MediaApplicationService(db_session)
    with pytest.raises(ValidationError, match="MIME type not allowed"):
        service._validate_upload(filename="evil.exe", content=b"MZ", declared_mime="application/octet-stream")


def test_validate_upload_rejects_mismatch(db_session):
    service = MediaApplicationService(db_session)
    with pytest.raises(ValidationError, match="Extension does not match"):
        service._validate_upload(filename="fake.png", content=PDF_BYTES, declared_mime="application/pdf")


def test_validate_upload_rejects_oversized(db_session, monkeypatch):
    from app.config import settings

    monkeypatch.setattr(settings, "media_max_upload_mb", 0)
    service = MediaApplicationService(db_session)
    with pytest.raises(ValidationError, match="File too large"):
        service._validate_upload(filename="big.png", content=PNG_BYTES, declared_mime="image/png")


def test_storage_factory_cloud_stubs():
    for provider in ("minio", "r2", "s3"):
        p = get_storage_provider(provider)
        with pytest.raises(NotImplementedError):
            p.read("x")
