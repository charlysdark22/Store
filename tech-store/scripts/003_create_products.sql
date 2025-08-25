-- Crear tabla de productos
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_en text not null,
  description text,
  description_en text,
  price decimal(10,2) not null,
  category_id uuid references public.categories(id) on delete set null,
  brand text,
  model text,
  specifications jsonb,
  specifications_en jsonb,
  images text[] default '{}',
  stock_quantity integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.products enable row level security;

-- Política para permitir lectura de productos activos a todos
create policy "products_select_active"
  on public.products for select
  using (is_active = true);

-- Solo administradores pueden modificar productos
create policy "products_admin_all"
  on public.products for all
  using (false); -- Se habilitará para admins más tarde
