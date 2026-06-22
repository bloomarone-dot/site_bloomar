import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import aiosmtplib

from app.config import settings

logger = logging.getLogger(__name__)


async def send_notification(*, subject: str, body: str, reply_to: str = "") -> None:
    if not settings.mail_user or not settings.mail_pass or "votre.email" in settings.mail_user:
        logger.info("Mode email TEST — notification non envoyée (SMTP non configuré)")
        logger.info("Sujet: %s", subject)
        return

    message = MIMEMultipart("alternative")
    message["From"] = settings.mail_from
    message["To"] = settings.mail_to
    message["Subject"] = subject
    if reply_to:
        message["Reply-To"] = reply_to
    message.attach(MIMEText(body, "html", "utf-8"))

    try:
        await aiosmtplib.send(
            message,
            hostname=settings.mail_host,
            port=settings.mail_port,
            username=settings.mail_user,
            password=settings.mail_pass,
            start_tls=True,
        )
        logger.info("Email envoyé : %s", subject)
    except Exception as exc:
        logger.warning("Échec envoi email : %s", exc)
