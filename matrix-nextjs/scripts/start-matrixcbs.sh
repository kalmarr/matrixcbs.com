#!/bin/bash
# MATRIX CBS - Szerver indító script
# A Next.js 16 standalone server.js elindítja a next-server worker-t,
# majd a parent process kilép. Ez a script figyelemmel kíséri a worker-t.

STANDALONE_DIR="/var/www/clients/client0/web1/private"
PORT="${PORT:-3001}"
LOG_DIR="/var/www/clients/client0/web1/private/logs"

export PORT
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export NODE_ENV="${NODE_ENV:-production}"

mkdir -p "$LOG_DIR"

# Port felszabadítás ha foglalt
fuser -k "$PORT/tcp" 2>/dev/null
sleep 2

cd "$STANDALONE_DIR" || exit 1

# Indítás és várakozás a next-server worker-re
node server.js >> "$LOG_DIR/matrixcbs-out.log" 2>> "$LOG_DIR/matrixcbs-err.log" &
SERVER_PID=$!

# Várunk hogy a next-server elinduljon
sleep 3

# Megkeressük a next-server worker PID-jét
WORKER_PID=$(fuser "$PORT/tcp" 2>/dev/null | tr -s ' ' | xargs)

if [ -z "$WORKER_PID" ]; then
    echo "$(date): HIBA - next-server nem indult el!" >> "$LOG_DIR/matrixcbs-err.log"
    exit 1
fi

echo "$(date): Szerver elindult (worker PID: $WORKER_PID, port: $PORT)" >> "$LOG_DIR/matrixcbs-out.log"

# Várakozás a worker process-re - ha leáll, a script is kilép
while kill -0 "$WORKER_PID" 2>/dev/null; do
    sleep 5
done

echo "$(date): Worker process (PID: $WORKER_PID) leállt, kilépés..." >> "$LOG_DIR/matrixcbs-err.log"
exit 1
