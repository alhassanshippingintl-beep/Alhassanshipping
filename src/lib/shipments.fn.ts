import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { staffMiddleware } from "@/lib/staff-middleware";
import { toIso, toNumber, maskPhone, requireText } from "@/lib/utils";
import {
  isServiceType,
  isStatus,
  type CreateShipmentInput,
  type Inquiry,
  type PublicShipment,
  type ServiceType,
  type Shipment,
  type ShipmentEvent,
  type ShipmentStatus,
} from "@/lib/shipments";

type ShipmentRow = {
  id: string;
  sender_name: string;
  sender_phone: string;
  sender_city: string;
  sender_country: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_city: string;
  receiver_country: string;
  origin: string;
  destination: string;
  service_type: string;
  package_desc: string;
  weight_kg: unknown;
  pieces: number;
  status: string;
  notes: string;
  created_by: string | null;
  created_at: unknown;
  updated_at: unknown;
};

type EventRow = {
  id: number;
  shipment_id: string;
  status: string;
  location: string;
  note: string;
  created_by: string | null;
  created_at: unknown;
};

function mapShipment(row: ShipmentRow): Shipment {
  const serviceType: ServiceType = isServiceType(row.service_type) ? row.service_type : "land";
  const status: ShipmentStatus = isStatus(row.status) ? row.status : "registered";
  return {
    id: row.id,
    senderName: row.sender_name,
    senderPhone: row.sender_phone,
    senderCity: row.sender_city,
    senderCountry: row.sender_country,
    receiverName: row.receiver_name,
    receiverPhone: row.receiver_phone,
    receiverCity: row.receiver_city,
    receiverCountry: row.receiver_country,
    origin: row.origin,
    destination: row.destination,
    serviceType,
    packageDesc: row.package_desc,
    weightKg: toNumber(row.weight_kg),
    pieces: Number(row.pieces) || 1,
    status,
    notes: row.notes ?? "",
    createdBy: row.created_by,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function mapPublic(row: ShipmentRow): PublicShipment {
  const s = mapShipment(row);
  return {
    ...s,
    senderPhone: maskPhone(s.senderPhone),
    receiverPhone: maskPhone(s.receiverPhone),
    notes: "",
    createdBy: null,
  };
}

function mapEvent(row: EventRow): ShipmentEvent {
  return {
    id: Number(row.id),
    shipmentId: row.shipment_id,
    status: isStatus(row.status) ? row.status : "registered",
    location: row.location ?? "",
    note: row.note ?? "",
    createdBy: row.created_by,
    createdAt: toIso(row.created_at),
  };
}

export const trackShipment = createServerFn({ method: "GET" })
  .validator((data: { trackingNumber: string }) => ({
    trackingNumber: String(data.trackingNumber ?? "").trim().toUpperCase(),
  }))
  .handler(async ({ data }) => {
    if (!data.trackingNumber) return { shipment: null, events: [] as ShipmentEvent[] };
    const sql = await getSql();
    const rows = await sql<ShipmentRow>`
      select * from shipments where id = ${data.trackingNumber} limit 1
    `;
    const row = rows[0];
    if (!row) return { shipment: null, events: [] as ShipmentEvent[] };
    const events = await sql<EventRow>`
      select * from shipment_events
      where shipment_id = ${row.id}
      order by created_at asc, id asc
    `;
    return { shipment: mapPublic(row), events: events.map(mapEvent) };
  });

export const getPublicStats = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<{ total: number; active: number; delivered: number }>`
    select
      count(*)::int as total,
      count(*) filter (where status not in ('delivered', 'returned'))::int as active,
      count(*) filter (where status = 'delivered')::int as delivered
    from shipments
  `;
  return rows[0] ?? { total: 0, active: 0, delivered: 0 };
});

export const listShipments = createServerFn({ method: "GET" })
  .middleware([staffMiddleware])
  .validator((data: { q?: string; status?: string } = {}) => ({
    q: String(data.q ?? "").trim(),
    status: String(data.status ?? "").trim(),
  }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const q = data.q;
    const status = data.status && isStatus(data.status) ? data.status : "";
    const like = q ? `%${q}%` : "";
    const rows = await sql<ShipmentRow>`
      select * from shipments
      where (${q} = '' or id ilike ${like} or sender_name ilike ${like}
        or receiver_name ilike ${like} or sender_phone ilike ${like}
        or receiver_phone ilike ${like} or origin ilike ${like}
        or destination ilike ${like})
      and (${status} = '' or status = ${status})
      order by created_at desc
      limit 200
    `;
    return rows.map(mapShipment);
  });

export const getShipment = createServerFn({ method: "GET" })
  .middleware([staffMiddleware])
  .validator((data: { id: string }) => ({
    id: String(data.id ?? "").trim().toUpperCase(),
  }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql<ShipmentRow>`
      select * from shipments where id = ${data.id} limit 1
    `;
    const row = rows[0];
    if (!row) return { shipment: null, events: [] as ShipmentEvent[] };
    const events = await sql<EventRow>`
      select * from shipment_events
      where shipment_id = ${row.id}
      order by created_at asc, id asc
    `;
    return { shipment: mapShipment(row), events: events.map(mapEvent) };
  });

