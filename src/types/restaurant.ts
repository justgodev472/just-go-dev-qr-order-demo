import { Locale } from "./menu";
import { CurrencyCode } from "./order";

export interface RestaurantConfig {
  name: Record<Locale, string>;
  branch: Record<Locale, string>;
  address: Record<Locale, string>;
  phone: string;
  wifiSsid: string;
  wifiPassword: string;
  serviceChargeRate: number; // 0.05 (5%)
  vatRate: number; // 0.07 (7%)
  exchangeRates: Record<CurrencyCode, number>;
}
