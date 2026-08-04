from sqlalchemy.orm import Session

from app.shared.domain.events import DomainEvent
from app.shared.infrastructure.event_bus import dispatch_events


class UnitOfWork:
    def __init__(self, session: Session):
        self.session = session
        self._events: list[DomainEvent] = []

    def add_event(self, event: DomainEvent) -> None:
        self._events.append(event)

    def commit(self) -> None:
        self.session.commit()
        if self._events:
            dispatch_events(self._events)
            self._events.clear()

    def rollback(self) -> None:
        self.session.rollback()
        self._events.clear()
