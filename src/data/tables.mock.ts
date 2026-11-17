import { RestaurantTable } from "@/types";

export const INITIAL_TABLES: RestaurantTable[] = [
  { id: "T01", label: "Table T01", capacity: 2, zone: "Indoor A", status: "available" },
  { id: "T02", label: "Table T02", capacity: 2, zone: "Indoor A", status: "available" },
  { id: "T03", label: "Table T03", capacity: 4, zone: "Indoor A", status: "available" },
  { id: "T04", label: "Table T04", capacity: 4, zone: "Indoor VIP", status: "active" }, // Default active table
  { id: "T05", label: "Table T05", capacity: 6, zone: "Indoor VIP", status: "available" },
  { id: "T06", label: "Table T06", capacity: 4, zone: "Terrace Garden", status: "available" },
  { id: "T07", label: "Table T07", capacity: 4, zone: "Terrace Garden", status: "available" },
  { id: "T08", label: "Table T08", capacity: 8, zone: "Terrace Garden", status: "available" },
  { id: "T09", label: "Table T09", capacity: 2, zone: "Bar Counter", status: "available" },
  { id: "T10", label: "Table T10", capacity: 2, zone: "Bar Counter", status: "available" },
];
