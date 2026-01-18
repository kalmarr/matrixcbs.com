# Preview Link System - Használati útmutató

## Áttekintés

A Preview Link rendszer lehetővé teszi időkorlátos előnézeti linkek generálását blog bejegyzésekhez, még publikálás előtt. Az előnézeti linkek **24 órán keresztül érvényesek**, és megoszthatók külső felülvizsgálók vagy ügyfelek számára.

## Létrehozott fájlok

```
matrix-nextjs/
├── lib/blog/
│   └── preview.ts                                    # Token utilities
├── app/api/admin/posts/[id]/preview/
│   └── route.ts                                      # API endpoint
├── app/blog/preview/[token]/
│   ├── page.tsx                                      # Preview oldal
│   └── not-found.tsx                                 # 404 oldal
└── components/admin/
    └── PreviewLink.tsx                               # UI komponens
```

## Komponensek részletesen

### 1. Token Utilities (`lib/blog/preview.ts`)

Funkciók:
- `generatePreviewToken()` - 64 karakteres biztonságos hex token generálása
- `getPreviewExpiration()` - Lejárati idő (24 óra)
- `validatePreviewToken(token, postId)` - Token validáció
- `getPostByPreviewToken(token)` - Post lekérés tokennel (kategóriák, címkék, szerző adatokkal)

### 2. API Endpoint (`app/api/admin/posts/[id]/preview/route.ts`)

**POST** `/api/admin/posts/[id]/preview`

Válasz sikeres esetén:
```json
{
  "success": true,
  "previewUrl": "https://matrixcbs.com/blog/preview/abc123...",
  "previewToken": "abc123...",
  "expiresAt": "2026-01-13T12:00:00.000Z",
  "message": "Előnézeti link sikeresen generálva"
}
```

Hibák:
- `400` - Érvénytelen post ID
- `404` - Post nem található
- `500` - Szerver hiba

### 3. Preview Page (`app/blog/preview/[token]/page.tsx`)

Funkciók:
- **Sárga "ELŐNÉZET" banner** tetején sticky pozícióval
- Post státusz megjelenítése (DRAFT, SCHEDULED, PUBLISHED, ARCHIVED)
- Lejárati idő megjelenítése magyar formátumban
- Teljes post renderelés:
  - Kategóriák színes badge-ekkel
  - Kiemelt kép
  - Szerző és dátum
  - Excerpt
  - Teljes tartalom (HTML)
  - Címkék
- SEO védelem: `noindex, nofollow`
- Automatikus 404 redirect ha token érvénytelen/lejárt

### 4. UI Component (`components/admin/PreviewLink.tsx`)

Kliens oldali React komponens magyar nyelvű UI-val.

## Integrálás az admin felületre

### Példa: Post szerkesztő oldal

```tsx
// app/admin/posts/[id]/edit/page.tsx
import PreviewLink from '@/components/admin/PreviewLink';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const postId = parseInt(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Poszt szerkesztése</h1>

      {/* ... szerkesztő form ... */}

      {/* Preview Link komponens */}
      <div className="mt-8">
        <PreviewLink postId={postId} />
      </div>
    </div>
  );
}
```

### Példa: Post lista oldalon

```tsx
// components/admin/PostListItem.tsx
import PreviewLink from '@/components/admin/PreviewLink';

export default function PostListItem({ post }) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="border rounded-lg p-4">
      <h3>{post.title}</h3>
      <p>{post.status}</p>

      <button onClick={() => setShowPreview(!showPreview)}>
        {showPreview ? 'Előnézet elrejtése' : 'Előnézeti link'}
      </button>

      {showPreview && (
        <div className="mt-4">
          <PreviewLink postId={post.id} />
        </div>
      )}
    </div>
  );
}
```

## Felhasználói folyamat

1. Admin megnyitja a poszt szerkesztő oldalt
2. Kattint a "Link generálása" gombra
3. Megjelenik az előnézeti URL egy másolható mezőben
4. "Másolás" gombbal vágólapra másolhatja
5. Megosztja a linket email-ben vagy más csatornán
6. Címzett megnyitja a linket és látja az előnézetet
7. 24 óra után a link automatikusan lejár

## UI Elemek (PreviewLink komponens)

- **Header**: "Előnézeti link" cím + "Link generálása" gomb
- **Leírás**: "Generálj egy időkorlátos linket..."
- **Hibakezelés**: Piros alert box hibaüzenettel
- **Generált link**:
  - Csak olvasható input mező
  - "Másolás" gomb (átváltozik "Másolva!"-ra)
  - Lejárati idő magyar formátumban
  - "Előnézet megnyitása új ablakban" link
- **Loading state**: Spinner ikon + "Generálás..." szöveg

## Környezeti változók

Állítsd be a `.env` fájlban:

