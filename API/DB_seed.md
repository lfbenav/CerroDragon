Este fue creado por ChatGPT, podría no funcionar como debería. El de crear la base de datos si fue hecho a mano en su mayoría en caso de que se lo pregunte.

```sql
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
  (gen_random_uuid(), 'VIEW_TOURS', 'Ver tours'),
  (gen_random_uuid(), 'MANAGE_RESERVATIONS', 'Gestionar reservas'),
  (gen_random_uuid(), 'CHAT_ACCESS', 'Acceso a mensajería'),
  (gen_random_uuid(), 'MANAGE_INVENTORY', 'Inventario');

-- =========================
-- ROLE PERMISSIONS
-- =========================

-- client: ver tours + chat
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN ('VIEW_TOURS', 'CHAT_ACCESS')
WHERE r.name = 'client';

-- guide: reservas + chat
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.code IN ('MANAGE_RESERVATIONS', 'CHAT_ACCESS')
WHERE r.name = 'guide';

-- =========================
-- TOURS
-- =========================
INSERT INTO tours (
  id, title, description, duration_hours, duration_days,
  max_persons, base_location
) VALUES
  (gen_random_uuid(), 'Tour Catarata', 'Caminata guiada a la catarata', 4, 1, 10, 'La Fortuna'),
  (gen_random_uuid(), 'Tour Mirador', 'Vista panorámica al amanecer', 3, 1, 8, 'Monteverde');

-- =========================
-- TAGS
-- =========================
INSERT INTO tags (id, name) VALUES
  (gen_random_uuid(), 'Naturaleza'),
  (gen_random_uuid(), 'Aventura');

INSERT INTO tour_tags (tour_id, tag_id)
SELECT t.id, tg.id FROM tours t CROSS JOIN tags tg;

-- =========================
-- TOUR PACKAGES
-- =========================
INSERT INTO tour_packages (id, tour_id, name, price_usd)
SELECT gen_random_uuid(), t.id, 'Básico', 50 FROM tours t;

INSERT INTO tour_packages (id, tour_id, name, price_usd)
SELECT gen_random_uuid(), t.id, 'Premium', 85 FROM tours t;

INSERT INTO tour_package_items (package_id, item_name)
SELECT tp.id, 'Guía certificado' FROM tour_packages tp;

-- =========================
-- MEETING POINTS
-- =========================
INSERT INTO meeting_points (id, name, description, link)
VALUES
  (gen_random_uuid(), 'Entrada Principal', 'Entrada al parque', 'https://maps.google.com'),
  (gen_random_uuid(), 'Hotel', 'Recogida en hotel', 'https://maps.google.com');

INSERT INTO tour_meeting_points (tour_id, meeting_point_id)
SELECT t.id, mp.id
FROM tours t
JOIN meeting_points mp ON mp.name = 'Entrada Principal';

-- =========================
-- INVENTORY
-- =========================
INSERT INTO inventory_items (name, unit, quantity)
VALUES
  ('Agua', 'botellas', 100),
  ('Snacks', 'paquetes', 40);

-- =========================
-- POLICIES
-- =========================
INSERT INTO policies (title, content)
VALUES
  ('Política de Cancelación',
   'Las cancelaciones deben realizarse con al menos 24 horas de anticipación.');

COMMIT;


-- Fin
```