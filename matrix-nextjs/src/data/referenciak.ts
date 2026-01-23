/**
 * MATRIX CBS - Referenciák statikus adatok
 * UX koncepció alapján összeállított referencia adatok
 */

import type {
  Szakertes,
  Megbizatas,
  Kepzes,
  Palyazat,
  HeroStatistic,
  TabConfig,
} from '@/types/referenciak';

// ===== HERO STATISZTIKÁK =====

export const heroStatistics: HeroStatistic[] = [
  { value: '20', suffix: '+', label: 'év tapasztalat' },
  { value: '100', suffix: '+', label: 'pályázat írás' },
  { value: '15', suffix: '+', label: 'év akkreditációs tapasztalat' },
  { value: '15', suffix: '+', label: 'aktív szakértői év' },
];

// ===== TAB KONFIGURÁCIÓ =====

export const tabConfig: TabConfig[] = [
  { id: 'szakertesek', label: 'Kiemelt szakértői projektek', count: 10 },
  { id: 'megbizatasok', label: 'Megbízatások', count: 7 },
  { id: 'kepzesek', label: 'Képzések', count: 2 },
  { id: 'palyazatiras', label: 'Pályázatírás', count: 21 },
];

// ===== SZAKÉRTÉSEK =====

export const szakertesek: Szakertes[] = [
  {
    id: 1,
    cim: 'Fináncokért Alapítvány',
    leiras: 'NEAO-KP-1-2024 pályázati projekt szakértői támogatása',
    idoszak: { kezdet: '2025' },
    statusz: 'aktiv',
    partner: 'Fináncokért Alapítvány',
    projektKod: 'NEAO-KP-1-2024',
  },
  {
    id: 2,
    cim: 'Vám- és Pénzügyi Dolgozók Szakszervezete',
    leiras: 'GINOP_PLUSZ.3.2.3-24 projekt szakértői feladatok',
    idoszak: { kezdet: '2025' },
    statusz: 'aktiv',
    partner: 'VPDSZ',
    projektKod: 'GINOP_PLUSZ.3.2.3-24',
  },
  {
    id: 3,
    cim: 'SZTE Szakképzési Vizsgaközpont',
    leiras: 'Akkreditációs/ Engedélyeztetési tanácsadás és felkészítés',
    idoszak: { kezdet: '2023', veg: '2026' },
    statusz: 'aktiv',
    partner: 'Szegedi Tudományegyetem',
  },
  {
    id: 4,
    cim: 'Fogászati rendelő felépítése',
    leiras: 'Szervezetfejlesztési és üzleti tanácsadás',
    idoszak: { kezdet: '2023' },
    statusz: 'lezart',
    partner: 'Trendo Dental magán fogászati rendelő',
  },
  {
    id: 5,
    cim: 'Mezőhegyesi Technikum, Szakképző Iskola és Kollégium',
    leiras: '„Akkreditált Vizsgaközpont létesítését megalapozó helyzettanulmány és jövőbeni perspektívák bemutatása" tanulmány',
    idoszak: { kezdet: '2022' },
    statusz: 'lezart',
    partner: 'Mezőhegyesi Technikum, Szakképző Iskola és Kollégium',
  },
  {
    id: 6,
    cim: 'Munkástanács Országos Szövetsége',
    leiras: 'GINOP-5.3.5.-18-00054 projekt szakértői támogatása',
    idoszak: { kezdet: '2021', veg: '2022' },
    statusz: 'lezart',
    partner: 'MOSZ',
    projektKod: 'GINOP-5.3.5.-18-00054',
  },
  {
    id: 7,
    cim: 'Belügyminisztérium Országos Katasztrófavédelmi Főigazgatóság Katasztrófavédelmi Vizsgaközpont',
    leiras: 'NAH Személytanúsító- Vizsgaközpont akkreditációjának kidolgozása, szakértői feladatok ellátása, NAH akkreditációs eljárás lefolytatása',
    idoszak: { kezdet: '2020', veg: '2021' },
    statusz: 'lezart',
    partner: 'Belügyminisztérium OKF',
  },
  {
    id: 8,
    cim: 'Belügyminisztérium Országos Rendőr-Főkapitányság Rendőrségi Oktatási és Kiképző Központ független akkreditált Vizsgaközpont',
    leiras: 'NAH Személytanúsító- Vizsgaközpont akkreditációjának kidolgozása, szakértői feladatok ellátása, NAH akkreditációs eljárás lefolytatása',
    idoszak: { kezdet: '2020', veg: '2021' },
    statusz: 'lezart',
    partner: 'Belügyminisztérium ORFK',
  },
  {
    id: 9,
    cim: 'Skoll Learning Technologies',
    leiras: 'E-learning tananyagok szakmai lektorálása',
    idoszak: { kezdet: '2020' },
    statusz: 'lezart',
    partner: 'Skoll Learning Technologies',
  },
  {
    id: 10,
    cim: 'Nemzeti Munkaügyi Hivatal',
    leiras: 'NMHA felsőfokú szakképzés munkaerő-piaci relevancia vizsgálata és szakmai gyakorlati koncepció elkészítése',
    idoszak: { kezdet: '2012' },
    statusz: 'lezart',
    partner: 'NMH',
  },
];