```env
# Production
NEXT_PUBLIC_BASE_URL=https://matrixcbs.com

# Development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Ha nincs beállítva, alapértelmezett: `http://localhost:3000`

## Adatbázis mezők

A Prisma schema már tartalmazza az alábbi mezőket a `Post` modellben:

```prisma
model Post {
  // ...
  previewToken    String?     @unique @map("preview_token") @db.VarChar(64)
  previewExpires  DateTime?   @map("preview_expires")
  // ...
}
```

**Nem szükséges migráció**, ezek a mezők már léteznek!

## Biztonsági megfontolások

1. **Kriptográfiailag biztos tokenek**
   - `crypto.randomBytes(32)` használata
   - 64 karakteres hex string
   - Gyakorlatilag kitalálhatatlan

2. **Időkorlát**
   - 24 órás lejárat
   - Automatikus validáció minden kérésnél

3. **Egyedi tokenek**
   - Minden új generálás új tokent hoz létre
   - A régi token érvényét veszti

4. **SEO védelem**
   - `robots: { index: false, follow: false }`
   - Előnézetek nem indexelődnek

5. **Hozzáférés-ellenőrzés**
   - Token nélkül nincs hozzáférés
   - Lejárt token automatikusan 404

## Preview oldal jellemzői

### Sárga banner (sticky, tetején)
- Szem ikon
- "ELŐNÉZET" nagy betűvel
- Státusz megjelenítése (DRAFT/SCHEDULED/stb.)
- Lejárati időpont

### Post megjelenítés
- Kategóriák színes badge-ekkel (kategória színnel)
- Nagy cím (4xl/5xl)
- Szerző és dátum ikonokkal
- Excerpt (nagyobb betűmérettel)
- Kiemelt kép (ha van)
- Teljes tartalom HTML renderelve (`prose` osztályokkal)
- Címkék alul (#tag formátumban)

### 404 oldal (lejárt/érvénytelen token)
- Piros figyelmeztető ikon
- "Előnézet nem található" cím
- Magyarázat a lejáratról
- "Főoldal" és "Blog" gombok
- Tipp új link generálásához

## Tesztelés

### 1. Manuális teszt

```bash
# Indítsd el a dev szervert
npm run dev

# Navigálj egy post szerkesztő oldalra
# http://localhost:3000/admin/posts/1/edit

# Generálj preview linket
# Nyisd meg a generált linket új ablakban
# Várj 24 órát és ellenőrizd, hogy lejár-e (vagy módosítsd az adatbázisban)
```

### 2. API teszt cURL-lel

```bash
# Generálj preview linket
curl -X POST http://localhost:3000/api/admin/posts/1/preview

# Várható válasz:
{
  "success": true,
  "previewUrl": "http://localhost:3000/blog/preview/abc123...",
  "previewToken": "abc123...",
  "expiresAt": "2026-01-13T12:00:00.000Z",
  "message": "Előnézeti link sikeresen generálva"
}
```

### 3. Token validáció teszt

```typescript
import { validatePreviewToken } from '@/lib/blog/preview';

// Érvényes token
const valid = await validatePreviewToken('abc123...', 1);
console.log(valid); // true

// Érvénytelen token
const invalid = await validatePreviewToken('invalid', 1);
console.log(invalid); // false
```

## Gyakori hibák és megoldások

### "Előnézet nem található"
- **Ok**: Token lejárt vagy érvénytelen
- **Megoldás**: Generálj új preview linket

### API hiba (500)
- **Ok**: Adatbázis kapcsolati hiba vagy érvénytelen post ID
- **Megoldás**: Ellenőrizd a szerver logokat és az adatbázis kapcsolatot

### Link nem nyílik meg
- **Ok**: `NEXT_PUBLIC_BASE_URL` nincs beállítva vagy helytelen
- **Megoldás**: Állítsd be a környezeti változót

### "Másolás" gomb nem működik
- **Ok**: Böngésző nem támogatja a Clipboard API-t vagy HTTPS szükséges
- **Megoldás**: Használj modernebb böngészőt vagy HTTPS-t

## Jövőbeli fejlesztések

- [ ] Email megosztás funkció (preview link küldése emailben)
- [ ] Testreszabható lejárati idő (választható 12/24/48/72 óra)
- [ ] Analytics előnézeti linkekhez (hányszor nyitották meg)
- [ ] Jelszóval védett előnézetek
- [ ] Komment funkció előnézetekhez (feedback gyűjtés)
- [ ] Több token kezelése (különböző embereknek különböző linkek)
- [ ] Preview history (korábbi előnézetek listája)

## Támogatás

Ha problémád van a preview link rendszerrel, ellenőrizd:
1. Adatbázis kapcsolatot
2. Prisma client frissítése (`npx prisma generate`)
3. Környezeti változók beállítása
4. Szerver logok hibákért
5. Böngésző konzol hibákért
