import json
from typing import Any

from pydantic import BaseModel, Field


class SettingItem(BaseModel):
    key: str
    value: Any


class SettingsGroupOut(BaseModel):
    group: str
    settings: dict[str, Any]


class SettingsGroupUpdate(BaseModel):
    settings: dict[str, Any] = Field(default_factory=dict)


DEFAULT_SETTINGS: dict[str, dict[str, Any]] = {
    "company": {
        "name": "Bloomarone",
        "brand": "BL∞MAR ONE",
        "tagline": "Pilotes d'Infrastructure Financière",
    },
    "contact": {
        "phone": "+237 652 209 175",
        "whatsapp": "237652209175",
        "email": "contact@bloomarone.com",
        "address": "Yaoundé, Quartier Omnisports, Cameroun",
        "hours": "Lun–Ven 8h–17h",
    },
    "social": {
        "facebook": "https://www.facebook.com/profile.php?id=61588999585653",
        "instagram": "https://www.instagram.com/bloomarone/",
        "linkedin": "https://www.linkedin.com/company/bloomar-one/",
        "tiktok": "https://www.tiktok.com/@bloomar.one",
    },
    "analytics": {
        "ga_measurement_id": "",
        "clarity_project_id": "",
        "enabled": True,
    },
    "theme": {
        "primary_color": "#7B2FF7",
        "secondary_color": "#12C7B7",
        "logo_url": "",
        "favicon_url": "",
        "font_family": "Inter",
        "border_radius": "12",
        "shadow_intensity": "medium",
        "mode_default": "light",
    },
}


def serialize_value(value: Any) -> str:
    if isinstance(value, str):
        return value
    return json.dumps(value, ensure_ascii=False)


def deserialize_value(raw: str) -> Any:
    if raw == "":
        return ""
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return raw
