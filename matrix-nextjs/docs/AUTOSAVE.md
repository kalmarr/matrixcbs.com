# Autosave System Documentation

## Áttekintés

Az autosave rendszer automatikusan menti a blog posztok piszkozatait az admin felületen, hogy megvédje a felhasználók munkáját véletlen adatvesztéstől.

## Komponensek

### 1. `hooks/useAutosave.ts`

Custom React hook az automatikus mentéshez.

**Funkciók:**
- Debounced mentés (változás után 5 másodperc inaktivitás)
- Periodikus mentés (30 másodpercenként)
- Dirty state követés (vannak-e nem mentett változások)
- Mentési állapot követés

**Használat:**
```typescript
const { isSaving, lastSaved, isDirty, clearDraft } = useAutosave({
  data: {
    title,
    content,
    excerpt,
    postId // opcionális, szerkesztésnél
  },
  enabled: true,
  debounceMs: 5000,
  autoSaveIntervalMs: 30000
})
```

### 2. `hooks/useBeforeUnload.ts`

Figyelmeztetés megjelenítése, ha a felhasználó nem mentett változásokkal próbálja elhagyni az oldalt.

**Használat:**
```typescript
useBeforeUnload(isDirty)
```

### 3. `components/admin/AutosaveIndicator.tsx`

Vizuális jelző a mentés állapotáról.

**Állapotok:**
- **Mentés folyamatban:** Narancssárga, spinner animációval
- **Nem mentett változások:** Sárga, figyelmeztető ikonnal
- **Sikeres mentés:** Zöld, időbélyeggel ("Elmentve: X perce")

### 4. `app/api/admin/posts/draft/route.ts`

API végpont a piszkozatok kezeléséhez.

**Végpontok:**
- `POST /api/admin/posts/draft` - Piszkozat mentése
- `GET /api/admin/posts/draft?postId=X` - Piszkozat lekérése
- `DELETE /api/admin/posts/draft?postId=X` - Piszkozat törlése

**Megjegyzés:** Jelenleg in-memory tárolást használ. Éles környezetben Redis vagy adatbázis javasolt.

## Integráció

### Új poszt oldal (`app/admin/posts/new/page.tsx`)

```typescript
// Autosave hook inicializálása
const { isSaving, lastSaved, isDirty, clearDraft } = useAutosave({
  data: { title, content, excerpt },
  enabled: true
})

// Böngésző bezárás figyelmeztetés
useBeforeUnload(isDirty)

// Indikátor megjelenítése
<AutosaveIndicator isSaving={isSaving} lastSaved={lastSaved} isDirty={isDirty} />

// Sikeres mentés után piszkozat törlése
await clearDraft()
```

### Poszt szerkesztés oldal (`app/admin/posts/[id]/page.tsx`)

Ugyanaz a logika, de postId paraméterrel:
```typescript
const { isSaving, lastSaved, isDirty, clearDraft } = useAutosave({
  data: { title, content, excerpt, postId },
  enabled: true
})
```

## Beállítások

### Mentési időzítések

- **Debounce idő:** 5 másodperc (változás után)
- **Periodikus mentés:** 30 másodperc
- **Állapot frissítés:** 10 másodperc (időbélyeg frissítés)

Ezek testreszabhatók a hook paramétereiben:
```typescript
useAutosave({
  data,
  enabled: true,
  debounceMs: 3000,        // 3 másodperc debounce
  autoSaveIntervalMs: 60000 // 1 perces periodikus mentés
})
```

## Működési folyamat

1. **Adat változás:** Felhasználó ír a szerkesztőben
2. **Debounce trigger:** 5 másodperc inaktivitás után
3. **Dirty state:** `isDirty = true` → sárga jelző
4. **API hívás:** POST request a `/api/admin/posts/draft` végponthoz
5. **Saving state:** `isSaving = true` → narancssárga jelző, spinner
6. **Sikeres mentés:** `lastSaved = new Date()`, `isDirty = false` → zöld jelző
7. **Periodikus mentés:** 30 másodpercenként, ha van nem mentett változás

## Böngésző támogatás

- Modern böngészők `beforeunload` event-je
- A figyelmeztetés szöveg nem testreszabható (biztonsági okokból)
- Minden modern böngésző megjeleníti a saját figyelmeztetését

## Jövőbeli fejlesztések

1. **Perzisztens tárolás:** Redis vagy PostgreSQL alapú tárolás
2. **Felhasználó azonosítás:** Session alapú draft kezelés
3. **Draft helyreállítás:** UI opció a mentett piszkozatok betöltésére
4. **Ütközés kezelés:** Ha több böngészőben szerkesztik ugyanazt
5. **Offline támogatás:** Service Worker + IndexedDB
6. **Draft history:** Több verzió tárolása és visszaállítás

## Tesztelés

Az autosave funkcionalitás tesztelése:

1. Nyisd meg az új poszt oldalt: `/admin/posts/new`
2. Kezdj el írni a címbe vagy tartalomba
3. Várj 5 másodpercet inaktivitás után
4. Ellenőrizd a "Mentés..." majd "Elmentve: most" jelzőt
5. Próbálj meg bezárni az oldalt → figyelmeztetés jelenik meg
6. Mentsd el a posztot → "Elmentve" jelző eltűnik

## Hibaelhárítás

### Autosave nem működik

1. Ellenőrizd a böngésző konzolt hibákért
2. Ellenőrizd az API végpont elérhetőségét
3. Ellenőrizd, hogy az `enabled` paraméter `true`-e

### Többszörös mentések

- Normális működés: debounce + periodikus mentés
- Ha túl gyakori, növeld a `debounceMs` értéket

### Böngésző figyelmeztetés nem jelenik meg

- Modern böngészők csak akkor mutatják, ha tényleg van változás
- Ellenőrizd az `isDirty` állapotot
- Safari esetén speciális beállítások szükségesek lehetnek
