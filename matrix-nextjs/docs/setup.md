# Telepítés és futtatás — MATRIX CBS

> Ezt a fájlt a projekt indulásakor töltsd ki a tényleges értékekkel.

## Előfeltételek

- Node.js 20+
- MySQL 8.0+ (utf8mb4 charset)
- PM2 (production)

## Telepítés

```bash
git clone [repo-url]
cd matrix-nextjs
cp .env.example .env
# Töltsd ki a .env fájlt a szükséges értékekkel
npm install
npx prisma migrate dev
npx prisma db seed
```

## Futtatás

### Fejlesztés
```bash
npm run dev                      # http://localhost:3000 (Turbopack)
```

### Éles környezet
```bash
npm run build                    # Standalone build
pm2 start ecosystem.config.js --env production
pm2 save
```

## Portok

| Szolgáltatás | Port | Megjegyzés |
|---|---|---|
| Next.js dev server | 3000 | `npm run dev` |
| Next.js standalone (PM2) | 3001 | Éles szerver, Apache ProxyPass |
| MySQL | 3306 | Lokális DB |

## Környezeti változók (.env)

### Kötelező
| Változó | Leírás | Példa |
|---------|--------|-------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@localhost:3306/matrixcbs?charset=utf8mb4` |
| `NEXTAUTH_SECRET` | JWT aláírási kulcs | Automatikusan generált (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Auth callback URL | `http://localhost:3000` (dev) / `https://matrixcbs.com` (prod) |
| `CRON_SECRET` | Ütemezett publikálás token | Véletlenszerű string |
| `NODE_ENV` | Környezet | `development` / `production` |

### Email (opcionális)
| Változó | Leírás | Példa |
|---------|--------|-------|
| `USE_SENDMAIL` | Postfix használata | `true` (éles) |
| `SMTP_HOST` | SMTP szerver | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP felhasználó | `user@example.com` |
| `SMTP_PASS` | SMTP jelszó | `app-password` |
| `EMAIL_FROM` | Küldő email | `info@matrixcbs.com` |

### Publikus
| Változó | Leírás | Példa |
|---------|--------|-------|
| `NEXT_PUBLIC_SITE_URL` | Alap URL | `https://matrixcbs.com` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics | `G-4H0BCH8311` |

A `.env.example` fájl tartalmazza az összes szükséges változót.

## Deploy (éles szerver)

### Szerver adatok
- **Projekt mappa**: `/var/www/clients/client0/web1/private`
- **Web root**: `/var/www/clients/client0/web1/web`
- **PM2 process**: `matrixcbs` (web1 user futtatja)
- **Port**: 3001 → Apache ProxyPass

### Deploy lépések
```bash
# 1. Lokálisan build
cd matrix-nextjs
npm run build

# 2. Feltöltés rsync-kel
rsync -av --delete .next/standalone/ contabo-matrixcbs:/var/www/clients/client0/web1/private/.next/standalone/
rsync -av --delete .next/static/ contabo-matrixcbs:/var/www/clients/client0/web1/private/.next/static/

# 3. Szerveren: deploy script futtatása (root)
ssh contabo
sudo /var/www/clients/client0/web1/private/scripts/deploy.sh

# 4. Ellenőrzés
curl -sI http://127.0.0.1:3001/   # 200 OK
curl -sI https://matrixcbs.com/    # 200 OK
pm2 status                          # matrixcbs online
```

### Hibaelhárítás
```bash
# PM2 logok
pm2 logs matrixcbs --lines 50

# Port foglalás ellenőrzése
fuser 3001/tcp

# Kézi újraindítás
pm2 restart matrixcbs

# Ha teljesen leállt
pm2 start ecosystem.config.js --env production && pm2 save
```

## Prisma parancsok

```bash
# Migration létrehozás
npx prisma migrate dev --name [név]

# Séma szinkronizálás (dev)
npx prisma db push

# Prisma Studio (DB böngésző)
npx prisma studio

# Seed futtatás
npx prisma db seed

# Admin jelszó reset
npx tsx scripts/reset-admin.ts
```
