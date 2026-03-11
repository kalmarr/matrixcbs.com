# CLAUDE.md — Univerzális projekt sablon (Laravel + Next.js)

## Nyelv és kommunikáció
- Kód kommentek (PHPDoc/JSDoc): angolul
- Inline kommentek, üzleti logika magyarázat: magyarul
- Commit üzenetek: magyarul, Conventional Commits formátumban
- Válaszok, magyarázatok: magyarul
- TODO/FIXME: angolul

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
- **Laravel**: Szintaktikai hiba → futtass linter-t / `php artisan route:list`-et
- **Next.js**: TypeScript hiba → `npx tsc --noEmit`, Build hiba → `npm run build`
- Addig iterálj, amíg a hiba BIZONYÍTOTTAN megszűnt

### Éles szerver vs lokális fejlesztés
- Ha éles szerveren lévő hibát küldök, a javítást LOKÁLISAN végezd
- Deploy-t CSAK AKKOR végezz, ha EXPLICIT kérem ("deployolj", "tedd ki élesbe")
- Amíg nem kérek deploy-t, minden munka lokális környezetben történik
- Ha lokális szerveren dolgozok (fejlesztek, tesztelek, stb.), akkor éles szerveren SOHA ne módosíts közvetlenül, csak deploy-on keresztül, ha kérlek

### Deploy protokoll — KÖTELEZŐ
- **SOHA ne SCP-zz/tölts fel egyedi fájlokat az élesre deploy nélkül** — ez inkonzisztens állapotot okoz
- Ha éles hibát kell javítani: lokálisan javíts → commitolj → deploy
- Ha deploy-t kérek, **AZONNAL deployolj** — NE futtass teszteket előtte, NE kérdezz vissza
- **MINDEN ellenőrzés DEPLOY UTÁN történik**, deploy előtt SEMMI
- Ha a deploy script health check WARN-t ad → AZONNAL vizsgáld meg, ne hagyd figyelmen kívül

#### Laravel deploy ellenőrzés
- Smoke test: `curl` minden kritikus URL-re (`/`, `/admin`, stb.) → nincs 500
- Route validáció: `php artisan route:list` hiba nélkül fut az élesben
- Laravel log: nincs friss ERROR a `storage/logs/laravel.log`-ban
- Cache: config, route, view, opcache törölve és újraépítve
- Migration-ök hiba nélkül lefutottak
- **View cache + opcache összefüggés**: a `view:clear` törli a compiled fájlokat a lemezről, de az opcache memóriájában maradnak → `opcache_reset()` KÖTELEZŐ a `view:clear` után

#### Next.js deploy ellenőrzés
- Lokálisan: `npm run build` hiba nélkül lefut
- Szerveren: rsync standalone + static fájlok, PM2 restart
- Smoke test: `curl -sI http://127.0.0.1:PORT/` és `curl -sI https://domain.com/` → 200 OK
- PM2 státusz: `pm2 status` — a process fut
- PM2 logok: `pm2 logs [name] --lines 20` — nincs friss hiba

### Deploy befejezésének feltétele
- Ha deploy parancsot kapok, **AZONNAL deployolj** — deploy ELŐTT SEMMILYEN teszt NEM kell
- Git push ÖNMAGÁBAN NEM jelenti, hogy a feladat kész — MINDEN ellenőrzés DEPLOY UTÁN történik
- Egy deploy CSAK AKKOR van kész, ha:
  1. `curl` HTTP 200/302-t ad minden kritikus URL-re — az oldal BETÖLT az éles szerveren
  2. Nincs friss hiba a logokban
  3. Konzol logban **0 hiba** van (nincs JS error, nincs 500, nincs warning)
- Addig a ciklus: **ellenőrizd → ha hiba van, javítsd → deployolj újra → ellenőrizd újra**
- Ez a ciklus NEM áll meg, amíg az ÖSSZES feltétel nem teljesül
- NE írd ki, hogy "kész" vagy "ok" amíg az ÖSSZES ellenőrzés nem zöld
- NE kérd a felhasználót, hogy nézze meg — amit tudsz ellenőrizni, azt TE ellenőrizd

#### Laravel-specifikus cache szabályok
- `view:cache` SOHA nem fut exception handler-ben (bootstrap/app.php)
- Production deploy után: `view:clear` futtatása KÖTELEZŐ, `view:cache` OPCIONÁLIS
- Ha `view:cache` hibát dob deploy közben → ne álljon meg a deploy, lazy compilation fog működni
- Recovery handler csak `view:clear`-t hív, SOHA `view:cache`-t

