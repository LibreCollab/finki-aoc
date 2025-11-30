#!/bin/sh
set -e

mkdir -p /app/tmp
ln -sfn /app/tmp /app/build/tmp

echo "Running Migrations..."
node build/ace.js migration:run --force

echo "Running Seeders..."
node build/ace.js db:seed

echo "Starting Server..."
exec node build/bin/server.js
