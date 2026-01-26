const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// Solo para hacer pruebas rápidas de funcionamiento 
exports.test = asyncHandler(async (req, res) => {
    res.send("API de Cabañas funcionando");
});

// ====================================
// Condiciones climáticas e incidencias
// ====================================

// Crear condición climática / incidencia
exports.createWeatherCondition = asyncHandler(async (req, res) => {
    const { title, message } = req.body || {};

    if (!title || !message) {
        throw new AppError("title y message son requeridos", 400);
    }

    const { rows } = await pool.query(`
        INSERT INTO weather_conditions (title, message)
        VALUES ($1, $2)
        RETURNING *
    `, [title, message]);

    res.status(201).json({
        success: true,
        data: rows[0]
    });
});

// Eliminar condición climática / incidencia
exports.deleteWeatherCondition = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rowCount } = await pool.query(`
        DELETE FROM weather_conditions
        WHERE id = $1
    `, [id]);

    if (!rowCount) {
        throw new AppError("Condición climática no encontrada", 404);
    }

    res.json({
        success: true,
        message: "Condición climática eliminada"
    });
});

// Activar o desactivar condición climática
exports.toggleWeatherCondition = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { is_active } = req.body || {};

    if (typeof is_active !== "boolean") {
        throw new AppError("is_active debe ser boolean", 400);
    }

    const { rowCount, rows } = await pool.query(`
        UPDATE weather_conditions
        SET is_active = $1,
            updated_at = now()
        WHERE id = $2
        RETURNING *
    `, [is_active, id]);

    if (!rowCount) {
        throw new AppError("Condición climática no encontrada", 404);
    }

    res.json({
        success: true,
        data: rows[0]
    });
});

// Listar todas las condiciones climáticas
exports.getAllWeatherConditions = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT *
        FROM weather_conditions
        ORDER BY updated_at DESC
    `);

    res.json({
        success: true,
        data: rows
    });
});

// Listar solo condiciones climáticas activas
exports.getActiveWeatherConditions = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT *
        FROM weather_conditions
        WHERE is_active = true
        ORDER BY updated_at DESC
    `);

    res.json({
        success: true,
        data: rows
    });
});


// =========
// Auditoría
// =========

// Crear entrada de auditoría
exports.createAuditLog = asyncHandler(async (req, res) => {
    const { actor_user_id, action, entity_type, entity_id, details } = req.body || {};

    if (!action || !entity_type) {
        throw new AppError("action y entity_type son requeridos", 400);
    }

    const { rows } = await pool.query(`
        INSERT INTO admin_logs (actor_user_id, action, entity_type, entity_id, details)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [actor_user_id || null, action, entity_type, entity_id || null, details || null]);

    res.status(201).json({ success: true, data: rows[0] });
});

// Ver todas las entradas de auditoría
exports.getAuditLogs = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT *
        FROM admin_logs
        ORDER BY created_at DESC
    `);

    res.json({ success: true, data: rows });
});

// ===================
// Puntos de encuentro
// ===================

// Obtener todos los puntos de encuentro
exports.getMeetingPoints = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT *
        FROM meeting_points
        ORDER BY name
    `);

    res.json({ success: true, data: rows });
});

// Crear punto de encuentro
exports.createMeetingPoint = asyncHandler(async (req, res) => {
    const { name, description, link, image_url } = req.body || {};

    if (!name) {
        throw new AppError("name requerido", 400);
    }

    const { rows } = await pool.query(`
        INSERT INTO meeting_points (name, description, link, image_url)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [
        name,
        description || null,
        link || null,
        image_url || null
    ]);

    res.status(201).json({ success: true, data: rows[0] });
});

// Actualizar punto de encuentro
exports.updateMeetingPoint = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, link, image_url, is_active } = req.body || {};

    const { rowCount, rows } = await pool.query(`
        UPDATE meeting_points
        SET name = COALESCE($1, name),
            description = COALESCE($2, description),
            link = COALESCE($3, link),
            image_url = COALESCE($4, image_url),
            is_active = COALESCE($5, is_active)
        WHERE id = $6
        RETURNING *
    `, [name, description, link, image_url, is_active, id]);

    if (!rowCount) {
        throw new AppError("Punto de encuentro no encontrado", 404);
    }

    res.json({ success: true, data: rows[0] });
});

// Eliminar punto de encuentro
exports.deleteMeetingPoint = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rowCount } = await pool.query(`
        DELETE FROM meeting_points
        WHERE id = $1
    `, [id]);

    if (!rowCount) {
        throw new AppError("Punto de encuentro no encontrado", 404);
    }

    res.json({ success: true, message: "Punto de encuentro eliminado" });
});


// =========
// Políticas
// =========

