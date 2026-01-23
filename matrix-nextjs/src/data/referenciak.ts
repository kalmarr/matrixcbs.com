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
  { value: '15', suffix: '+', label: 'év tapasztalat' },
  { value: '20', suffix: '+', label: 'pályázat írva' },
  { value: '7', suffix: '+', label: 'akkreditáció' },
  { value: '5', suffix: '+', label: 'aktív szakértői megbízás' },
];

// ===== TAB KONFIGURÁCIÓ =====

export const tabConfig: TabConfig[] = [
  { id: 'szakertesek', label: 'Szakértések', count: 10 },
  { id: 'megbizatasok', label: 'Megbízatások', count: 7 },
  { id: 'kepzesek', label: 'Képzések', count: 2 },
  { id: 'palyazatiras', label: 'Pályázatírás', count: 19 },
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
    leiras: 'Akkreditációs tanácsadás és felkészítés',
    idoszak: { kezdet: '2023', veg: '2026' },
    statusz: 'folyamatban',
    partner: 'Szegedi Tudományegyetem',
  },
  {
    id: 4,
    cim: 'Fogászati rendelő felépítése',
    leiras: 'Szervezetfejlesztési és üzleti tanácsadás',
    idoszak: { kezdet: '2023' },
    statusz: 'lezart',
    partner: 'Magán fogászati rendelő',
  },
  {
    id: 5,
    cim: 'Mezőhegyesi Technikum',
    leiras: 'Akkreditált Vizsgaközpont helyzettanulmány készítése',
    idoszak: { kezdet: '2022' },
    statusz: 'lezart',
    partner: 'Mezőhegyesi Technikum',
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
    cim: 'BM OKF Katasztrófavédelmi Vizsgaközpont',
    leiras: 'NAH akkreditáció kidolgozása és bevezetése',
    idoszak: { kezdet: '2020', veg: '2021' },
    statusz: 'lezart',
    partner: 'Belügyminisztérium OKF',
  },
  {
    id: 8,
    cim: 'BM ORFK Rendőrségi Vizsgaközpont',
    leiras: 'NAH akkreditáció előkészítése',
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
    leiras: 'Felsőfokú szakképzés vizsgálat és elemzés',
    idoszak: { kezdet: '2012' },
    statusz: 'lezart',
    partner: 'NMH',
  },
];

// ===== MEGBÍZATÁSOK =====

export const megbizatasok: Megbizatas[] = [
  {
    id: 1,
    cim: 'NSZI Akkreditált Szakértő',
    leiras: 'Szakképzési Vizsgaközpont Engedélyezési és Ellenőrzési Igazgatóság',
    idoszak: { kezdet: '2025' },
    statusz: 'aktiv',
    szervezet: 'NSZI',
    pozicio: 'Akkreditált Szakértő',
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
    cim: 'OKKI Vizsgafelügyelő',
    leiras: 'Ágazati alapvizsga elnöki névjegyzék - Oktatás és szociális ágazat',
    idoszak: { kezdet: '2021' },
    statusz: 'aktiv',
    szervezet: 'OKKI',
    pozicio: 'Vizsgafelügyelő',
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
    cim: 'BM Rendészeti Szakértő',
    leiras: 'Vezetőkiválasztási, Vezetőképzési és Továbbképzési Főosztály',
    idoszak: { kezdet: '2019' },
    statusz: 'aktiv',
    szervezet: 'BM',
    pozicio: 'Rendészeti Szakértő',
    szakteruletek: ['felnőttképzés', 'oktatás', 'kompetenciamérés'],
    icon: 'badge',
  },
  {
    id: 7,
    cim: 'BV Vizsgaközpont szakértő',
    leiras: 'Büntetés-végrehajtás Vizsgaközpont akkreditálási szakértő',
    idoszak: { kezdet: '2020', veg: '2022' },
    statusz: 'lezart',
    szervezet: 'BV',
    pozicio: 'Szakértő',
    icon: 'shield',
  },
];

// ===== KÉPZÉSEK =====

export const kepzesek: Kepzes[] = [
  {
    id: 1,
    cim: 'Szervezeti és vállalati képzések',
    leiras:
      'Igényre szabott belső képzések szervezése és lebonyolítása cégek és intézmények számára',
    idoszak: { kezdet: '2006', veg: '2022' },
    tipusok: [
      'Tanácsadó képzések',
      'HR képzések',
      'Vezetőképzések',
      'Soft skill tréningek',
    ],
    resztvevokSzama: '500+',
  },
  {
    id: 2,
    cim: 'Akkreditált felnőttképzési programok',
    leiras:
      'Minősített felnőttképzési programok fejlesztése és megvalósítása akkreditált képzőként',
    idoszak: { kezdet: '2010', veg: '2020' },
    tipusok: [
      'OKJ képzések',
      'Szakmai továbbképzések',
      'Kompetenciafejlesztő képzések',
    ],
    resztvevokSzama: '1000+',
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
    megnevezes: 'Munkaerő-piaci szolgáltatások fejlesztése',
    cel: 'Szolgáltatási kapacitás bővítése',
    tipus: 'eu',
  },
  {
    id: 4,
    kod: 'TÁMOP-2.4.8',
    megnevezes: 'Hátrányos helyzetű célcsoportok képzése',
    cel: 'Társadalmi felzárkóztatás',
    tipus: 'eu',
  },
  {
    id: 5,
    kod: 'TÁMOP-5.3.1',
    megnevezes: 'Szociális szolgáltatások fejlesztése',
    cel: 'Ellátórendszer modernizálása',
    tipus: 'eu',
  },
  {
    id: 6,
    kod: 'TÁMOP-6.1.2',
    megnevezes: 'Egészségügyi ellátórendszer fejlesztése',
    cel: 'Egészségügyi kapacitás növelése',
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
    kod: 'GINOP-1.2.1',
    megnevezes: 'KKV termelési kapacitás bővítés',
    cel: 'Termelékenység növelése',
    tipus: 'eu',
  },
  {
    id: 10,
    kod: 'GINOP-1.2.2',
    megnevezes: 'Mikro-, kis- és középvállalkozások technológiai fejlesztése',
    cel: 'Technológiai modernizáció',
    tipus: 'eu',
  },
  {
    id: 11,
    kod: 'GINOP-5.1.1',
    megnevezes: 'Út a munkaerőpiacra program',
    cel: 'Foglalkoztatás elősegítése',
    tipus: 'eu',
  },
  {
    id: 12,
    kod: 'GINOP-5.2.4',
    megnevezes: 'Fiatalok vállalkozóvá válásának támogatása',
    cel: 'Vállalkozásfejlesztés',
    tipus: 'eu',
  },
  {
    id: 13,
    kod: 'GINOP-5.3.5',
    megnevezes: 'Munkahelyi képzések támogatása nagyvállalatok részére',
    cel: 'Munkavállalói kompetenciafejlesztés',
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
    megnevezes: 'Falusi csok és közösségi tér fejlesztés',
    cel: 'Vidékfejlesztés támogatása',
    tipus: 'hazai',
  },
  {
    id: 17,
    kod: 'NEAK',
    megnevezes: 'Nemzeti Egészségbiztosítási Alapkezelő',
    cel: 'Egészségügyi szolgáltatások finanszírozása',
    tipus: 'hazai',
  },
  {
    id: 18,
    kod: 'NKA',
    megnevezes: 'Nemzeti Kulturális Alap',
    cel: 'Kulturális projektek támogatása',
    tipus: 'hazai',
  },
  {
    id: 19,
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
