const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// =======================
// TEST
// =======================
exports.test = asyncHandler(async (req, res) => {
  res.send("API de Comidas funcionando");
});


// ======================================================
// ADMIN – CATÁLOGO DE COMIDAS
// ======================================================

// GET /foods/comidas
exports.getMealOptions = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(`
    SELECT id, option_name, is_active
    FROM meal_options
    ORDER BY option_name
  `);

  res.status(200).json({
    success: true,
    data: rows
  });
});

// POST /foods/comidas
exports.createMealOption = asyncHandler(async (req, res) => {
  const { option_name } = req.body || {};

  if (!option_name) {
    throw new AppError("option_name requerido", 400, "MISSING_FIELDS");
  }

  const { rows } = await pool.query(`
    INSERT INTO meal_options (option_name)
    VALUES ($1)
    RETURNING *
  `, [option_name]);

  res.status(201).json({
    success: true,
    data: rows[0]
  });
});

// PUT /foods/comidas/:id
exports.toggleMealOption = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body || {};

  if (typeof is_active !== "boolean") {
    throw new AppError("is_active requerido", 400, "MISSING_FIELDS");
  }

  const { rows } = await pool.query(`
    UPDATE meal_options
    SET is_active = $1
    WHERE id = $2
    RETURNING *
  `, [is_active, id]);

  if (!rows.length) {
    throw new AppError("Opción no encontrada", 404, "MEAL_OPTION_NOT_FOUND");
  }

  res.json({
    success: true,
    data: rows[0]
  });
});

// DELETE /foods/comidas/:id
exports.deleteMealOption = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(`
    DELETE FROM meal_options
    WHERE id = $1
  `, [id]);

  if (!result.rowCount) {
    throw new AppError("Opción no encontrada", 404, "MEAL_OPTION_NOT_FOUND");
  }

  res.json({
    success: true,
    message: "Opción eliminada"
  });
});


// ======================================================
// ADMIN – FORMULARIOS DE COMIDA
// ======================================================

// GET /foods/formularios
exports.getMealForms = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(`
    SELECT
      mf.id,
      mf.code,
      mf.is_active,
      mf.created_at,

      r.id AS reservation_id,
      r.tour_date,

      t.title AS tour_name,   -- ✅ CORREGIDO

      c.full_name AS customer_name,
      u.email AS customer_email,

      COUNT(mr.id) AS responses_count

    FROM meal_forms mf
    LEFT JOIN reservations r ON r.id = mf.reservation_id
    LEFT JOIN tours t ON t.id = r.tour_id
    LEFT JOIN customers c ON c.id = r.customer_id
    LEFT JOIN users u ON u.id = c.user_id
    LEFT JOIN meal_responses mr ON mr.meal_form_id = mf.id

    GROUP BY
      mf.id,
      r.id,
      t.title,
      c.full_name,
      u.email

    ORDER BY mf.created_at DESC
  `);

  const data = rows.map(row => ({
    id: row.code,
    isActive: row.is_active,
    clienteNombre: row.customer_name,
    clienteEmail: row.customer_email,
    tour: row.tour_name,
    fecha: row.tour_date,
    registros: Number(row.responses_count),
    reservaAsociada: row.reservation_id
  }));

  res.status(200).json({
    success: true,
    data
  });
});

// POST /foods/formularios
exports.createMealForm = asyncHandler(async (req, res) => {
  const { reservation_id, responsible_name } = req.body || {};

  if (!reservation_id || !responsible_name) {
    throw new AppError(
      "reservation_id y responsible_name son requeridos",
      400,
      "MISSING_FIELDS"
    );
  }

    const reservationRes = await pool.query(`
        SELECT id FROM reservations
        WHERE id = $1
        `, [reservation_id]);

    if (!reservationRes.rowCount) {
        throw new AppError("Reserva no existe", 404);
    }

  const { rows } = await pool.query(`
    INSERT INTO meal_forms (reservation_id, responsible_name)
    VALUES ($1, $2)
    RETURNING *
  `, [reservation_id, responsible_name]);

  res.status(201).json({
    success: true,
    data: rows[0]
  });
});

