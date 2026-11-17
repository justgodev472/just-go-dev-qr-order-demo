import { MenuItem } from "./menu";

export type OrderItemStatus =
  | "pending" // ส่งเข้าครัวแล้ว รอครัวรับ
  | "accepted" // legacy: ข้อมูลเก่า — สเต็ปใหม่ครัวกดรับแล้วถือเป็น "cooking" ทันที
  | "cooking" // กำลังปรุง
  | "serving" // กำลังมาเสิร์ฟ
  | "served" // เสิร์ฟแล้ว
  | "cancelled";
export type TableOrderStatus = "active" | "requested_bill" | "paid" | "completed";
export type ServiceCallType = "waiter" | "water" | "spoon" | "bill";
export type CurrencyCode = "LAK" | "THB" | "USD";

export interface SelectedOption {
  groupId: string;
  optionId: string;
  name: string;
  priceExtra: number;
}

export interface CartItem {
  id: string; // unique item id in cart
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: SelectedOption[];
  specialInstructions?: string;
  unitPrice: number; // base + options
  subtotal: number;
}

export interface PlacedOrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: SelectedOption[];
  specialInstructions?: string;
  unitPrice: number;
  subtotal: number;
  status: OrderItemStatus;
  round: number;
}

export interface OrderRound {
  roundNumber: number;
  placedAt: string;
  items: PlacedOrderItem[];
}

export interface TableOrderRecord {
  orderId: string;
  orderNumber: string; // e.g. "ORD-042"
  tableId: string;
  guestCount: number;
  createdAt: string;
  rounds: OrderRound[];
  subtotal: number;
  serviceCharge: number; // 5%
  vat: number; // 7%
  total: number;
  status: TableOrderStatus;
  paymentMethod?: "onepay" | "cash" | "card";
}

export interface ServiceCallItem {
  /** id ของตัวเลือก เช่น "plate" / "water_cold" */
  id: string;
  quantity: number;
}

export interface ServiceCallDetails {
  /** id ของตัวเลือกที่ลูกค้าเลือก เช่น ["water_cold"] หรือ ["plate","spoon"] */
  kindIds?: string[];
  /** จำนวนแก้ว / จำนวนชิ้น (รูปแบบเดิม ใช้เมื่อไม่มี items) */
  quantity?: number;
  /** รายการย่อยพร้อมจำนวนของแต่ละอย่าง (รูปแบบใหม่) */
  items?: ServiceCallItem[];
  /** หมายเหตุอิสระจากลูกค้า */
  note?: string;
}

export interface ServiceCallRequest extends ServiceCallDetails {
  id: string;
  tableId: string;
  type: ServiceCallType;
  title: string;
  requestedAt: string;
  status: "pending" | "acknowledged" | "resolved";
}
