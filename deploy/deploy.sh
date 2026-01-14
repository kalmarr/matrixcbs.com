#!/bin/bash

#===============================================================================
# MATRIX CBS - Deploy Script
# Verzio: 2.0
# Next.js + ISPConfig + PM2
#
# Hasznalat: ./deploy.sh [parancs]
# Parancsok: deploy, build, pack, upload, ssh, start, stop, restart, logs, help
#===============================================================================

set -e

# Szinek
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Script konyvtar
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Konfiguracio betoltese
if [[ -f "$SCRIPT_DIR/config.sh" ]]; then
    source "$SCRIPT_DIR/config.sh"
else
    echo -e "${RED}HIBA: config.sh nem talalhato!${NC}"
    echo "Hozd letre a deploy/config.sh fajlt a config.sh.example alapjan."
    exit 1
fi

# Alapertelmezett ertekek
TMP_DIR="/tmp/matrixcbs-deploy"  # Fix nev, nem PID alapu
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$PROJECT_DIR/backups"

# Backup konyvtar letrehozasa
mkdir -p "$BACKUP_DIR"

#-------------------------------------------------------------------------------
# Segedfuggvenyek
#-------------------------------------------------------------------------------

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[OK]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[FIGYELEM]${NC} $1"; }
log_error() { echo -e "${RED}[HIBA]${NC} $1"; }

log_step() {
    echo ""
    echo -e "${CYAN}================================================================${NC}"
    echo -e "${CYAN}>> $1${NC}"
    echo -e "${CYAN}================================================================${NC}"
}

cleanup() {
    if [[ -d "$TMP_DIR" ]]; then
        rm -rf "$TMP_DIR"
        log_info "Ideiglenes fajlok torolve"
    fi
}

trap cleanup EXIT

#-------------------------------------------------------------------------------
# Docker parancsok (lokalis fejlesztes)
#-------------------------------------------------------------------------------

docker_start() {
    log_step "Docker inditasa"
    cd "$PROJECT_DIR"
    docker-compose up -d
    log_success "Docker elindult"
    docker-compose ps
}

docker_stop() {
    log_step "Docker leallitasa"
    cd "$PROJECT_DIR"
    docker-compose down
    log_success "Docker leallt"
}

docker_restart() {
    log_step "Docker ujrainditasa"
    cd "$PROJECT_DIR"
    docker-compose restart
    log_success "Docker ujraindult"
}

docker_logs() {
    log_step "Docker logok"
    cd "$PROJECT_DIR"
    docker-compose logs -f
}

#-------------------------------------------------------------------------------
# Adatbazis - Lokalis (Docker)
#-------------------------------------------------------------------------------

db_backup_local() {
    log_step "Lokalis adatbazis backup"

    local backup_file="$BACKUP_DIR/local_${TIMESTAMP}.sql.gz"

    log_info "Docker container: $LOCAL_DB_CONTAINER"
    log_info "Adatbazis: $LOCAL_DB_NAME"

    # Ellenorzes
    if ! docker ps --format '{{.Names}}' | grep -q "^${LOCAL_DB_CONTAINER}$"; then
        log_error "Docker container nem fut: $LOCAL_DB_CONTAINER"
        log_info "Inditsd el: ./deploy.sh start"
        exit 1
    fi

    # Mysqldump Docker containeren belul
    docker exec "$LOCAL_DB_CONTAINER" mysqldump \
        -u"$LOCAL_DB_USER" \
        -p"$LOCAL_DB_PASS" \
        --single-transaction \
        --routines \
        --triggers \
        "$LOCAL_DB_NAME" | gzip > "$backup_file"

    if [[ -f "$backup_file" ]] && [[ -s "$backup_file" ]]; then
        log_success "Backup kesz: $backup_file"
        log_info "Meret: $(du -h "$backup_file" | cut -f1)"
    else
        log_error "Backup nem sikerult!"
        rm -f "$backup_file"
        exit 1
    fi
}

