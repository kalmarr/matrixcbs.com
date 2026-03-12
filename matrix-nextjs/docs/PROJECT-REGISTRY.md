# PROJECT-REGISTRY.md — MATRIX CBS erőforrás nyilvántartás

> **KÖTELEZŐ:** Minden Claude Code ügynök OLVASSA BE ezt a fájlt erőforrás foglalás előtt.
> Új foglalás után AZONNAL frissítsd ezt a fájlt.

## Foglalt portok

| Port | Projekt | Szolgáltatás | Megjegyzés |
|------|---------|-------------|------------|
| 3001 | MATRIX CBS | Next.js standalone (PM2) | Apache ProxyPass → 127.0.0.1:3001 |
| 3306 | MATRIX CBS | MySQL | charset=utf8mb4 |

### Szabad port tartományok
- **3002–3099**: További Node.js / Next.js alkalmazások
- **5174–5199**: Vite dev server-ek
- **8001–8099**: Egyéb webalkalmazások

## Adatbázisok

| DB név | Projekt | Motor | Port | Megjegyzés |
|--------|---------|-------|------|------------|
| matrixcbs | MATRIX CBS | MySQL 8.0+ | 3306 | Prisma ORM, utf8mb4 collation |

## PM2 process-ek

| Név | Projekt | Port | User | Megjegyzés |
|-----|---------|------|------|------------|
| matrixcbs | MATRIX CBS | 3001 | web1 (defaultmatrixCBS) | ecosystem.config.js + start-matrixcbs.sh wrapper |

## Környezeti változók (éles szerver)

| Változó | Cél | Megjegyzés |
|---------|-----|------------|
| DATABASE_URL | MySQL connection | ?charset=utf8mb4 kötelező |
| NEXTAUTH_SECRET | JWT aláírás | Automatikusan generált |
| NEXTAUTH_URL | Auth callback URL | https://matrixcbs.com |
| CRON_SECRET | Ütemezett publikálás webhook | Véletlenszerű token |
| USE_SENDMAIL | Email küldés mód | "true" = Postfix (éles) |
| NEXT_PUBLIC_GA_MEASUREMENT_ID | Google Analytics | G-4H0BCH8311 |

## Szabályok

1. **Port foglalás:** A 3001-es port a MATRIX CBS projekté — ha új szolgáltatás kell, a 3002–3099 tartományból válassz
2. **DB név:** Projektnév alapján, snake_case
3. **PM2:** Mindig web1 userrel futtasd, NEM kalmarr-ral
4. **Ütközés:** Ha két projekt ugyanazt az erőforrást használná → az ÚJABB projekt kap másik értéket
