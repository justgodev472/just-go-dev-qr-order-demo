import { Locale } from "@/locales";

export interface ServiceOption {
  id: string;
  name: Record<Locale, string>;
}

/** ຊະນິດນ້ຳທີ່ລູກຄ້າເລືອກໄດ້ຕອນກົດ "ເຕີມນ້ຳ" */
export const WATER_KINDS: ServiceOption[] = [
  {
    id: "water_cold",
    name: { lo: "ນ້ຳດື່ມເຢັນ", th: "น้ำดื่มเย็น", en: "Cold water" },
  },
  {
    id: "water_ice",
    name: { lo: "ນ້ຳແຂງ", th: "น้ำแข็ง", en: "Ice" },
  },
  {
    id: "water_hot",
    name: { lo: "ນ້ຳຮ້ອນ", th: "น้ำร้อน", en: "Hot water" },
  },
  {
    id: "water_broth",
    name: { lo: "ນ້ຳຊຸບ", th: "น้ำซุป", en: "Soup broth" },
  },
];

/** ສິ່ງທີ່ລູກຄ້າຂໍເພີ່ມ (ຈານ / ບ່ວງ / ສ້ອມ / ຖ້ວຍ) */
export const CUTLERY_KINDS: ServiceOption[] = [
  { id: "plate", name: { lo: "ຈານ", th: "จาน", en: "Plate" } },
  { id: "spoon", name: { lo: "ບ່ວງ", th: "ช้อน", en: "Spoon" } },
  { id: "fork", name: { lo: "ສ້ອມ", th: "ส้อม", en: "Fork" } },
  { id: "bowl", name: { lo: "ຖ້ວຍ", th: "ถ้วย", en: "Bowl" } },
];

const ALL_OPTIONS = [...WATER_KINDS, ...CUTLERY_KINDS];

export function findServiceOption(id: string): ServiceOption | undefined {
  return ALL_OPTIONS.find((option) => option.id === id);
}

/** ດຶງຊື່ຕົວເລືອກຕາມພາສາທີ່ໃຊ້ຢູ່; ຖ້າບໍ່ພົບໃຫ້ຄືນ id ເດີມ */
export function serviceOptionName(id: string, locale: Locale): string {
  return findServiceOption(id)?.name[locale] ?? id;
}
