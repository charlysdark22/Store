-- Habilitar RLS en la tabla de categorías si aún no está habilitado
alter table public.categories enable row level security;

-- Crear una política para permitir la lectura pública de las categorías
create policy "categories_select_all" 
  on public.categories for select
  using (true);
