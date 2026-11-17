export type Locale = "lo" | "th" | "en";

export type MenuCategory = "all" | "recommended" | "food" | "drinks" | "desserts" | "appetizers";

export interface OptionItem {
  id: string;
  name: Record<Locale, string>;
  priceExtra: number; // in LAK
}

export interface OptionGroup {
  id: string;
  title: Record<Locale, string>;
  required: boolean;
  maxSelect: number; // 1 = Single Radio, >1 = Multiple Checkboxes
  options: OptionItem[];
}

export interface MenuItem {
  id: string;
  sku: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  category: MenuCategory;
  price: number; // Base price in LAK
  image: string;
  isPopular?: boolean;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  optionGroups?: OptionGroup[];
}
