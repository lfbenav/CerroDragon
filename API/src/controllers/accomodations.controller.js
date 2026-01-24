const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// Solo para hacer pruebas rápidas de funcionamiento 
exports.test = asyncHandler(async (req, res) => {
    res.send("API de Cabañas funcionando");
});

// Obtener todas las cabañas
exports.getAll = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT *
        FROM accommodations
        WHERE is_active = true
        ORDER BY name
    `);

    res.json({ success: true, data: rows });
});

// Obtener una cabaña por id
exports.getById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rows } = await pool.query(`
        SELECT *
        FROM accommodations
        WHERE id = $1
    `, [id]);

    if (!rows.length) {
        throw new AppError("Alojamiento no encontrado", 404);
    }

    res.json({ success: true, data: rows[0] });
});

// Crear una cabaña
exports.create = asyncHandler(async (req, res) => {
    const { name, description, capacity, price, image_url } = req.body || {};

    if (!name || capacity == null) {
        throw new AppError("name y capacity requeridos", 400);
    }

    const { rows } = await pool.query(`
        INSERT INTO accommodations (name, description, capacity, price, image_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [
        name,
        description || null,
        capacity,
        price || null,
        image_url || null
    ]);

    res.status(201).json({ success: true, data: rows[0] });
});

// Actualizar info de una cabaña
exports.update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, capacity, price, image_url } = req.body || {};

    const { rowCount, rows } = await pool.query(`
        UPDATE accommodations
        SET name = COALESCE($1, name),
            description = COALESCE($2, description),
            capacity = COALESCE($3, capacity),
            price = COALESCE($4, price),
            image_url = COALESCE($5, image_url)
        WHERE id = $6
        RETURNING *
    `, [name, description, capacity, price, image_url, id]);

    if (!rowCount) {
        throw new AppError("Alojamiento no encontrado", 404);
    }

    res.json({ success: true, data: rows[0] });
});

// Poner si una cabaña está activa o no
exports.updateStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!status) {
        throw new AppError("status requerido", 400);
    }

    const { rowCount, rows } = await pool.query(`
        UPDATE accommodations
        SET status = $1
        WHERE id = $2
        RETURNING *
    `, [status, id]);

    if (!rowCount) {
        throw new AppError("Alojamiento no encontrado", 404);
    }

    res.json({ success: true, data: rows[0] });
});

// Para borrar una cabaña
exports.remove = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rowCount } = await pool.query(`
        DELETE FROM accommodations WHERE id = $1
    `, [id]);

    if (!rowCount) {
        throw new AppError("Alojamiento no encontrado", 404);
    }

    res.json({ success: true, message: "Alojamiento eliminado" });
});

// Para un cliente reservar una cabaña
exports.reserve = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { start_date, end_date, persons } = req.body || {};
    const userId = req.user.userId;

    if (!start_date || !end_date || !persons) {
        throw new AppError("start_date, end_date y persons requeridos", 400);
    }

    const { rows: customerRows } = await pool.query(`
        SELECT id FROM customers WHERE user_id = $1
    `, [userId]);

    if (!customerRows.length) {
        throw new AppError("Cliente no encontrado", 404);
    }

    const { rows: lodgeRows } = await pool.query(`
        SELECT capacity FROM accommodations WHERE id = $1 AND is_active = true
    `, [id]);

    if (!lodgeRows.length) {
        throw new AppError("Alojamiento no disponible", 404);
    }

    if (persons > lodgeRows[0].capacity) {
        throw new AppError("Capacidad excedida", 400);
    }

    const { rows } = await pool.query(`
        INSERT INTO accommodation_reservations
        (accommodation_id, customer_id, start_date, end_date, persons)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [id, customerRows[0].id, start_date, end_date, persons]);

    res.status(201).json({ success: true, data: rows[0] });
});

// Obtener todas las reservaciones de todas las cabañas
exports.getAllReservations = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT 
            ar.*,
            a.name AS accommodation_name,
            c.full_name AS customer_name
        FROM accommodation_reservations ar
        JOIN accommodations a ON a.id = ar.accommodation_id
        JOIN customers c ON c.id = ar.customer_id
        ORDER BY ar.start_date DESC
    `);

    res.status(200).json({
        success: true,
        data: rows
    });
});