// PUT /foods/formularios/:id/toggle
exports.toggleMealForm = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body || {};

  if (typeof is_active !== "boolean") {
    throw new AppError("is_active requerido", 400);
  }

  const { rows } = await pool.query(`
    UPDATE meal_forms
    SET is_active = $1
    WHERE id = $2
    RETURNING *
  `, [is_active, id]);

  if (!rows.length) {
    throw new AppError("Formulario no encontrado", 404);
  }

  res.json({
    success: true,
    data: rows[0]
  });
});

// GET /foods/formularios/:code/respuestas
exports.getMealFormResponses = asyncHandler(async (req, res) => {
  const { code } = req.params;

  const formRes = await pool.query(`
    SELECT
      mf.id AS meal_form_id,
      mf.code,

      r.id AS reservation_id,
      r.tour_date,

      t.title AS tour_name,
      c.full_name AS customer_name

    FROM meal_forms mf
    LEFT JOIN reservations r ON r.id = mf.reservation_id
    LEFT JOIN tours t ON t.id = r.tour_id
    LEFT JOIN customers c ON c.id = r.customer_id

    WHERE mf.code = $1
  `, [code]);

  if (!formRes.rowCount) {
    throw new AppError("Formulario no encontrado", 404, "MEAL_FORM_NOT_FOUND");
  }

  const form = formRes.rows[0];

  const responsesRes = await pool.query(`
    SELECT
      mr.participant_name,
      mo.option_name,
      mr.note
    FROM meal_responses mr
    LEFT JOIN meal_options mo ON mo.id = mr.selected_option_id
    WHERE mr.meal_form_id = $1
    ORDER BY mr.created_at ASC
  `, [form.meal_form_id]);

  const rows = responsesRes.rows.map(r => ({
    nombre: r.participant_name,
    tipoComida: r.option_name || "—",
    alergias: r.note || "Ninguna"
  }));

  res.status(200).json({
    success: true,
    data: {
      code: form.code,
      cliente: form.customer_name ?? "—",
      tour: form.tour_name ?? "—",
      reservaId: form.reservation_id ?? "—",
      fechaTexto: form.tour_date
        ? form.tour_date.toLocaleDateString("es-CR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "—",
      rows
    }
  });
});


// ======================================================
// 👤 CLIENTE – FORMULARIO POR CÓDIGO
// ======================================================

// GET /foods/formularios/:code
exports.getMealFormByCode = asyncHandler(async (req, res) => {
  const { code } = req.params;

  const formRes = await pool.query(`
    SELECT id, responsible_name
    FROM meal_forms
    WHERE code = $1 AND is_active = true
  `, [code]);

  if (!formRes.rowCount) {
    throw new AppError("Formulario inválido", 404, "MEAL_FORM_NOT_FOUND");
  }

  const optionsRes = await pool.query(`
    SELECT id, option_name
    FROM meal_options
    WHERE is_active = true
    ORDER BY option_name
  `);

  res.json({
    success: true,
    data: {
      responsibleName: formRes.rows[0].responsible_name,
      options: optionsRes.rows
    }
  });
});

// POST /foods/formularios/:code/respuestas
exports.createMealResponse = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const { participant_name, selected_option_id, note } = req.body || {};

  if (!participant_name || !selected_option_id) {
    throw new AppError("Campos requeridos faltantes", 400);
  }

  const formRes = await pool.query(`
    SELECT id
    FROM meal_forms
    WHERE code = $1 AND is_active = true
  `, [code]);

  if (!formRes.rowCount) {
    throw new AppError("Formulario inválido", 404);
  }

  const { rows } = await pool.query(`
    INSERT INTO meal_responses
      (meal_form_id, participant_name, selected_option_id, note)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [
    formRes.rows[0].id,
    participant_name,
    selected_option_id,
    note || null
  ]);

  res.status(201).json({
    success: true,
    data: rows[0]
  });
});
