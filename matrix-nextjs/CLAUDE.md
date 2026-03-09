# CLAUDE.md - MATRIX CBS Next.js Projekt

Ez a fájl útmutatást ad a Claude Code számára a MATRIX CBS Next.js projekthez.

## Projekt Áttekintés

Modern Next.js 16 alapú webalkalmazás a MATRIX CBS Kft. számára, admin panellel és blog rendszerrel.

## Nyelv és kommunikáció

- Kód kommentek (JSDoc): angolul
- Inline kommentek, üzleti logika magyarázat: magyarul
- Commit üzenetek: magyarul, Conventional Commits formátumban
- Válaszok, magyarázatok: magyarul
- TODO/FIXME: angolul

## Kötelező Követelmények

### UTF-8 és Magyar Ékezetek

**KRITIKUS:** A teljes projektben kötelező az UTF-8 kódolás és a magyar ékezetek helyes kezelése!

#### API Route-ok
- Minden API response-nak tartalmaznia kell a `charset=utf-8` headert
- Használd az `@/lib/api-utils` helper függvényeket:
  ```typescript
  import { jsonResponse, badRequestResponse, serverErrorResponse } from '@/lib/api-utils'

  // Helyesen:
  return jsonResponse(data)
  return badRequestResponse('Hiba történt')
  ```

#### Adatbázis
- A DATABASE_URL-nek tartalmaznia kell a `?charset=utf8mb4` paramétert
- Példa: `mysql://user:pass@host:3306/db?charset=utf8mb4`

#### String Manipuláció
- **NE használj** `.charAt()` vagy `.substring()` függvényeket magyar szövegen!
- Használd az `@/lib/string-utils` Unicode-safe függvényeket:
  ```typescript
  import { getFirstChar, safeSubstring, truncateText } from '@/lib/string-utils'

  // Helyesen:
  getFirstChar(text)           // Első karakter (Unicode-safe)
  safeSubstring(text, 40)      // Substring (nem vág ketté ékezeteket)
  truncateText(text, 100)      // Truncate ellipszissel
  ```

## Technológiai Stack

- **Framework**: Next.js 16 (App Router)
- **Adatbázis**: MySQL (Prisma ORM)
- **Stílus**: Tailwind CSS
- **Nyelv**: TypeScript
- **Ikónok**: Lucide React

## Mappastruktúra

```
matrix-nextjs/
├── src/
│   ├── app/           # Next.js App Router oldalak
│   │   ├── admin/     # Admin panel oldalak
│   │   ├── api/       # API route-ok
│   │   └── ...        # Publikus oldalak
│   ├── components/    # React komponensek
│   └── lib/           # Utility függvények
│       ├── api-utils.ts      # API response helperek (charset)
│       ├── string-utils.ts   # Unicode-safe string műveletek
│       └── prisma.ts         # Prisma client
├── prisma/
│   └── schema.prisma  # Adatbázis séma
├── docs/              # Részletes dokumentációk
└── public/            # Statikus fájlok
```

## Fájl megnyitási protokoll

Mielőtt BÁRMIT módosítanál egy fájlban:
1. Ellenőrizd, van-e benne komment az alábbi szabályok szerint
2. Ha NINCS → pótold a kommenteket
3. Ha VAN de HIÁNYOS → egészítsd ki a meglévőt, NE adj hozzá új blokkot
4. Ha VAN és PONTATLAN → cseréld ki (töröld a régit, írd az újat), NE duplikáld
5. UTÁNA végezd el a kért módosítást
6. Ha lehetséges, a kommentelés és a módosítás KÜLÖN commit legyen

## Hibajavítási protokoll

### Javítás befejezésének feltétele
- Egy hiba CSAK AKKOR van javítva, ha TESZTELTED és ELLENŐRIZTED, hogy a hiba megszűnt
- NE kérd a felhasználót, hogy ellenőrizze — amit tudsz ellenőrizni, azt TE ellenőrizd
- Konzol hiba → futtasd a kódot / ellenőrizd a logot, amíg van hiba, addig javíts
- Teszt hiba → futtasd a tesztet, amíg piros, addig javíts
- TypeScript hiba → futtass `npx tsc --noEmit`, amíg van hiba, addig javíts
- Addig iterálj, amíg a hiba BIZONYÍTOTTAN megszűnt

### Éles szerver vs lokális fejlesztés
- Ha éles szerveren lévő hibát küldök, a javítást LOKÁLISAN végezd
- Deploy-t CSAK AKKOR végezz, ha EXPLICIT kérem ("deployolj", "tedd ki élesbe")
- Amíg nem kérek deploy-t, minden munka lokális környezetben történik
- Ha lokális szerveren dolgozok, éles szerveren SOHA ne módosíts közvetlenül

