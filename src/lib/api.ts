import { supabase } from "@/integrations/supabase/client";
import axios from "axios";

const api = axios.create({
  baseURL: "https://asset-manager--ticketbts.replit.app",
  timeout: 15000,
});

export interface InventoryItem {
  id: number;
  city: string;
  venue: string;
  section: string;
  row: string;
  price: number;
  status: string;
  reserved_until: string | null;
}

export interface ReservePayload {
  inventoryId: string;
  fullName: string;
  email: string;
  phone: string;
  quantity: number;
  city: string;
  total: number;
}

export interface ReserveResponse {
  orderId: string;
  expiresAt: string;
  message?: string;
}

export const fetchInventory = async (): Promise<InventoryItem[]> => {
  const { data } = await api.get("/api/inventory");
  return Array.isArray(data) ? data : data.inventory ?? [];
};

function generateOrderId(city: string): string {
  const prefix = city.substring(0, 3).toUpperCase();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}

export const submitReservation = async (payload: ReservePayload): Promise<ReserveResponse> => {
  const orderId = generateOrderId(payload.city);

  const { error } = await supabase.from("reservations").insert({
    order_id: orderId,
    full_name: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    quantity: payload.quantity,
    city: payload.city,
    inventory_id: payload.inventoryId,
  });

  if (error) throw new Error(error.message);

  // Send Telegram notification (fire-and-forget, don't block the user)
  supabase.functions.invoke("telegram-notify", {
    body: {
      orderId,
      city: payload.city,
      fullName: payload.fullName,
      quantity: payload.quantity,
      total: payload.total,
      email: payload.email,
      phone: payload.phone,
    },
  }).catch((err) => console.error("Telegram notification failed:", err));

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  return { orderId, expiresAt };
};
