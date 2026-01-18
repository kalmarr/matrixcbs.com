# MATRIX CBS - Biztonsági Javítások Terv

## Összefoglaló

A biztonsági audit feltárta, hogy az admin API végpontok **NINCS** authentikáció alatt,
és a már implementált biztonsági funkciók (CSRF, HTML sanitizálás) **NINCSENEK HASZNÁLVA**.

---

## 1. Admin API Authentikáció

### Probléma
- `/api/admin/messages/route.ts` - NEM ellenőrzi a bejelentkezést
- `/api/admin/posts/route.ts` - NEM ellenőrzi a bejelentkezést
- `/api/admin/media/upload/route.ts` - NEM ellenőrzi a bejelentkezést (hardcoded uploadedBy=1)

### Megoldás
Létrehozunk egy `withAuth()` wrapper függvényt amit minden admin route-nál használunk:

```typescript
// src/lib/auth-guard.ts
import { auth } from './auth'
import { NextResponse } from 'next/server'

export async function withAuth(handler: Function) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return handler(session)
}
```

### Érintett fájlok
- `src/lib/auth-guard.ts` - ÚJ fájl
- `src/app/api/admin/messages/route.ts` - auth hozzáadás
- `src/app/api/admin/posts/route.ts` - auth hozzáadás
- `src/app/api/admin/media/upload/route.ts` - auth hozzáadás + uploadedBy session-ből

---

## 2. Middleware Frissítés

### Probléma
A middleware jelenleg átengedi az összes `/admin` és `/api/admin` kérést.

### Megoldás
A middleware-ben ellenőrizzük a NextAuth session-t az admin route-oknál:

```typescript
// middleware.ts - kiegészítés
import { auth } from '@/lib/auth'

// Admin útvonalak védelme
if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
  const session = await auth()
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}
```

### Érintett fájlok
- `middleware.ts`

---

## 3. CSRF Védelem

### Probléma
A `src/lib/security.ts` tartalmazza a CSRF funkciókat, de SEHOL nincs használva:
- `validateOrigin()` - origin/referer ellenőrzés
- `generateCsrfToken()` - token generálás

### Megoldás
A contact form API-nál használjuk a `validateOrigin()` funkciót:

```typescript
// src/app/api/contact/route.ts
import { validateOrigin } from '@/lib/security'

export async function POST(request: NextRequest) {
  // CSRF védelem
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  }
  // ... folytatás
}
```

### Érintett fájlok
- `src/app/api/contact/route.ts`
- Opcionálisan: minden POST API végpont

---

## 4. Email Header Injection Megelőzése

### Probléma
A felhasználói input (név, email) közvetlenül kerül az email mezőkbe:
- `src/lib/email.ts` 88-90, 110. sor

Ha valaki `\n` karaktert ír a nevébe, extra email fejléceket injektálhat.

### Megoldás
Sanitizáljuk az email mezőket:

```typescript
// src/lib/email.ts - segédfüggvény
function sanitizeEmailField(value: string): string {
  // Eltávolítjuk a newline karaktereket
  return value.replace(/[\r\n]/g, '').trim()
}

// Használat
const safeName = sanitizeEmailField(data.firstName + ' ' + data.lastName)
const safeEmail = sanitizeEmailField(data.email)
```

### Érintett fájlok
- `src/lib/email.ts`

---

## 5. HTML Sanitizálás Email Sablonokban

### Probléma
A customer confirmation email HTML-t tartalmaz, és a felhasználói input escape-elés nélkül kerül bele.

### Megoldás
Használjuk a meglévő `escapeHtml()` függvényt a `security.ts`-ből:

```typescript
import { escapeHtml } from '@/lib/security'

// Email sablonban:
const html = `
  <p>Kedves ${escapeHtml(data.firstName)},</p>
  <p>${escapeHtml(data.message)}</p>
`
```

### Érintett fájlok
- `src/lib/email.ts`

---

## Implementációs Sorrend

1. **auth-guard.ts** létrehozása
2. **Admin API route-ok** frissítése (messages, posts, media/upload)
3. **middleware.ts** frissítése
4. **email.ts** biztonsági javítások
5. **contact/route.ts** CSRF védelem
6. **Lokális tesztelés**
7. **Deploy** (csak ha minden működik)

---

## Tesztelési Terv

### Lokális tesztelés
1. Build: `npm run build`
2. Start: `npm run start` vagy PM2
3. Tesztelni:
   - [ ] Admin API-k 401-et adnak bejelentkezés nélkül
   - [ ] Admin API-k működnek bejelentkezéssel
   - [ ] Contact form működik
   - [ ] Contact form elutasítja rossz origin-t
   - [ ] Email küldés nem tartalmaz injection-t

### Deployment
Csak sikeres lokális teszt után!
