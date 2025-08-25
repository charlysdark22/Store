-- Insertar categorías de ejemplo
insert into public.categories (name, name_en, description, description_en) values
('Computadoras de Escritorio', 'Desktop Computers', 'Computadoras completas para uso doméstico y profesional', 'Complete computers for home and professional use'),
('Laptops', 'Laptops', 'Computadoras portátiles para trabajo y entretenimiento', 'Portable computers for work and entertainment'),
('Teléfonos', 'Phones', 'Smartphones y teléfonos móviles', 'Smartphones and mobile phones'),
('Accesorios PC', 'PC Accessories', 'Accesorios para computadoras de escritorio', 'Accessories for desktop computers'),
('Accesorios Laptop', 'Laptop Accessories', 'Accesorios para laptops', 'Accessories for laptops'),
('Accesorios Teléfono', 'Phone Accessories', 'Accesorios para teléfonos móviles', 'Accessories for mobile phones');

-- Insertar productos de ejemplo
insert into public.products (name, name_en, description, description_en, price, category_id, brand, model, specifications, specifications_en, stock_quantity) 
select 
  'PC Gamer Intel i5', 'Gaming PC Intel i5', 
  'Computadora de escritorio para gaming con procesador Intel i5', 'Desktop computer for gaming with Intel i5 processor',
  850.00, c.id, 'Custom Build', 'Gaming i5',
  '{"processor": "Intel i5-12400F", "ram": "16GB DDR4", "storage": "500GB SSD", "gpu": "GTX 1660 Super"}'::jsonb,
  '{"processor": "Intel i5-12400F", "ram": "16GB DDR4", "storage": "500GB SSD", "gpu": "GTX 1660 Super"}'::jsonb,
  5
from public.categories c where c.name = 'Computadoras de Escritorio';

insert into public.products (name, name_en, description, description_en, price, category_id, brand, model, stock_quantity)
select 
  'Laptop Dell Inspiron 15', 'Dell Inspiron 15 Laptop',
  'Laptop Dell para uso diario y trabajo', 'Dell laptop for daily use and work',
  650.00, c.id, 'Dell', 'Inspiron 15', 8
from public.categories c where c.name = 'Laptops';

insert into public.products (name, name_en, description, description_en, price, category_id, brand, model, stock_quantity)
select 
  'iPhone 14', 'iPhone 14',
  'Smartphone Apple iPhone 14', 'Apple iPhone 14 smartphone',
  1200.00, c.id, 'Apple', 'iPhone 14', 3
from public.categories c where c.name = 'Teléfonos';

insert into public.products (name, name_en, description, description_en, price, category_id, brand, model, stock_quantity)
select 
  'Teclado Mecánico RGB', 'RGB Mechanical Keyboard',
  'Teclado mecánico con iluminación RGB', 'Mechanical keyboard with RGB lighting',
  85.00, c.id, 'Corsair', 'K70 RGB', 15
from public.categories c where c.name = 'Accesorios PC';