### Ha elakadtál
- Ha 2-3 iteráció után sem sikerül a javítás, használj MCP eszközöket
- ELSŐ lépés: ref.tools MCP — keress rá a hibaüzenetre vagy a csomag dokumentációjára
- SOHA ne találgass vakon — előbb nézz utána, utána javíts

## Kommentelési szabályok

### Közös szabályok
- Komplex üzleti logikánál MINDIG magyar inline komment a döntés okával
- Workaround-oknál hivatkozz a problémára (pl. "// SMTP limit miatt...")
- If/else ágaknál kommentáld miért kell az adott ág, ha nem egyértelmű

### Amit NE kommentálj
- Triviális getter/setter, egyértelmű értékadás
- Framework standard konvenciók szerinti műveletek
- Típusdefiníciók amik önmagukat dokumentálják

### Komment karbantartás
- Logika módosul → komment KÖTELEZŐEN frissül
- Törölt kód → hozzá tartozó komment is törlődik, SOHA ne maradjon árva komment
- PHPDoc/JSDoc @param/@return MINDIG egyezzen a metódus/függvény szignatúrájával
- SOHA ne hagyj elavult kommentet — az rosszabb, mint ha nincs

### Duplikáció elkerülése
- Ha egy fájlban MÁR VAN PHPDoc/JSDoc komment, NE adj hozzá újat — FRISSÍTSD a meglévőt
- Mielőtt kommentet írsz, MINDIG ellenőrizd, van-e már komment az adott elemnél
- SOHA ne legyen két doc blokk egymás alatt ugyanahhoz az elemhez

### Laravel (PHP/Blade)
- Osztály fejlécébe PHPDoc: egysoros leírás, kapcsolódó osztályok ha releváns
- Publikus metódushoz PHPDoc: @param, @return, @throws, egysoros cél
- Privát/protected metódushoz is PHPDoc, ha nem triviális
- Route fájlok: csoportonként komment a csoport céljáról
- Migration: minden mező mellett rövid komment a szerepéről
- Form Request: validációs szabályok mellé komment ha nem egyértelmű
- Config/.env.example: minden változó magyarázata
- Blade template-ek: szekciók elején és végén HTML jelölő (`<!-- SZEKCIÓ: [név] kezdete/vége -->`)
- Komplex @if/@foreach feltételeknél kommentáld a célt

### Next.js (TypeScript/React)
- React komponensekhez JSDoc: egysoros leírás, @param props felsorolás
  ```typescript
  /**
   * Displays a reference card with company logo and description.
   *
   * @param props - Component properties
   * @param props.title - Company or project name
   * @param props.description - Brief description
   */
  export function ReferenceCard({ title, description }: Props) {
  ```
- TypeScript interface-ekhez/típusokhoz JSDoc, ha nem önmagukat dokumentálják
- API route-okhoz komment a végpont céljáról és autentikációs követelményéről
- Komplex hook-oknál JSDoc a cél és visszatérési érték dokumentálásához

## Kódolási konvenciók

### Alapelvek
- DRY: ne ismételd magad, használj közös komponenseket, hook-okat, utility-ket, service-eket
- KISS: a legegyszerűbb működő megoldás az első választás
- Egy függvény/metódus = egy felelősség
- Magic number-ök helyett konstansok vagy config értékek

### Elnevezések — közös
- Adatbázis táblák, mezők: snake_case (users, created_at)
- Route-ok: kebab-case (user-profile, dental-listings)
- Konstansok: UPPER_SNAKE_CASE (MAX_UPLOAD_SIZE)

### Elnevezések — Laravel
- Osztályok: PascalCase (ListingController, DentalAd)
- Metódusok, változók: camelCase (getActiveListings, $userRole)
- Config kulcsok: snake_case ponttal (app.listing_limit)

### Elnevezések — Next.js
- Komponensek, típusok, interface-ek: PascalCase (ReferenceCard, TrainingProps)
- Függvények, változók, hook-ok: camelCase (getTrainings, useContactForm)
- Route mappák, fájlok: kebab-case (src/app/adatvedelem/page.tsx)
- CSS class-ek: Tailwind utility-k, egyedi class: kebab-case

### Laravel konvenciók
- Skinny Controller — üzleti logika Service osztályokba
- Model CSAK: Eloquent relationship-ek, scope-ok, attribútumok, accessorok/mutatorok
- Form Request a validációhoz, NE a controller-ben validálj
- Policy a jogosultságkezeléshez
- Resource/Collection az API response formázáshoz
- Event/Listener a laza csatoláshoz ahol értelmes
- Queued Job hosszú futású műveletekhez