### Deploy protokoll — KÖTELEZŐ
- **SOHA ne SCP-zz/tölts fel egyedi fájlokat az élesre deploy nélkül** — ez inkonzisztens állapotot okoz
- Ha éles hibát kell javítani: lokálisan javíts → commitolj → deploy script-tel
- **Deploy ELŐTT** lokális tesztek KÖTELEZŐEK: `npm run build`, `npx tsc --noEmit`
- **Deploy UTÁN** kötelező verifikáció:
  - Smoke test: `curl -sI http://127.0.0.1:3001/` és `curl -sI https://matrixcbs.com/`
  - PM2 státusz: `pm2 status` — a `matrixcbs` process fut
  - PM2 logok: `pm2 logs matrixcbs --lines 20` — nincs friss hiba

### Ha elakadtál
- Ha 2-3 iteráció után sem sikerül a javítás, használj MCP eszközöket
- ELSŐ lépés: ref.tools MCP — keress rá a hibaüzenetre vagy a csomag dokumentációjára
- SOHA ne találgass vakon — előbb nézz utána, utána javíts

## Kommentelési szabályok

### React komponensek — JSDoc
```typescript
/**
 * Displays a reference card with company logo, description, and link.
 *
 * @param props - Component properties
 * @param props.title - Company or project name
 * @param props.description - Brief description of the reference
 * @param props.imageUrl - Path to the company logo
 */
export function ReferenceCard({ title, description, imageUrl }: ReferenceCardProps) {
```

### TypeScript interface-ek/típusok — JSDoc
```typescript
/**
 * Represents a single training course offered by MATRIX CBS.
 */
interface Training {
  /** URL-safe identifier generated from the title */
  slug: string;
  /** Course title in Hungarian */
  title: string;
  /** Duration in hours */
  duration: number;
}
```

### Inline kommentek üzleti logikához — magyarul
```typescript
// Az áfás árat csak akkor jelenítjük meg, ha a képzés nem ÁFA-mentes
if (training.vatRate > 0) {
  displayPrice = training.price * (1 + training.vatRate);
}
```

### Amit NE kommentálj
- Triviális értékadás, egyértelmű JSX markup
- Standard Next.js konvenciók szerinti műveletek
- Típusdefiníciók amik önmagukat dokumentálják

### Komment karbantartás
- Logika módosul → komment KÖTELEZŐEN frissül
- Törölt kód → hozzá tartozó komment is törlődik, SOHA ne maradjon árva komment
- JSDoc @param/@returns MINDIG egyezzen a függvény szignatúrájával
- SOHA ne hagyj elavult kommentet — az rosszabb, mint ha nincs

### Duplikáció elkerülése
- Ha egy fájlban MÁR VAN JSDoc komment, NE adj hozzá újat — FRISSÍTSD a meglévőt
- Mielőtt kommentet írsz, MINDIG ellenőrizd, van-e már komment az adott komponensnél/függvénynél
- SOHA ne legyen két JSDoc blokk egymás alatt ugyanahhoz az elemhez

> Részletes példák és anti-pattern-ek: `docs/commenting-rules.md`

## Kódolási konvenciók

### Alapelvek
- DRY: ne ismételd magad, használj közös komponenseket, hook-okat, utility-ket
- KISS: a legegyszerűbb működő megoldás az első választás
- Egy függvény/komponens = egy felelősség
- Magic number-ök helyett konstansok vagy config értékek

### Elnevezések
- Komponensek, típusok, interface-ek: PascalCase (`ReferenceCard`, `TrainingProps`)
- Függvények, változók, hook-ok: camelCase (`getTrainings`, `useContactForm`)
- Route mappák, fájlok: kebab-case (`src/app/adatvedelem/page.tsx`)
- Adatbázis táblák, mezők: snake_case (Prisma sémában)
- Konstansok: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- CSS class-ek: Tailwind utility-k, egyedi class ha szükséges: kebab-case

### Next.js konvenciók
- **App Router**: minden route a `src/app/` alatt, `page.tsx` / `layout.tsx` / `loading.tsx`
- **Server Components** alapértelmezetten — `'use client'` csak ha kell (interaktivitás, hook-ok)
- **API Routes**: `src/app/api/` alatt, `route.ts` fájlokban
- **Metadata**: `generateMetadata()` vagy statikus `metadata` export minden oldalon
- **Image**: Next.js `<Image>` komponens, `priority` a fold feletti képeknél
- **Link**: Next.js `<Link>` komponens belső navigációhoz

## Biztonság

- SOHA ne commitolj `.env` fájlt, API kulcsot, jelszót, titkos tokent
- Ha új titkos értéket vezetsz be, CSAK az `.env.example`-be kerüljön üres/példa értékkel
- `.gitignore`-ban MINDIG ellenőrizd: `.env*`, `node_modules/`, `.next/`
- Ha véletlenül commitolva lett érzékeny adat, NE csak töröld — jelezd, mert a git history-ban megmarad
- Input validálás: Zod sémákkal az API route-okban
- XSS: React alapból escaped, nyers HTML renderelés csak ha 100% biztonságos a tartalom
- Minden user input: szerver-oldali validálás az API route-ban

> Részletes checklist: `docs/security-checklist.md`

## Git konvenciók

