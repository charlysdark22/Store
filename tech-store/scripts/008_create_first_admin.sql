-- Insertar el primer super admin (reemplaza con tu email)
-- IMPORTANTE: Cambia 'admin@techstore.cu' por tu email real
insert into public.admin_roles (user_id, role, created_at)
select 
  id,
  'super_admin',
  now()
from auth.users 
where email = 'admin@techstore.cu'
on conflict (user_id) do nothing;

-- Si no existe el usuario admin, puedes crearlo manualmente después del registro
