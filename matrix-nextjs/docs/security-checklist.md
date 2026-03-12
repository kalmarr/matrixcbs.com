# Fejlesztés utáni biztonsági ellenőrzési checklist

Minden fejlesztési feladat BEFEJEZÉSE után, commit ELŐTT végezd el az alábbi ellenőrzéseket.

## Automatikus ellenőrzés (parancsok)

### TypeScript típusellenőrzés
```bash
npx tsc --noEmit
```
Nincs típushiba → biztonságos.

### Build ellenőrzés
```bash
npm run build
```
Sikeres build → nincs szintaktikai vagy import hiba.

### Veszélyes kód minták keresése
```bash
# Nyers HTML renderelés (XSS kockázat) — keress rá: dangerously Set Inner HTML (egybeírva)
grep -rn "dangerouslyS" src/

# Debug kód maradt-e benne
grep -rn "console\.log\|console\.debug\|debugger" src/ --include="*.ts" --include="*.tsx"

# Hardcoded jelszó/token/secret keresés
grep -rn "password.*=.*['\"].*['\"\|secret.*=.*['\"].*['\"\|token.*=.*['\"]" src/

# Nyitott kérdések áttekintése
grep -rn "TODO\|FIXME\|HACK\|XXX" src/
```

### Semgrep (ha elérhető)
```bash
semgrep --config=auto src/
semgrep --config=p/typescript src/
semgrep --config=p/react src/
```

## Manuális ellenőrzés

### Minden módosításnál
- [ ] Új API route-hoz van-e auth védelem (`auth-guard.ts` vagy middleware)?
- [ ] `.env.example` frissítve van-e ha új env változó került be?
- [ ] Nem maradt-e debug kód a commitban?
- [ ] TypeScript strict mód hibák javítva?

### Új API route létrehozásakor
- [ ] Admin route-ok: `requireAuth()` hívás az `auth-guard.ts`-ből
- [ ] Publikus route-ok: rate limiting beállítva (`rateLimit.ts`)
- [ ] Input validálás Zod sémával (`validations.ts`)
- [ ] Response: `jsonResponse()` / `badRequestResponse()` az `api-utils.ts`-ből (charset)
- [ ] Origin validálás: `validateOrigin()` POST/PUT/DELETE kéréseknél
- [ ] Hibakezelés: megfelelő HTTP status kódok, nem szivárog stack trace

### Új komponens létrehozásakor
- [ ] Server Component alapértelmezetten — `'use client'` csak ha kell
- [ ] User input escaped (React alapból escaped, de figyeld a nyers HTML-t)
- [ ] Képeknél: Next.js `<Image>` komponens (automatikus optimalizálás)

### Prisma / adatbázis módosítás
- [ ] Migration létrehozva (`npx prisma migrate dev`)
- [ ] Érzékeny mezők nem kerülnek API response-ba (select/omit használata)
- [ ] Nincs nyers SQL query validálatlan user inputtal

## Security headerek (next.config.ts)

Ellenőrizd, hogy a következők aktívak:
- [ ] **HSTS**: `Strict-Transport-Security: max-age=63072000; includeSubDomains`
- [ ] **X-Frame-Options**: `SAMEORIGIN`
- [ ] **X-Content-Type-Options**: `nosniff`
- [ ] **X-XSS-Protection**: `1; mode=block`
- [ ] **Referrer-Policy**: `strict-origin-when-cross-origin`
- [ ] **Permissions-Policy**: kamera, mikrofon, geolokáció tiltva
- [ ] **CSP**: Google Analytics és Facebook kivételekkel

## Middleware védelem (middleware.ts)

- [ ] `/admin/*` route-ok átirányítanak `/admin/login`-ra ha nincs session
- [ ] `/api/admin/*` route-ok 401-et adnak ha nincs session
- [ ] `/api/auth/*` route-ok mindig elérhetők
- [ ] Karbantartási mód ellenőrzés aktív

## Meglévő biztonsági implementációk

Az alábbi fájlok tartalmazzák a projekt biztonsági logikáját — módosítás előtt olvasd el:

| Fájl | Cél |
|------|-----|
| `src/lib/auth.ts` | NextAuth konfiguráció (JWT, Credentials) |
| `src/lib/auth-guard.ts` | API route auth middleware |
| `src/lib/security.ts` | Origin validálás, CSRF védelem |
| `src/lib/sanitize-html.ts` | HTML sanitizálás (DOMPurify) |
| `src/lib/rateLimit.ts` | Rate limiting (LRU cache) |
| `src/lib/validations.ts` | Zod validációs sémák |
| `src/lib/api-utils.ts` | API response helperek (charset=utf-8) |
| `middleware.ts` | Edge middleware (auth + maintenance redirect) |
| `next.config.ts` | Security headerek (CSP, HSTS, stb.) |

## Érzékeny területek

Ha a módosítás az alábbi területeket érinti, KÜLÖN ellenőrizd:

### Autentikáció (auth.ts, auth-guard.ts)
- [ ] JWT token lejárat megfelelő (24 óra)
- [ ] Jelszó bcrypt hash-eléssel tárolva
- [ ] Session invalidálás működik

### Fájl feltöltés (api/admin/media)
- [ ] MIME type ellenőrzés (csak kép típusok)
- [ ] Fájlméret limit
- [ ] Fájlnév sanitizálás (nincs path traversal)
- [ ] Sharp-pal feldolgozott képek (nem az eredeti fájl szolgáltatva)

### Kapcsolatfelvételi űrlap (api/contact)
- [ ] Zod validálás minden mezőre
- [ ] Honeypot mező bot-szűréshez
- [ ] Timing validálás (min. 3 másodperc)
- [ ] Rate limiting aktív (10 kérés / 15 perc / IP)
- [ ] Email header injection védelem

### Cron endpoint (api/cron/publish-scheduled)
- [ ] CRON_SECRET token ellenőrzés
- [ ] Nem érhető el token nélkül
