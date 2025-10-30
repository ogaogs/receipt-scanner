#!/bin/sh
set -e

echo "Starting entrypoint script..."

# データベース接続を待機してマイグレーションを適用
echo "Waiting for database to be ready..."
until npx prisma migrate deploy; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready and migrations applied!"

echo "Starting application..."
# Next.jsアプリケーションを起動
exec node server.js