### Laravel frontend
- Blade component-ek újrahasználható UI elemekhez
- Alpine.js vagy Livewire interaktivitáshoz (ne jQuery ha elkerülhető)
- Tailwind utility class-ek, egyedi CSS csak ha szükséges
- Képek: WebP formátum, lazy loading, responsive méretezés

### Next.js konvenciók
- **App Router**: minden route a `src/app/` alatt, `page.tsx` / `layout.tsx` / `loading.tsx`
- **Server Components** alapértelmezetten — `'use client'` csak ha kell (interaktivitás, hook-ok)
- **API Routes**: `src/app/api/` alatt, `route.ts` fájlokban
- **Metadata**: `generateMetadata()` vagy statikus `metadata` export minden oldalon
- **Image**: Next.js `<Image>` komponens, `priority` a fold feletti képeknél
- **Link**: Next.js `<Link>` komponens belső navigációhoz
- **Validáció**: Zod sémákkal az API route-okban
- **Stílus**: Tailwind CSS utility class-ek

## UTF-8 és Magyar Ékezetek

**KRITIKUS:** A teljes projektben kötelező az UTF-8 kódolás és a magyar ékezetek helyes kezelése!

### API Response-ok
- Minden API response-nak tartalmaznia kell a `charset=utf-8` headert
- Használj helper függvényeket a response-okhoz, ha elérhetőek

### Adatbázis
- A DATABASE_URL / connection config tartalmazzon `charset=utf8mb4` paramétert
- Collation: `utf8mb4_unicode_ci` (MySQL) vagy megfelelő UTF-8 collation

### String manipuláció
- **NE használj** `.charAt()`, `.substring()` (JS) vagy hasonló byte-alapú függvényeket magyar szövegen
- Használj Unicode-safe string műveleteket (pl. spread operator, `Array.from()`, vagy dedikált utility-k)

## Biztonság

### Közös szabályok
- SOHA ne commitolj `.env` fájlt, API kulcsot, jelszót, titkos tokent
- Ha új titkos értéket vezetsz be, CSAK az `.env.example`-be kerüljön üres/példa értékkel
- `.gitignore`-ban MINDIG ellenőrizd: `.env*`, `node_modules/`, logfájlok
- Ha véletlenül commitolva lett érzékeny adat, NE csak töröld — jelezd, mert a git history-ban megmarad
- Fájl feltöltés: típus + méret validálás

### Laravel biztonság
- Külső API kulcsokat `config/services.php` + `env()` kombóval kezeld
- Minden user input: validálás (Form Request) + sanitizálás
- SQL: MINDIG Eloquent vagy Query Builder, soha raw query validálatlan inputtal
- XSS: Blade-ben `{{ }}` (escaped), nyers HTML renderelés csak ha 100% biztonságos
- CSRF: minden POST/PUT/DELETE form-ban `@csrf`
- Mass assignment: `$fillable` MINDIG explicit, `$guarded` csak indokolt esetben

### Next.js biztonság
- API route-okban: Zod séma validáció minden bemenetre
- XSS: React alapból escaped, nyers HTML renderelés csak ha 100% biztonságos és sanitizált (pl. DOMPurify)
- Szerver-oldali validálás az API route-ban — kliens-oldali validálás NEM elég
- Auth middleware/guard az admin route-okhoz
- `.env*` fájlok gitignore-ban, `NEXT_PUBLIC_` prefix csak publikus értékekhez

## Jelszókezelés
- Jelszavaknál MINDIG engedélyezd a speciális karaktereket
- SOHA ne validáld, ne kérdőjelezd meg a jelszó tartalmát — fogadd el ahogy van
- Ne korlátozd a karakter típusokat (szám, nagybetű stb. ne legyen kötelező)
- Minimum hossz: 8 karakter, maximum: 255

## Hibakezelés
- Try-catch ahol exception várható, MINDIG specifikus exception/error típusokkal
- Soha ne nyelj el hibát üres catch blokkal
- Logolj minden elkapott hibánál kontextussal (user_id, request, stb.)
- Felhasználónak: barátságos magyar hibaüzenet
- Fejlesztőnek: részletes log a háttérben
- Éles környezetben: soha ne mutass stack trace-t a felhasználónak

## Adatbázis
- Migration MINDEN sémaváltozáshoz — kézi DB módosítás TILOS
- **Laravel**: Seeder a tesztadatokhoz, Factory a tesztekhez
- **Next.js (Prisma)**: Seed script, `prisma migrate dev` fejlesztéshez, `prisma migrate deploy` élesben
- Index a gyakran keresett/szűrt mezőkre
- Soft delete ahol az adat visszaállítható kell legyen
- Foreign key constraint-ek a referenciális integritáshoz

