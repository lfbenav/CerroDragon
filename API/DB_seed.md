Este fue creado por ChatGPT, podría no funcionar como debería. El de crear la base de datos si fue hecho a mano en su mayoría en caso de que se lo pregunte.

```sql
BEGIN;

-- =========================
-- ROLES
-- =========================
INSERT INTO roles (id, name, description) VALUES
  (gen_random_uuid(), 'ADMIN', 'Administrador'),
  (gen_random_uuid(), 'CUSTOMER', 'Cliente'),
  (gen_random_uuid(), 'GUIDE', 'Guía');

-- =========================
-- PERMISSIONS
-- =========================
INSERT INTO permissions (id, code, description) VALUES
  (gen_random_uuid(), 'CREATE_TOUR', 'Crear tours'),
  (gen_random_uuid(), 'UPDATE_TOUR', 'Editar tours'),
  (gen_random_uuid(), 'MANAGE_RESERVATIONS', 'Reservas'),
  (gen_random_uuid(), 'CHAT_ACCESS', 'Chat'),
  (gen_random_uuid(), 'MANAGE_INVENTORY', 'Inventario');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name = 'ADMIN';

-- =========================
-- USERS
-- =========================
INSERT INTO users (id, email, password_hash, type) VALUES
  (gen_random_uuid(), 'admin@cerrodragon.com', 'hashed_admin', 'admin'),
  (gen_random_uuid(), 'cliente@correo.com', 'hashed_cliente', 'client'),
  (gen_random_uuid(), 'guia@correo.com', 'hashed_guia', 'guide');

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u JOIN roles r
ON (u.email='admin@cerrodragon.com' AND r.name='ADMIN')
OR (u.email='cliente@correo.com' AND r.name='CUSTOMER')
OR (u.email='guia@correo.com' AND r.name='GUIDE');

-- =========================
-- CUSTOMER / GUIDE
-- =========================
INSERT INTO customers (id, user_id, full_name, phone)
SELECT gen_random_uuid(), id, 'Juan Pérez', '8888-8888'
FROM users WHERE email='cliente@correo.com';

INSERT INTO guides (id, user_id, full_name, phone, bio)
SELECT gen_random_uuid(), id, 'Carlos Guía', '8777-7777',
       'Guía certificado en montaña'
FROM users WHERE email='guia@correo.com';

-- =========================
-- TOURS
-- =========================
INSERT INTO tours (
  id, title, description, duration_hours, duration_days,
  max_persons, base_location
) VALUES
  (gen_random_uuid(), 'Tour Catarata', 'Caminata guiada', 4, 1, 10, 'La Fortuna'),
  (gen_random_uuid(), 'Tour Mirador', 'Vista panorámica', 3, 1, 8, 'Monteverde');

-- =========================
-- TAGS
-- =========================
INSERT INTO tags (id, name) VALUES
  (gen_random_uuid(), 'Naturaleza'),
  (gen_random_uuid(), 'Aventura');

INSERT INTO tour_tags (tour_id, tag_id)
SELECT t.id, tg.id FROM tours t CROSS JOIN tags tg;

-- =========================
-- PACKAGES
-- =========================
INSERT INTO tour_packages (id, tour_id, name, price_usd)
SELECT gen_random_uuid(), t.id, 'Básico', 50 FROM tours t;

INSERT INTO tour_packages (id, tour_id, name, price_usd)
SELECT gen_random_uuid(), t.id, 'Premium', 85 FROM tours t;

INSERT INTO tour_package_items (package_id, item_name)
SELECT tp.id, 'Guía certificado' FROM tour_packages tp;

-- =========================
-- PROMOCIONES
-- =========================
INSERT INTO promotions (id, tour_id, title, discount_value)
SELECT gen_random_uuid(), id, 'Promo Verde', 10 FROM tours LIMIT 1;

-- =========================
-- MEETING POINTS
-- =========================
INSERT INTO meeting_points (id, name, description, extra_cost_per_person_usd)
VALUES
  (gen_random_uuid(), 'Entrada Principal', 'Entrada al parque', 0),
  (gen_random_uuid(), 'Hotel', 'Recogida en hotel', 5);

INSERT INTO tour_meeting_points (tour_id, meeting_point_id)
SELECT t.id, mp.id FROM tours t JOIN meeting_points mp
ON mp.name='Entrada Principal';

-- =========================
-- RESERVATION (TOUR)
-- =========================
INSERT INTO reservations (
  id, customer_id, tour_id, tour_package_id,
  tour_date, persons, meeting_point_id,
  subtotal_usd, discount_usd, meeting_extra_usd,
  total_usd, status
)
SELECT
  gen_random_uuid(),
  c.id,
  t.id,
  tp.id,
  CURRENT_DATE + 7,
  2,
  mp.id,
  170,
  0,
  0,
  170,
  'CONFIRMED'
FROM customers c
JOIN tours t ON t.title='Tour Mirador'
JOIN tour_packages tp ON tp.tour_id=t.id AND tp.name='Premium'
JOIN meeting_points mp ON mp.name='Entrada Principal'
LIMIT 1;

-- =========================
-- STATUS HISTORY
-- =========================
INSERT INTO reservation_status_history (reservation_id, new_status)
SELECT id, 'CONFIRMED' FROM reservations;

-- =========================
-- CHAT
-- =========================
INSERT INTO chat_threads (id, customer_id)
SELECT gen_random_uuid(), id FROM customers LIMIT 1;

INSERT INTO chat_messages (thread_id, sender_type, message)
SELECT id, 'CUSTOMER', 'Hola, ¿incluye almuerzo?' FROM chat_threads;

-- =========================
-- INVENTORY
-- =========================
INSERT INTO inventory_items (name, unit, quantity)
VALUES ('Agua', 'botellas', 100);

-- =========================
-- ADMIN LOG
-- =========================
INSERT INTO admin_logs (actor_user_id, action, entity_type)
SELECT id, 'SEED_INIT', 'system'
FROM users WHERE email='admin@cerrodragon.com';

COMMIT;

-- Fin
```