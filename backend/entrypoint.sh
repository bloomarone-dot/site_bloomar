#!/bin/bash
set -e

echo "Application des migrations Alembic..."
alembic upgrade head

echo "Démarrage du serveur API..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
