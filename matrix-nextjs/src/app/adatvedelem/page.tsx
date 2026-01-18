import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { GradientMesh } from '@/components/effects/GradientMesh';

export const metadata: Metadata = {
  title: 'Adatvédelmi Tájékoztató',
  description: 'A MATRIX CBS Kft. adatvédelmi tájékoztatója a személyes adatok kezeléséről a GDPR előírásainak megfelelően.',
};

export default function AdatvedelemPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <GradientMesh variant="subtle" />

        <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-accent-red">
              Adatvédelmi Tájékoztató
            </h1>
            <p className="text-lg text-[var(--color-text-muted)]">
              Utolsó módosítás: 2025. január
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[var(--max-content-width)] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto prose prose-invert">
            <ScrollReveal>
              <div className="space-y-12">
                {/* 1. Adatkezelő */}
                <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                    1. Adatkezelő
                  </h2>
                  <div className="text-[var(--color-text-secondary)] space-y-2">
                    <p><strong>Név:</strong> MATRIX CBS Kft.</p>
                    <p><strong>Székhely:</strong> 6724 Szeged, Pulcz utca 3-2.</p>
                    <p><strong>Adószám:</strong> 13847951-2-06</p>
                    <p><strong>Cégjegyzékszám:</strong> 06-09-010970</p>
                    <p><strong>Felnőttképzési nyilvántartási szám:</strong> B/2020/000668</p>
                    <p><strong>E-mail:</strong> info@matrixcbs.com</p>
                    <p><strong>Telefon:</strong> +36 70 327 2146</p>
                  </div>
                </div>

                {/* 2. Az adatkezelés jogalapjai */}
                <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                    2. Az adatkezelés jogalapjai
                  </h2>
                  <p className="text-[var(--color-text-secondary)] mb-4">
                    Az adatkezelés az alábbi jogalapokon történik az Általános Adatvédelmi Rendelet (GDPR) 6. cikk (1) bekezdése szerint:
                  </p>
                  <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
                    <li><strong>Hozzájárulás (a) pont):</strong> Cookie-k használata, hírlevél feliratkozás</li>
                    <li><strong>Szerződés teljesítése (b) pont):</strong> Képzési szolgáltatások nyújtása, kapcsolatfelvétel</li>
                    <li><strong>Jogos érdek (f) pont):</strong> Weboldal biztonsága, visszaélések megelőzése</li>
                  </ul>
                </div>

                {/* 3. Kezelt adatok */}
                <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                    3. Kezelt személyes adatok köre
                  </h2>

                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mt-4 mb-2">
                    3.1. Kapcsolatfelvételi űrlap
                  </h3>
                  <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
                    <li>Név</li>
                    <li>E-mail cím</li>
                    <li>Telefonszám (opcionális)</li>
                    <li>Üzenet tartalma</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mt-6 mb-2">
                    3.2. Automatikusan gyűjtött technikai adatok
                  </h3>
                  <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
                    <li>IP cím</li>
                    <li>Böngésző típusa és verziója</li>
                    <li>Operációs rendszer</li>
                    <li>Látogatás időpontja</li>
                    <li>Megtekintett oldalak</li>
                    <li>Hivatkozó oldal (referrer)</li>
                  </ul>
                </div>

                {/* 4. Adatkezelés célja */}
                <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                    4. Adatkezelés célja
                  </h2>
                  <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
                    <li>Kapcsolatfelvételi kérelmek megválaszolása</li>
                    <li>Szolgáltatásokról való tájékoztatás</li>
                    <li>Szerződéskötés előkészítése és teljesítése</li>
                    <li>Weboldal működésének biztosítása</li>
                    <li>Statisztikai elemzések készítése (anonimizált formában)</li>
                    <li>Felhasználói élmény javítása</li>
                  </ul>
                </div>

                {/* 5. Adatkezelés időtartama */}
                <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                    5. Adatkezelés időtartama
                  </h2>
                  <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
                    <li><strong>Kapcsolatfelvételi adatok:</strong> A megkeresés megválaszolásától számított 2 év</li>
                    <li><strong>Szerződéses adatok:</strong> A szerződés megszűnésétől számított 8 év (számviteli törvény előírása)</li>
                    <li><strong>Technikai adatok (Google Analytics):</strong> 26 hónap</li>
                    <li><strong>Cookie hozzájárulás:</strong> 1 év</li>
                  </ul>
                </div>

                {/* 6. Cookie-k */}
                <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                    6. Cookie-k (sütik) használata
                  </h2>
                  <p className="text-[var(--color-text-secondary)] mb-4">
                    Weboldalunk cookie-kat használ a felhasználói élmény javítása és
                    statisztikai célok érdekében. A cookie-k elfogadásáról Ön dönt a
                    weboldal első látogatásakor megjelenő sávon keresztül.
                  </p>

                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mt-6 mb-2">
                    6.1. Szükséges cookie-k
                  </h3>
                  <p className="text-[var(--color-text-secondary)] mb-2">
                    Ezek a cookie-k a weboldal működéséhez elengedhetetlenek:
                  </p>
                  <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
                    <li><strong>matrixcbs_cookie_consent:</strong> Cookie hozzájárulás tárolása (1 év)</li>
                    <li><strong>session:</strong> Munkamenet azonosító (munkamenet végéig)</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mt-6 mb-2">
                    6.2. Statisztikai cookie-k (Google Analytics)
                  </h3>
                  <p className="text-[var(--color-text-secondary)] mb-2">
                    Csak az Ön hozzájárulásával aktiválódnak:
                  </p>
                  <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
                    <li><strong>_ga:</strong> Felhasználó megkülönböztetése (2 év)</li>
                    <li><strong>_gid:</strong> Felhasználó megkülönböztetése (24 óra)</li>
                    <li><strong>_gat:</strong> Kérések korlátozása (1 perc)</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mt-6 mb-2">
                    6.3. Marketing cookie-k
                  </h3>
                  <p className="text-[var(--color-text-secondary)]">
                    Facebook Messenger chat plugin működéséhez szükséges cookie-k, amelyek csak az Ön hozzájárulásával aktiválódnak.
                  </p>
                </div>

                {/* 7. Adattovábbítás */}
                <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                    7. Adattovábbítás
                  </h2>
                  <p className="text-[var(--color-text-secondary)] mb-4">
                    Személyes adatait harmadik félnek nem adjuk át, kivéve:
                  </p>
                  <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
                    <li>Ha erre jogszabály kötelez minket</li>
                    <li>Google Analytics szolgáltatás (anonimizált adatok, USA - EU-US Data Privacy Framework alapján)</li>
                    <li>Tárhelyszolgáltató (Magyarország)</li>
                  </ul>
                </div>

                {/* 8. Adatbiztonság */}
                <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                    8. Adatbiztonság
                  </h2>
                  <p className="text-[var(--color-text-secondary)] mb-4">
                    Az Ön személyes adatainak védelme érdekében az alábbi technikai és szervezési intézkedéseket alkalmazzuk:
                  </p>
                  <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
                    <li><strong>SSL/TLS titkosítás:</strong> A weboldalon keresztül küldött adatok titkosítva kerülnek továbbításra</li>
                    <li><strong>Tűzfal védelem:</strong> Szervereinket tűzfal védi az illetéktelen hozzáférés ellen</li>
                    <li><strong>Rendszeres frissítések:</strong> Szoftvereink naprakész biztonsági frissítésekkel rendelkeznek</li>
                    <li><strong>Hozzáférés korlátozás:</strong> Az adatokhoz csak az arra jogosult személyek férhetnek hozzá</li>
                    <li><strong>Rendszeres biztonsági mentések:</strong> Az adatok rendszeres mentése az adatvesztés megelőzése érdekében</li>
                  </ul>
                </div>

                {/* 9. Érintetti jogok */}
                <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                    9. Az Ön jogai
                  </h2>
                  <p className="text-[var(--color-text-secondary)] mb-4">
                    A GDPR alapján Ön jogosult:
                  </p>
                  <ul className="list-disc list-inside text-[var(--color-text-secondary)] space-y-2">
                    <li><strong>Tájékoztatáshoz való jog:</strong> Tájékoztatást kérni személyes adatainak kezeléséről</li>
                    <li><strong>Hozzáféréshez való jog:</strong> Másolatot kérni a kezelt adatairól</li>
                    <li><strong>Helyesbítéshez való jog:</strong> Kérni személyes adatainak helyesbítését</li>
                    <li><strong>Törléshez való jog:</strong> Kérni személyes adatainak törlését (&quot;elfeledtetéshez való jog&quot;)</li>
                    <li><strong>Korlátozáshoz való jog:</strong> Kérni az adatkezelés korlátozását</li>
                    <li><strong>Tiltakozáshoz való jog:</strong> Tiltakozni az adatkezelés ellen</li>
                    <li><strong>Adathordozhatósághoz való jog:</strong> Adatainak strukturált, géppel olvasható formátumban történő megkapása</li>
                    <li><strong>Hozzájárulás visszavonása:</strong> Hozzájárulását bármikor visszavonhatja</li>
                  </ul>
                  <p className="text-[var(--color-text-secondary)] mt-4">
                    Jogainak gyakorlásához kérjük, vegye fel velünk a kapcsolatot az info@matrixcbs.com e-mail címen.
                  </p>
                </div>

                {/* 10. Jogorvoslat */}
                <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                    10. Jogorvoslati lehetőségek
                  </h2>
                  <p className="text-[var(--color-text-secondary)] mb-4">
                    Amennyiben úgy érzi, hogy személyes adatainak kezelésével kapcsolatban
                    jogsérelem érte, panasszal fordulhat:
                  </p>
                  <div className="text-[var(--color-text-secondary)]">
                    <p><strong>Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH)</strong></p>
                    <p>Cím: 1055 Budapest, Falk Miksa utca 9-11.</p>
                    <p>Postacím: 1363 Budapest, Pf. 9.</p>
                    <p>Telefon: +36 1 391 1400</p>
                    <p>Fax: +36 1 391 1410</p>
                    <p>E-mail: ugyfelszolgalat@naih.hu</p>
                    <p>Weboldal: <a href="https://www.naih.hu" target="_blank" rel="noopener noreferrer" className="text-accent-red hover:underline">www.naih.hu</a></p>
                  </div>
                  <p className="text-[var(--color-text-secondary)] mt-4">
                    Továbbá lehetősége van bírósághoz fordulni. A per elbírálása a törvényszék hatáskörébe tartozik. A per - az érintett választása szerint - az érintett lakóhelye vagy tartózkodási helye szerinti törvényszék előtt is megindítható.
                  </p>
                </div>

                {/* 11. Tájékoztató módosítása */}
                <div className="p-8 rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                    11. Tájékoztató módosítása
                  </h2>
                  <p className="text-[var(--color-text-secondary)]">
                    Az Adatkezelő fenntartja magának a jogot, hogy jelen tájékoztatót egyoldalúan, a módosítást követő hatállyal módosítsa. Az Adatkezelő a honlap módosításokkal egységes szerkezetbe foglalt változatát a honlapon közzéteszi.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
