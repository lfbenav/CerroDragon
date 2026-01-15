const pool = require("../config/db");
const asyncHandler = require("./asyncHandler.middleware");
const AppError = require("../utils/AppError");

exports.requirePermission = (permissionCode) =>
    asyncHandler(async (req, res, next) => {
        if (!req.user?.id) {
            throw new AppError("No autorizado", 401, "NO_AUTH_CONTEXT");
        }

        const { rows } = await pool.query(
            `
            SELECT 1
            FROM permissions p
            JOIN role_permissions rp ON rp.permission_id = p.id
            JOIN user_roles ur ON ur.role_id = rp.role_id
            WHERE ur.user_id = $1
                AND p.code = $2
            LIMIT 1
            `,
            [req.user.id, permissionCode]
        );

        if (!rows.length) {
            throw new AppError(
                "No tiene permisos para esta acción", 403, "FORBIDDEN"
            );
        }

        next();
    });
