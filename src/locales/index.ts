import { lo } from "./lo";
import { th } from "./th";
import { en } from "./en";
import { Locale, QrOrderDictionary } from "./types";

export const dictionaries: Record<Locale, QrOrderDictionary> = {
  lo,
  th,
  en,
};

export * from "./types";