db_restore_local() {
    local backup_file="$1"

    log_step "Lokalis adatbazis visszaallitas"

    if [[ -z "$backup_file" ]]; then
        log_error "Hasznalat: ./deploy.sh db:restore <fajl>"
        echo ""
        echo "Elerheto backupok:"
        db_list_backups
        exit 1
    fi

    # Relativ utvonal kezelese
    if [[ ! -f "$backup_file" ]]; then
        backup_file="$BACKUP_DIR/$backup_file"
    fi

    if [[ ! -f "$backup_file" ]]; then
        log_error "Fajl nem talalhato: $backup_file"
        exit 1
    fi

    # Ellenorzes
    if ! docker ps --format '{{.Names}}' | grep -q "^${LOCAL_DB_CONTAINER}$"; then
        log_error "Docker container nem fut: $LOCAL_DB_CONTAINER"
        exit 1
    fi

    log_warning "Ez a muvelet FELULIRJA a lokalis adatbazist!"
    read -p "Biztosan folytatod? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_warning "Megszakitva"
        exit 0
    fi

    log_info "Visszaallitas: $backup_file"

    # Gzip tomorites kezelese
    if [[ "$backup_file" == *.gz ]]; then
        gunzip -c "$backup_file" | docker exec -i "$LOCAL_DB_CONTAINER" mysql \
            -u"$LOCAL_DB_USER" \
            -p"$LOCAL_DB_PASS" \
            "$LOCAL_DB_NAME"
    else
        docker exec -i "$LOCAL_DB_CONTAINER" mysql \
            -u"$LOCAL_DB_USER" \
            -p"$LOCAL_DB_PASS" \
            "$LOCAL_DB_NAME" < "$backup_file"
    fi

    log_success "Visszaallitas kesz"
    log_info "Prisma client ujrageneralasa..."
    cd "$PROJECT_DIR"
    npx prisma generate
}

db_list_backups() {
    log_step "Elerheto backupok"

    if [[ ! -d "$BACKUP_DIR" ]] || [[ -z "$(ls -A "$BACKUP_DIR" 2>/dev/null)" ]]; then
        log_warning "Nincs elerheto backup"
        return
    fi

    echo ""
    echo -e "${CYAN}Lokalis backupok:${NC}"
    ls -lh "$BACKUP_DIR"/local_*.sql.gz 2>/dev/null | awk '{print "  " $NF " (" $5 ")"}'

    echo ""
    echo -e "${CYAN}Remote backupok:${NC}"
    ls -lh "$BACKUP_DIR"/remote_*.sql.gz 2>/dev/null | awk '{print "  " $NF " (" $5 ")"}'

    echo ""
    echo "Osszes backup meret: $(du -sh "$BACKUP_DIR" | cut -f1)"

    # Regi backupok figyelmeztetese (30 napnal regebbi)
    local old_backups=$(find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 2>/dev/null | wc -l)
    if [[ $old_backups -gt 0 ]]; then
        echo ""
        log_warning "$old_backups db backup regebbi 30 napnal"
    fi
}

#-------------------------------------------------------------------------------
# Adatbazis - Eles (Remote)
#-------------------------------------------------------------------------------

db_pull_remote() {
    local backup_only=false
    if [[ "$1" == "--backup-only" ]]; then
        backup_only=true
    fi

    log_step "Eles adatbazis letoltese"

    local backup_file="$BACKUP_DIR/remote_${TIMESTAMP}.sql.gz"

    log_info "Kapcsolodas: $SSH_USER@$SSH_HOST:$SSH_PORT"
    log_info "Adatbazis: $REMOTE_DB_NAME"

    # SSH-n keresztul mysqldump
    ssh -o StrictHostKeyChecking=no \
        -p "$SSH_PORT" \
        "$SSH_USER@$SSH_HOST" \
        "mysqldump -u'$REMOTE_DB_USER' -p'$REMOTE_DB_PASS' --single-transaction --routines --triggers '$REMOTE_DB_NAME'" \
        | gzip > "$backup_file"

    if [[ -f "$backup_file" ]] && [[ -s "$backup_file" ]]; then
        log_success "Backup kesz: $backup_file"
        log_info "Meret: $(du -h "$backup_file" | cut -f1)"
    else
        log_error "Backup nem sikerult!"
        rm -f "$backup_file"
        exit 1
    fi

    if [[ "$backup_only" == false ]]; then
        echo ""
        read -p "Visszaallitod a lokalis adatbazisba? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            db_restore_local "$backup_file"
        fi
    fi
}

