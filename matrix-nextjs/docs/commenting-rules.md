# Kommentelési szabályok — Részletes útmutató

## Alapelv
Ez a projekt hosszú távon több fejlesztő által is karbantartható kell legyen.
Minden kódrészletnek önmagáért kell beszélnie. A "miért"-et kommentáld, ne a "mit"-et.

## Automatikus kommentelés meglévő kódhoz
Ha megnyitsz vagy módosítani készülsz egy fájlt és NINCS benne komment (vagy hiányos):
1. ELŐSZÖR egészítsd ki a kommenteket az alábbi szabályok szerint
2. UTÁNA végezd el a kért módosítást
3. A kommentelést és a módosítást KÜLÖN commitként kezeld ha lehetséges

## PHP osztályok (Model, Controller, Service, stb.)

### Osztály szintű PHPDoc
```php
/**
 * Manages dental equipment listings and their lifecycle.
 *
 * Handles CRUD operations, search filtering, and status transitions
 * for dental equipment advertisements. Works closely with
 * ListingImageService for media management.
 */
class ListingController extends Controller
```

### Metódus szintű PHPDoc
```php
/**
 * Filter listings by category and location.
 *
 * @param  ListingFilterRequest  $request  Validated filter parameters
 * @param  string|null  $category  Slug of the dental category
 * @return \Illuminate\View\View
 * @throws \App\Exceptions\InvalidFilterException
 */
public function filter(ListingFilterRequest $request, ?string $category = null): View
```

### Inline komment üzleti logikához
```php
// Lejárt hirdetéseket 30 nap után automatikusan archiváljuk,
// mert a felhasználói visszajelzések szerint ennyi idő után már nem relevánsak
if ($listing->expired_at->diffInDays(now()) > 30) {
    $listing->archive();
}
```

## Laravel specifikus példák

### Route fájlok
```php
// --- Publikus hirdetés böngészés (bejelentkezés nélkül elérhető) ---
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/{listing}', [ListingController::class, 'show']);

// --- Hirdetéskezelés (csak bejelentkezett felhasználók) ---
Route::middleware('auth')->group(function () {
    Route::resource('my-listings', MyListingController::class);
});
```

### Migration
```php
Schema::create('listings', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // Hirdető felhasználó
    $table->foreignId('category_id')->constrained();                // Fogorvosi kategória (eszköz, anyag, stb.)
    $table->string('title');                                        // Hirdetés címe, max 255 karakter
    $table->text('description');                                    // Részletes leírás, HTML engedélyezett
    $table->unsignedInteger('price')->nullable();                   // Ár forintban, null = egyedi ár
    $table->enum('condition', ['new', 'used', 'refurbished']);      // Eszköz állapota
    $table->enum('status', ['draft', 'active', 'expired', 'sold']);// Hirdetés státusza
    $table->timestamp('expires_at')->nullable();                    // Lejárat dátuma, null = korlátlan
    $table->timestamps();
    $table->softDeletes();                                          // Törölt hirdetések visszaállíthatók
});
```

### Form Request
```php
public function rules(): array
{
    return [
        'title' => 'required|string|max:255',
        'price' => 'nullable|integer|min:0|max:99999999', // Forintban, max ~100M Ft
        'category_id' => 'required|exists:categories,id', // Csak létező kategória választható
        'images' => 'array|max:10',                        // Max 10 kép hirdetésenként (szerver kapacitás miatt)
        'images.*' => 'image|max:5120',                    // Képenként max 5MB (WebP konverzió után ~1MB lesz)
    ];
}
```

## Blade template-ek

### Szekció jelölés
```blade
<!-- SZEKCIÓ: Hirdetés kártya lista kezdete -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    @forelse($listings as $listing)
        <!-- Egyedi hirdetés kártya -->
        <x-listing-card :listing="$listing" />
    @empty
        <!-- Üres állapot: nincs találat a szűrésre -->
        <x-empty-state message="Nincs találat a keresésre" />
    @endforelse
</div>
<!-- SZEKCIÓ: Hirdetés kártya lista vége -->

<!-- SZEKCIÓ: Lapozó kezdete -->
{{ $listings->links() }}
<!-- SZEKCIÓ: Lapozó vége -->
```

## JavaScript

