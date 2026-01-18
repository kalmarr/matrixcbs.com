#!/bin/bash

#===============================================================================
# MATRIX CBS - Szerver Deploy Script
# Verzio: 2.1
# Ezt a scriptet a szerveren futtatja az SSH parancs
#===============================================================================

set -e

# PATH beallitas (SSH-n at mas a PATH!)
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

# Profile betoltese ha letezik
[[ -f /etc/profile ]] && source /etc/profile 2>/dev/null || true

# Szinek
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Utvonalak
BASE_DIR="/var/www/clients/client0/web1"
TMP_DIR="$BASE_DIR/tmp"
WEB_DIR="$BASE_DIR/web"
PRIVATE_DIR="$BASE_DIR/private"

# ISPConfig felhasznalo
WEB_USER="web1"
WEB_GROUP="client0"

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[FIGYELEM]${NC} $1"; }
log_error() { echo -e "${RED}[HIBA]${NC} $1"; }

log_step() {
    echo ""
    echo -e "${BLUE}>> $1${NC}"
    echo "----------------------------------------------------------------"
}

#-------------------------------------------------------------------------------
# Ellenorzesek
#-------------------------------------------------------------------------------

log_step "Deploy elokeszitese"

cd "$TMP_DIR"

if [[ ! -f "web.tar.gz" ]]; then
    log_error "web.tar.gz nem talalhato!"
    exit 1
fi

if [[ ! -f "private.tar.gz" ]]; then
    log_error "private.tar.gz nem talalhato!"
    exit 1
fi

log_success "Csomagok megtalalva"

#-------------------------------------------------------------------------------
# Backup
#-------------------------------------------------------------------------------

log_step "Backup keszitese"

BACKUP_DIR="$BASE_DIR/backups"
BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"

# Backup konyvtar letrehozasa (ha nincs jog, folytatas nelkule)
if ! mkdir -p "$BACKUP_DIR" 2>/dev/null; then
    # Probalkozas a private konyvtarban
    BACKUP_DIR="$PRIVATE_DIR/backups"
    if ! mkdir -p "$BACKUP_DIR" 2>/dev/null; then
        log_warning "Backup konyvtar nem hozhato letre - backup kihagyva"
        BACKUP_DIR=""
    fi
fi

# .env backup
if [[ -n "$BACKUP_DIR" ]] && [[ -f "$PRIVATE_DIR/.env" ]]; then
    cp "$PRIVATE_DIR/.env" "$BACKUP_DIR/${BACKUP_NAME}_env"
    log_info ".env mentve"
fi

# Adatbazis backup (ha van .env es DATABASE_URL es BACKUP_DIR)
if [[ -n "$BACKUP_DIR" ]] && [[ -f "$PRIVATE_DIR/.env" ]]; then
    # DATABASE_URL kiolvasasa
    DB_URL=$(grep "^DATABASE_URL=" "$PRIVATE_DIR/.env" | cut -d'=' -f2- | tr -d '"' | tr -d "'")

    if [[ -n "$DB_URL" ]]; then
        # mysql://user:pass@host:port/dbname parser
        DB_USER=$(echo "$DB_URL" | sed -n 's|mysql://\([^:]*\):.*|\1|p')
        DB_PASS=$(echo "$DB_URL" | sed -n 's|mysql://[^:]*:\([^@]*\)@.*|\1|p')
        DB_HOST=$(echo "$DB_URL" | sed -n 's|mysql://[^@]*@\([^:]*\):.*|\1|p')
        DB_PORT=$(echo "$DB_URL" | sed -n 's|mysql://[^@]*@[^:]*:\([^/]*\)/.*|\1|p')
        DB_NAME=$(echo "$DB_URL" | sed -n 's|mysql://[^/]*/\(.*\)|\1|p')

        if [[ -n "$DB_NAME" ]] && [[ -n "$DB_USER" ]]; then
            log_info "Adatbazis backup: $DB_NAME"

            if mysqldump -u"$DB_USER" -p"$DB_PASS" -h"$DB_HOST" -P"$DB_PORT" \
                --single-transaction --routines --triggers "$DB_NAME" \
                2>/dev/null | gzip > "$BACKUP_DIR/${BACKUP_NAME}_db.sql.gz"; then
                log_success "Adatbazis backup kesz ($(du -h "$BACKUP_DIR/${BACKUP_NAME}_db.sql.gz" | cut -f1))"
            else
                log_warning "Adatbazis backup nem sikerult (deploy folytatodik)"
            fi
        fi
    fi