db_push_remote() {
    log_step "ELES ADATBAZIS FELULIRASA"

    echo ""
    echo -e "${RED}+==============================================================+${NC}"
    echo -e "${RED}|                                                              |${NC}"
    echo -e "${RED}|   *** FIGYELEM! ELES ADATBAZIS FELULIRASA! ***              |${NC}"
    echo -e "${RED}|                                                              |${NC}"
    echo -e "${RED}+==============================================================+${NC}"
    echo ""
    echo "Ez a muvelet VEGLEGESEN felulirja az eles adatbazist!"
    echo ""
    echo -e "  Szerver:    ${YELLOW}$SSH_HOST${NC}"
    echo -e "  Adatbazis:  ${YELLOW}$REMOTE_DB_NAME${NC}"
    echo -e "  Idopont:    $(date)"
    echo ""

    # Elso megerosites
    read -p "Biztosan folytatod? (igen/NEM) " -r
    if [[ ! "$REPLY" == "igen" ]]; then
        log_error "Megszakitva"
        exit 1
    fi

    # Masodik megerosites - adatbazis nev beirasa
    echo ""
    echo -e "${YELLOW}Masodik megerosites szukseges!${NC}"
    read -p "Ird be az adatbazis nevet a megerositeshez: " -r
    if [[ ! "$REPLY" == "$REMOTE_DB_NAME" ]]; then
        log_error "Hibas adatbazis nev - megszakitva"
        exit 1
    fi

    # Automatikus backup az elesrol
    echo ""
    log_warning "Elotte backup keszitese az eles adatbazisrol..."
    db_pull_remote --backup-only

    # Lokalis backup keszitese
    log_info "Lokalis backup keszitese..."
    db_backup_local

    local local_backup="$BACKUP_DIR/local_${TIMESTAMP}.sql.gz"

    # Feltoltes es visszaallitas
    log_info "Adatbazis feltoltese es visszaallitasa..."

    # Dekompressz + SSH-n at import
    gunzip -c "$local_backup" | ssh -o StrictHostKeyChecking=no \
        -p "$SSH_PORT" \
        "$SSH_USER@$SSH_HOST" \
        "mysql -u'$REMOTE_DB_USER' -p'$REMOTE_DB_PASS' '$REMOTE_DB_NAME'"

    log_success "Eles adatbazis frissitve!"
    echo ""
    log_warning "Ne felejtsd el futtatni a Prisma migrate-et az elesen!"
    echo "  ssh -p $SSH_PORT $SSH_USER@$SSH_HOST"
    echo "  cd /var/www/clients/client0/web1/private && npx prisma migrate deploy"
}

db_remote_backup() {
    log_step "Backup keszitese az eles szerveren"

    log_info "Kapcsolodas: $SSH_USER@$SSH_HOST:$SSH_PORT"

    ssh -o StrictHostKeyChecking=no \
        -p "$SSH_PORT" \
        "$SSH_USER@$SSH_HOST" \
        "cd /var/www/clients/client0/web1 && mkdir -p backups && mysqldump -u'$REMOTE_DB_USER' -p'$REMOTE_DB_PASS' --single-transaction --routines --triggers '$REMOTE_DB_NAME' | gzip > backups/db_\$(date +%Y%m%d_%H%M%S).sql.gz && ls -lh backups/*.sql.gz | tail -5"

    log_success "Backup kesz az eles szerveren"
}

