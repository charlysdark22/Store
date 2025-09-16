-- Insertar categorías de ejemplo
insert into public.categories (name, name_en, description, description_en) values
('Computadoras de Escritorio', 'Desktop Computers', 'Computadoras completas para uso doméstico y profesional', 'Complete computers for home and professional use'),
('Laptops', 'Laptops', 'Computadoras portátiles para trabajo y entretenimiento', 'Portable computers for work and entertainment'),
('Teléfonos', 'Phones', 'Smartphones y teléfonos móviles', 'Smartphones and mobile phones'),
('Accesorios PC', 'PC Accessories', 'Accesorios para computadoras de escritorio', 'Accessories for desktop computers'),
('Accesorios Laptop', 'Laptop Accessories', 'Accesorios para laptops', 'Accessories for laptops'),
('Accesorios Teléfono', 'Phone Accessories', 'Accesorios para teléfonos móviles', 'Accessories for mobile phones');

-- Insertar productos de ejemplo
insert into public.products (name, name_en, description, description_en, price, category_id, stock_quantity)
select
  'Cajita Externa para HDD/SSD 2.5"', 'External Case for 2.5" HDD/SSD',
  'Convierte tu disco en portátil', 'Turn your disk into a portable one',
  5000, c.id, 10
from public.categories c where c.name = 'Accesorios PC';

insert into public.products (name, name_en, description, description_en, price, category_id, stock_quantity)
select
  'SSD 128GB para Laptop', '128GB SSD for Laptop',
  '¡Acelera tu computadora al instante!', 'Speed up your computer instantly!',
  6500, c.id, 10
from public.categories c where c.name = 'Accesorios PC';

insert into public.products (name, name_en, description, description_en, price, category_id, brand, model, stock_quantity)
select
  'Cable Conversor TP-Link 5V a 9V', 'TP-Link 5V to 9V Converter Cable',
  'Ideal para routers y dispositivos', 'Ideal for routers and devices',
  2500, c.id, 'TP-Link', '5V to 9V', 10
from public.categories c where c.name = 'Accesorios PC';
