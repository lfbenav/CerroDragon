```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- AUTH (RF2)
-- =========================

-- Si es admin o si es user normal
CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text
);

-- Información del usuario
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);

-- Para enviar lo de recuperar contraseña
CREATE TABLE password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  used_at timestamptz
);

-- La lista con las acciones que necesitan ser autorizadas
CREATE TABLE permissions (  -- 'Crear tours'
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text
);

-- Asignar permisos a un rol
CREATE TABLE role_permissions ( -- 'El rol admin puede crear tours'
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Asignar un rol a un usuario
CREATE TABLE user_roles (   -- 'El usuario Alex es un admin'
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  PRIMARY KEY (user_id, role_id)
);

-- =========================
-- CLIENTES (RF1)
-- =========================

CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- GUÍAS (RF6)
-- =========================

CREATE TABLE guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  bio text,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- TOURS Y PAQUETES (RF4)
-- =========================

CREATE TABLE tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  base_location text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE tour_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  name text NOT NULL,                -- 'Paquete 1'
  price_usd numeric(10,2) NOT NULL CHECK (price_usd >= 0),
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE tour_package_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES tour_packages(id) ON DELETE CASCADE,
  item_name text NOT NULL            -- 'Almuerzo', 'Guiado', 'Póliza INS'
);

-- =========================
-- PROMOCIONES (RF11)
-- =========================

CREATE TABLE promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES tours(id) ON DELETE RESTRICT,
  title text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE promotion_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id uuid NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  name text NOT NULL,
  price_usd numeric(10,2) NOT NULL CHECK (price_usd >= 0),
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE promotion_package_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_package_id uuid NOT NULL REFERENCES promotion_packages(id) ON DELETE CASCADE,
  item_name text NOT NULL
);

-- =========================
-- PUNTOS DE ENCUENTRO (RF15)
-- =========================

CREATE TABLE meeting_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  extra_cost_per_person_usd numeric(10,2) NOT NULL DEFAULT 0 CHECK (extra_cost_per_person_usd >= 0),
  is_active boolean NOT NULL DEFAULT true
);

-- Un tour puede tener varios puntos de encuentro
CREATE TABLE tour_meeting_points (
  tour_id uuid NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  meeting_point_id uuid NOT NULL REFERENCES meeting_points(id) ON DELETE RESTRICT,
  PRIMARY KEY (tour_id, meeting_point_id)
);

-- =========================
-- CUPONES (RF19)
-- =========================

CREATE TABLE coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text,
  discount_type text NOT NULL CHECK (discount_type IN ('PERCENT','AMOUNT')),
  discount_value numeric(10,2) NOT NULL CHECK (discount_value >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  max_uses integer CHECK (max_uses IS NULL OR max_uses >= 1),
  used_count integer NOT NULL DEFAULT 0
);

-- =========================
-- CALENDARIO / DISPONIBILIDAD (RF5)
-- =========================

CREATE TABLE tour_calendar_unavailable_weekday (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  weekday smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  status text NOT NULL CHECK (status IN ('LIMITED','HOLIDAY','BLOCKED')),
  note text,
  UNIQUE (tour_id, weekday)
);

CREATE TABLE tour_calendar_unavailable_day (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  day date NOT NULL,
  status text NOT NULL CHECK (status IN ('LIMITED','FULL','HOLIDAY','BLOCKED')),
  note text,
  UNIQUE (tour_id, day)
);

-- Mi razonamiento es que tiene más usabilidad que, para cada tour, al crearlo o editarlo, se puede asignar si hay día que en ninguna semana nunca se va a ofrecer ese tour, y se puede seleccionar manualmente algún día específico que no se va a dar el tour.
-- Al mostrarlo en el forntend, simplemente se enseña un calendario con todos los días, y se ponen en gris los días que estén en estas tres tablas.

CREATE TABLE global_calendar_unavailable_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day date NOT NULL UNIQUE,
  text NOT NULL CHECK (status IN ('HOLIDAY','BLOCKED')),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- También, hay una tabla para definir días que para TODOS los tours no va a estar disponible.

-- =========================
-- RESERVAS DE TOURS/PROMOS (RF8/RF9/RF10/RF18)
-- =========================

CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,

  -- tour o promo (exactamente uno)
  tour_id uuid REFERENCES tours(id) ON DELETE RESTRICT,
  promotion_id uuid REFERENCES promotions(id) ON DELETE RESTRICT,
  CHECK (
    (tour_id IS NOT NULL AND promotion_id IS NULL)
    OR
    (tour_id IS NULL AND promotion_id IS NOT NULL)
  ),

  tour_date date NOT NULL,
  reserved_at timestamptz NOT NULL DEFAULT now(),

  -- paquete elegido (depende si es tour o promo)
  tour_package_id uuid REFERENCES tour_packages(id) ON DELETE RESTRICT,
  promotion_package_id uuid REFERENCES promotion_packages(id) ON DELETE RESTRICT,
  CHECK (
    (tour_id IS NOT NULL AND tour_package_id IS NOT NULL AND promotion_package_id IS NULL)
    OR
    (promotion_id IS NOT NULL AND promotion_package_id IS NOT NULL AND tour_package_id IS NULL)
  ),

  persons integer NOT NULL CHECK (persons >= 1),

  can_arrive_4x4 boolean,  -- pregunta en P5
  meeting_point_id uuid REFERENCES meeting_points(id) ON DELETE RESTRICT,

  coupon_id uuid REFERENCES coupons(id) ON DELETE SET NULL,

  -- montos (guardá el snapshot final para no depender de cambios futuros)
  subtotal_usd numeric(10,2) NOT NULL CHECK (subtotal_usd >= 0),
  meeting_extra_usd numeric(10,2) NOT NULL DEFAULT 0 CHECK (meeting_extra_usd >= 0),
  discount_usd numeric(10,2) NOT NULL DEFAULT 0 CHECK (discount_usd >= 0),
  total_usd numeric(10,2) NOT NULL CHECK (total_usd >= 0),

  status text NOT NULL CHECK (status IN ('PENDING','CONFIRMED','CANCELLED','REFUND_REQUESTED','REFUNDED')) DEFAULT 'PENDING',
  confirmed_at timestamptz,
  cancelled_at timestamptz
);

-- Asignación de guías (RF7)
CREATE TABLE reservation_guides (
  reservation_id uuid NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  guide_id uuid NOT NULL REFERENCES guides(id) ON DELETE RESTRICT,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (reservation_id, guide_id)
);

-- Documento/PDF comprobante (CL3)
CREATE TABLE reservation_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  doc_type text NOT NULL CHECK (doc_type IN ('RECEIPT','CONFIRMATION')),
  file_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- REEMBOLSOS (RF18)
-- =========================

CREATE TABLE refund_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid UNIQUE NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  requested_at timestamptz NOT NULL DEFAULT now(),
  reason text,
  decision text CHECK (decision IN ('PENDING','APPROVED','REJECTED')) DEFAULT 'PENDING',
  decided_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  decided_at timestamptz
);

-- =========================
-- MENSAJERÍA (RF12)
-- =========================

CREATE TABLE chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  last_message_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('CUSTOMER','ADMIN')),
  sender_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  message text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now()
);

-- La idea es que todos los admin con ese permiso de chat pueden ver todos los chats con los usuarios listados. El usuario solo ve uno con un admin.

-- Que divertido tener un chat, esperemos que narco no nos bote la base de datos

-- =========================
-- ALOJAMIENTOS (RF13 / RF25)
-- =========================

CREATE TABLE accommodations (   -- Cabaña
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  capacity integer NOT NULL CHECK (capacity >= 1),
  is_active boolean NOT NULL DEFAULT true,
  status text NOT NULL CHECK (status IN ('AVAILABLE','RESERVED','INACTIVE')) DEFAULT 'AVAILABLE',
  last_reserved timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE accommodation_reservations (   -- Reservar cabaña
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  start_date date NOT NULL,
  end_date date NOT NULL,
  persons integer NOT NULL CHECK (persons >= 1),
  status text NOT NULL CHECK (status IN ('PENDING','CONFIRMED','CANCELLED')) DEFAULT 'PENDING',
  reserved_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  CHECK (end_date > start_date)
);

-- =========================
-- POLÍTICAS (RF16)
-- =========================

CREATE TABLE policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- No sé, aquí meter el mucho texto que quiera. Si mete HTML estaría muy chiva para costumizar como se ve o poner negritas

-- =========================
-- FORMULARIO COMIDAS POR CÓDIGO (RF17)
-- =========================

CREATE TABLE meal_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid REFERENCES reservations(id) ON DELETE SET NULL, -- se asocia a una reserva?
  code text UNIQUE NOT NULL,                 -- código tipo Kahoot
  responsible_name text NOT NULL,            -- encargado de la reservación
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE meal_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_form_id uuid NOT NULL REFERENCES meal_forms(id) ON DELETE CASCADE,
  option_name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true
);

CREATE TABLE meal_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_form_id uuid NOT NULL REFERENCES meal_forms(id) ON DELETE CASCADE,
  participant_name text NOT NULL,
  selected_option_id uuid REFERENCES meal_options(id) ON DELETE SET NULL,
  note text,          -- Poner alergias o algo
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- FORMULARIO CHECKIN POR CÓDIGO (RF24)
-- =========================

CREATE TABLE checkin_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,          -- código que se comparte
  is_active boolean NOT NULL DEFAULT true,
  opened_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  note text                          -- por si hay que poner que se hizo el checkin de x forma o no se
);

CREATE TABLE checkin_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checkin_form_id uuid NOT NULL REFERENCES checkin_forms(id) ON DELETE CASCADE,
  participant_name text NOT NULL,
  phone text,
  checked_in_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (checkin_session_id, participant_name)
);

-- =========================
-- TESTIMONIOS (RF21)
-- =========================

CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  content text NOT NULL,
  rating integer CHECK (rating BETWEEN 1 AND 5),
  status text NOT NULL CHECK (status IN ('PENDING','APPROVED','REJECTED')) DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at timestamptz
);

-- Que el api retorne n testimonios random para que sea más dinámico :D

-- =========================
-- CONDICIONES CLIMÁTICAS (RF22)
-- =========================

CREATE TABLE weather_conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- INVENTARIO LOCAL (RF23)
-- =========================

CREATE TABLE inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,                   -- 'papas', 'arroz', etc
  unit text NOT NULL,                          -- 'kilos', 'unidades', etc
  quantity numeric(12,2) NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =========================
-- BITÁCORA / AUDITORÍA ADMIN (RF14)
-- =========================

CREATE TABLE admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,                        -- 'CREATE_TOUR', 'CONFIRM_RESERVATION', etc
  entity_type text NOT NULL,                   -- 'tour', 'reservation', ...
  entity_id uuid,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
```