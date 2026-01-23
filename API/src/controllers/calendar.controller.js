const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// Solo para hacer pruebas rápidas de funcionamiento 
exports.test = asyncHandler(async (req, res) => {
    res.send("API de Calendario funcionando");
});

// GET /calendar
exports.getCalendar = asyncHandler(async (req, res) => {
    const globalDays = await pool.query(`
        SELECT id, day, status, note
        FROM global_calendar_unavailable_days
        ORDER BY day
    `);

    const weekdays = await pool.query(`
        SELECT id, tour_id, weekday, status, note
        FROM tour_calendar_unavailable_weekday
    `);

    const days = await pool.query(`
        SELECT id, tour_id, day, status, note
        FROM tour_calendar_unavailable_day
    `);

    res.status(200).json({
        success: true,
        global_days: globalDays.rows,
        tour_weekdays: weekdays.rows,
        tour_days: days.rows
    });
});

// GET /calendar/:tour_id
exports.getCalendarByTour = asyncHandler(async (req, res) => {
    const { tour_id } = req.params;

    const tourExists = await pool.query(`
        SELECT 1 FROM tours WHERE id = $1
    `, [tour_id]);

    if (!tourExists.rowCount) {
        throw new AppError("Tour no existe", 404, "TOUR_NOT_FOUND");
    }

    const weekdays = await pool.query(`
        SELECT id, weekday, status, note
        FROM tour_calendar_unavailable_weekday
        WHERE tour_id = $1
    `, [tour_id]);

    const days = await pool.query(`
        SELECT id, day, status, note
        FROM tour_calendar_unavailable_day
        WHERE tour_id = $1
        ORDER BY day
    `, [tour_id]);

    const globalDays = await pool.query(`
        SELECT day, status, note
        FROM global_calendar_unavailable_days
    `);

    res.status(200).json({
        success: true,
        tour_id,
        weekdays: weekdays.rows,
        days: days.rows,
        global_days: globalDays.rows
    });
});

// POST /calendar
exports.createCalendarEntry = asyncHandler(async (req, res) => {
    const {
        type,        // 'GLOBAL_DAY' | 'TOUR_DAY' | 'TOUR_WEEKDAY'
        tour_id,
        day,
        weekday,
        status,
        note
    } = req.body || {};

    if (!type || !status) {
        throw new AppError("type y status son requeridos", 400, "MISSING_FIELDS");
    }

    let query;
    let values;

    switch (type) {
        case "GLOBAL_DAY":
            if (!day) throw new AppError("day requerido", 400);
            query = `
                INSERT INTO global_calendar_unavailable_days (day, status, note)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            values = [day, status, note || null];
            break;

        case "TOUR_DAY":
            if (!tour_id || !day) throw new AppError("tour_id y day requeridos", 400);
            query = `
                INSERT INTO tour_calendar_unavailable_day (tour_id, day, status, note)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;
            values = [tour_id, day, status, note || null];
            break;

        case "TOUR_WEEKDAY":
            if (!tour_id || weekday === undefined)
                throw new AppError("tour_id y weekday requeridos", 400);
            query = `
                INSERT INTO tour_calendar_unavailable_weekday (tour_id, weekday, status, note)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;
            values = [tour_id, weekday, status, note || null];
            break;

        default:
            throw new AppError("Tipo inválido", 400, "INVALID_TYPE");
    }

    const { rows } = await pool.query(query, values);

    res.status(201).json({
        success: true,
        entry: rows[0]
    });
});

// PUT /calendar/:id
exports.updateCalendarEntry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, note } = req.body || {};

    if (!status) {
        throw new AppError("status requerido", 400);
    }

    const tables = [
        "global_calendar_unavailable_days",
        "tour_calendar_unavailable_day",
        "tour_calendar_unavailable_weekday"
    ];

    let updated = null;

    for (const table of tables) {
        const { rows } = await pool.query(`
            UPDATE ${table}
            SET status = $1,
                note = $2
            WHERE id = $3
            RETURNING *
        `, [status, note || null, id]);

        if (rows.length) {
            updated = rows[0];
            break;
        }
    }

    if (!updated) {
        throw new AppError("Entrada no encontrada", 404, "CALENDAR_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        entry: updated
    });
});

// DELETE /calendar/:id
exports.deleteCalendarEntry = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const tables = [
        "global_calendar_unavailable_days",
        "tour_calendar_unavailable_day",
        "tour_calendar_unavailable_weekday"
    ];

    let deleted = false;

    for (const table of tables) {
        const resDelete = await pool.query(`
            DELETE FROM ${table}
            WHERE id = $1
        `, [id]);

        if (resDelete.rowCount) {
            deleted = true;
            break;
        }
    }

    if (!deleted) {
        throw new AppError("Entrada no encontrada", 404, "CALENDAR_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        message: "Entrada eliminada"
    });
});

// GET /calendar/colors
exports.getCalendarColors = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        colors: {
            AVAILABLE: "green",
            LIMITED: "yellow",
            FULL: "red",
            HOLIDAY: "gray",
            BLOCKED: "black"
        }
    });
});
