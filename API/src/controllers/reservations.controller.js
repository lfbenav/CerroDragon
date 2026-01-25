const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// Solo para hacer pruebas rápidas de funcionamiento 
exports.test = asyncHandler(async (req, res) => {
    res.send("API de Reservaciones funcionando");
});

// GET /reservations - Get all reservations (admin) with filters
exports.getAll = asyncHandler(async (req, res) => {
    const { status, date, tour_id } = req.query;

    let query = `
        SELECT r.id, r.customer_id, r.tour_id, r.promotion_id, r.tour_package_id,
               r.tour_date, r.reserved_at, r.persons, r.can_arrive_4x4,
               r.meeting_point_id, r.subtotal_usd, r.discount_usd,
               r.meeting_extra_usd, r.total_usd, r.status,
               r.confirmed_at, r.cancelled_at,
               t.title as tour_title
        FROM reservations r
        JOIN tours t ON t.id = r.tour_id
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (status) {
        query += ` AND r.status = $${paramIndex++}`;
        params.push(status);
    }

    if (date) {
        query += ` AND r.tour_date = $${paramIndex++}`;
        params.push(date);
    }

    if (tour_id) {
        query += ` AND r.tour_id = $${paramIndex++}`;
        params.push(tour_id);
    }

    query += ` ORDER BY r.reserved_at DESC`;

    const { rows } = await pool.query(query, params);

    res.status(200).json({
        success: true,
        data: rows
    });
});

// GET /reservations/:id - Get single reservation
exports.getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    let query = `
        SELECT r.id, r.customer_id, r.tour_id, r.promotion_id, r.tour_package_id,
               r.tour_date, r.reserved_at, r.persons, r.can_arrive_4x4,
               r.meeting_point_id, r.subtotal_usd, r.discount_usd,
               r.meeting_extra_usd, r.total_usd, r.status,
               r.confirmed_at, r.cancelled_at,
               t.title as tour_title
        FROM reservations r
        JOIN tours t ON t.id = r.tour_id
        WHERE r.id = $1
    `;
    const params = [id];

    // Customers can only see their own reservations
    if (user.role === 'CUSTOMER') {
        query += ` AND r.customer_id = $2`;
        params.push(user.id);
    }

    const { rows } = await pool.query(query, params);

    if (!rows.length) {
        throw new AppError("Reservación no encontrada", 404, "RESERVATION_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        data: rows[0]
    });
});

// POST /reservations - Create new reservation
exports.create = asyncHandler(async (req, res) => {
    const {
        customer_id,
        tour_id,
        promotion_id,
        tour_package_id,
        tour_date,
        persons,
        can_arrive_4x4,
        meeting_point_id,
        subtotal_usd,
        discount_usd = 0,
        meeting_extra_usd = 0,
        total_usd
    } = req.body;

    // Validate required fields
    if (!customer_id || !tour_id || !tour_date || !persons || subtotal_usd === undefined || total_usd === undefined) {
        throw new AppError("Campos requeridos: customer_id, tour_id, tour_date, persons, subtotal_usd, total_usd", 400, "MISSING_FIELDS");
    }

    // Verify tour exists
    const tourCheck = await pool.query(`SELECT id FROM tours WHERE id = $1`, [tour_id]);
    if (!tourCheck.rows.length) {
        throw new AppError("Tour no encontrado", 404, "TOUR_NOT_FOUND");
    }

    // Verify promotion if provided
    if (promotion_id) {
        const promoCheck = await pool.query(`SELECT id FROM promotions WHERE id = $1`, [promotion_id]);
        if (!promoCheck.rows.length) {
            throw new AppError("Promoción no encontrada", 404, "PROMOTION_NOT_FOUND");
        }
    }

    // Verify package if provided
    if (tour_package_id) {
        const pkgCheck = await pool.query(`SELECT id FROM tour_packages WHERE id = $1`, [tour_package_id]);
        if (!pkgCheck.rows.length) {
            throw new AppError("Paquete no encontrado", 404, "PACKAGE_NOT_FOUND");
        }
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Create reservation
        const { rows } = await client.query(`
            INSERT INTO reservations (
                customer_id, tour_id, promotion_id, tour_package_id,
                tour_date, persons, can_arrive_4x4, meeting_point_id,
                subtotal_usd, discount_usd, meeting_extra_usd, total_usd
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `, [
            customer_id, tour_id, promotion_id || null, tour_package_id || null,
            tour_date, persons, can_arrive_4x4 || null, meeting_point_id || null,
            subtotal_usd, discount_usd, meeting_extra_usd, total_usd
        ]);

        // Record initial status in history
        await client.query(`
            INSERT INTO reservation_status_history (reservation_id, old_status, new_status, changed_by)
            VALUES ($1, NULL, 'PENDING', $2)
        `, [rows[0].id, req.user?.id || null]);

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
});

// PUT /reservations/:id - Update reservation
exports.update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        tour_date,
        persons,
        can_arrive_4x4,
        meeting_point_id
    } = req.body;

    // Note: Financial fields should NOT be updated after creation (snapshot rule)
    const { rows } = await pool.query(`
        UPDATE reservations
        SET tour_date = COALESCE($1, tour_date),
            persons = COALESCE($2, persons),
            can_arrive_4x4 = COALESCE($3, can_arrive_4x4),
            meeting_point_id = COALESCE($4, meeting_point_id)
        WHERE id = $5
        RETURNING *
    `, [tour_date, persons, can_arrive_4x4, meeting_point_id, id]);

    if (!rows.length) {
        throw new AppError("Reservación no encontrada", 404, "RESERVATION_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        data: rows[0]
    });
});

// DELETE /reservations/:id - Delete reservation (admin only)
exports.delete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rowCount } = await pool.query(`
        DELETE FROM reservations WHERE id = $1
    `, [id]);

    if (!rowCount) {
        throw new AppError("Reservación no encontrada", 404, "RESERVATION_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        message: "Reservación eliminada"
    });
});

// PUT /reservations/:id/status - Update reservation status (admin only)
exports.updateStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    if (!status) {
        throw new AppError("status es requerido", 400, "MISSING_STATUS");
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'REFUND_REQUESTED', 'REFUNDED'];
    if (!validStatuses.includes(status)) {
        throw new AppError(`Status inválido. Debe ser: ${validStatuses.join(', ')}`, 400, "INVALID_STATUS");
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Get current status
        const current = await client.query(`
            SELECT id, status FROM reservations WHERE id = $1 FOR UPDATE
        `, [id]);

        if (!current.rows.length) {
            throw new AppError("Reservación no encontrada", 404, "RESERVATION_NOT_FOUND");
        }

        const oldStatus = current.rows[0].status;

        // Update reservation status
        let updateQuery = `
            UPDATE reservations
            SET status = $1
        `;
        const updateParams = [status];
        let paramIndex = 2;

        if (status === 'CONFIRMED') {
            updateQuery += `, confirmed_at = NOW()`;
        } else if (status === 'CANCELLED' || status === 'REFUNDED') {
            updateQuery += `, cancelled_at = NOW()`;
        }

        updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
        updateParams.push(id);

        const { rows } = await client.query(updateQuery, updateParams);

        // Record status change in history
        await client.query(`
            INSERT INTO reservation_status_history (reservation_id, old_status, new_status, changed_by)
            VALUES ($1, $2, $3, $4)
        `, [id, oldStatus, status, user.id]);

        await client.query('COMMIT');

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
});

// GET /reservations/:id/status-history - Get status history
exports.getStatusHistory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rows } = await pool.query(`
        SELECT rsh.id, rsh.reservation_id, rsh.old_status, rsh.new_status,
               rsh.changed_by, rsh.changed_at,
               u.email as changed_by_email
        FROM reservation_status_history rsh
        LEFT JOIN users u ON u.id = rsh.changed_by
        WHERE rsh.reservation_id = $1
        ORDER BY rsh.changed_at ASC
    `, [id]);

    res.status(200).json({
        success: true,
        data: rows
    });
});

// GET /my-reservations - Get customer's own reservations
exports.getMyReservations = asyncHandler(async (req, res) => {
    const user = req.user;

    // Get customer_id from user_id
    const customerRes = await pool.query(`
        SELECT id FROM customers WHERE user_id = $1
    `, [user.id]);

    if (!customerRes.rows.length) {
        return res.status(200).json({
            success: true,
            data: []
        });
    }

    const customerId = customerRes.rows[0].id;

    const { rows } = await pool.query(`
        SELECT r.id, r.tour_id, r.promotion_id, r.tour_package_id,
               r.tour_date, r.reserved_at, r.persons,
               r.subtotal_usd, r.discount_usd, r.meeting_extra_usd, r.total_usd,
               r.status, r.confirmed_at, r.cancelled_at,
               t.title as tour_title, t.description as tour_description
        FROM reservations r
        JOIN tours t ON t.id = r.tour_id
        WHERE r.customer_id = $1
        ORDER BY r.reserved_at DESC
    `, [customerId]);

    res.status(200).json({
        success: true,
        data: rows
    });
});

// POST /reservations/:id/request-refund - Customer requests refund
exports.requestRefund = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Get reservation and verify ownership
        const current = await client.query(`
            SELECT id, status, customer_id FROM reservations WHERE id = $1 FOR UPDATE
        `, [id]);

        if (!current.rows.length) {
            throw new AppError("Reservación no encontrada", 404, "RESERVATION_NOT_FOUND");
        }

        // Verify customer owns this reservation
        if (current.rows[0].customer_id !== user.id) {
            throw new AppError("No autorizado", 403, "FORBIDDEN");
        }

        const oldStatus = current.rows[0].status;

        // Can only request refund from CONFIRMED or PENDING
        if (!['CONFIRMED', 'PENDING'].includes(oldStatus)) {
            throw new AppError("No se puede solicitar reembolso en el estado actual", 400, "INVALID_STATUS_FOR_REFUND");
        }

        // Update status to REFUND_REQUESTED
        const { rows } = await client.query(`
            UPDATE reservations
            SET status = 'REFUND_REQUESTED'
            WHERE id = $1
            RETURNING *
        `, [id]);

        // Record status change
        await client.query(`
            INSERT INTO reservation_status_history (reservation_id, old_status, new_status, changed_by)
            VALUES ($1, $2, 'REFUND_REQUESTED', $3)
        `, [id, oldStatus, user.id]);

        await client.query('COMMIT');

        res.status(200).json({
            success: true,
            data: rows[0],
            message: "Solicitud de reembolso registrada"
        });
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
});