db_cleanup_old() {
    log_step "Regi backupok torlese"

    local count_before=$(find "$BACKUP_DIR" -name "*.sql.gz" 2>/dev/null | wc -l)

    # 30 napnal regebbi backupok torlese
    find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete 2>/dev/null

    local count_after=$(find "$BACKUP_DIR" -name "*.sql.gz" 2>/dev/null | wc -l)
    local deleted=$((count_before - count_after))

    if [[ $deleted -gt 0 ]]; then
        log_success "$deleted regi backup torolve"
    else
        log_info "Nincs torlendo backup"
    fi
}

#-------------------------------------------------------------------------------
# Build
#-------------------------------------------------------------------------------

build_project() {
    log_step "Projekt buildelese"
    cd "$PROJECT_DIR"

    if [[ ! -d "node_modules" ]]; then
        log_info "node_modules telepitese..."
        npm ci
    fi

    log_info "Next.js production build..."
    npm run build

    log_success "Build kesz"
}

#-------------------------------------------------------------------------------
# Csomagolas
#-------------------------------------------------------------------------------

pack_project() {
    log_step "Deploy csomag keszitese"

    mkdir -p "$TMP_DIR"
    cd "$PROJECT_DIR"

    # Web csomag
    log_info "Web csomag keszitese..."
    mkdir -p "$TMP_DIR/web_staging"
    cp -r public/* "$TMP_DIR/web_staging/" 2>/dev/null || true

    if [[ -d ".next/static" ]]; then
        mkdir -p "$TMP_DIR/web_staging/_next"
        cp -r .next/static "$TMP_DIR/web_staging/_next/"
    fi

    cd "$TMP_DIR/web_staging"
    tar -czf "$TMP_DIR/web.tar.gz" .
    log_success "web.tar.gz kesz ($(du -h "$TMP_DIR/web.tar.gz" | cut -f1))"

    # Private csomag
    log_info "Private csomag keszitese..."
    cd "$PROJECT_DIR"

    tar -czf "$TMP_DIR/private.tar.gz" \
        --exclude='node_modules' \
        --exclude='.next/cache' \
        --exclude='public' \
        --exclude='.git' \
        --exclude='deploy' \
        --exclude='.env.local' \
        --exclude='*.log' \
        .

    log_success "private.tar.gz kesz ($(du -h "$TMP_DIR/private.tar.gz" | cut -f1))"

    # Szerver script
    cp "$SCRIPT_DIR/deploy-server.sh" "$TMP_DIR/"

    # .env.production
    if [[ -f "$PROJECT_DIR/.env.production" ]]; then
        cp "$PROJECT_DIR/.env.production" "$TMP_DIR/.env"
        log_info ".env.production hozzaadva"
    fi

    log_success "Csomagolas kesz"
    ls -lh "$TMP_DIR"/*.tar.gz
}

#-------------------------------------------------------------------------------
# FTP Feltoltes
#-------------------------------------------------------------------------------

upload_ftp() {
    log_step "FTP feltoltes"

    if ! command -v lftp &> /dev/null; then
        log_error "lftp nincs telepitve! (sudo apt install lftp)"
        exit 1
    fi

    log_info "Kapcsolodas: $FTP_HOST..."

    lftp -c "
        set ssl:verify-certificate no
        set ftp:ssl-force true
        set ftp:ssl-protect-data true
        set ftp:passive-mode true
        set net:timeout 30
        set net:max-retries 3

        open -u $FTP_USER,$FTP_PASS ftp://$FTP_HOST

        cd tmp
        put $TMP_DIR/web.tar.gz
        put $TMP_DIR/private.tar.gz
        put $TMP_DIR/deploy-server.sh
        $(if [[ -f "$TMP_DIR/.env" ]]; then echo "put $TMP_DIR/.env"; fi)
        bye
    "

    log_success "FTP feltoltes kesz"
}

#-------------------------------------------------------------------------------
# SSH Deploy (kulcs alapu)
#-------------------------------------------------------------------------------

run_remote_deploy() {
    log_step "Tavoli deploy futtatasa (SSH)"

    log_info "SSH kapcsolodas: $SSH_USER@$SSH_HOST:$SSH_PORT..."

    # SSH kulcs alapu kapcsolat (konfiguralva ~/.ssh/config-ban)
    ssh -o StrictHostKeyChecking=no \
        -p "$SSH_PORT" \
        "$SSH_USER@$SSH_HOST" \
        "cd /var/www/clients/client0/web1/tmp && chmod +x deploy-server.sh && ./deploy-server.sh"

    log_success "Tavoli deploy befejezve"
}

#-------------------------------------------------------------------------------
# Teljes Deploy
#-------------------------------------------------------------------------------

full_deploy() {
    log_step "TELJES DEPLOY INDITASA"
    echo -e "${YELLOW}Projekt:${NC} $PROJECT_DIR"
    echo -e "${YELLOW}Szerver:${NC} $SSH_HOST"
    echo -e "${YELLOW}Idopont:${NC} $(date)"
    echo ""

    read -p "Biztosan folytatod a deploy-t? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_warning "Deploy megszakitva"
        exit 0
    fi

    local start_time=$(date +%s)

    build_project
    pack_project
    upload_ftp
    run_remote_deploy

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    echo ""
    log_step "DEPLOY BEFEJEZVE"
    echo -e "${GREEN}Sikeres deploy! Idotartam: ${duration}s${NC}"
    echo -e "Ellenorizd: ${BLUE}https://matrixcbs.com${NC}"
}

#-------------------------------------------------------------------------------
# Sugo
#-------------------------------------------------------------------------------

show_help() {
    echo ""
    echo -e "${CYAN}MATRIX CBS - Deploy Script v2.0${NC}"
    echo ""
    echo -e "${YELLOW}Hasznalat:${NC} ./deploy.sh <parancs>"
    echo ""
    echo -e "${GREEN}LOKALIS DOCKER:${NC}"
    echo "  start       - Docker inditasa"
    echo "  stop        - Docker leallitasa"
    echo "  restart     - Docker ujrainditasa"
    echo "  logs        - Log kovetes"
    echo ""
    echo -e "${GREEN}VPS DEPLOY:${NC}"
    echo "  deploy      - Teljes deploy (csak kod)"
    echo "  build       - Csak build"
    echo "  pack        - Csak csomagolas"
    echo "  upload      - Csak FTP feltoltes"
    echo "  ssh         - Csak SSH deploy"
    echo ""
    echo -e "${GREEN}ADATBAZIS:${NC}"
    echo "  db:backup   - Lokalis adatbazis backup"
    echo "  db:restore  - Lokalis adatbazis visszaallitas"
    echo "  db:list     - Backupok listazasa"
    echo "  db:pull     - Eles adatbazis letoltese"
    echo -e "  db:push     - ${RED}Lokalis DB feltoltese elesre (VESZELYES!)${NC}"
    echo "  db:remote   - Backup keszitese az eles szerveren"
    echo "  db:cleanup  - Regi backupok torlese (30+ nap)"
    echo ""
}

#-------------------------------------------------------------------------------
# Fo logika
#-------------------------------------------------------------------------------

case "${1:-}" in
    # Docker
    start)       docker_start ;;
    stop)        docker_stop ;;
    restart)     docker_restart ;;
    logs)        docker_logs ;;

    # Deploy
    deploy)      full_deploy ;;
    build)       build_project ;;
    pack)        pack_project; trap - EXIT ;;
    upload)      upload_ftp ;;
    ssh)         run_remote_deploy ;;

    # Adatbazis
    db:backup)   db_backup_local ;;
    db:restore)  db_restore_local "$2" ;;
    db:list)     db_list_backups ;;
    db:pull)     db_pull_remote ;;
    db:push)     db_push_remote ;;
    db:remote)   db_remote_backup ;;
    db:cleanup)  db_cleanup_old ;;

    # Sugo
    help|--help|-h|"") show_help ;;
    *)           log_error "Ismeretlen parancs: $1"; show_help; exit 1 ;;
esac