fi

# Regi backupok torlese
if [[ -n "$BACKUP_DIR" ]]; then
    # - Fajl backupok: 7 nap
    # - Adatbazis backupok: 30 nap
    find "$BACKUP_DIR" -name "*_env" -type f -mtime +7 -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name "*_db.sql.gz" -type f -mtime +30 -delete 2>/dev/null || true
    log_success "Backup kesz"
else
    log_warning "Backup kihagyva (nincs jogosultsag)"
fi

#-------------------------------------------------------------------------------
# Web fajlok kicsomagolasa
#-------------------------------------------------------------------------------

log_step "Web fajlok frissitese"

mkdir -p "$WEB_DIR"
cd "$WEB_DIR"
tar -xzf "$TMP_DIR/web.tar.gz"

log_success "Web fajlok frissitve"

#-------------------------------------------------------------------------------
# Private fajlok kicsomagolasa
#-------------------------------------------------------------------------------

log_step "Private fajlok frissitese"

mkdir -p "$PRIVATE_DIR"

# .env mentese
if [[ -f "$PRIVATE_DIR/.env" ]]; then
    cp "$PRIVATE_DIR/.env" "$TMP_DIR/.env.backup"
fi

cd "$PRIVATE_DIR"
tar -xzf "$TMP_DIR/private.tar.gz"

# .env visszaallitasa
if [[ -f "$TMP_DIR/.env.backup" ]] && [[ ! -f "$TMP_DIR/.env" ]]; then
    mv "$TMP_DIR/.env.backup" "$PRIVATE_DIR/.env"
    log_info "Korabbi .env visszaallitva"
elif [[ -f "$TMP_DIR/.env" ]]; then
    cp "$TMP_DIR/.env" "$PRIVATE_DIR/.env"
    log_info "Uj .env telepitve"
fi

log_success "Private fajlok frissitve"

#-------------------------------------------------------------------------------
# Node modules
#-------------------------------------------------------------------------------

log_step "Node modules ellenorzese"

cd "$PRIVATE_DIR"

if [[ ! -d "node_modules" ]]; then
    log_info "node_modules telepitese..."
    npm ci --production
    log_success "npm install kesz"
else
    log_info "node_modules letezik"
fi

#-------------------------------------------------------------------------------
# Prisma
#-------------------------------------------------------------------------------

log_step "Prisma frissitese"

cd "$PRIVATE_DIR"

if [[ -f "prisma/schema.prisma" ]]; then
    # Prisma client generalasa (node direkt, mert npx permission denied)
    node node_modules/prisma/build/index.js generate 2>&1
    log_success "Prisma client generalva"

    # Adatbazis migracik NEM futnak automatikusan deploy soran!
    # Kezi futtatas szukseges: npx prisma migrate deploy
    log_info "Adatbazis migracio kihagyva (manualis futtatast igenyel)"
fi

#-------------------------------------------------------------------------------
# Jogosultsagok
#-------------------------------------------------------------------------------

log_step "Jogosultsagok beallitasa"

cd "$BASE_DIR"

chown -R $WEB_USER:$WEB_GROUP web/
chown -R $WEB_USER:$WEB_GROUP private/

find web/ -type d -exec chmod 755 {} +
find private/ -type d -exec chmod 755 {} +
find web/ -type f -exec chmod 644 {} +
find private/ -type f -exec chmod 644 {} +

if [[ -f "private/.env" ]]; then
    chmod 600 private/.env
fi

if [[ -d "private/node_modules/.bin" ]]; then
    chmod -R 755 private/node_modules/.bin/
fi

# Prisma engine binarisok futtatasi joga
if [[ -d "private/node_modules/@prisma/engines" ]]; then
    chmod 755 private/node_modules/@prisma/engines/schema-engine-* 2>/dev/null || true
    chmod 755 private/node_modules/@prisma/engines/query-engine-* 2>/dev/null || true
    chmod 755 private/node_modules/@prisma/engines/libquery_engine-* 2>/dev/null || true
    log_info "Prisma engine jogosultsagok beallitva"
