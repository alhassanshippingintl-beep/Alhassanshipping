import {
  createError,
  defineEventHandler,
  getHeader,
  getQuery,
  getRouterParam,
  readBody,
  setHeader,
  setResponseStatus,
} from "h3";
import { getSql } from "../../../src/lib/db";
import { credentialsOk, issueStaffToken, verifyStaffToken } from "../../../src/lib/staff.server";

const statuses = [
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

const statusLabels: Record<string, string> = {
  registered: "تم التسجيل",
  picked_up: "تم الاستلام",
  in_transit: "في الطريق",
  at_customs: "في الجمارك",
  customs_cleared: "تم التخليص",
  out_for_delivery: "خرج للتسليم",
  delivered: "تم التسليم",
  on_hold: "معلّقة",
  returned: "مرتجع",
};

const serviceLabels: Record<string, string> = {
  land: "شحن بري",
  sea: "شحن بحري",
  air: "شحن جوي",
};

function error(statusCode: number, message: string): never {
  throw createError({ statusCode, statusMessage: message, data: { error: message } });
}

function maskPhone(phone: string) {
  if (!phone) return "****";
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 4) return "****";
  return `${phone.startsWith("+") ? "+" : ""}******${digits.slice(-3)}`;
}

function mapShipment(row: any, mask = false) {
  const serviceType = serviceLabels[row.service_type] ? row.service_type : "land";
  return {
    id: row.id,
    senderName: row.sender_name,
    senderPhone: mask ? maskPhone(row.sender_phone) : row.sender_phone,
    senderCity: row.sender_city ?? "",
    senderCountry: row.sender_country ?? "",
    receiverName: row.receiver_name,
    receiverPhone: mask ? maskPhone(row.receiver_phone) : row.receiver_phone,
    receiverCity: row.receiver_city ?? "",
    receiverCountry: row.receiver_country ?? "",
    origin: row.origin,
    destination: row.destination,
    serviceType,
    serviceLabel: serviceLabels[serviceType],
    packageDesc: row.package_desc ?? "",
    weightKg: row.weight_kg == null ? null : Number(row.weight_kg),
    pieces: Number(row.pieces) || 1,
    status: row.status,
    statusLabel: statusLabels[row.status] ?? row.status,
    notes: mask ? "" : row.notes ?? "",
    createdBy: mask ? null : row.created_by,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at ?? ""),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at ?? ""),
  };
}

function mapEvent(row: any) {
  return {
    id: Number(row.id),
    shipmentId: row.shipment_id,
    status: row.status,
    statusLabel: statusLabels[row.status] ?? row.status,
    location: row.location ?? "",
    note: row.note ?? "",
    createdBy: row.created_by,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at ?? ""),
  };
}

function bearer(event: any) {
  const value = getHeader(event, "authorization") ?? "";
  return value.startsWith("Bearer ") ? value.slice(7) : "";
}

async function requireStaff(event: any) {
  const user = await verifyStaffToken(bearer(event));
  if (!user) error(401, "Unauthorized");
  return user;
}

async function shipmentWithEvents(id: string, mask = false) {
  const sql = await getSql();
  const rows = await sql<any>`select * from shipments where id = ${id} limit 1`;
  if (!rows[0]) return null;
  const events = await sql<any>`select * from shipment_events where shipment_id = ${id} order by created_at asc, id asc`;
  return { shipment: mapShipment(rows[0], mask), events: events.map(mapEvent) };
}

