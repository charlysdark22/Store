-- Crear tabla de categorías de productos
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_en text not null,
  description text,
  description_en text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS para categories (solo lectura pública)
alter table public.categories enable row level security;

-- Política para permitir lectura a todos los usuarios autenticados
create policy "categories_select_all"
  on public.categories for select
  using (true);

-- Solo administradores pueden insertar/actualizar/eliminar (se configurará más tarde)
create policy "categories_admin_all"
  on public.categories for all
  using (false); -- Por ahora bloqueado, se habilitará para admins
