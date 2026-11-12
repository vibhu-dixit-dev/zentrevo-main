-- Optional native Postgres table for Zentrevo Curated Destinations
-- Note: If you don't run this SQL, /api/destinations automatically uses Supabase Storage (zentrevo-catalog bucket) so cloud sync still works out-of-the-box.

create table if not exists public.destinations (
  id bigint primary key,
  sort_order integer not null default 0,
  title text not null,
  location text not null,
  region text not null default 'international',
  badge text,
  tag_color text,
  price text not null,
  duration text,
  rating numeric(3, 2) default 4.95,
  reviews integer default 0,
  category text default 'Luxury Escapes',
  image text,
  image_alt text,
  description text,
  highlights jsonb default '[]'::jsonb,
  status text default 'Live',
  slug text,
  map_x integer,
  map_y integer,
  lat text,
  lng text,
  state text,
  country text,
  short_title text,
  updated_at timestamptz not null default now()
);

alter table public.destinations enable row level security;

drop policy if exists "Allow public read destinations" on public.destinations;
create policy "Allow public read destinations"
  on public.destinations
  for select
  using (true);