export default defineEventHandler(async (event) => {
  setHeader(event, "access-control-allow-origin", "*");
  setHeader(event, "access-control-allow-headers", "Content-Type, Authorization");
  setHeader(event, "access-control-allow-methods", "GET, POST, PATCH, OPTIONS");
  if (event.method.toUpperCase() === "OPTIONS") {
    setResponseStatus(event, 204);
    return null;
  }
  const path = getRouterParam(event, "path") ?? "";
  const parts = path.split("/").filter(Boolean);
  const method = event.method.toUpperCase();

  if (method === "GET" && parts[0] === "health") {
    return { ok: true, service: "Al Hassan International Shipping", db: true };
  }

  if (method === "POST" && parts.join("/") === "auth/staff-login") {
    const body = (await readBody(event)) as { email?: string; username?: string; password?: string };
    const username = String(body?.username ?? body?.email ?? "").trim();
    const password = String(body?.password ?? "");
    if (!credentialsOk(username, password)) error(401, "Invalid staff credentials");
    const token = await issueStaffToken();
    return {
      token,
      user: { id: 1, email: username, name: "موظف الحسن", role: "staff", createdAt: new Date().toISOString() },
    };
  }

  if (method === "GET" && parts.join("/") === "auth/me") {
    await requireStaff(event);
    return { user: { id: 1, email: "alhassan", name: "موظف الحسن", role: "staff" } };
  }

  if (method === "GET" && parts[0] === "track" && parts[1]) {
    const result = await shipmentWithEvents(String(parts[1]).trim().toUpperCase(), true);
    return result ?? { shipment: null, events: [] };
  }

  if (parts[0] !== "shipments") error(404, "Not found");
  await requireStaff(event);
  const sql = await getSql();

  if (method === "GET" && parts.length === 1) {
    const query = getQuery(event) as Record<string, string | undefined>;
    const q = String(query.q ?? "").trim();
    const like = `%${q}%`;
    const rows = await sql<any>`
      select * from shipments
      where (${q} = '' or id ilike ${like} or sender_name ilike ${like}
        or receiver_name ilike ${like} or sender_phone ilike ${like}
        or receiver_phone ilike ${like} or origin ilike ${like} or destination ilike ${like})
      order by created_at desc limit 200
    `;
    return { shipments: rows.map((row) => mapShipment(row)) };
  }

  if (method === "GET" && parts.length === 2) {
    return (await shipmentWithEvents(String(parts[1]).trim().toUpperCase(), false)) ?? { shipment: null, events: [] };
  }

  if (method === "PATCH" && parts.length === 3 && parts[2] === "status") {
    const id = String(parts[1]).trim().toUpperCase();
    const body = (await readBody(event)) as { status?: string; location?: string; note?: string };
    const status = String(body?.status ?? "");
    if (!statuses.includes(status as (typeof statuses)[number])) error(400, "Invalid status");
    const existing = await sql<any>`select id from shipments where id = ${id} limit 1`;
    if (!existing[0]) error(404, "Shipment not found");
    await sql`insert into shipment_events (shipment_id, status, location, note, created_by) values (${id}, ${status}, ${String(body?.location ?? "")}, ${String(body?.note ?? "")}, ${"alhassan"})`;
    await sql`update shipments set status = ${status}, updated_at = now() where id = ${id}`;
    return (await shipmentWithEvents(id, false))!;
  }

  if (method === "POST" && parts.length === 1) {
    const body = (await readBody(event)) as Record<string, any>;
    const required = ["senderName", "senderPhone", "receiverName", "receiverPhone", "origin", "destination"];
    for (const key of required) if (!String(body?.[key] ?? "").trim()) error(400, `${key} required`);
    const serviceType = String(body?.serviceType ?? "land");
    if (!serviceLabels[serviceType]) error(400, "Invalid serviceType");
    const year = new Date().getFullYear();
    const seq = await sql<any>`insert into shipment_seq (year, last_n) values (${year}, 10000) on conflict (year) do update set last_n = shipment_seq.last_n + 1 returning last_n`;
    const id = `AH-${year}-${String(seq[0]?.last_n ?? 10000).padStart(5, "0")}`;
    await sql`insert into shipments (id, sender_name, sender_phone, sender_city, sender_country, receiver_name, receiver_phone, receiver_city, receiver_country, origin, destination, service_type, package_desc, weight_kg, pieces, status, notes, created_by) values (${id}, ${body.senderName}, ${body.senderPhone}, ${body.senderCity ?? ""}, ${body.senderCountry ?? ""}, ${body.receiverName}, ${body.receiverPhone}, ${body.receiverCity ?? ""}, ${body.receiverCountry ?? ""}, ${body.origin}, ${body.destination}, ${serviceType}, ${body.packageDesc ?? ""}, ${body.weightKg === "" || body.weightKg == null ? null : Number(body.weightKg)}, ${Number(body.pieces) || 1}, 'registered', ${body.notes ?? ""}, ${"alhassan"})`;
    await sql`insert into shipment_events (shipment_id, status, location, note, created_by) values (${id}, 'registered', ${body.origin}, 'تم تسجيل الشحنة في النظام', ${"alhassan"})`;
    return (await shipmentWithEvents(id, false))!;
  }

  setResponseStatus(event, 404);
  return { error: "Not found" };
});
