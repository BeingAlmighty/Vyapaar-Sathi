from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import psycopg

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_msg = errors[0].get("msg") if errors else "Invalid request payload"
    field = " -> ".join([str(loc) for loc in errors[0].get("loc", [])]) if errors else ""
    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": f"{first_msg} (field: {field})"
            }
        }
    )

async def http_exception_handler(request: Request, exc: HTTPException):
    code_str = "RESOURCE_NOT_FOUND" if exc.status_code == 404 else "BAD_REQUEST" if exc.status_code == 400 else "HTTP_ERROR"
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": code_str,
                "message": exc.detail
            }
        }
    )

async def database_exception_handler(request: Request, exc: psycopg.Error):
    print(f"Database Error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "DATABASE_ERROR",
                "message": "A database error occurred. Please try again later."
            }
        }
    )

async def generic_exception_handler(request: Request, exc: Exception):
    print(f"Unhandled Exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected server error occurred."
            }
        }
    )