// Ver todas las políticas
exports.getPolicies = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT *
        FROM policies
        ORDER BY created_at DESC
    `);

    res.json({ success: true, data: rows });
});

// Crear política
exports.createPolicy = asyncHandler(async (req, res) => {
    const { title, content } = req.body || {};

    if (!title || !content) {
        throw new AppError("title y content requeridos", 400);
    }

    const { rows } = await pool.query(`
        INSERT INTO policies (title, content)
        VALUES ($1, $2)
        RETURNING *
    `, [title, content]);

    res.status(201).json({ success: true, data: rows[0] });
});

// Actualizar política
exports.updatePolicy = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content, is_active } = req.body || {};

    const { rowCount, rows } = await pool.query(`
        UPDATE policies
        SET title = COALESCE($1, title),
            content = COALESCE($2, content),
            is_active = COALESCE($3, is_active)
        WHERE id = $4
        RETURNING *
    `, [title, content, is_active, id]);

    if (!rowCount) {
        throw new AppError("Política no encontrada", 404);
    }

    res.json({ success: true, data: rows[0] });
});

// Eliminar política
exports.deletePolicy = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rowCount } = await pool.query(`
        DELETE FROM policies WHERE id = $1
    `, [id]);

    if (!rowCount) {
        throw new AppError("Política no encontrada", 404);
    }

    res.json({ success: true, message: "Política eliminada" });
});

// ===========
// Testimonios
// ===========

// Crear testimonio
exports.createTestimonial = asyncHandler(async (req, res) => {
    const { customer_id, content, rating } = req.body || {};

    if (!content) {
        throw new AppError("content requerido", 400);
    }

    const { rows } = await pool.query(`
        INSERT INTO testimonials (customer_id, content, rating)
        VALUES ($1, $2, $3)
        RETURNING *
    `, [customer_id || null, content, rating || null]);

    res.status(201).json({ success: true, data: rows[0] });
});

// Ver todos los testimonios
exports.getTestimonials = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT *
        FROM testimonials
        ORDER BY created_at DESC
    `);

    res.json({ success: true, data: rows });
});

// Aprobar o rechazar testimonio
exports.reviewTestimonial = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, reviewed_by_user_id } = req.body || {};

    if (!["APPROVED", "REJECTED"].includes(status)) {
        throw new AppError("status inválido", 400);
    }

    const { rowCount, rows } = await pool.query(`
        UPDATE testimonials
        SET status = $1,
            reviewed_by_user_id = $2,
            reviewed_at = now()
        WHERE id = $3
        RETURNING *
    `, [status, reviewed_by_user_id || null, id]);

    if (!rowCount) {
        throw new AppError("Testimonio no encontrado", 404);
    }

    res.json({ success: true, data: rows[0] });
});

// Obtener solo testimonios aprobados
exports.getApprovedTestimonials = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT *
        FROM testimonials
        WHERE status = 'APPROVED'
        ORDER BY created_at DESC
    `);

    res.json({
        success: true,
        data: rows
    });
});

// ===========
// Inventario
// ===========

/**
 * Obtener todos los ítems de inventario
 */
exports.getInventoryItems = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(`
    SELECT *
    FROM inventory_items
    ORDER BY name ASC
  `);

  res.json({
    success: true,
    data: rows,
  });
});

/**
 * Obtener un ítem por ID
 */
exports.getInventoryItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { rows } = await pool.query(`
    SELECT *
    FROM inventory_items
    WHERE id = $1
  `, [id]);

  if (!rows.length) {
    throw new AppError("Ítem de inventario no encontrado", 404);
  }

  res.json({
    success: true,
    data: rows[0],
  });
});

/**
 * Crear ítem de inventario
 */
exports.createInventoryItem = asyncHandler(async (req, res) => {
  const { name, unit, quantity } = req.body;

  if (!name || !unit) {
    throw new AppError("name y unit son obligatorios", 400);
  }

  const { rows } = await pool.query(`
    INSERT INTO inventory_items (name, unit, quantity)
    VALUES ($1, $2, COALESCE($3, 0))
    RETURNING *
  `, [name.trim().toLowerCase(), unit.trim(), quantity]);

  res.status(201).json({
    success: true,
    data: rows[0],
  });
});

/**
 * Actualizar ítem de inventario
 */
exports.updateInventoryItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, unit, quantity } = req.body;

  const { rows } = await pool.query(`
    UPDATE inventory_items
    SET
      name = COALESCE($1, name),
      unit = COALESCE($2, unit),
      quantity = COALESCE($3, quantity),
      updated_at = now()
    WHERE id = $4
    RETURNING *
  `, [
    name ? name.trim().toLowerCase() : null,
    unit || null,
    quantity,
    id,
  ]);

  if (!rows.length) {
    throw new AppError("Ítem de inventario no encontrado", 404);
  }

  res.json({
    success: true,
    data: rows[0],
  });
});

/**
 * Ajustar stock (sumar o restar)
 * body: { amount: number }
 */
exports.adjustInventoryQuantity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  if (typeof amount !== "number") {
    throw new AppError("amount debe ser un número", 400);
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(`
      UPDATE inventory_items
      SET
        quantity = quantity + $1,
        updated_at = now()
      WHERE id = $2
      RETURNING *
    `, [amount, id]);

    if (!rows.length) {
      throw new AppError("Ítem de inventario no encontrado", 404);
    }

    if (rows[0].quantity < 0) {
      throw new AppError("La cantidad no puede quedar en negativo", 400);
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
});

/**
 * Eliminar ítem de inventario
 */
exports.deleteInventoryItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { rows } = await pool.query(`
    DELETE FROM inventory_items
    WHERE id = $1
    RETURNING *
  `, [id]);

  if (!rows.length) {
    throw new AppError("Ítem de inventario no encontrado", 404);
  }

  res.json({
    success: true,
    message: "Ítem eliminado correctamente",
  });
});