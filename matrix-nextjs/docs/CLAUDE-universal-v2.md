# CLAUDE.md — Univerzális projekt sablon

## Nyelv és kommunikáció
- Kód kommentek (PHPDoc/JSDoc): angolul
- Inline kommentek, üzleti logika magyarázat: magyarul
- Commit üzenetek: magyarul, Conventional Commits formátumban
- Válaszok, magyarázatok: magyarul

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
- Szintaktikai hiba → futtass linter-t / php artisan route:list-et
- Addig iterálj, amíg a hiba BIZONYÍTOTTAN megszűnt

### Éles szerver vs lokális fejlesztés
- Ha éles szerveren lévő hibát küldök, a javítást LOKÁLISAN végezd
- Deploy-t CSAK AKKOR végezz, ha EXPLICIT kérem ("deployolj", "tedd ki élesbe")
- Amíg nem kérek deploy-t, minden munka lokális környezetben történik
- Ha lokális szerveren dolgozok (fejlesztek, tesztelek, stb.), akkor éles szerveren SOHA ne módosíts közvetlenül, csak deploy-on keresztül, ha kérlek

### Deploy protokoll — KÖTELEZŐ
- **SOHA ne SCP-zz/tölts fel egyedi fájlokat az élesre deploy nélkül** — ez inkonzisztens állapotot okoz (view cache, route cache, opcache nem szinkronizálódik)
- Ha éles hibát kell javítani: lokálisan javíts → commitolj → `./deploy.sh deploy`
- **Deploy ELŐTT** lokális tesztek KÖTELEZŐEK: `php artisan test`, `pint --test`, `bash -n deploy.sh`
- **Deploy UTÁN** kötelező verifikáció (a deploy script automatikusan végzi, de manuálisan is ellenőrizd):
  - Smoke test: `curl` minden kritikus URL-re (`/`, `/admin`, stb.) → nincs 500
  - Route validáció: `php artisan route:list` hiba nélkül fut az élesben
  - Laravel log: nincs friss ERROR a `storage/logs/laravel.log`-ban
- **View cache + opcache összefüggés**: a `view:clear` törli a compiled fájlokat a lemezről, de az opcache memóriájában maradnak → `opcache_reset()` KÖTELEZŐ a `view:clear` után (a deploy script automatikusan kezeli)
- Ha a deploy script health check WARN-t ad → AZONNAL vizsgáld meg, ne hagyd figyelmen kívül

### Deploy befejezésének feltétele
- Git push ÖNMAGÁBAN NEM jelenti, hogy a feladat kész — MINDIG futtasd a deploy utáni ellenőrzést
- Ha HTTP health check 500-at ad → vizsgáld meg a laravel.log-ot → javíts → deploy újra → ellenőrizd újra
- Egy deploy CSAK AKKOR van kész, ha:
  1. Minden cache törölve és újraépítve (config, route, view, opcache)
  2. Migration-ök hiba nélkül lefutottak
  3. `curl` HTTP 200/302-t ad minden kritikus URL-re
  4. Nincs friss ERROR a `storage/logs/laravel.log`-ban
- Ha BÁRMELYIK lépés hibázik → írd le a PONTOS hibát → javítsd → kezd elölről az 1. lépéstől

### View Cache szabályok
- `view:cache` SOHA nem fut exception handler-ben (bootstrap/app.php)
- Production deploy után: `view:clear` futtatása KÖTELEZŐ, `view:cache` OPCIONÁLIS
- Ha `view:cache` hibát dob deploy közben → ne álljon meg a deploy, lazy compilation fog működni
- Recovery handler csak `view:clear`-t hív, SOHA `view:cache`-t

### Ha elakadtál
- Ha 2-3 iteráció után sem sikerül a javítás, használj MCP eszközöket
- ELSŐ lépés: ref.tools MCP — keress rá a hibaüzenetre, a használt csomag dokumentációjára, vagy a Laravel/Livewire releváns szekciójára
- Ha a ref.tools nem ad eredményt, használj Brave Search MCP-t vagy más elérhető MCP-t
- SOHA ne találgass vakon — előbb nézz utána, utána javíts

## Kommentelési szabályok

### PHP osztályok (Model, Controller, Service, Request, Middleware, stb.)
- Osztály fejlécébe PHPDoc: egysoros leírás, kapcsolódó osztályok ha releváns
- Publikus metódushoz PHPDoc: @param, @return, @throws, egysoros cél
- Privát/protected metódushoz is PHPDoc, ha nem triviális
- Komplex üzleti logikánál MINDIG magyar inline komment a döntés okával
- Workaround-oknál hivatkozz a problémára (pl. "// SMTP limit miatt...")
- If/else ágaknál kommentáld miért kell az adott ág, ha nem egyértelmű