// Obtener las reservaciones de una cabaña
exports.getReservations = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rows } = await pool.query(`
        SELECT ar.*, c.full_name
        FROM accommodation_reservations ar
        JOIN customers c ON c.id = ar.customer_id
        WHERE ar.accommodation_id = $1
        ORDER BY ar.start_date
    `, [id]);

    res.json({ success: true, data: rows });
});

// Para un admin confirmar una reservación
exports.confirmReservation = asyncHandler(async (req, res) => {
    const { reservation_id } = req.params;

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const { rows } = await client.query(`
            UPDATE accommodation_reservations
            SET status = 'CONFIRMED',
                confirmed_at = now()
            WHERE id = $1
            RETURNING accommodation_id
        `, [reservation_id]);

        if (!rows.length) {
            throw new AppError("Reservación no encontrada", 404);
        }

        await client.query(`
            UPDATE accommodations
            SET last_reserved = now()
            WHERE id = $1
        `, [rows[0].accommodation_id]);

        await client.query("COMMIT");

        res.json({ success: true, message: "Reservación confirmada" });
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
});

// Para un admin cancelar una reservación
exports.cancelReservation = asyncHandler(async (req, res) => {
    const { reservation_id } = req.params;

    const { rowCount } = await pool.query(`
        UPDATE accommodation_reservations
        SET status = 'CANCELLED', cancelled_at = now()
        WHERE id = $1
    `, [reservation_id]);

    if (!rowCount) {
        throw new AppError("Reservación no encontrada", 404);
    }

    res.json({ success: true, message: "Reservación cancelada" });
});

// Ver disponibilidad de una cabaña por rango de fechas
exports.getAvailability = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { start_date, end_date } = req.query || {};

    if (!start_date || !end_date) {
        throw new AppError("start_date y end_date requeridos", 400);
    }

    const { rows } = await pool.query(`
        SELECT 1
        FROM accommodation_reservations
        WHERE accommodation_id = $1
          AND status != 'CANCELLED'
          AND NOT (
            end_date <= $2 OR start_date >= $3
          )
    `, [id, start_date, end_date]);

    res.json({
        success: true,
        available: rows.length === 0
    });
});

// Ver mis reservaciones de cabañas
exports.getMyReservations = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const { rows } = await pool.query(`
        SELECT ar.*, a.name AS accommodation_name
        FROM accommodation_reservations ar
        JOIN customers c ON c.id = ar.customer_id
        JOIN accommodations a ON a.id = ar.accommodation_id
        WHERE c.user_id = $1
        ORDER BY ar.start_date DESC
    `, [userId]);

    res.json({ success: true, data: rows });
});

// Ver detalle de una reservación
exports.getReservationById = asyncHandler(async (req, res) => {
    const { reservation_id } = req.params;

    const { rows } = await pool.query(`
        SELECT 
            ar.*,
            a.name AS accommodation_name,
            c.full_name AS customer_name
        FROM accommodation_reservations ar
        JOIN accommodations a ON a.id = ar.accommodation_id
        JOIN customers c ON c.id = ar.customer_id
        WHERE ar.id = $1
    `, [reservation_id]);

    if (!rows.length) {
        throw new AppError("Reservación no encontrada", 404);
    }

    res.json({ success: true, data: rows[0] });
});

// Editar una reservación (fechas o personas)
exports.updateReservation = asyncHandler(async (req, res) => {
    const { reservation_id } = req.params;
    const { start_date, end_date, persons } = req.body || {};

    const { rows } = await pool.query(`
        SELECT accommodation_id
        FROM accommodation_reservations
        WHERE id = $1
    `, [reservation_id]);

    if (!rows.length) {
        throw new AppError("Reservación no encontrada", 404);
    }

    const accommodationId = rows[0].accommodation_id;

    // Validar traslape
    const overlap = await pool.query(`
        SELECT 1
        FROM accommodation_reservations
        WHERE accommodation_id = $1
          AND id != $2
          AND status != 'CANCELLED'
          AND NOT (
            end_date <= $3 OR start_date >= $4
          )
    `, [accommodationId, reservation_id, start_date, end_date]);

    if (overlap.rows.length) {
        throw new AppError("Fechas no disponibles", 400);
    }

    const update = await pool.query(`
        UPDATE accommodation_reservations
        SET start_date = COALESCE($1, start_date),
            end_date   = COALESCE($2, end_date),
            persons    = COALESCE($3, persons)
        WHERE id = $4
        RETURNING *
    `, [start_date, end_date, persons, reservation_id]);

    res.json({ success: true, data: update.rows[0] });
});
