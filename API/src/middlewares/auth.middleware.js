const pool = require("../config/db");
const asyncHandler = require("./asyncHandler.middleware");
const AppError = require("../utils/AppError");
const { verifyAccessToken } = require("../utils/jwt");

module.exports = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("No autorizado (falta token)", 401, "NO_TOKEN");
    }

    const token = authHeader.split(" ")[1];

    let payload;
    try {
        payload = verifyAccessToken(token);
    } catch (e) {
        throw new AppError("Token inválido o expirado", 401, "INVALID_TOKEN");
    }

    const { rows } = await pool.query(
        `SELECT id, email, is_active
        FROM users
        WHERE id = $1`,
        [payload.userId]
    );

    if (!rows.length) {
        throw new AppError("Usuario no existe", 401, "USER_NOT_FOUND");
    }
    if (!rows[0].is_active) {
        throw new AppError("Usuario inactivo", 403, "USER_INACTIVE");
    }

    req.user = rows[0];
    next();
});
