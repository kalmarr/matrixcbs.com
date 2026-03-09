# Fejlesztés utáni biztonsági ellenőrzési checklist

Minden fejlesztési feladat BEFEJEZÉSE után, commit ELŐTT végezd el az alábbi ellenőrzéseket.

## Automatikus ellenőrzés (parancsok)

### Route védelem
```bash
# Védtelen route-ok keresése (auth/middleware hiány)
php artisan route:list
```
Ellenőrizd: minden nem-publikus route-nak van-e `auth`, `verified`, `throttle` middleware-je.

### Veszélyes kód minták keresése
```bash
# Raw query, unescaped output, eval keresés
grep -rn "DB::raw\|{!!\|eval(" app/

# Debug kód maradt-e benne
grep -rn "dd(\|dump(\|var_dump(\|ray(" app/ resources/

# Nyitott kérdések áttekintése
grep -rn "TODO\|FIXME\|HACK\|XXX" app/

# Hardcoded jelszó/token/secret keresés
grep -rn "password.*=.*['\"].*['\"\|secret.*=.*['\"].*['\"\|token.*=.*['\"]" app/ config/
```

### Semgrep (ha elérhető)
```bash
# Automatikus biztonsági audit
semgrep --config=auto app/

# Vagy specifikus PHP/Laravel szabályokkal
semgrep --config=p/php app/
semgrep --config=p/laravel app/
```

## Manuális ellenőrzés

### Minden módosításnál
- [ ] Minden új route-hoz van-e middleware (auth, verified, throttle)?
- [ ] .env.example frissítve van-e ha új env változó került be?
- [ ] Nem maradt-e debug kód a commitban?

### Új Model létrehozásakor
- [ ] `$fillable` explicit felsorolva (NE `$guarded = []`)
- [ ] `$hidden` beállítva érzékeny mezőkre (password, remember_token, api_token, stb.)
- [ ] `$casts` beállítva ahol szükséges (date, boolean, encrypted, stb.)

### Új Form Request létrehozásakor
- [ ] `authorize()` metódus implementálva (nem csak `return true`)
- [ ] Validációs szabályok teljesek és specifikusak
- [ ] Fájl feltöltésnél: típus whitelist (`mimes:jpg,png,pdf`) + méret limit (`max:5120`)

### Új API endpoint létrehozásakor
- [ ] Rate limiting beállítva (`throttle` middleware)
- [ ] Response formázás Resource/Collection-nel
- [ ] Hibakezelés: megfelelő HTTP status kódok

### Új Controller metódusnál
- [ ] Policy/Gate jogosultságkezelés implementálva
- [ ] Input validálás Form Request-tel (nem a controller-ben)
- [ ] Redirect/response megfelelő

## Érzékeny területek (auth, payment, user data)

Ha a módosítás az alábbi területeket érinti, KÜLÖN ellenőrizd:

### CSRF védelem
- [ ] Minden POST/PUT/PATCH/DELETE form-ban van `@csrf`
- [ ] AJAX kérésekhez X-CSRF-TOKEN header beállítva

### SQL injection védelem
- [ ] Nincs `DB::raw()` user inputtal
- [ ] Nincs `whereRaw()` validálatlan adattal
- [ ] Minden lekérdezés Eloquent-tel vagy Query Builder-rel, paraméteres kötéssel

### XSS védelem
- [ ] Minden user-generated content `{{ }}` (escaped)
- [ ] `{!! !!}` csak ha a tartalom 100% biztonságos (pl. saját HTML generálás)
- [ ] Input sanitizálás Purifier-rel ha HTML engedélyezett

### Jogosultságkezelés
- [ ] Policy/Gate minden érzékeny művelethez
- [ ] Ne csak `auth` middleware — ellenőrizd, hogy az adott user ahhoz az erőforráshoz fér-e hozzá
- [ ] Soft-deleted rekordokhoz nincs publikus hozzáférés

### Fizetési integráció
- [ ] Webhook signature verification implementálva
- [ ] Összegek szerver-oldalon számítva (nem kliens-oldali adatból)
- [ ] Tranzakció logolva (összeg, user, időpont, státusz)
- [ ] Hibakezelés: sikertelen fizetés kezelése, visszaállítás
