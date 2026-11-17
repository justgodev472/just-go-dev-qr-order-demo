import { RestaurantConfig } from "@/types";

export const INITIAL_RESTAURANT_CONFIG: RestaurantConfig = {
  name: {
    lo: "JustGoDev Bistro & Cafe",
    th: "JustGoDev Bistro & Cafe",
    en: "JustGoDev Bistro & Cafe",
  },
  branch: {
    lo: "ສາຂາ ນະຄອນຫຼວງວຽງຈັນ (Vientiane Center)",
    th: "สาขา นครหลวงเวียงจันทน์ (Vientiane Center)",
    en: "Vientiane Flagship Center",
  },
  address: {
    lo: "ຖະໜົນລ້ານຊ້າງ, ເມືອງຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ",
    th: "ถนนล้านช้าง, เมืองจันทบุรี, นครหลวงเวียงจันทน์",
    en: "Lane Xang Ave, Chanthabouly, Vientiane, Laos",
  },
  phone: "+856 20 5555 8899",
  wifiSsid: "JustGoDev_Guest_WiFi",
  wifiPassword: "enjoydining2026",
  serviceChargeRate: 0.05, // 5%
  vatRate: 0.07, // 7%
  exchangeRates: {
    LAK: 1,
    THB: 620, // 1 THB = 620 LAK
    USD: 21800, // 1 USD = 21,800 LAK
  },
};
