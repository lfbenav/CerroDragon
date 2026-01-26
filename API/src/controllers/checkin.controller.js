const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// =======================
// TEST
// =======================
exports.test = asyncHandler(async (req, res) => {
  res.send("API de Check-in funcionando");
});

// ======================================================
// ADMIN – FORMULARIOS CHECK-IN
// ======================================================

// GET /checkin/forms
exports.getCheckinForms = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(`
    SELECT
      cf.id,
      cf.code,
      cf.is_active,
      cf.opened_at,
      cf.closed_at,

      r.id AS reservation_id,
      r.tour_date,

      t.title AS tour_name,

      c.full_name AS customer_name,
      u.email AS customer_email,

      COUNT(ce.id) AS entries_count

    FROM checkin_forms cf
    JOIN reservations r ON r.id = cf.reservation_id
    JOIN tours t ON t.id = r.tour_id
    JOIN customers c ON c.id = r.customer_id
    JOIN users u ON u.id = c.user_id
    LEFT JOIN checkin_entries ce ON ce.checkin_form_id = cf.id

    GROUP BY
      cf.id,
      r.id,
      t.title,
      c.full_name,
      u.email

    ORDER BY cf.opened_at DESC
  `);

  const data = rows.map(row => ({
    id: row.code,
    isActive: row.is_active,
    clienteNombre: row.customer_name,
    clienteEmail: row.customer_email,
    tour: row.tour_name,
    fecha: row.tour_date,
    registros: Number(row.entries_count),
    reservaAsociada: row.reservation_id
  }));

  res.json({ success: true, data });
});

// POST /checkin/forms
exports.createCheckinForm = asyncHandler(async (req, res) => {
  const { reservation_id, note } = req.body || {};

  if (!reservation_id) {
    throw new AppError("reservation_id requerido", 400);
  }

  const reservationRes = await pool.query(`
    SELECT id FROM reservations WHERE id = $1
  `, [reservation_id]);

  if (!reservationRes.rowCount) {
    throw new AppError("Reserva no existe", 404);
  }

  const { rows } = await pool.query(`
    INSERT INTO checkin_forms (reservation_id, note)
    VALUES ($1, $2)
    RETURNING *
  `, [reservation_id, note || null]);

  res.status(201).json({
    success: true,
    data: rows[0]
  });
});

// PUT /checkin/forms/:id/toggle
exports.toggleCheckinForm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body || {};

  if (typeof is_active !== "boolean") {
    throw new AppError("is_active requerido", 400);
  }

  const { rows } = await pool.query(`
    UPDATE checkin_forms
    SET is_active = $1,
        closed_at = CASE WHEN $1 = false THEN now() ELSE NULL END
    WHERE id = $2
    RETURNING *
  `, [is_active, id]);

  if (!rows.length) {
    throw new AppError("Formulario no encontrado", 404);
  }

  res.json({ success: true, data: rows[0] });
});

// GET /checkin/formularios/:code/entries
exports.getCheckinEntriesByCode = asyncHandler(async (req, res) => {
  const { code } = req.params;

  // 1️⃣ Buscar formulario + contexto
  const formRes = await pool.query(`
    SELECT
      cf.id,
      cf.code,
      cf.is_active,
      cf.opened_at,
      cf.closed_at,

      r.id AS reservation_id,
      r.tour_date,
      t.title AS tour_name,
      c.full_name AS customer_name

    FROM checkin_forms cf
    JOIN reservations r ON r.id = cf.reservation_id
    JOIN tours t ON t.id = r.tour_id
    JOIN customers c ON c.id = r.customer_id

    WHERE cf.code = $1
  `, [code]);

  if (!formRes.rowCount) {
    throw new AppError("Formulario de check-in no encontrado", 404, "CHECKIN_FORM_NOT_FOUND");
  }

  const form = formRes.rows[0];

  // 2️⃣ Obtener entradas
  const entriesRes = await pool.query(`
    SELECT
      participant_name,
      phone,
      checked_in_at
    FROM checkin_entries
    WHERE checkin_form_id = $1
    ORDER BY checked_in_at ASC
  `, [form.id]);

  // 3️⃣ Formatear fecha (seguro)
  const fechaTexto = form.tour_date
    ? new Date(form.tour_date).toLocaleDateString("es-CR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  res.json({
    success: true,
    data: {
      code: form.code,
      cliente: form.customer_name,
      tour: form.tour_name,
      reservaId: form.reservation_id,
      fechaTexto,

      isActive: form.is_active,
      openedAt: form.opened_at,
      closedAt: form.closed_at,

      registros: entriesRes.rowCount,
      rows: entriesRes.rows.map(r => ({
        nombre: r.participant_name,
        telefono: r.phone,
        checkinAt: r.checked_in_at,
      })),
    },
  });
});



// ======================================================
// CLIENTE – CHECK-IN POR CÓDIGO
// ======================================================

// GET /checkin/forms/:code
exports.getCheckinFormByCode = asyncHandler(async (req, res) => {
  const { code } = req.params;

  const { rows } = await pool.query(`
    SELECT id
    FROM checkin_forms
    WHERE code = $1 AND is_active = true
  `, [code]);

  if (!rows.length) {
    throw new AppError("Formulario inválido o cerrado", 404);
  }

  res.json({
    success: true,
    data: { formId: rows[0].id }
  });
});

// POST /checkin/forms/:code/entries
exports.createCheckinEntry = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const { participant_name, phone } = req.body || {};

  if (!participant_name) {
    throw new AppError("participant_name requerido", 400);
  }

  const formRes = await pool.query(`
    SELECT id
    FROM checkin_forms
    WHERE code = $1 AND is_active = true
  `, [code]);

  if (!formRes.rowCount) {
    throw new AppError("Formulario inválido o cerrado", 404);
  }

  const { rows } = await pool.query(`
    INSERT INTO checkin_entries
      (checkin_form_id, participant_name, phone)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [
    formRes.rows[0].id,
    participant_name,
    phone || null
  ]);

  res.status(201).json({
    success: true,
    data: rows[0]
  });
});
