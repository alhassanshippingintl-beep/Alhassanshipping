export const STATUSES = [
  "registered",
  "picked_up",
  "in_transit",
  "at_customs",
  "customs_cleared",
  "out_for_delivery",
  "delivered",
  "on_hold",
  "returned",
] as const;

export type ShipmentStatus = (typeof STATUSES)[number];
export type ServiceType = "land" | "sea" | "air";

export const STATUS_META: Record<ShipmentStatus, { label: string; className: string }> = {
  registered: { label: "تم التسجيل", className: "bg-line text-muted" },
  picked_up: { label: "تم الاستلام", className: "bg-navy/10 text-navy" },
  in_transit: { label: "في الطريق", className: "bg-brand/10 text-brand" },
  at_customs: { label: "في الجمارك", className: "bg-navy/15 text-navy" },
  customs_cleared: { label: "تم التخليص", className: "bg-ok/15 text-ok" },
  out_for_delivery: { label: "خرج للتسليم", className: "bg-brand/15 text-brand" },
  delivered: { label: "تم التسليم", className: "bg-ok/15 text-ok" },
  on_hold: { label: "معلّقة", className: "bg-line text-muted" },
  returned: { label: "مرتجع", className: "bg-brand/10 text-brand" },
};

export const SERVICE_META: Record<ServiceType, { label: string }> = {
  land: { label: "شحن بري" },
  sea: { label: "شحن بحري" },
  air: { label: "شحن جوي" },
};

export function isStatus(v: string): v is ShipmentStatus {
  return (STATUSES as readonly string[]).includes(v);
}

export function isServiceType(v: string): v is ServiceType {
  return v === "land" || v === "sea" || v === "air";
}

export type Shipment = {
  id: string;
  senderName: string;
  senderPhone: string;
  senderCity: string;
  senderCountry: string;
  receiverName: string;
  receiverPhone: string;
  receiverCity: string;
  receiverCountry: string;
  origin: string;
  destination: string;
  serviceType: ServiceType;
  packageDesc: string;
  weightKg: number | null;
  pieces: number;
  status: ShipmentStatus;
  notes: string;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublicShipment = Shipment;

export type ShipmentEvent = {
  id: number;
  shipmentId: string;
  status: ShipmentStatus;
  location: string;
  note: string;
  createdBy: string | null;
  createdAt: string;
};

export type Inquiry = {
  id: number;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  createdAt: string;
};

export type CreateShipmentInput = {
  senderName: string;
  senderPhone: string;
  senderCity: string;
  senderCountry: string;
  receiverName: string;
  receiverPhone: string;
  receiverCity: string;
  receiverCountry: string;
  origin: string;
  destination: string;
  serviceType: string;
  packageDesc: string;
  weightKg: string;
  pieces: string;
  notes: string;
};
