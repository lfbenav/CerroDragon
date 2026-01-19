const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// GET /reservations/:id/documents - Get documents for a reservation
exports.getByReservation = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Verify reservation exists
    const resCheck = await pool.query(`SELECT id FROM reservations WHERE id = $1`, [id]);
    if (!resCheck.rows.length) {
        throw new AppError("Reservación no encontrada", 404, "RESERVATION_NOT_FOUND");
    }

    const { rows } = await pool.query(`
        SELECT id, reservation_id, doc_type, file_url, created_at
        FROM reservation_documents
        WHERE reservation_id = $1
        ORDER BY created_at DESC
    `, [id]);

    res.status(200).json({
        success: true,
        data: rows
    });
});

// POST /reservations/:id/documents - Add document to reservation
exports.create = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { doc_type, file_url } = req.body;

    if (!doc_type || !file_url) {
        throw new AppError("doc_type y file_url son requeridos", 400, "MISSING_FIELDS");
    }

    if (!['RECEIPT', 'CONFIRMATION'].includes(doc_type)) {
        throw new AppError("doc_type debe ser RECEIPT o CONFIRMATION", 400, "INVALID_DOC_TYPE");
    }

    // Verify reservation exists
    const resCheck = await pool.query(`SELECT id FROM reservations WHERE id = $1`, [id]);
    if (!resCheck.rows.length) {
        throw new AppError("Reservación no encontrada", 404, "RESERVATION_NOT_FOUND");
    }

    const { rows } = await pool.query(`
        INSERT INTO reservation_documents (reservation_id, doc_type, file_url)
        VALUES ($1, $2, $3)
        RETURNING id, reservation_id, doc_type, file_url, created_at
    `, [id, doc_type, file_url]);

    res.status(201).json({
        success: true,
        data: rows[0]
    });
});

// GET /documents/:id - Get single document
exports.getById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rows } = await pool.query(`
        SELECT id, reservation_id, doc_type, file_url, created_at
        FROM reservation_documents
        WHERE id = $1
    `, [id]);

    if (!rows.length) {
        throw new AppError("Documento no encontrado", 404, "DOCUMENT_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        data: rows[0]
    });
});
