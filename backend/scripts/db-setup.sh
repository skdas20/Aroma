#!/usr/bin/env bash
set -euo pipefail

# Project root is one level up from this script's directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_DB_FILE="$ROOT_DIR/.env.db"

if [[ ! -f "$ENV_DB_FILE" ]]; then
  echo "Missing $ENV_DB_FILE. Create it from .env.db.example first." >&2
  exit 1
fi

# Load .env.db reliably
set -a
source "$ENV_DB_FILE"
set +a

DB_NAME=${DB_NAME:-amara}
DB_USER=${DB_USER:-amara_user}
DB_PASSWORD=${DB_PASSWORD:-db@1234}
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}

echo " Setting up PostgreSQL database '$DB_NAME' and user '$DB_USER'..."

# Ensure PostgreSQL service is running (best-effort)
if command -v systemctl >/dev/null 2>&1; then
  sudo systemctl start postgresql || true
else
  sudo service postgresql start || true
fi

# Create user if not exists
if sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1; then
  echo "User '${DB_USER}' already exists"
else
  sudo -u postgres psql -c "CREATE USER \"${DB_USER}\" WITH PASSWORD '${DB_PASSWORD}';"
  echo "Created user '${DB_USER}'"
fi

# Create database if not exists
if sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
  echo "Database '${DB_NAME}' already exists"
else
  sudo -u postgres createdb "${DB_NAME}"
  echo "Created database '${DB_NAME}'"
fi

# Grants
sudo -u postgres psql -c "ALTER ROLE \"${DB_USER}\" CREATEDB;" >/dev/null || true
sudo -u postgres psql -d "${DB_NAME}" -c "GRANT ALL PRIVILEGES ON DATABASE \"${DB_NAME}\" TO \"${DB_USER}\";" >/dev/null || true
sudo -u postgres psql -d "${DB_NAME}" -c "GRANT ALL ON SCHEMA public TO \"${DB_USER}\";" >/dev/null || true
sudo -u postgres psql -d "${DB_NAME}" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO \"${DB_USER}\";" >/dev/null || true
sudo -u postgres psql -d "${DB_NAME}" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO \"${DB_USER}\";" >/dev/null || true

echo "\n Database setup complete."

# URL-encode password to safely embed in DATABASE_URL
ENCODED_PASSWORD=$(node -e 'process.stdout.write(encodeURIComponent(process.env.DB_PASSWORD || ""))')
DB_URL="postgresql://${DB_USER}:${ENCODED_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"
ENV_FILE="$ROOT_DIR/.env"
echo " Writing DATABASE_URL to $ENV_FILE"
if [[ -f "$ENV_FILE" ]]; then
  if grep -q '^DATABASE_URL=' "$ENV_FILE"; then
    sed -i "s|^DATABASE_URL=.*|DATABASE_URL=${DB_URL}|" "$ENV_FILE"
  else
    printf "\nDATABASE_URL=%s\n" "$DB_URL" >> "$ENV_FILE"
  fi
else
  printf "DATABASE_URL=%s\n" "$DB_URL" > "$ENV_FILE"
fi

echo " DATABASE_URL set in $ENV_FILE"
