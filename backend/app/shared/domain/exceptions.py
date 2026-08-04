class BloomarError(Exception):
    """Base application error."""

    code: str = "INTERNAL_ERROR"
    status_code: int = 500

    def __init__(self, message: str, *, code: str | None = None, status_code: int | None = None):
        super().__init__(message)
        if code:
            self.code = code
        if status_code:
            self.status_code = status_code


class NotFoundError(BloomarError):
    code = "NOT_FOUND"
    status_code = 404


class ValidationError(BloomarError):
    code = "VALIDATION_ERROR"
    status_code = 422


class ForbiddenError(BloomarError):
    code = "FORBIDDEN"
    status_code = 403


class UnauthorizedError(BloomarError):
    code = "UNAUTHORIZED"
    status_code = 401


class ConflictError(BloomarError):
    code = "CONFLICT"
    status_code = 409


class BusinessRuleError(BloomarError):
    code = "BUSINESS_RULE_VIOLATION"
    status_code = 400
