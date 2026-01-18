#!/bin/sh
set -e

echo "==================================="
echo "MATRIX CBS Development Environment"
echo "==================================="

# Wait for MySQL to be ready (additional safety beyond healthcheck)
echo "Waiting for MySQL to be ready..."
until nc -z db 3306 2>/dev/null; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done
echo "MySQL is up!"

# Generate Prisma client if schema exists
if [ -f "prisma/schema.prisma" ]; then
  echo "Generating Prisma client..."
  npx prisma generate

  echo "Syncing Prisma schema with database..."
  npx prisma db push --accept-data-loss 2>/dev/null || echo "Schema sync skipped"

  echo "Prisma setup complete!"
fi

echo "Starting application..."
exec "$@"
