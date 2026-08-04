import json

from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modules.audit.models import AuditLog


class AuditLogOut(BaseModel):
    id: int
    user_id: int | None
    action: str
    entity_type: str | None
    entity_id: str | None
    payload: dict | None
    ip_address: str | None
    created_at: str

    model_config = {"from_attributes": True}


class AuditService:
    def __init__(self, db: Session):
        self.db = db

    def log(
        self,
        *,
        action: str,
        user_id: int | None = None,
        entity_type: str | None = None,
        entity_id: str | None = None,
        payload: dict | None = None,
        ip_address: str | None = None,
    ) -> None:
        entry = AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            payload=json.dumps(payload, ensure_ascii=False) if payload else None,
            ip_address=ip_address,
        )
        self.db.add(entry)
        self.db.commit()

    def list_logs(self, *, page: int, limit: int) -> tuple[list[dict], int]:
        query = select(AuditLog)
        total = self.db.scalar(select(func.count()).select_from(query.subquery())) or 0
        rows = self.db.scalars(
            query.order_by(AuditLog.created_at.desc()).offset((page - 1) * limit).limit(limit)
        ).all()
        result = []
        for row in rows:
            payload = None
            if row.payload:
                try:
                    payload = json.loads(row.payload)
                except json.JSONDecodeError:
                    payload = {"raw": row.payload}
            result.append(
                {
                    "id": row.id,
                    "user_id": row.user_id,
                    "action": row.action,
                    "entity_type": row.entity_type,
                    "entity_id": row.entity_id,
                    "payload": payload,
                    "ip_address": row.ip_address,
                    "created_at": row.created_at.isoformat() if row.created_at else "",
                }
            )
        return result, total
