const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// Solo para hacer pruebas rápidas de funcionamiento 
exports.test = asyncHandler(async (req, res) => {
    res.send("API de Tours funcionando");
});

// GET /tours - Obtener todos los toures (hasta los que están deshabilitados)
exports.getAll = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT id, title, description,
            duration_hours, duration_days,
            max_persons, person_price,
            image_url, base_location,
            is_active, created_at
        FROM tours
        ORDER BY created_at DESC
    `);

    res.status(200).json({
        success: true,
        data: rows
    });
});

// Obtener solamente los toures activos (disponibles para el usuario)
exports.getAllActive = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT id, title, description,
            duration_hours, duration_days,
            max_persons, person_price,
            image_url, base_location,
            created_at
        FROM tours
        WHERE is_active = true
        ORDER BY created_at DESC
    `);

    res.status(200).json({
        success: true,
        data: rows
    });
});

// GET /tours/:id - Get single tour
exports.getById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rows } = await pool.query(`
        SELECT id, title, description,
            duration_hours, duration_days,
            max_persons, person_price,
            image_url, base_location,
            is_active, created_at
        FROM tours
        WHERE id = $1
    `, [id]);

    if (!rows.length) {
        throw new AppError("Tour no encontrado", 404, "TOUR_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        data: rows[0]
    });
});

// POST /tours - Create new tour
exports.create = asyncHandler(async (req, res) => {
    const { title, description, duration_hours, duration_days, max_persons, person_price, image_url, base_location } = req.body;

    if (!title || !duration_hours || !duration_days || !max_persons || !person_price) {
        throw new AppError("title, duration_hours, duration_days, max_persons y person_price son requeridos", 400, "MISSING_FIELDS");
    }

    const { rows } = await pool.query(`
        INSERT INTO tours (
            title, description,
            duration_hours, duration_days,
            max_persons, person_price,
            image_url, base_location
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *
    `, [
        title,
        description || null,
        duration_hours,
        duration_days,
        max_persons,
        person_price,
        image_url || null,
        base_location || null
    ]);

    res.status(201).json({
        success: true,
        data: rows[0]
    });
});

// PUT /tours/:id - Update tour
exports.update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, duration_hours, duration_days, max_persons, person_price, image_url, base_location, is_active } = req.body;

    const { rows } = await pool.query(`
        UPDATE tours
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            duration_hours = COALESCE($3, duration_hours),
            duration_days = COALESCE($4, duration_days),
            max_persons = COALESCE($5, max_persons),
            person_price = COALESCE($6, person_price),
            image_url = COALESCE($7, image_url),
            base_location = COALESCE($8, base_location),
            is_active = COALESCE($9, is_active)
        WHERE id = $10
        RETURNING *
    `, [
        title,
        description,
        duration_hours,
        duration_days,
        max_persons,
        person_price,
        image_url,
        base_location,
        is_active,
        id
    ]);

    if (!rows.length) {
        throw new AppError("Tour no encontrado", 404, "TOUR_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        data: rows[0]
    });
});

// DELETE /tours/:id - Delete tour
exports.delete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rowCount } = await pool.query(`
        DELETE FROM tours WHERE id = $1
    `, [id]);

    if (!rowCount) {
        throw new AppError("Tour no encontrado", 404, "TOUR_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        message: "Tour eliminado"
    });
});