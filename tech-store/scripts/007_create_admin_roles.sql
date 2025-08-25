-- Crear tabla de roles de administrador
create table if not exists public.admin_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'admin' check (role in ('admin', 'super_admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id),
  unique(user_id)
);

-- Habilitar RLS
alter table public.admin_roles enable row level security;

-- Solo super admins pueden gestionar roles
create policy "admin_roles_super_admin_only"
  on public.admin_roles for all
  using (
    exists (
      select 1 from public.admin_roles ar 
      where ar.user_id = auth.uid() 
      and ar.role = 'super_admin'
    )
  );

-- Función para verificar si un usuario es admin
create or replace function public.is_admin(user_uuid uuid default auth.uid())
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1 from public.admin_roles 
    where user_id = user_uuid
  );
end;
$$;

-- Función para verificar si un usuario es super admin
create or replace function public.is_super_admin(user_uuid uuid default auth.uid())
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1 from public.admin_roles 
    where user_id = user_uuid 
    and role = 'super_admin'
  );
end;
$$;

-- Actualizar políticas de productos para permitir acceso a admins
drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all"
  on public.products for all
  using (public.is_admin());

-- Actualizar políticas de categorías para permitir acceso a admins
drop policy if exists "categories_admin_all" on public.categories;
create policy "categories_admin_all"
  on public.categories for all
  using (public.is_admin());

-- Política para que admins puedan ver todos los pedidos
create policy "orders_admin_select"
  on public.orders for select
  using (public.is_admin());

create policy "orders_admin_update"
  on public.orders for update
  using (public.is_admin());

-- Política para que admins puedan ver todos los items de pedidos
create policy "order_items_admin_select"
  on public.order_items for select
  using (
    public.is_admin() or
    exists (
      select 1 from public.orders 
      where orders.id = order_items.order_id 
      and orders.user_id = auth.uid()
    )
  );
