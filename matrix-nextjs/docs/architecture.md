# Architektúra — MATRIX CBS

> Ezt a fájlt a projekt fejlődésével párhuzamosan tartsd karban.

## Projekt leírás

Modern webalkalmazás a MATRIX CBS Kft. (szegedi felnőttképzési intézmény) számára. Admin panellel, blog rendszerrel, kapcsolatfelvételi űrlappal és karbantartási móddal.

## Technológiai stack

| Terület | Technológia |
|---------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4 |
| Nyelv | TypeScript 5 |
| ORM | Prisma 5 |
| Adatbázis | MySQL 8.0+ (utf8mb4) |
| Auth | NextAuth 5 (Credentials, JWT) |
| Editor | TipTap 3 (Prosemirror) |
| Validálás | Zod 4, React Hook Form 7 |
| Email | Nodemailer (Sendmail/SMTP) |
| Animáció | Framer Motion 12 |
| Ikónok | Lucide React |
| Képfeldolgozás | Sharp |
| Process manager | PM2 |

## Fő modulok

### Blog rendszer
- Bejegyzések CRUD (létrehozás, szerkesztés, törlés, archiválás)
- Státuszok: DRAFT → SCHEDULED → PUBLISHED → ARCHIVED
- Verziókezelés (PostVersion) és automatikus mentés (PostDraft)
- Kategóriák és címkék (many-to-many)
- Kiemelt kép, SEO mezők (meta title, description, canonical URL)
- Ütemezett publikálás (cron webhook)
- Előnézeti link tokennel

### Admin panel
- Felhasználókezelés (SUPER_ADMIN, ADMIN, EDITOR szerepkörök)
- Média könyvtár (feltöltés, thumbnail generálás Sharp-pal)
- GYIK kezelés
- Kapcsolati üzenetek kezelése
- Karbantartási mód (IP whitelist-tel)
- Web Vitals dashboard

### Publikus oldalak
- Főoldal, Rólunk, Megoldásaink, Referenciák
- Szervezeti kihívások, Kapcsolat, GYIK
- Adatvédelem, Névjegy
- Blog (listázás, kategória szűrés, bejegyzés oldal)

### Kapcsolat
- Űrlap Zod validálással, honeypot mezővel, timing ellenőrzéssel
- Email értesítés Nodemailer-rel (Postfix élesben)
- Rate limiting (10 kérés / 15 perc / IP)

## Mappastruktúra

```
matrix-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API route-ok
│   │   │   ├── admin/          # Védett admin API-k
│   │   │   ├── auth/[...nextauth]/ # NextAuth
│   │   │   ├── contact/        # Kapcsolatfelvételi űrlap
│   │   │   ├── blog/           # Kapcsolódó bejegyzések
│   │   │   ├── analytics/      # Web Vitals gyűjtés
│   │   │   ├── maintenance/    # Karbantartási mód státusz
│   │   │   └── cron/           # Ütemezett publikálás
│   │   ├── admin/              # Admin panel oldalak
│   │   ├── blog/               # Blog oldalak
│   │   ├── error/              # Egyedi hibaoldalak (400–503)
│   │   └── (publikus oldalak)  # rolunk, megoldasaink, stb.
│   ├── components/
│   │   ├── admin/              # Admin komponensek (PostEditor, MediaPicker, stb.)
│   │   ├── layout/             # Header, Footer, Navbar
│   │   ├── sections/           # Főoldali szekciók
│   │   ├── effects/            # Animációs effektek (ScrollReveal)
│   │   ├── ui/                 # UI primitívek (Button, Input)
│   │   └── marketing/          # Marketing komponensek
│   ├── lib/                    # Utility-k és helperek
│   │   ├── auth.ts             # NextAuth konfiguráció
│   │   ├── auth-guard.ts       # Auth middleware
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── api-utils.ts        # API response helperek (charset)
│   │   ├── string-utils.ts     # Unicode-safe string műveletek
│   │   ├── security.ts         # Biztonsági utility-k
│   │   ├── sanitize-html.ts    # HTML sanitizálás (DOMPurify)
│   │   ├── email.ts            # Email küldés (Nodemailer)
│   │   ├── rateLimit.ts        # Rate limiting (LRU cache)
│   │   └── validations.ts      # Zod sémák
│   ├── hooks/                  # React hook-ok
│   └── types/                  # TypeScript típusok
├── prisma/
│   ├── schema.prisma           # Adatbázis séma
│   └── seed.ts                 # Seed adatok
├── scripts/
│   ├── deploy.sh               # Deploy script
│   ├── start-matrixcbs.sh      # PM2 wrapper script
│   └── reset-admin.ts          # Admin jelszó reset
├── ecosystem.config.js         # PM2 konfiguráció
├── middleware.ts                # Edge middleware (auth + maintenance)
└── next.config.ts              # Next.js konfig (security headerek)
```

## Kulcs entitások és kapcsolatok

```
Admin (adminisztrátor)
├── hasMany: Post (bejegyzések, mint szerző)
├── hasMany: PostDraft (automatikus mentések)
└── hasMany: Media (feltöltött média)

Post (blog bejegyzés)
├── belongsTo: Admin (szerző)
├── belongsToMany: Category (kategóriák, PostCategory join)
├── belongsToMany: Tag (címkék, PostTag join)
└── hasMany: PostVersion (verzióelőzmények)

Category (kategória)
└── belongsToMany: Post

Tag (címke)
└── belongsToMany: Post

Media (feltöltött fájl)
└── belongsTo: Admin (feltöltő)

ContactMessage (kapcsolati üzenet)
Faq (gyakori kérdés)
WebVital (teljesítmény metrika)
MaintenanceMode (karbantartási mód beállítás)
Download (letölthető dokumentum)
```

## API route-ok

### Publikus
- `POST /api/contact` — Kapcsolatfelvételi űrlap (rate limited)
- `GET /api/blog/related-posts` — Kapcsolódó bejegyzések
- `POST /api/analytics/web-vitals` — Teljesítmény metrikák gyűjtése
- `GET /api/maintenance/status` — Karbantartási mód státusz

### Admin (védett, NextAuth session szükséges)
- `/api/admin/posts` — Bejegyzések CRUD
- `/api/admin/categories` — Kategóriák kezelése
- `/api/admin/tags` — Címkék kezelése
- `/api/admin/faqs` — GYIK kezelése
- `/api/admin/media` — Média könyvtár + feltöltés
- `/api/admin/messages` — Kapcsolati üzenetek
- `/api/admin/users` — Admin felhasználók kezelése
- `/api/admin/maintenance` — Karbantartási mód

### Cron
- `POST /api/cron/publish-scheduled` — Ütemezett bejegyzések publikálása (CRON_SECRET token)
