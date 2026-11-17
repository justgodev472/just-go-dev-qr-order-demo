import { CurrencyCode } from "@/types";

export function formatPrice(
  amountInLak: number,
  currency: CurrencyCode = "LAK",
  exchangeRates: Record<CurrencyCode, number> = { LAK: 1, THB: 620, USD: 21800 }
): string {
  if (currency === "LAK") {
    return `${amountInLak.toLocaleString("en-US")} ₭`;
  }

  if (currency === "THB") {
    const rate = exchangeRates.THB || 620;
    const amountThb = Math.round(amountInLak / rate);
    return `฿ ${amountThb.toLocaleString("en-US")}`;
  }

  if (currency === "USD") {
    const rate = exchangeRates.USD || 21800;
    const amountUsd = amountInLak / rate;
    return `$ ${amountUsd.toFixed(2)}`;
  }

  return `${amountInLak.toLocaleString("en-US")} ₭`;
}

export function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "--:--";
  }
}