### JSDoc példa
```javascript
/**
 * Initialize the listing image gallery with lightbox support.
 *
 * @param {string} containerId - DOM ID of the gallery container
 * @param {Object} options - Gallery configuration
 * @param {number} options.maxZoom - Maximum zoom level (default: 3)
 * @param {boolean} options.thumbnails - Show thumbnail strip (default: true)
 * @returns {Object} Gallery instance with destroy() method
 */
function initGallery(containerId, options = {}) {
    // Lazy load-oljuk a képeket, mert mobilon a sávszélesség kritikus
    const observer = new IntersectionObserver(loadImage, {
        rootMargin: '200px' // 200px-el a viewport előtt kezdjük a betöltést
    });
}
```

## Komment karbantartás

### Frissítési szabály
Ha módosítasz egy metódust, MINDIG ellenőrizd:
1. A PHPDoc még helyes? (paraméterek, return típus, leírás)
2. Az inline kommentek még érvényesek?
3. Van-e kapcsolódó komment más fájlokban ami szintén frissítendő?

### Duplikáció elkerülése
- Ha egy fájlban MÁR VAN PHPDoc komment, NE adj hozzá újat — FRISSÍTSD a meglévőt
- Mielőtt kommentet írsz, MINDIG ellenőrizd, van-e már komment az adott osztálynál/metódusnál
- Ha a meglévő komment pontatlan vagy hiányos, CSERÉLD ki (töröld a régit, írd az újat)
- SOHA ne legyen két PHPDoc blokk egymás alatt ugyanahhoz az elemhez
- Ugyanez vonatkozik Blade szekció-jelölőkre és JSDoc blokkokra is

```php
// ROSSZ — duplikált PHPDoc:
/**
 * Service for managing uniforms.
 */
/**
 * Service for managing uniform inventory, stock operations, and assignments.
 */
class UniformService

// JÓ — egy frissített PHPDoc:
/**
 * Service for managing uniform inventory, stock operations, employee assignments, and exit returns.
 */
class UniformService
```

### Anti-pattern: elavult komment
```php
// ROSSZ — a komment hazudik, mert a logika már változott:
// Csak aktív hirdetéseket kérdezünk le
$listings = Listing::withTrashed()->get(); // ← Ez MINDEN hirdetést lekér!

// JÓ — frissített komment:
// Törölt hirdetéseket is lekérjük az admin áttekintő nézethez
$listings = Listing::withTrashed()->get();
```

### Anti-pattern: árva komment
Törölt vagy áthelyezett kódhoz tartozó kommentet MINDIG távolítsd el.
```php
// ROSSZ — a kód már nincs, de a komment maradt:
class ListingController extends Controller
{
    // Kedvencekhez adás kezelése
    // Képfeltöltés AJAX endpoint
    // CSV export generálás

    public function index() { ... }
}

// JÓ — csak ahhoz van komment, ami tényleg létezik:
class ListingController extends Controller
{
    /**
     * Display paginated listing index with filters.
     */
    public function index() { ... }
}
```

```blade
{{-- ROSSZ — a szekció már nem létezik, de a jelölő maradt: --}}
<!-- SZEKCIÓ: Oldalsáv widget kezdete -->
<div class="main-content">
    {{-- itt már nincs oldalsáv, átszerveztük --}}
</div>
<!-- SZEKCIÓ: Oldalsáv widget vége -->

{{-- JÓ — a jelölő a tényleges tartalmat tükrözi: --}}
<!-- SZEKCIÓ: Fő tartalom kezdete -->
<div class="main-content">
    ...
</div>
<!-- SZEKCIÓ: Fő tartalom vége -->
```

### Ellenőrzési szabály
Módosítás vagy törlés után MINDIG végezd el:
1. A törölt kódhoz tartozó kommentek is törölve lettek?
2. Az áthelyezett kódnál a régi helyen maradt-e árva komment?
3. Blade szekció-jelölők párosak maradtak-e (kezdete + vége)?
4. PHPDoc @param/@return még egyezik-e a metódus szignatúrájával?

## Kommentelési nyelv összefoglaló

| Típus | Nyelv | Példa |
|-------|-------|-------|
| PHPDoc / JSDoc | Angol | `@param string $title Listing title` |
| Inline üzleti logika | Magyar | `// Lejárt hirdetés archiválása` |
| Blade szekció jelölő | Magyar | `<!-- SZEKCIÓ: Keresőmező -->` |
| TODO/FIXME | Angol | `// TODO: Add pagination` |
| Workaround magyarázat | Magyar | `// ISPConfig limit miatt...` |