### Conventional Commits formátum
- `feat(scope)`: új funkció (pl. `feat(blog): blog oldal hozzáadása`)
- `fix(scope)`: hibajavítás (pl. `fix(contact): email küldés javítása`)
- `refactor(scope)`: kód átszervezés, viselkedés változás nélkül
- `style(scope)`: formázás, kommentelés, whitespace
- `docs(scope)`: dokumentáció módosítás
- `test(scope)`: teszt hozzáadás/módosítás
- `chore(scope)`: build, config, dependency változás
- Breaking change: `feat(scope)!:` leírás

### Egyéb szabályok
- Egy commit = egy logikai egység
- Működő kódot commitolj — ha nem fordul le (`npm run build`), ne pushold
- Commit üzenet magyarul, scope angolul

## SEO konfiguráció

### Canonical URL-ek
- Minden oldal `layout.tsx`-ben vagy `page.tsx`-ben `metadata.alternates.canonical` beállítva
- Alap URL: `https://matrixcbs.com`

### robots.ts
- `src/app/robots.ts` — keresőmotor szabályok
- Admin és API útvonalak tiltva

### sitemap.ts
- `src/app/sitemap.ts` — dinamikus sitemap generálás
- Minden publikus oldal benne van, `lastModified` frissítve

### .htaccess redirect szabályok
- Régi statikus HTML URL-ek (`/rolunk.html`, `/contact.html`, stb.) → új Next.js route-okra 301 redirect
- Apache ProxyPass a PM2 process-hez (port 3001)
- A redirect szabályok a szerver web mappájában vannak

## Többügynökös fejlesztési workflow (TMUX)

Komplex feladatoknál MINDIG használj több párhuzamos Claude Code ügynököt TMUX session-ökben.
- Bármilyen többfájlos/többmodulos feladatnál: minimum 2 ügynök (fejlesztő + reviewer)
- Az ügynökök NE módosítsák ugyanazt a fájlt egyszerre — fájl-szintű felosztás
- A reviewer ügynök MINDIG utolsóként fut, a többiek munkáját ellenőrzi
- Minden ügynök UGYANAZT a CLAUDE.md-t olvassa — konzisztencia garantált

> Részletes ügynök felosztás, TMUX parancsok és indítási sablon: `docs/multi-agent-workflow.md`

## Fejlesztési Megjegyzések

- A slug generálás NFD normalizálást használ az ékezetek eltávolítására
- Az OpenGraph locale: `hu_HU`
- A font subset-ek tartalmazzák a `latin-ext` karaktereket az ékezetekhez

## DEPLOY FOLYAMAT

### Követelmények
- Node.js 20+
- PM2 globálisan telepítve: `npm install -g pm2`
- PM2 startup beállítva (egyszer kell): `pm2 startup && pm2 save`

### Szerver elérési utak
- **Projekt mappa**: `/var/www/clients/client0/web1/private`
- **Standalone build**: `/var/www/clients/client0/web1/private/.next/standalone`
- **Statikus fájlok (web)**: `/var/www/clients/client0/web1/web`
- **Port**: 3001 (Apache proxy-zza a .htaccess-en keresztül)

### Deploy parancsok

```bash
cd /var/www/clients/client0/web1/private

# 1. Kód frissítése
git pull origin main  # vagy rsync

# 2. Függőségek
npm install

# 3. Build (standalone módban)
npm run build

# 4. Statikus fájlok szinkronizálása a web mappába
rsync -av --delete .next/standalone/public/ /var/www/clients/client0/web1/web/
rsync -av --delete .next/static/ /var/www/clients/client0/web1/web/_next/static/

# 5. PM2 újraindítás
pm2 restart matrixcbs || pm2 start ecosystem.config.js --env production

# 6. Mentés és ellenőrzés
pm2 save
pm2 status
curl -sI http://127.0.0.1:3001/
```

### KRITIKUS TUDNIVALÓK

1. **A weboldal a PM2 process-től függ!**
   - Ha a `matrixcbs` PM2 process nem fut -> 503 hiba az ÖSSZES oldalon
   - Ellenőrzés: `pm2 list`
   - A szerver NEM fog működni PM2 nélkül!

2. **Szerver újraindítás után**
   - Automatikusan elindul a `pm2 startup` miatt
   - Ha mégsem: `pm2 resurrect` vagy `pm2 start ecosystem.config.js --env production`

3. **Hibaelhárítás**
   ```bash
   # Logok megtekintése
   pm2 logs matrixcbs --lines 50

   # Állapot ellenőrzése
   pm2 describe matrixcbs

   # Kézi újraindítás
   pm2 restart matrixcbs

   # Ha teljesen leállt
   pm2 start ecosystem.config.js --env production && pm2 save
   ```

4. **Deploy után mindig ellenőrizd**
   ```bash
   curl -sI http://127.0.0.1:3001/  # 200 OK kell legyen
   curl -sI https://matrixcbs.com/  # 200 OK kell legyen
   ```

## Külső dokumentáció hivatkozások

- Részletes kommentelési szabályok: `docs/commenting-rules.md`
- Biztonsági ellenőrzési checklist: `docs/security-checklist.md`
- Többügynökös workflow és TMUX: `docs/multi-agent-workflow.md`

> Ha a hivatkozott fájl nem létezik, JELEZD a hiányát, de NE hozd létre automatikusan.
