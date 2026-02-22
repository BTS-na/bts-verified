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

export const submitReservation = async (payload: ReservePayload): Promise<ReserveResponse> => {
  const { data } = await api.post("/api/reserve", payload);
  return data;
};
