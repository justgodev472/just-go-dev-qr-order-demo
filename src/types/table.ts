export type TableStatus = "available" | "active" | "billing";

export interface RestaurantTable {
  id: string; // e.g. "T01", "T04"
  label: string; // e.g. "Table T04"
  capacity: number; // e.g. 4
  zone: string; // e.g. "Indoor A", "Outdoor Terrace"
  status: TableStatus;
}