## Tesztelés

### Laravel
- Feature test minden API endpoint-hoz / route-hoz
- Unit test komplex üzleti logikához (Service, Model metódusok)
- Tesztnév: `test_[mit_csinál]_[milyen_körülmények_közt]` (snake_case)

### Next.js
- API route tesztek (request/response validáció)
- Komponens tesztek React Testing Library-vel ha szükséges
- E2E tesztek Playwright-tal kritikus user flow-khoz

### Közös
- Arrange-Act-Assert (AAA) struktúra minden tesztben
- Tesztadatok: Factory/Faker/fixture, SOHA ne használj éles adatot
- Assertion-ök legyenek specifikusak

## Fejlesztés utáni biztonsági ellenőrzés
Minden fejlesztési feladat BEFEJEZÉSE után, commit ELŐTT végezd el a biztonsági ellenőrzést.
- Automatikus: route ellenőrzés, debug kód keresés, Semgrep ha elérhető
- Manuális: auth guard/middleware, input validáció, .env.example naprakész
- Érzékeny területeknél (auth, payment, user data): injection, XSS, jogosultságkezelés

> Részletes checklist: docs/security-checklist.md

## Teljesítmény

### Laravel
- N+1 query: MINDIG `with()` eager loading ahol relationship-et használsz
- Cache gyakran lekért, ritkán változó adatot (config, beállítások)
- Pagination nagy listáknál (soha ne tölts be mindent egyszerre)
- Queue (Job) email küldéshez, fájl feldolgozáshoz, nehéz számításokhoz
- Lazy collection nagy adathalmazoknál (`cursor()` vagy `lazy()`)

### Next.js
- Server Components alapértelmezetten — kliens-oldali JS minimalizálása
- `force-dynamic` csak ahol valóban szükséges, ISR/revalidate ahol lehetséges
- Next.js `<Image>` komponens automatikus optimalizálással (ha `sharp` elérhető)
- Prisma `include`/`select` — csak a szükséges mezőket kérd le
- `loading.tsx` skeleton-ok a jobb UX-ért

## Git konvenciók

### Conventional Commits formátum
- `feat(scope)`: új funkció (pl. `feat(blog): blog oldal hozzáadása`)
- `fix(scope)`: hibajavítás (pl. `fix(auth): bejelentkezési hiba javítása`)
- `refactor(scope)`: kód átszervezés, viselkedés változás nélkül
- `style(scope)`: formázás, kommentelés, whitespace
- `docs(scope)`: dokumentáció módosítás
- `test(scope)`: teszt hozzáadás/módosítás
- `chore(scope)`: build, config, dependency változás
- Breaking change: `feat(scope)!:` leírás

### Branch elnevezés
- `feature/[rövid-leírás]`, `fix/[rövid-leírás]`, `refactor/[rövid-leírás]`

### Egyéb szabályok
- Egy commit = egy logikai egység
- Működő kódot commitolj — ha nem fordul le, ne pushold
- Commit üzenet magyarul, scope angolul

## Többügynökös fejlesztési workflow (TMUX)
Komplex feladatoknál MINDIG használj több párhuzamos Claude Code ügynököt TMUX session-ökben.
- Bármilyen többfájlos/többmodulos feladatnál: minimum 2 ügynök (fejlesztő + reviewer)
- Az ügynökök NE módosítsák ugyanazt a fájlt egyszerre — fájl-szintű felosztás
- A reviewer ügynök MINDIG utolsóként fut, a többiek munkáját ellenőrzi
- Minden ügynök UGYANAZT a CLAUDE.md-t olvassa — konzisztencia garantált

> Részletes ügynök felosztás, TMUX parancsok és indítási sablon: docs/multi-agent-workflow.md

## Fájl és mappastruktúra
- **Laravel**: Tartsd be a Laravel standard struktúrát, új modul = új almappa az `app/` alatt
- **Next.js**: App Router struktúra a `src/app/` alatt, komponensek `src/components/`, utility-k `src/lib/`
- Részletes struktúra: docs/architecture.md (ha létezik)

## Külső dokumentáció hivatkozások
- Részletes kommentelési szabályok: docs/commenting-rules.md
- Biztonsági ellenőrzési checklist: docs/security-checklist.md
- Többügynökös workflow és TMUX: docs/multi-agent-workflow.md
- Projekt architektúra és struktúra: docs/architecture.md
- Telepítés és futtatás: docs/setup.md
- API dokumentáció: docs/api.md

> Ha a hivatkozott fájl nem létezik, JELEZD a hiányát, de NE hozd létre automatikusan.
