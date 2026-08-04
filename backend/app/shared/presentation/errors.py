from fastapi import Request
from fastapi.responses import JSONResponse
from pydantic import ValidationError as PydanticValidationError

from app.shared.domain.exceptions import BloomarError


def register_exception_handlers(app):
    @app.exception_handler(BloomarError)
    async def bloomar_error_handler(_: Request, exc: BloomarError):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": {"code": exc.code, "message": str(exc)}},
        )

    @app.exception_handler(PydanticValidationError)
    async def pydantic_validation_handler(_: Request, exc: PydanticValidationError):
        return JSONResponse(
            status_code=422,
            content={
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Validation failed",
                    "details": exc.errors(),
                }
            },
        )