### Laravel specifikus
- Route fájlok: csoportonként komment a csoport céljáról
- Migration: minden mező mellett rövid komment a szerepéről
- Form Request: validációs szabályok mellé komment ha nem egyértelmű
- Config/.env.example: minden változó magyarázata
- Middleware: milyen esetben fut, mit csinál

### Blade template-ek
- Szekciók elején és végén HTML jelölő:
  `<!-- SZEKCIÓ: [név] kezdete -->` / `<!-- SZEKCIÓ: [név] vége -->`
- Komplex @if/@foreach feltételeknél kommentáld a célt
- Partial/component beillesztésnél kommentáld mit húz be és miért

### JavaScript / CSS
- JS függvényekhez JSDoc (cél, paraméterek, visszatérés)
- Komplex DOM manipulációknál kommentáld a szándékot
- CSS szekciónként komment ha nem egyértelmű miért kell

### Amit NE kommentálj
- Triviális getter/setter (hacsak nincs bennük logika)
- Egyértelmű értékadás ($i++, $name = $user->name)
- Laravel standard konvenciók szerinti műveletek

### Komment karbantartás
- Logika módosul → komment KÖTELEZŐEN frissül
- Mező szerepe változik → komment frissül
- Törölt kód → hozzá tartozó komment is törlődik, SOHA ne maradjon árva komment
- Áthelyezett kód → régi helyen lévő komment törlendő
- Blade szekció-jelölők MINDIG párosak maradjanak (kezdete + vége)
- PHPDoc @param/@return MINDIG egyezzen a metódus szignatúrájával
- SOHA ne hagyj elavult kommentet — az rosszabb, mint ha nincs

### Duplikáció elkerülése
- Ha egy fájlban MÁR VAN PHPDoc komment, NE adj hozzá újat — FRISSÍTSD a meglévőt
- Mielőtt kommentet írsz, MINDIG ellenőrizd, van-e már komment az adott osztálynál/metódusnál
- Ha a meglévő komment pontatlan vagy hiányos, CSERÉLD ki (töröld a régit, írd az újat)
- SOHA ne legyen két PHPDoc blokk egymás alatt ugyanahhoz az elemhez
- Ugyanez vonatkozik Blade szekció-jelölőkre és JSDoc blokkokra is

## Kódolási konvenciók

### Alapelvek
- DRY: ne ismételd magad, használj trait-eket, service-eket, helper-eket
- KISS: a legegyszerűbb működő megoldás az első választás
- Egy metódus = egy felelősség, max ~30 sor
- Magic number-ök helyett konstansok vagy config értékek
- Hardcoded string-ek helyett nyelvi fájlok (lang/) vagy config

### Elnevezések
- Osztályok: PascalCase (ListingController, DentalAd)
- Metódusok, változók: camelCase (getActiveListings, $userRole)
- Adatbázis táblák, mezők: snake_case (dental_listings, created_at)
- Route-ok: kebab-case (dental-listings, user-profile)
- Config kulcsok: snake_case ponttal (app.listing_limit)
- Konstansok: UPPER_SNAKE_CASE (MAX_UPLOAD_SIZE)

### Laravel konvenciók
- Skinny Controller — üzleti logika Service osztályokba
- Model CSAK: Eloquent relationship-ek, scope-ok, attribútumok, accessorok/mutatorok
- Form Request a validációhoz, NE a controller-ben validálj
- Policy a jogosultságkezeléshez
- Resource/Collection az API response formázáshoz
- Event/Listener a laza csatoláshoz ahol értelmes
- Queued Job hosszú futású műveletekhez

### Frontend
- Blade component-ek újrahasználható UI elemekhez
- Alpine.js vagy Livewire interaktivitáshoz (ne jQuery ha elkerülhető)
- Tailwind utility class-ek, egyedi CSS csak ha szükséges
- Képek: WebP formátum, lazy loading, responsive méretezés

