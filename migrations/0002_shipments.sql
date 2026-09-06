create table if not exists shipment_seq (
  year integer primary key,
  last_n integer not null
);

create table if not exists shipments (
  id text primary key,
  sender_name text not null,
  sender_phone text not null,
  sender_city text not null default '',
  sender_country text not null default '',
  receiver_name text not null,
  receiver_phone text not null,
  receiver_city text not null default '',
  receiver_country text not null default '',
  origin text not null,
  destination text not null,
  service_type text not null default 'land',
  package_desc text not null default '',
  weight_kg numeric,
  pieces integer not null default 1,
  status text not null default 'registered',
  notes text not null default '',
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists shipment_events (
  id serial primary key,
  shipment_id text not null references shipments(id) on delete cascade,
  status text not null,
  location text not null default '',
  note text not null default '',
  created_by text,
  created_at timestamptz not null default now()
);

create index if not exists shipment_events_shipment_id_idx on shipment_events (shipment_id);
create index if not exists shipments_status_idx on shipments (status);

create table if not exists inquiries (
  id serial primary key,
  name text not null,
  phone text not null,
  email text not null default '',
  service text not null default '',
  message text not null,
  created_at timestamptz not null default now()
);

insert into shipment_seq (year, last_n) values (2026, 10003)
on conflict (year) do nothing;

insert into shipments (
  id, sender_name, sender_phone, sender_city, sender_country,
  receiver_name, receiver_phone, receiver_city, receiver_country,
  origin, destination, service_type, package_desc, weight_kg, pieces, status, notes
) values
  ('AH-2026-10001', 'مؤسسة الشام التجارية', '+963991111111', 'دمشق', 'سوريا',
   'شركة الرافدين للاستيراد', '07801234567', 'بغداد', 'العراق',
   'دمشق', 'بغداد', 'land', 'قطع غيار وآلات', 420, 8, 'in_transit', ''),
  ('AH-2026-10002', 'النيل للمنسوجات', '+201001112233', 'الإسكندرية', 'مصر',
   'مؤسسة الحرمين', '0501234567', 'جدة', 'السعودية',
   'الإسكندرية', 'جدة', 'sea', 'أقمشة قطنية', 2100, 14, 'delivered', ''),
  ('AH-2026-10003', 'الخليج للإلكترونيات', '+971501234567', 'دبي', 'الإمارات',
   'مكتبة الفيصل', '0933123456', 'دمشق', 'سوريا',
   'دبي', 'دمشق', 'air', 'أجهزة إلكترونية', 38, 3, 'at_customs', '')
on conflict (id) do nothing;

insert into shipment_events (shipment_id, status, location, note)
select * from (
  values
    ('AH-2026-10001', 'registered', 'دمشق', 'تم تسجيل الشحنة في النظام'),
    ('AH-2026-10001', 'picked_up', 'دمشق', 'تم استلام البضاعة من المرسل'),
    ('AH-2026-10001', 'in_transit', 'حدود جابر', 'الشحنة في الطريق إلى بغداد'),
    ('AH-2026-10002', 'registered', 'الإسكندرية', 'تم تسجيل الشحنة في النظام'),
    ('AH-2026-10002', 'in_transit', 'ميناء الإسكندرية', 'غادرت الحاوية الميناء'),
    ('AH-2026-10002', 'delivered', 'جدة', 'تم التسليم للمستلم'),
    ('AH-2026-10003', 'registered', 'دبي', 'تم تسجيل الشحنة في النظام'),
    ('AH-2026-10003', 'in_transit', 'مطار دبي', 'أقلعت الشحنة'),
    ('AH-2026-10003', 'at_customs', 'دمشق', 'الشحنة في الجمارك بانتظار التخليص')
) as e(shipment_id, status, location, note)
where not exists (
  select 1 from shipment_events x where x.shipment_id = e.shipment_id and x.status = e.status
);