fi

log_success "Jogosultsagok beallitva"

#-------------------------------------------------------------------------------
# Regi folyamatok leallitasa (port 3000)
#-------------------------------------------------------------------------------

log_step "Regi folyamatok leallitasa"

# Minden 3001-es porton futo folyamat leallitasa
PIDS_3001=$(lsof -t -i :3001 2>/dev/null || true)
if [[ -n "$PIDS_3001" ]]; then
    log_info "Port 3001-en futo folyamatok: $PIDS_3001"
    echo "$PIDS_3001" | xargs -r kill -9 2>/dev/null || true
    sleep 2
    log_success "Regi folyamatok leallitva"
else
    log_info "Nincs futo folyamat a 3001-es porton"
fi

# PM2 leallitasa ha fut
pm2 kill 2>/dev/null || true

# Regi logs mappa torlese (root tulajdonu lehet)
if [[ -d "$PRIVATE_DIR/logs" ]]; then
    rm -rf "$PRIVATE_DIR/logs" 2>/dev/null || true
    log_info "Regi logs mappa torolve"
fi

# Regi .next.old torlese
if [[ -d "$PRIVATE_DIR/.next.old" ]]; then
    rm -rf "$PRIVATE_DIR/.next.old" 2>/dev/null || true
    log_info "Regi .next.old torolve"
fi

#-------------------------------------------------------------------------------
# PM2 ujrainditas
#-------------------------------------------------------------------------------

log_step "PM2 alkalmazas ujrainditasa"

cd "$PRIVATE_DIR"

# Standalone mod ellenorzese es ecosystem.config.js generalasa
if [[ -f ".next/standalone/server.js" ]]; then
    log_info "Standalone build talalva - standalone mod hasznalata"

    # Standalone-hoz szukseges fajlok masolasa
    if [[ -d ".next/static" ]]; then
        mkdir -p .next/standalone/.next
        cp -r .next/static .next/standalone/.next/
        log_info "Static fajlok masolva standalone-ba"
    fi

    # Public mappa masolasa standalone-ba (ha letezik)
    if [[ -d "$WEB_DIR" ]]; then
        cp -r "$WEB_DIR"/* .next/standalone/public/ 2>/dev/null || mkdir -p .next/standalone/public
        log_info "Public fajlok masolva standalone-ba"
    fi

    # ecosystem.config.js generalasa standalone modhoz
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'matrixcbs',
    script: '.next/standalone/server.js',
    cwd: '/var/www/clients/client0/web1/private',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001,
      HOSTNAME: '0.0.0.0'
    }
  }]
};
EOF
    log_success "ecosystem.config.js frissitve (standalone mod)"
else
    log_warning "Standalone build nem talalva - next start hasznalata"

    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'matrixcbs',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3001',
    cwd: '/var/www/clients/client0/web1/private',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
EOF
fi

chown $WEB_USER:$WEB_GROUP ecosystem.config.js

# PM2 ujrainditas
pm2 delete matrixcbs 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save
log_success "PM2 ujrainditva"

#-------------------------------------------------------------------------------
# Cache torles
#-------------------------------------------------------------------------------

log_step "Cache torlese"

cd "$PRIVATE_DIR"

if [[ -d ".next/cache" ]]; then
    rm -rf .next/cache
    log_info "Next.js cache torolve"
fi

log_success "Cache torolve"

#-------------------------------------------------------------------------------
# Takaritas
#-------------------------------------------------------------------------------

log_step "Ideiglenes fajlok torlese"

cd "$TMP_DIR"

rm -f web.tar.gz
rm -f private.tar.gz
rm -f .env
rm -f .env.backup

log_success "Takaritas kesz"

#-------------------------------------------------------------------------------
# Osszefoglalo
#-------------------------------------------------------------------------------

echo ""
echo -e "${GREEN}================================================================${NC}"
echo -e "${GREEN}         DEPLOY SIKERESEN BEFEJEZVE!                           ${NC}"
echo -e "${GREEN}================================================================${NC}"
echo ""
echo "Idopont: $(date)"
echo "Web:     $WEB_DIR"
echo "Private: $PRIVATE_DIR"
echo ""

pm2 list

echo ""
echo -e "${BLUE}Ellenorizd: https://matrixcbs.com${NC}"
echo ""
