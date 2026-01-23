/**
 * MATRIX CBS - Referenciák oldal típusok
 * TypeScript típusdefiníciók a referencia adatokhoz
 */

// Státusz típusok
export type ReferenceStatus = 'aktiv' | 'lezart' | 'folyamatban';

// Kategória típusok
export type ReferenceCategory =
  | 'szakertesek'
  | 'megbizatasok'
  | 'kepzesek'
  | 'palyazatiras';

// Pályázat típus
export type PalyazatType = 'eu' | 'hazai';

// Időszak interfész
export interface Period {
  kezdet: string; // pl. "2023"
  veg?: string; // pl. "2026" vagy undefined ha folyamatban
}

// Szakértés (tanácsadói projekt)
export interface Szakertes {
  id: number;
  cim: string;
  leiras: string;
  idoszak: Period;
  statusz: ReferenceStatus;
  partner: string;
  projektKod?: string; // pl. "GINOP_PLUSZ.3.2.3-24"
}

// Megbízatás (hivatalos kinevezés/akkreditáció)
export interface Megbizatas {
  id: number;
  cim: string;
  leiras: string;
  idoszak: Period;
  statusz: ReferenceStatus;
  szervezet: string;
  pozicio: string;
  nyilvantartasiSzam?: string; // pl. "SZAK012"
  szakteruletek?: string[];
  icon: 'building' | 'search' | 'clipboard' | 'graduation' | 'shield' | 'badge';
}

// Képzés
export interface Kepzes {
  id: number;
  cim: string;
  leiras: string;
  idoszak: Period;
  tipusok: string[];
  resztvevokSzama?: string;
}

// Pályázat
export interface Palyazat {
  id: number;
  kod: string; // pl. "TAMOP-1.1.2"
  megnevezes: string;
  cel: string;
  tipus: PalyazatType;
}

// Hero statisztika
export interface HeroStatistic {
  value: string;
  suffix?: string;
  label: string;
}

// Tab konfiguráció
export interface TabConfig {
  id: ReferenceCategory;
  label: string;
  count: number;
}