// ===== MEGBÍZATÁSOK =====

export const megbizatasok: Megbizatas[] = [
  {
    id: 1,
    cim: 'NSZFH Hatósági Szakértő',
    leiras: 'Nemzeti Szakképzési és Felnőttképzési Igazgatóság Akkreditált Szakképzési Vizsgaközpont Engedélyezési és Ellenőrzési Igazgatóság',
    idoszak: { kezdet: '2025' },
    statusz: 'aktiv',
    szervezet: 'NSZFH',
    pozicio: 'Hatósági Szakértő',
    nyilvantartasiSzam: 'SZAK012',
    icon: 'building',
  },
  {
    id: 2,
    cim: 'NAH Szakértő',
    leiras: 'Személytanúsítás - Vizsgaközpont akkreditálási szakértő',
    idoszak: { kezdet: '2020', veg: '2024' },
    statusz: 'lezart',
    szervezet: 'NAH',
    pozicio: 'Szakértő',
    icon: 'search',
  },
  {
    id: 3,
    cim: 'Országos Kereskedelmi és Iparkamara Vizsgafelügyelő és Elnök',
    leiras: 'Vizsgafelügyelői és Ágazati vizsga elnöki feladatok ellátása oktatás és szociális ágazatban',
    idoszak: { kezdet: '2021' },
    statusz: 'aktiv',
    szervezet: 'OKKI',
    pozicio: 'Vizsgafelügyelő és Elnök',
    icon: 'clipboard',
  },
  {
    id: 4,
    cim: 'IKK Minősített Szakértő',
    leiras: 'Innovatív és Képzéstámogató Központ Zrt. minősített szakértő',
    idoszak: { kezdet: '2021' },
    statusz: 'aktiv',
    szervezet: 'IKK',
    pozicio: 'Minősített Szakértő',
    nyilvantartasiSzam: 'IKK-MSZNY/2021/2',
    icon: 'graduation',
  },
  {
    id: 5,
    cim: 'BM OKF Minőségirányítási vezető',
    leiras: 'Oktatási Főosztály és Katasztrófavédelmi Vizsgaközpont',
    idoszak: { kezdet: '2021' },
    statusz: 'aktiv',
    szervezet: 'BM OKF',
    pozicio: 'Minőségirányítási vezető',
    icon: 'shield',
  },
  {
    id: 6,
    cim: 'BM RVVTF Minősített program szakértő',
    leiras: 'Rendészeti Vezetőkiválasztási, Vezetőképzési és Továbbképzési Főosztály',
    idoszak: { kezdet: '2019' },
    statusz: 'aktiv',
    szervezet: 'BM',
    pozicio: 'Minősített program szakértő',
    szakteruletek: ['felnőttképzés', 'vezetői / állományi kompetenciamérés', 'tananyagfejlesztés'],
    icon: 'badge',
  },
  {
    id: 7,
    cim: 'Felnőttképzési szakértő',
    leiras: 'Büntetés-végrehajtás Vizsgaközpont akkreditálási szakértő',
    idoszak: { kezdet: '2021', veg: '2023' },
    statusz: 'lezart',
    szervezet: 'BV',
    pozicio: 'Felnőttképzési szakértő',
    icon: 'shield',
  },
];

