BEGIN;

-- =========================
-- ROLES
-- =========================
INSERT INTO roles (id, name, description) VALUES
  (gen_random_uuid(), 'client', 'Cliente del sistema'),
  (gen_random_uuid(), 'guide', 'Guía turístico');

-- =========================
-- PERMISSIONS
-- =========================
INSERT INTO permissions (id, code, description) VALUES
  (gen_random_uuid(), 'MANAGE_TOURS', 'Gestionar tours y cabañas'),
  (gen_random_uuid(), 'MANAGE_RESERVATIONS', 'Gestionar reservas'),
  (gen_random_uuid(), 'MANAGE_ADMINS', 'Gestionar administradores'),
  (gen_random_uuid(), 'MANAGE_INVENTORY', 'Inventario');

-- =========================
-- TAGS
-- =========================
INSERT INTO tags (name) VALUES 
('Experto'),
('Moderado'),
('Fácil'),
('Todos')
ON CONFLICT DO NOTHING;

-- =========================
-- TOUR PACKAGES
-- =========================
INSERT INTO tour_packages (id, tour_id, name, price_usd)
SELECT gen_random_uuid(), t.id, 'Básico', 15000
FROM tours t;

INSERT INTO tour_packages (id, tour_id, name, price_usd)
SELECT gen_random_uuid(), t.id, 'Premium', 28000
FROM tours t;

INSERT INTO tour_package_items (package_id, item_name)
SELECT tp.id, 'Guía certificado'
FROM tour_packages tp;

INSERT INTO tour_package_items (package_id, item_name)
SELECT tp.id, 'Seguro INS'
FROM tour_packages tp
WHERE tp.name = 'Premium';


-- =========================
-- INVENTORY
-- =========================
INSERT INTO inventory_items (name, unit, quantity)
VALUES
  ('Agua', 'botellas', 120),
  ('Tortillas', 'paquetes', 50),
  ('Botiquín', 'unidades', 3);

-- =========================
-- POLICIES
-- =========================
INSERT INTO policies (title, content, is_active)
VALUES
(
  'Política de Cancelación',
  'Las cancelaciones deben realizarse con al menos 24 horas de anticipación para aplicar reembolso.',
  true
);

COMMIT;

-- Fin