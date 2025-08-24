-- Insertar categorías principales
INSERT INTO categories (name, slug, description, image_url) VALUES
('Computadoras de Escritorio', 'computadoras-escritorio', 'PCs de escritorio para trabajo y gaming', '/placeholder.svg?height=300&width=400'),
('Laptops', 'laptops', 'Laptops y notebooks para trabajo y estudio', '/placeholder.svg?height=300&width=400'),
('Teléfonos', 'telefonos', 'Smartphones y teléfonos móviles', '/placeholder.svg?height=300&width=400'),
('Accesorios PC', 'accesorios-pc', 'Accesorios para computadoras de escritorio', '/placeholder.svg?height=300&width=400'),
('Accesorios Laptop', 'accesorios-laptop', 'Accesorios para laptops', '/placeholder.svg?height=300&width=400'),
('Accesorios Teléfono', 'accesorios-telefono', 'Accesorios para teléfonos móviles', '/placeholder.svg?height=300&width=400')
ON CONFLICT (slug) DO NOTHING;

-- Insertar subcategorías para computadoras
INSERT INTO categories (name, slug, description, parent_id) VALUES
('Gaming PCs', 'gaming-pcs', 'Computadoras optimizadas para gaming', (SELECT id FROM categories WHERE slug = 'computadoras-escritorio')),
('Oficina', 'pcs-oficina', 'Computadoras para uso de oficina', (SELECT id FROM categories WHERE slug = 'computadoras-escritorio')),
('Workstations', 'workstations', 'Estaciones de trabajo profesionales', (SELECT id FROM categories WHERE slug = 'computadoras-escritorio'))
ON CONFLICT (slug) DO NOTHING;

-- Insertar subcategorías para laptops
INSERT INTO categories (name, slug, description, parent_id) VALUES
('Gaming Laptops', 'gaming-laptops', 'Laptops para gaming', (SELECT id FROM categories WHERE slug = 'laptops')),
('Ultrabooks', 'ultrabooks', 'Laptops ultradelgadas', (SELECT id FROM categories WHERE slug = 'laptops')),
('Laptops Trabajo', 'laptops-trabajo', 'Laptops para uso profesional', (SELECT id FROM categories WHERE slug = 'laptops'))
ON CONFLICT (slug) DO NOTHING;

-- Insertar subcategorías para teléfonos
INSERT INTO categories (name, slug, description, parent_id) VALUES
('Android', 'android', 'Teléfonos Android', (SELECT id FROM categories WHERE slug = 'telefonos')),
('iPhone', 'iphone', 'Teléfonos iPhone', (SELECT id FROM categories WHERE slug = 'telefonos')),
('Básicos', 'telefonos-basicos', 'Teléfonos básicos', (SELECT id FROM categories WHERE slug = 'telefonos'))
ON CONFLICT (slug) DO NOTHING;