// ===== KÉPZÉSEK =====

export const kepzesek: Kepzes[] = [
  {
    id: 1,
    cim: 'Idegen nyelvi képzések',
    leiras:
      'Angol, német, olasz és francia nyelv oktatása lakosság és cégek számára',
    idoszak: { kezdet: '2006', veg: '2013' },
    tipusok: [
      'Angol nyelv',
      'Német nyelv',
      'Olasz nyelv',
      'Francia nyelv',
    ],
    resztvevokSzama: '5000+',
  },
  {
    id: 2,
    cim: 'Minősített továbbképzési programok',
    leiras:
      'Belügyminisztérium Rendészeti Vezetőkiválasztási, Vezetőképzési és Továbbképzési Főosztály keretében minősített továbbképzési programok kidolgozása, engedélyeztetése, képzések szervezése, megvalósítása rendvédelmi szervek részére, országosan',
    idoszak: { kezdet: '2015', veg: '2022' },
    tipusok: [
      'Büntetésvégrehajtás',
      'Rendőrség',
      'Katasztrófavédelem',
    ],
    resztvevokSzama: '20 000+',
  },
];

// ===== PÁLYÁZATOK =====

export const palyazatokEu: Palyazat[] = [
  {
    id: 1,
    kod: 'TÁMOP-1.1.2',
    megnevezes: 'Munkaerő-piaci kulcskompetenciák fejlesztése',
    cel: 'Foglalkoztathatóság javítása',
    tipus: 'eu',
  },
  {
    id: 2,
    kod: 'TÁMOP-2.1.2',
    megnevezes: 'Idegen nyelvi és informatikai kompetenciák fejlesztése',
    cel: 'Munkaerő-piaci esélyek növelése',
    tipus: 'eu',
  },
  {
    id: 3,
    kod: 'TÁMOP-2.1.3',
    megnevezes: 'Munkahelyi képzések támogatása mikro-kis-, középvállalkozások számára a konvergencia régiókban',
    cel: 'Munkahelyi képzések támogatása',
    tipus: 'eu',
  },
  {
    id: 4,
    kod: 'TÁMOP-2.3.4',
    megnevezes: 'Gyakornoki program a tanulószerződés keretében tanult pályakezdők támogatására',
    cel: 'Új munkahelyek létrehozásának támogatására',
    tipus: 'eu',
  },
  {
    id: 5,
    kod: 'TÁMOP-2.4.3',
    megnevezes: 'Szociális gazdaság fejlesztése',
    cel: 'Szociális szövetkezetek megerősítése',
    tipus: 'eu',
  },
  {
    id: 6,
    kod: 'TÁMOP-6.1.2',
    megnevezes: 'Egészségre nevelés és személetformálás',
    cel: 'Életmódprogramok, közösségi rendezvények, szűrések támogatása',
    tipus: 'eu',
  },
  {
    id: 7,
    kod: 'GOP-2.1.1',
    megnevezes: 'KKV fejlesztési támogatás',
    cel: 'Versenyképesség növelése',
    tipus: 'eu',
  },
  {
    id: 8,
    kod: 'GOP-2.2.1',
    megnevezes: 'Vállalati folyamatmenedzsment támogatás',
    cel: 'Hatékonyság javítása',
    tipus: 'eu',
  },
  {
    id: 9,
    kod: 'GOP-3.3.2',
    megnevezes: 'Versenyképes üzleti környezet fejlesztése',
    cel: 'A vállalkozások piaci megjelenésének és a piaci versenyben való eredményes részvételének erősítése',
    tipus: 'eu',
  },
  {
    id: 10,
    kod: 'GOP-3.3.3',
    megnevezes: 'Mikro-, kis-, és középvállalkozások piaci megjelenésének támogatása',
    cel: 'Vállalkozások nemzetközi piaci megjelenésének ösztönzése, támogatása',
    tipus: 'eu',
  },
  {
    id: 11,
    kod: 'GINOP-1.2.1',
    megnevezes: 'KKV termelési kapacitás bővítés',
    cel: 'Termelékenység növelése',
    tipus: 'eu',
  },
  {
    id: 12,
    kod: 'GINOP-1.3.1',
    megnevezes: 'Mikro-, kis- és középvállalkozások piaci megjelenésének támogatása',
    cel: 'A KKV-k belföldi és nemzetközi piaci megjelenésének, márkaismertségének és exportképességének növelése',
    tipus: 'eu',
  },
  {
    id: 13,
    kod: 'GINOP-2.1.7',
    megnevezes: 'Prototípus, termék-, technológia- és szolgáltatásfejlesztés',
    cel: 'KKV-k kutatás-fejlesztési eredményeinek, innovatív termékek, technológiák támogatása',
    tipus: 'eu',
  },
  {
    id: 14,
    kod: 'GINOP_PLUSZ.3.2.3',
    megnevezes: 'Munkahelyi képzések támogatása',
    cel: 'Digitális és zöld kompetenciák fejlesztése',
    tipus: 'eu',
  },
];