export const createShipment = createServerFn({ method: "POST" })
  .middleware([staffMiddleware])
  .validator((data: CreateShipmentInput) => {
    const serviceType = String(data.serviceType ?? "land");
    if (!isServiceType(serviceType)) throw new Error("نوع الخدمة غير صالح");
    const pieces = Math.max(1, Math.min(9999, Number(data.pieces) || 1));
    const weightRaw = String(data.weightKg ?? "").trim();
    const weightKg = weightRaw === "" ? null : Number(weightRaw);
    if (weightKg != null && (!Number.isFinite(weightKg) || weightKg < 0)) {
      throw new Error("الوزن غير صالح");
    }
    return {
      senderName: requireText(data.senderName, "اسم المرسل"),
      senderPhone: requireText(data.senderPhone, "هاتف المرسل", 6, 30),
      senderCity: String(data.senderCity ?? "").trim(),
      senderCountry: String(data.senderCountry ?? "").trim(),
      receiverName: requireText(data.receiverName, "اسم المستلم"),
      receiverPhone: requireText(data.receiverPhone, "هاتف المستلم", 6, 30),
      receiverCity: String(data.receiverCity ?? "").trim(),
      receiverCountry: String(data.receiverCountry ?? "").trim(),
      origin: requireText(data.origin, "مدينة الانطلاق"),
      destination: requireText(data.destination, "مدينة الوصول"),
      serviceType,
      packageDesc: String(data.packageDesc ?? "").trim(),
      weightKg,
      pieces,
      notes: String(data.notes ?? "").trim(),
    };
  })
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const year = new Date().getFullYear();
    const seq = await sql<{ last_n: number }>`
      insert into shipment_seq (year, last_n) values (${year}, 10000)
      on conflict (year) do update set last_n = shipment_seq.last_n + 1
      returning last_n
    `;
    const n = seq[0]?.last_n ?? 10000;
    const id = `AH-${year}-${String(n).padStart(5, "0")}`;
    await sql`
      insert into shipments (
        id, sender_name, sender_phone, sender_city, sender_country,
        receiver_name, receiver_phone, receiver_city, receiver_country,
        origin, destination, service_type, package_desc, weight_kg, pieces,
        status, notes, created_by
      ) values (
        ${id}, ${data.senderName}, ${data.senderPhone}, ${data.senderCity}, ${data.senderCountry},
        ${data.receiverName}, ${data.receiverPhone}, ${data.receiverCity}, ${data.receiverCountry},
        ${data.origin}, ${data.destination}, ${data.serviceType}, ${data.packageDesc},
        ${data.weightKg}, ${data.pieces}, 'registered', ${data.notes}, ${context.userId}
      )
    `;
    await sql`
      insert into shipment_events (shipment_id, status, location, note, created_by)
      values (${id}, 'registered', ${data.origin}, 'تم تسجيل الشحنة في النظام', ${context.userId})
    `;
    const rows = await sql<ShipmentRow>`select * from shipments where id = ${id} limit 1`;
    return mapShipment(rows[0]!);
  });

export const addShipmentEvent = createServerFn({ method: "POST" })
  .middleware([staffMiddleware])
  .validator((data: { id: string; status: string; location: string; note: string }) => {
    const status = String(data.status ?? "");
    if (!isStatus(status)) throw new Error("حالة غير صالحة");
    return {
      id: String(data.id ?? "").trim().toUpperCase(),
      status,
      location: String(data.location ?? "").trim(),
      note: String(data.note ?? "").trim(),
    };
  })
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const existing = await sql<{ id: string }>`select id from shipments where id = ${data.id} limit 1`;
    if (!existing[0]) throw new Error("الشحنة غير موجودة");
    await sql`
      insert into shipment_events (shipment_id, status, location, note, created_by)
      values (${data.id}, ${data.status}, ${data.location}, ${data.note}, ${context.userId})
    `;
    await sql`
      update shipments
      set status = ${data.status}, updated_at = now()
      where id = ${data.id}
    `;
    const rows = await sql<ShipmentRow>`select * from shipments where id = ${data.id} limit 1`;
    const events = await sql<EventRow>`
      select * from shipment_events where shipment_id = ${data.id}
      order by created_at asc, id asc
    `;
    return { shipment: mapShipment(rows[0]!), events: events.map(mapEvent) };
  });

export const submitInquiry = createServerFn({ method: "POST" })
  .validator((data: { name: string; phone: string; email: string; service: string; message: string }) => ({
    name: requireText(data.name, "الاسم"),
    phone: requireText(data.phone, "الهاتف", 6, 30),
    email: String(data.email ?? "").trim(),
    service: String(data.service ?? "").trim(),
    message: requireText(data.message, "الرسالة", 8, 2000),
  }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql`
      insert into inquiries (name, phone, email, service, message)
      values (${data.name}, ${data.phone}, ${data.email}, ${data.service}, ${data.message})
    `;
    return { ok: true as const };
  });

export const listInquiries = createServerFn({ method: "GET" })
  .middleware([staffMiddleware])
  .handler(async () => {
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      name: string;
      phone: string;
      email: string;
      service: string;
      message: string;
      created_at: unknown;
    }>`select * from inquiries order by created_at desc limit 100`;
    return rows.map(
      (r): Inquiry => ({
        id: Number(r.id),
        name: r.name,
        phone: r.phone,
        email: r.email,
        service: r.service,
        message: r.message,
        createdAt: toIso(r.created_at),
      }),
    );
  });