## Biztonság
- SOHA ne commitolj .env fájlt, API kulcsot, jelszót, titkos tokent
- Ha új titkos értéket vezetsz be, CSAK az .env.example-be kerüljön üres/példa értékkel
- .gitignore-ban MINDIG ellenőrizd, hogy benne van: .env, storage/, node_modules/, *.log
- Ha véletlenül commitolva lett érzékeny adat, NE csak töröld — jelezd, mert a git history-ban megmarad
- Külső API kulcsokat config/services.php + env() kombóval kezeld, soha ne hardcode-old
- Minden user input: validálás (Form Request) + sanitizálás
- SQL: MINDIG Eloquent vagy Query Builder, soha raw query validálatlan inputtal
- XSS: Blade-ben {{ }} (escaped), {!! !!} csak ha 100% biztonságos a tartalom
- CSRF: minden POST/PUT/DELETE form-ban @csrf
- Mass assignment: $fillable MINDIG explicit, $guarded csak indokolt esetben
- Fájl feltöltés: típus + méret validálás, SOHA ne tárold public/-ban közvetlenül

## Jelszókezelés
- Jelszavaknál MINDIG engedélyezd a speciális karaktereket
- SOHA ne validáld, ne kérdőjelezd meg a jelszó tartalmát — fogadd el ahogy van
- Ne korlátozd a karakter típusokat (szám, nagybetű stb. ne legyen kötelező)
- Minimum hossz: 8 karakter, maximum: 255

## Hibakezelés
- Try-catch ahol exception várható, MINDIG specifikus exception típusokkal
- Soha ne nyelj el hibát üres catch blokkal
- Log::error() minden elkapott hibánál kontextussal (user_id, request, stb.)
- Felhasználónak: barátságos magyar hibaüzenet
- Fejlesztőnek: részletes log a háttérben
- Éles környezetben: soha ne mutass stack trace-t a felhasználónak

## Adatbázis
- Migration MINDEN sémaváltozáshoz — kézi DB módosítás TILOS
- Seeder a tesztadatokhoz, Factory a tesztekhez
- Index a gyakran keresett/szűrt mezőkre
- Soft delete ahol az adat visszaállítható kell legyen
- Foreign key constraint-ek a referenciális integritáshoz

## Tesztelés
- Feature test minden API endpoint-hoz / route-hoz
- Unit test komplex üzleti logikához (Service, Model metódusok)
- Tesztnév: test_[mit_csinál]_[milyen_körülmények_közt] (snake_case)
- Arrange-Act-Assert (AAA) struktúra minden tesztben
- Tesztadatok: Factory és Faker, SOHA ne használj éles adatot
- Assertion-ök legyenek specifikusak, ne csak assertTrue()

## Fejlesztés utáni biztonsági ellenőrzés
Minden fejlesztési feladat BEFEJEZÉSE után, commit ELŐTT végezd el a biztonsági ellenőrzést.
- Automatikus: route ellenőrzés, raw query/debug kód keresés, Semgrep
- Manuális: middleware, authorize(), $fillable/$hidden, rate limiting, .env.example
- Érzékeny területeknél (auth, payment, user data): CSRF, SQL injection, XSS, Policy/Gate

> Részletes checklist és parancsok: docs/security-checklist.md

## Teljesítmény
- N+1 query: MINDIG with() eager loading ahol relationship-et használsz
- Cache gyakran lekért, ritkán változó adatot (config, beállítások)
- Pagination nagy listáknál (soha ne tölts be mindent egyszerre)
- Queue (Job) email küldéshez, fájl feldolgozáshoz, nehéz számításokhoz
- Lazy collection nagy adathalmazoknál (cursor() vagy lazy())

## Git konvenciók

### Conventional Commits formátum
- feat(scope): új funkció (pl. `feat(listing): hirdetés szűrő hozzáadása`)
- fix(scope): hibajavítás (pl. `fix(auth): bejelentkezési hiba javítása`)
- refactor(scope): kód átszervezés, viselkedés változás nélkül
- style(scope): formázás, kommentelés, whitespace
- docs(scope): dokumentáció módosítás
- test(scope): teszt hozzáadás/módosítás
- chore(scope): build, config, dependency változás
- Breaking change: feat(scope)!: leírás

### Branch elnevezés
- feature/[rövid-leírás], fix/[rövid-leírás], refactor/[rövid-leírás]

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
- Tartsd be a Laravel standard struktúrát
- Új modul = új almappa az app/ alatt ha indokolt (pl. app/Services/Listing/)
- Részletes struktúra: docs/architecture.md (ha létezik)

## Külső dokumentáció hivatkozások
- Részletes kommentelési szabályok: docs/commenting-rules.md
- Biztonsági ellenőrzési checklist: docs/security-checklist.md
- Többügynökös workflow és TMUX: docs/multi-agent-workflow.md
- Projekt architektúra és struktúra: docs/architecture.md
- Telepítés és futtatás: docs/setup.md
- API dokumentáció: docs/api.md

> Ha a hivatkozott fájl nem létezik, JELEZD a hiányát, de NE hozd létre automatikusan.
