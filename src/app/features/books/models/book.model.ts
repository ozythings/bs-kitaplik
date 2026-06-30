export type Durum = "okunacak" | "okunuyor" | "okundu";

export interface Book {
  id: number;
  ad: string;
  yazar: string;
  tur?: string;
  durum: Durum;
  sayfaSayisi?: number;
  puan?: number;
  not?: string;
  eklenmeTarihi: string;
}
