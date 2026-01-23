# CLAUDE.md - MATRIX CBS Next.js Projekt

Ez a fájl útmutatást ad a Claude Code számára a MATRIX CBS Next.js projekthez.

## Projekt Áttekintés

Modern Next.js 16 alapú webalkalmazás a MATRIX CBS Kft. számára, admin panellel és blog rendszerrel.

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
└── public/            # Statikus fájlok
```

## Fejlesztési Megjegyzések

- A slug generálás NFD normalizálást használ az ékezetek eltávolítására
- Az OpenGraph locale: `hu_HU`
- A font subset-ek tartalmazzák a `latin-ext` karaktereket az ékezetekhez
