Aquí está todo para crear la Base de Datos de Cerro Dragón. Solo crear una base de datos en postgre llamada `toursdb` y correr todo esto.

```sql
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

-- GET /tours
-- POST /tours
-- GET /tours/:id
-- DELETE /tours/:id
-- PUT /tours/:id

-- GET TAGS EN GENERAL
-- GET TAGS / TAGS POR TOUR
-- POST TAGS A TOUR 
-- DELETE TAGS DE TOUR

-- get /tour-packages
-- post /tour-packages
-- put /tour-packages/:id
-- delete /tour-packages/:id

-- get /tour-package-items
-- post /tour-package-items
-- delete /tour-package-items/:id

-- get /reservations
-- post /reservations
-- get /reservations/:id
-- put /reservations/:id
-- delete /reservations/:id

-- put /reservations/:id/status
-- GET /reservations/:id/status-history



-- get /asign-guide
-- put /asign-guide/:reservation_id/:guide_id
-- post /asign-guide/:reservation_id/:guide_id
-- delete /asign-guide/:reservation_id/:guide_id

-- get /promotions
-- get /promotions/:id
-- post /promotions
-- put /promotions/:id
-- delete /promotions/:id

-- get /my-reservations
-- ASK FOR A REFUND
-- post /reservations/:id/request-refund


-- Filtros administrativos (dashboard)
-- (Ojo: puede ser una sola ruta con query params)
-- GET /reservations?status=PENDING
-- GET /reservations?date=2026-01-10
-- GET /reservations?tour_id=...

-- GET  /reservations/:id/documents
-- POST /reservations/:id/documents
-- GET  /documents/:id




CREATE TABLE tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  duration_hours integer NOT NULL CHECK (duration_hours > 0),
  duration_days integer NOT NULL CHECK (duration_days > 0),
  max_persons integer NOT NULL CHECK (max_persons > 0),
  base_location text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE TAGS (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL
);

CREATE TABLE tour_tags (
  tour_id uuid NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (tour_id, tag_id)
);


-- checked 
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
  tour_id uuid NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  -- only amount discounts for now
  discount_value numeric(10,2) NOT NULL CHECK (discount_value >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- EN VEZ DE TENER PAQUETES SEPARADOS, USAMOS LOS MISMOS QUE EN TOURS Y QUE EL PRECIO DE LA PROMO SEA LA SUMA DE LOS PAQUETES ELEGIDOS
-- borrar
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
-- CUPONES (RF19)
-- BORRAR
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
-- RESERVAS DE TOURS/PROMOS (RF8/RF9/RF10/RF18)
-- =========================


CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id),

  tour_id uuid NOT NULL REFERENCES tours(id),
  promotion_id uuid REFERENCES promotions(id),

  tour_package_id uuid REFERENCES tour_packages(id),

  tour_date date NOT NULL,
  reserved_at timestamptz NOT NULL DEFAULT now(),

  persons integer NOT NULL CHECK (persons >= 1),

  can_arrive_4x4 boolean,
  meeting_point_id uuid REFERENCES meeting_points(id),

  -- snapshot financiero
  subtotal_usd numeric(10,2) NOT NULL CHECK (subtotal_usd >= 0),
  discount_usd numeric(10,2) NOT NULL DEFAULT 0 CHECK (discount_usd >= 0),
  meeting_extra_usd numeric(10,2) NOT NULL DEFAULT 0 CHECK (meeting_extra_usd >= 0),
  total_usd numeric(10,2) NOT NULL CHECK (total_usd >= 0),

  status text NOT NULL CHECK (
    status IN ('PENDING','CONFIRMED','CANCELLED','REFUND_REQUESTED','REFUNDED')
  ) DEFAULT 'PENDING',

  confirmed_at timestamptz,
  cancelled_at timestamptz
);



CREATE TABLE reservation_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  old_status text,
  new_status text NOT NULL,
  changed_by uuid REFERENCES users(id), -- admin o sistema
  changed_at timestamptz NOT NULL DEFAULT now()
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
```