export const palyazatokHazai: Palyazat[] = [
  {
    id: 15,
    kod: 'NEA',
    megnevezes: 'Nemzeti Együttműködési Alap',
    cel: 'Civil szervezetek működési támogatása',
    tipus: 'hazai',
  },
  {
    id: 16,
    kod: 'Magyar Falu Program',
    megnevezes: 'A 5000 fő alatti kistelepülések hátrányainak enyhítése',
    cel: 'Életminőség javítása',
    tipus: 'hazai',
  },
  {
    id: 17,
    kod: 'FSZK',
    megnevezes: 'Fogyatékos személyek esélyegyenlőségéért Kht. által kiírt különféle támogatási programok',
    cel: 'Fogyatékossággal élő személyek esélyegyenlőségének, önálló életvitelének, társadalmi inklúziójának elősegítése',
    tipus: 'hazai',
  },
  {
    id: 18,
    kod: 'CSP-CSBM',
    megnevezes: 'Családbarát munkahelyek kialakításának és fejlesztésének támogatása',
    cel: 'A családbarát munkahelyek kialakításának, fejlesztésének és jó gyakorlatainak támogatása',
    tipus: 'hazai',
  },
  {
    id: 19,
    kod: 'IFJ-GY',
    megnevezes: '„Újratervezés!" – Gyermek és Ifjúsági Alapprogram',
    cel: 'Gyermek- és ifjúsági közösségek programjainak, közösségépítő eseményeinek, képzéseknek támogatása',
    tipus: 'hazai',
  },
  {
    id: 20,
    kod: 'NKA',
    megnevezes: 'Nemzeti Kulturális Alap',
    cel: 'Kulturális projektek támogatása',
    tipus: 'hazai',
  },
  {
    id: 21,
    kod: 'NFA',
    megnevezes: 'Nemzeti Foglalkoztatási Alap',
    cel: 'Foglalkoztatási programok támogatása',
    tipus: 'hazai',
  },
];

// Összevont pályázatok export
export const palyazatok = {
  eu: palyazatokEu,
  hazai: palyazatokHazai,
};
