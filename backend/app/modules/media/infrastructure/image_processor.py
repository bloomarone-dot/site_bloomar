import io
from collections import Counter

from PIL import Image, ExifTags, UnidentifiedImageError

from app.modules.media.domain.enums import VariantName, VARIANT_MAX_SIZES


def detect_mime(content: bytes, filename: str) -> str | None:
    """Magic-byte MIME detection for supported types."""
    if content[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if content[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if content[:4] == b"RIFF" and content[8:12] == b"WEBP":
        return "image/webp"
    if content[:6] in (b"GIF87a", b"GIF89a"):
        return "image/gif"
    if content[:4] == b"%PDF":
        return "application/pdf"
    if content[:4] == b"PK\x03\x04":
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
        mapping = {"docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                   "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                   "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                   "zip": "application/zip"}
        return mapping.get(ext, "application/zip")
    if content[:3] == b"ID3" or content[:2] == b"\xff\xfb":
        return "audio/mpeg"
    if content[:4] == b"RIFF" and len(content) > 12 and content[8:12] == b"WAVE":
        return "audio/wav"
    if len(content) > 12 and content[4:8] == b"ftyp":
        return "video/mp4"
    if content[:4] == b"\x1a\x45\xdf\xa3":
        return "video/webm"
    if content[:5] == b"<?xml" or b"<svg" in content[:200]:
        return "image/svg+xml"
    return None


def apply_exif_orientation(image: Image.Image) -> Image.Image:
    try:
        exif = image.getexif()
        if not exif:
            return image
        orientation_key = next(
            (k for k, v in ExifTags.TAGS.items() if v == "Orientation"),
            None,
        )
        if orientation_key is None:
            return image
        orientation = exif.get(orientation_key)
        transforms = {
            2: Image.Transpose.FLIP_LEFT_RIGHT,
            3: Image.Transpose.ROTATE_180,
            4: Image.Transpose.FLIP_TOP_BOTTOM,
            5: Image.Transpose.TRANSPOSE,
            6: Image.Transpose.ROTATE_270,
            7: Image.Transpose.TRANSVERSE,
            8: Image.Transpose.ROTATE_90,
        }
        if orientation in transforms:
            return image.transpose(transforms[orientation])
    except Exception:  # noqa: BLE001
        pass
    return image


def extract_dominant_color(image: Image.Image) -> str | None:
    try:
        sample = image.copy()
        sample.thumbnail((64, 64), Image.Resampling.LANCZOS)
        if sample.mode != "RGB":
            sample = sample.convert("RGB")
        pixels = list(sample.getdata())
        if not pixels:
            return None
        r, g, b = Counter(pixels).most_common(1)[0][0]
        return f"#{r:02x}{g:02x}{b:02x}"
    except Exception:  # noqa: BLE001
        return None


class ImageProcessor:
    """Generates image variants and metadata. BlurHash hook reserved for Sprint 3."""

    blurhash_enabled: bool = False

    def process(
        self,
        content: bytes,
        *,
        base_name: str,
        folder: str,
        storage,
    ) -> tuple[int, int, str | None, list[dict]]:
        """
        Returns width, height, dominant_color, variant specs:
        [{variant_name, relative_path, width, height, size_bytes, format}]
        """
        if content[:5] == b"<?xml" or b"<svg" in content[:200]:
            return 0, 0, None, []

        try:
            image = Image.open(io.BytesIO(content))
        except UnidentifiedImageError as exc:
            raise ValueError("Invalid image") from exc

        image = apply_exif_orientation(image)
        if image.mode in ("RGBA", "P"):
            rgb = image.convert("RGB")
        else:
            rgb = image.convert("RGB") if image.mode != "RGB" else image

        width, height = rgb.size
        dominant = extract_dominant_color(rgb)
        variants: list[dict] = []

        for variant_name, max_size in VARIANT_MAX_SIZES.items():
            if variant_name in (VariantName.ORIGINAL, VariantName.WEBP):
                continue
            if max_size is None:
                continue
            thumb = rgb.copy()
            thumb.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            ext = ".webp"
            fmt = "WEBP"
            variant_filename = f"{base_name}_{variant_name}{ext}"
            rel_path = f"{folder}/variants/{variant_filename}"
            dest = storage.build_path(folder=f"{folder}/variants", filename=variant_filename)
            thumb.save(dest, format=fmt, quality=85)
            variants.append(
                {
                    "variant_name": variant_name,
                    "storage_path": storage.relative_to_root(dest),
                    "width": thumb.width,
                    "height": thumb.height,
                    "size_bytes": dest.stat().st_size,
                    "format": fmt.lower(),
                }
            )

        # WebP full-size copy
        webp_name = f"{base_name}_webp.webp"
        webp_dest = storage.build_path(folder=f"{folder}/variants", filename=webp_name)
        rgb.save(webp_dest, format="WEBP", quality=85)
        variants.append(
            {
                "variant_name": VariantName.WEBP,
                "storage_path": storage.relative_to_root(webp_dest),
                "width": width,
                "height": height,
                "size_bytes": webp_dest.stat().st_size,
                "format": "webp",
            }
        )

        return width, height, dominant, variants
