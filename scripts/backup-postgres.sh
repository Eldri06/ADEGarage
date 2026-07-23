#!/usr/bin/env bash
set -euo pipefail

: "${DATABASE_URL:?Set DATABASE_URL to the production PostgreSQL connection URL.}"
: "${BACKUP_DIR:?Set BACKUP_DIR to a writable directory outside the application container.}"

umask 077
mkdir -p "$BACKUP_DIR"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
target="$BACKUP_DIR/adegarage-$stamp.dump"
pg_dump --format=custom --no-owner --dbname="$DATABASE_URL" --file="$target"
find "$BACKUP_DIR" -type f -name 'adegarage-*.dump' -mtime +"${BACKUP_RETENTION_DAYS:-30}" -delete
echo "Created $target"
