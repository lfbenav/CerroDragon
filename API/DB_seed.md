Este fue creado por ChatGPT, podría no funcionar como debería. El de crear la base de datos si fue hecho a mano en su mayoría en caso de que se lo pregunte.

```sql
-- =========================================================
-- SEED COMPLETO - Cerro Dragón Tours
-- Ejecutar dentro de la DB (toursdb) ya con el schema creado
-- =========================================================

-- Limpieza (opcional). Si te tira errores por FK, comentá este bloque.
-- OJO: esto borra datos.
-- TRUNCATE TABLE
--   admin_logs,
--   inventory_items,
--   weather_conditions,
--   testimonials,
--   checkin_entries,
--   checkin_forms,
--   meal_responses,
--   meal_options,
--   meal_forms,
--   policies,
--   accommodation_reservations,
--   accommodations,
--   chat_messages,
--   chat_threads,
--   refund_requests,
--   reservation_documents,
--   reservation_guides,
--   reservations,
--   global_calendar_unavailable_days,
--   tour_calendar_unavailable_day,
--   tour_calendar_unavailable_weekday,
--   coupons,
--   tour_meeting_points,
--   meeting_points,
--   promotion_package_items,
--   promotion_packages,
--   promotions,
--   tour_package_items,
--   tour_packages,
--   tours,
--   guides,
--   customers,
--   user_roles,
--   role_permissions,
--   permissions,
--   roles,
--   password_reset_tokens,
--   users
-- RESTART IDENTITY CASCADE;

-- =========================================================
-- 1) ROLES
-- =========================================================
INSERT INTO roles (id, name, description)
VALUES
  (gen_random_uuid(), 'ADMIN', 'Administrador del sistema'),
  (gen_random_uuid(), 'CUSTOMER', 'Cliente');

-- =========================================================
-- 2) PERMISSIONS
-- =========================================================
INSERT INTO permissions (id, code, description)
VALUES
  (gen_random_uuid(), 'CREATE_TOUR', 'Crear tours'),
  (gen_random_uuid(), 'UPDATE_TOUR', 'Editar tours'),
  (gen_random_uuid(), 'MANAGE_RESERVATIONS', 'Gestionar reservas'),
  (gen_random_uuid(), 'CHAT_ACCESS', 'Acceso al chat'),
  (gen_random_uuid(), 'MANAGE_INVENTORY', 'Gestionar inventario');

-- ADMIN tiene todos los permisos
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'ADMIN';

-- =========================================================
-- 3) USERS (admin + cliente + guía)
-- =========================================================
INSERT INTO users (id, email, password_hash)
VALUES
  (gen_random_uuid(), 'admin@cerrodragon.com', 'hashed_admin'),
  (gen_random_uuid(), 'cliente@correo.com', 'hashed_cliente'),
  (gen_random_uuid(), 'guia@correo.com', 'hashed_guia');

-- Asignar roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON
  (u.email = 'admin@cerrodragon.com' AND r.name = 'ADMIN')
  OR
  (u.email = 'cliente@correo.com' AND r.name = 'CUSTOMER');

-- =========================================================
-- 4) CUSTOMER + GUIDE
-- =========================================================
INSERT INTO customers (id, user_id, full_name, phone)
SELECT gen_random_uuid(), id, 'Juan Pérez', '8888-8888'
FROM users WHERE email = 'cliente@correo.com';

INSERT INTO guides (id, user_id, full_name, phone, bio, image_url)
SELECT gen_random_uuid(), id, 'Carlos Guía', '8777-7777',
       'Guía local certificado en montaña y primeros auxilios',
       'https://picsum.photos/seed/guia1/400/400'
FROM users WHERE email = 'guia@correo.com';

-- =========================================================
-- 5) TOURS
-- =========================================================
INSERT INTO tours (id, title, description, base_location)
VALUES
  (gen_random_uuid(), 'Tour Catarata', 'Caminata guiada a catarata natural', 'La Fortuna'),
  (gen_random_uuid(), 'Tour Mirador', 'Vista panorámica al amanecer', 'Monteverde'),
  (gen_random_uuid(), 'Tour Nocturno', 'Avistamiento de fauna nocturna', 'Sarapiquí');

-- =========================================================
-- 6) TOUR PACKAGES + ITEMS
-- =========================================================
-- Para cada tour, creamos 2 paquetes
INSERT INTO tour_packages (id, tour_id, name, price_usd, is_active)
SELECT gen_random_uuid(), t.id, 'Paquete Básico', 50, true
FROM tours t;

INSERT INTO tour_packages (id, tour_id, name, price_usd, is_active)
SELECT gen_random_uuid(), t.id, 'Paquete Premium', 85, true
FROM tours t;

-- Items para Básico
INSERT INTO tour_package_items (package_id, item_name)
SELECT tp.id, 'Guía certificado'
FROM tour_packages tp
WHERE tp.name = 'Paquete Básico';

INSERT INTO tour_package_items (package_id, item_name)
SELECT tp.id, 'Botella de agua'
FROM tour_packages tp
WHERE tp.name = 'Paquete Básico';

-- Items para Premium
INSERT INTO tour_package_items (package_id, item_name)
SELECT tp.id, 'Guía certificado'
FROM tour_packages tp
WHERE tp.name = 'Paquete Premium';

INSERT INTO tour_package_items (package_id, item_name)
SELECT tp.id, 'Almuerzo'
FROM tour_packages tp
WHERE tp.name = 'Paquete Premium';

INSERT INTO tour_package_items (package_id, item_name)
SELECT tp.id, 'Póliza INS'
FROM tour_packages tp
WHERE tp.name = 'Paquete Premium';

-- =========================================================
-- 7) PROMOCIONES + PACKAGES + ITEMS
-- =========================================================
INSERT INTO promotions (id, tour_id, title, description, is_active)
SELECT gen_random_uuid(), t.id, 'Promo Temporada Verde', 'Precio especial por temporada', true
FROM tours t
WHERE t.title = 'Tour Catarata'
LIMIT 1;

INSERT INTO promotion_packages (id, promotion_id, name, price_usd, is_active)
SELECT gen_random_uuid(), p.id, 'Promo Pack', 40, true
FROM promotions p;

INSERT INTO promotion_package_items (promo_package_id, item_name)
SELECT pp.id, 'Guía + Snack'
FROM promotion_packages pp;

-- =========================================================
-- 8) MEETING POINTS + RELACIÓN CON TOURS
-- =========================================================
INSERT INTO meeting_points (id, name, description, extra_cost_per_person_usd, is_active)
VALUES
  (gen_random_uuid(), 'Entrada Principal', 'Entrada al parque', 0, true),
  (gen_random_uuid(), 'Hotel Centro', 'Recogida en hotel', 5, true),
  (gen_random_uuid(), 'Terminal Bus', 'Punto céntrico de salida', 3, true);

-- Todos los tours tienen Entrada Principal
INSERT INTO tour_meeting_points (tour_id, meeting_point_id)
SELECT t.id, mp.id
FROM tours t
JOIN meeting_points mp ON mp.name = 'Entrada Principal';

-- Tour Mirador también tiene Hotel Centro
INSERT INTO tour_meeting_points (tour_id, meeting_point_id)
SELECT t.id, mp.id
FROM tours t
JOIN meeting_points mp ON mp.name = 'Hotel Centro'
WHERE t.title = 'Tour Mirador';

-- =========================================================
-- 9) CUPONES
-- =========================================================
INSERT INTO coupons (id, code, description, discount_type, discount_value, starts_at, ends_at, is_active, max_uses)
VALUES
  (gen_random_uuid(), 'DESC10', '10% de descuento', 'PERCENT', 10, now() - interval '1 day', now() + interval '30 days', true, 100),
  (gen_random_uuid(), 'SAVE5', '5 USD de descuento', 'AMOUNT', 5, now() - interval '1 day', now() + interval '15 days', true, 50);

-- =========================================================
-- 10) CALENDARIO (global + días bloqueados por tour)
-- =========================================================
INSERT INTO global_calendar_unavailable_days (id, day, status, note)
VALUES
  (gen_random_uuid(), CURRENT_DATE + 3, 'HOLIDAY', 'Feriado (prueba)'),
  (gen_random_uuid(), CURRENT_DATE + 10, 'BLOCKED', 'Mantenimiento de sendero');

-- Un weekday bloqueado para Tour Nocturno (ej: domingo=0 o 6 depende tu convención; aquí uso 0=domingo)
INSERT INTO tour_calendar_unavailable_weekday (id, tour_id, weekday, status, note)
SELECT gen_random_uuid(), t.id, 0, 'BLOCKED', 'No se ofrece domingos'
FROM tours t
WHERE t.title = 'Tour Nocturno';

-- Un día específico FULL para Tour Catarata
INSERT INTO tour_calendar_unavailable_day (id, tour_id, day, status, note)
SELECT gen_random_uuid(), t.id, CURRENT_DATE + 7, 'FULL', 'Cupo lleno (prueba)'
FROM tours t
WHERE t.title = 'Tour Catarata';

-- =========================================================
-- 11) RESERVAS (1 tour + 1 promo)
-- =========================================================
-- Reserva de tour
INSERT INTO reservations (
  id, customer_id, tour_id, tour_date, tour_package_id, persons,
  can_arrive_4x4, meeting_point_id, coupon_id,
  subtotal_usd, meeting_extra_usd, discount_usd, total_usd,
  status
)
SELECT
  gen_random_uuid(),
  c.id,
  t.id,
  CURRENT_DATE + 8,
  tp.id,
  2,
  true,
  mp.id,
  cp.id,
  170,  -- ejemplo: premium 85*2
  0,
  17,   -- 10%
  153,
  'CONFIRMED'
FROM customers c
JOIN tours t ON t.title = 'Tour Mirador'
JOIN tour_packages tp ON tp.tour_id = t.id AND tp.name = 'Paquete Premium'
JOIN meeting_points mp ON mp.name = 'Entrada Principal'
JOIN coupons cp ON cp.code = 'DESC10'
LIMIT 1;

-- Reserva de promo (cumple constraints)
INSERT INTO reservations (
  id, customer_id, promotion_id, tour_date, promotion_package_id, persons,
  meeting_point_id,
  subtotal_usd, meeting_extra_usd, discount_usd, total_usd,
  status
)
SELECT
  gen_random_uuid(),
  c.id,
  p.id,
  CURRENT_DATE + 12,
  pp.id,
  1,
  mp.id,
  40,
  0,
  0,
  40,
  'PENDING'
FROM customers c
JOIN promotions p ON true
JOIN promotion_packages pp ON pp.promotion_id = p.id
JOIN meeting_points mp ON mp.name = 'Hotel Centro'
LIMIT 1;

-- =========================================================
-- 12) ASIGNACIÓN DE GUÍA A UNA RESERVA
-- =========================================================
INSERT INTO reservation_guides (reservation_id, guide_id)
SELECT r.id, g.id
FROM reservations r
JOIN guides g ON true
WHERE r.status = 'CONFIRMED'
LIMIT 1;

-- =========================================================
-- 13) DOCUMENTOS DE RESERVA (PDF links dummy)
-- =========================================================
INSERT INTO reservation_documents (id, reservation_id, doc_type, file_url)
SELECT gen_random_uuid(), r.id, 'CONFIRMATION', 'https://example.com/docs/confirmacion.pdf'
FROM reservations r
WHERE r.status = 'CONFIRMED'
LIMIT 1;

-- =========================================================
-- 14) POLÍTICAS
-- =========================================================
INSERT INTO policies (id, title, content, is_active)
VALUES
  (gen_random_uuid(), 'Política de Cancelación', 'Las cancelaciones deben realizarse con 24h de anticipación...', true),
  (gen_random_uuid(), 'Política de Seguridad', 'Uso obligatorio de calzado adecuado y seguir instrucciones del guía...', true);

-- =========================================================
-- 15) TESTIMONIOS
-- =========================================================
INSERT INTO testimonials (id, customer_id, content, rating, status)
SELECT gen_random_uuid(), c.id, 'La experiencia fue increíble, súper recomendado.', 5, 'APPROVED'
FROM customers c
LIMIT 1;

INSERT INTO testimonials (id, customer_id, content, rating, status)
SELECT gen_random_uuid(), c.id, 'Muy buen tour, pero el clima estaba fuerte.', 4, 'PENDING'
FROM customers c
LIMIT 1;

-- =========================================================
-- 16) CONDICIONES CLIMÁTICAS
-- =========================================================
INSERT INTO weather_conditions (id, title, message, is_active)
VALUES
  (gen_random_uuid(), 'Advertencia de lluvia', 'Se esperan lluvias fuertes en la tarde. Traer impermeable.', true);

-- =========================================================
-- 17) INVENTARIO
-- =========================================================
INSERT INTO inventory_items (id, name, unit, quantity)
VALUES
  (gen_random_uuid(), 'Arroz', 'kilos', 25),
  (gen_random_uuid(), 'Botellas de agua', 'unidades', 120),
  (gen_random_uuid(), 'Platos desechables', 'unidades', 300),
  (gen_random_uuid(), 'Botiquín', 'unidades', 2);

-- =========================================================
-- 18) CABAÑAS (ACCOMMODATIONS)
-- =========================================================
INSERT INTO accommodations (id, name, description, capacity, status, is_active)
VALUES
  (gen_random_uuid(), 'Cabaña Río', 'Cabaña cerca del río, ideal para 2 personas', 2, 'AVAILABLE', true),
  (gen_random_uuid(), 'Cabaña Bosque', 'Cabaña familiar con vista al bosque', 5, 'AVAILABLE', true),
  (gen_random_uuid(), 'Cabaña Mirador', 'Cabaña con balcón y vista panorámica', 4, 'INACTIVE', true);

-- Reservación de cabaña
INSERT INTO accommodation_reservations (
  id, customer_id, start_date, end_date, persons, status
)
SELECT
  gen_random_uuid(),
  c.id,
  CURRENT_DATE + 5,
  CURRENT_DATE + 7,
  2,
  'PENDING'
FROM customers c
LIMIT 1;

-- =========================================================
-- 19) MENSAJERÍA (THREAD + MENSAJES)
-- =========================================================
INSERT INTO chat_threads (id, customer_id, is_active)
SELECT gen_random_uuid(), c.id, true
FROM customers c
LIMIT 1;

-- Mensaje del cliente
INSERT INTO chat_messages (id, thread_id, sender_type, sender_user_id, message)
SELECT gen_random_uuid(), th.id, 'CUSTOMER', u.id, 'Hola, ¿el tour incluye almuerzo?'
FROM chat_threads th
JOIN customers c ON c.id = th.customer_id
JOIN users u ON u.id = c.user_id
LIMIT 1;

-- Respuesta del admin
INSERT INTO chat_messages (id, thread_id, sender_type, sender_user_id, message)
SELECT gen_random_uuid(), th.id, 'ADMIN', u.id, 'Sí, el Paquete Premium incluye almuerzo.'
FROM chat_threads th
JOIN users u ON u.email = 'admin@cerrodragon.com'
LIMIT 1;

-- Actualizar last_message_at
UPDATE chat_threads
SET last_message_at = now()
WHERE true;

-- =========================================================
-- 20) FORMULARIO DE COMIDAS (MEAL FORMS + OPTIONS + RESPONSES)
-- =========================================================
-- Crear meal_form asociado a la reserva CONFIRMED
INSERT INTO meal_forms (id, reservation_id, code, responsible_name, is_active)
SELECT gen_random_uuid(), r.id, 'FOOD123', 'Juan Pérez', true
FROM reservations r
WHERE r.status = 'CONFIRMED'
LIMIT 1;

-- Opciones del formulario
INSERT INTO meal_options (id, meal_form_id, option_name, is_active)
SELECT gen_random_uuid(), mf.id, 'Vegetariano', true
FROM meal_forms mf
WHERE mf.code = 'FOOD123';

INSERT INTO meal_options (id, meal_form_id, option_name, is_active)
SELECT gen_random_uuid(), mf.id, 'Pollo', true
FROM meal_forms mf
WHERE mf.code = 'FOOD123';

INSERT INTO meal_options (id, meal_form_id, option_name, is_active)
SELECT gen_random_uuid(), mf.id, 'Carne', true
FROM meal_forms mf
WHERE mf.code = 'FOOD123';

-- Respuestas
INSERT INTO meal_responses (id, meal_form_id, participant_name, selected_option_id, note)
SELECT gen_random_uuid(), mf.id, 'Ana', mo.id, 'Sin cebolla'
FROM meal_forms mf
JOIN meal_options mo ON mo.meal_form_id = mf.id
WHERE mf.code = 'FOOD123' AND mo.option_name = 'Pollo'
LIMIT 1;

INSERT INTO meal_responses (id, meal_form_id, participant_name, selected_option_id, note)
SELECT gen_random_uuid(), mf.id, 'Luis', mo.id, 'Alergia a maní'
FROM meal_forms mf
JOIN meal_options mo ON mo.meal_form_id = mf.id
WHERE mf.code = 'FOOD123' AND mo.option_name = 'Vegetariano'
LIMIT 1;

-- =========================================================
-- 21) CHECKIN FORM + ENTRIES
-- =========================================================
INSERT INTO checkin_forms (id, reservation_id, code, is_active, note)
SELECT gen_random_uuid(), r.id, 'CHECK123', true, 'Check-in prueba'
FROM reservations r
WHERE r.status IN ('CONFIRMED','PENDING')
LIMIT 1;

INSERT INTO checkin_entries (id, checkin_form_id, participant_name, phone)
SELECT gen_random_uuid(), cf.id, 'Ana', '8999-1111'
FROM checkin_forms cf
WHERE cf.code = 'CHECK123';

INSERT INTO checkin_entries (id, checkin_form_id, participant_name, phone)
SELECT gen_random_uuid(), cf.id, 'Luis', '8999-2222'
FROM checkin_forms cf
WHERE cf.code = 'CHECK123';

-- =========================================================
-- 22) ADMIN LOGS (auditoría)
-- =========================================================
INSERT INTO admin_logs (id, actor_user_id, action, entity_type, entity_id, details)
SELECT
  gen_random_uuid(),
  u.id,
  'SEED_INIT',
  'system',
  NULL,
  jsonb_build_object('note','Seed inicial cargado', 'when', now())
FROM users u
WHERE u.email = 'admin@cerrodragon.com'
LIMIT 1;

-- Fin
```