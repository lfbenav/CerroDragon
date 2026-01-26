const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// Solo para hacer pruebas rápidas de funcionamiento 
exports.test = asyncHandler(async (req, res) => {
    res.send("API de Users funcionando");
});

// Obtener todos los usuarios registrados
exports.getAll = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT id, email, type, is_active
        FROM users
    `);

    if (!rows.length) {
        throw new AppError("No hay usuarios disponibles", 404, "USERS_EMPTY");
    }

    res.status(200).json({
        success: true,
        data: rows
    });
});

// Obtener todos los clientes registrados
exports.getAllClients = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT
            u.id AS user_id,
            u.email,
            u.is_active,
            c.full_name,
            c.phone,
            c.created_at
        FROM users u
        JOIN customers c ON c.user_id = u.id
        WHERE u.type = 'client'
        ORDER BY c.created_at DESC
    `);

    if (!rows.length) {
        throw new AppError("No hay clientes registrados", 404, "CLIENTS_EMPTY");
    }

    res.status(200).json({
        success: true,
        data: rows
    });
});

// Obtener todos los guías registrados
exports.getAllGuides = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT
            u.id AS user_id,
            u.email,
            u.is_active,
            g.full_name,
            g.phone,
            g.bio,
            g.image_url,
            g.is_active AS guide_active,
            g.created_at
        FROM users u
        JOIN guides g ON g.user_id = u.id
        WHERE u.type = 'guide'
        ORDER BY g.created_at DESC
    `);

    if (!rows.length) {
        throw new AppError("No hay guías registrados", 404, "GUIDES_EMPTY");
    }

    res.status(200).json({
        success: true,
        data: rows
    });
});

// Obtener todos los administradores registrados
exports.getAllAdmins = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT
            u.id AS user_id,
            u.email,
            u.is_active,
            c.full_name,
            c.phone,
            c.created_at
        FROM users u
        JOIN admins c ON c.user_id = u.id
        WHERE u.type = 'admin'
        ORDER BY c.created_at DESC
    `);

    if (!rows.length) {
        throw new AppError("No hay administradores registrados", 404, "ADMINS_EMPTY");
    }

    res.status(200).json({
        success: true,
        data: rows
    });
});

// Obtener user por email
exports.getByEmail = asyncHandler(async (req, res) => {
    const { email } = req.params;

    const { rows } = await pool.query(`
        SELECT id, email, type, is_active, created_at
        FROM users
        WHERE email = $1;
    `, [email]);

    if (!rows.length) {
        throw new AppError("Usuario no encontrado", 404, "USER_NOT_FOUND");
    }

    res.json({ success: true, data: rows[0] });
});

// Obtener user por ID
exports.getById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rows } = await pool.query(`
        SELECT id, email, type, is_active, created_at
        FROM users
        WHERE id = $1;
    `, [id]);

    if (!rows.length) {
        throw new AppError("Usuario no encontrado", 404, "USER_NOT_FOUND");
    }

    res.json({ success: true, data: rows[0] });
});

// Obtener cliente por ID
exports.getClientByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rows } = await pool.query(`
        SELECT
            u.id AS user_id,
            u.email,
            u.is_active,
            c.full_name,
            c.phone,
            c.created_at
        FROM users u
        JOIN customers c ON c.user_id = u.id
        WHERE u.id = $1 AND u.type = 'client'
    `, [id]);

    if (!rows.length) {
        throw new AppError("Cliente no encontrado", 404, "CLIENT_NOT_FOUND");
    }

    res.json({ success: true, data: rows[0] });
});

// Obtener guía por ID
exports.getGuideByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rows } = await pool.query(`
        SELECT
            u.id AS user_id,
            u.email,
            u.is_active,
            g.full_name,
            g.phone,
            g.bio,
            g.image_url,
            g.is_active AS guide_active
        FROM users u
        JOIN guides g ON g.user_id = u.id
        WHERE u.id = $1 AND u.type = 'guide'
    `, [id]);

    if (!rows.length) {
        throw new AppError("Guía no encontrado", 404, "GUIDE_NOT_FOUND");
    }

    res.json({ success: true, data: rows[0] });
});

// Obtener admin por ID
exports.getAdminByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rows } = await pool.query(`
        SELECT
            u.id AS user_id,
            u.email,
            u.is_active,
            c.full_name,
            c.phone,
            c.created_at
        FROM users u
        JOIN admins c ON c.user_id = u.id
        WHERE u.id = $1 AND u.type = 'admin'
    `, [id]);

    if (!rows.length) {
        throw new AppError("Administrador no encontrado", 404, "ADMIN_NOT_FOUND");
    }

    res.json({ success: true, data: rows[0] });
});

// Editar usuario
exports.updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    // Validar email duplicado si viene email
    if (email) {
        const emailExists = await pool.query(
            `SELECT 1 FROM users WHERE email = $1 AND id <> $2`,
            [email, id]
        );

        if (emailExists.rows.length) {
            throw new AppError("Email ya registrado", 409, "EMAIL_EXISTS");
        }
    }

    const { rowCount } = await pool.query(`
        UPDATE users
        SET email = COALESCE($1, email)
        WHERE id = $2
    `, [email, id]);

    if (!rowCount) {
        throw new AppError("Usuario no encontrado", 404, "USER_NOT_FOUND");
    }

    res.json({ success: true });
});

// Editar cliente
exports.updateClient = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { email, full_name, phone } = req.body || {};

    const db = await pool.connect();

    try {
        // Verificar que exista el cliente
        const clientExists = await db.query(`
            SELECT 1 FROM users WHERE id = $1 AND type = 'client'
        `, [id]);

        if (!clientExists.rows.length) {
            throw new AppError("Cliente no encontrado", 404, "CLIENT_NOT_FOUND");
        }

        // Validar email duplicado
        if (email) {
            const emailExists = await db.query(`
                SELECT 1 FROM users WHERE email = $1 AND id <> $2
            `, [email, id]);

            if (emailExists.rows.length) {
                throw new AppError("Email ya registrado", 409, "EMAIL_EXISTS");
            }
        }

        await db.query("BEGIN");

        await db.query(`
            UPDATE users
            SET email = COALESCE($1, email)
            WHERE id = $2
        `, [email, id]);

        await db.query(`
            UPDATE customers
            SET
                full_name = COALESCE($1, full_name),
                phone = COALESCE($2, phone),
                updated_at = now()
            WHERE user_id = $3
        `, [full_name, phone, id]);

        await db.query("COMMIT");

        res.json({ success: true });

    } catch (error) {
        await db.query("ROLLBACK");
        throw error;
    } finally {
        db.release();
    }
});

// Editar guia
exports.updateGuide = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { email, full_name, phone, bio, image_url } = req.body || {};

    const db = await pool.connect();

    try {
        // Verificar que exista el guía
        const guideExists = await db.query(`
            SELECT 1 FROM users WHERE id = $1 AND type = 'guide'
        `, [id]);

        if (!guideExists.rows.length) {
            throw new AppError("Guía no encontrado", 404, "GUIDE_NOT_FOUND");
        }

        // Validar email duplicado
        if (email) {
            const emailExists = await db.query(`
                SELECT 1 FROM users WHERE email = $1 AND id <> $2
            `, [email, id]);

            if (emailExists.rows.length) {
                throw new AppError("Email ya registrado", 409, "EMAIL_EXISTS");
            }
        }

        await db.query("BEGIN");

        await db.query(`
            UPDATE users
            SET email = COALESCE($1, email)
            WHERE id = $2
        `, [email, id]);

        await db.query(`
            UPDATE guides
            SET
                full_name = COALESCE($1, full_name),
                phone = COALESCE($2, phone),
                bio = COALESCE($3, bio),
                image_url = COALESCE($4, image_url)
            WHERE user_id = $5
        `, [
            full_name,
            phone,
            bio,
            image_url,
            id
        ]);

        await db.query("COMMIT");

        res.json({ success: true });

    } catch (error) {
        await db.query("ROLLBACK");
        throw error;
    } finally {
        db.release();
    }
});

// Editar admin
exports.updateAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { email, full_name, phone } = req.body || {};

    const db = await pool.connect();

    try {
        // Verificar que exista el admin
        const adminExists = await db.query(`
            SELECT 1 FROM users WHERE id = $1 AND type = 'admin'
        `, [id]);

        if (!adminExists.rows.length) {
            throw new AppError("Admin no encontrado", 404, "ADMIN_NOT_FOUND");
        }

        // Validar email duplicado
        if (email) {
            const emailExists = await db.query(`
                SELECT 1 FROM users WHERE email = $1 AND id <> $2
            `, [email, id]);

            if (emailExists.rows.length) {
                throw new AppError("Email ya registrado", 409, "EMAIL_EXISTS");
            }
        }

        await db.query("BEGIN");

        await db.query(`
            UPDATE users
            SET email = COALESCE($1, email)
            WHERE id = $2
        `, [email, id]);

        await db.query(`
            UPDATE admins
            SET
                full_name = COALESCE($1, full_name),
                phone = COALESCE($2, phone),
                updated_at = now()
            WHERE user_id = $3
        `, [full_name, phone, id]);

        await db.query("COMMIT");

        res.json({ success: true });

    } catch (error) {
        await db.query("ROLLBACK");
        throw error;
    } finally {
        db.release();
    }
});

// Activar usuario
exports.activateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const db = await pool.connect();

    try {
        await db.query("BEGIN");

        // Activar user y obtener tipo
        const userRes = await db.query(`
            UPDATE users
            SET is_active = true
            WHERE id = $1
            RETURNING type
        `, [id]);

        if (!userRes.rowCount) {
            throw new AppError("Usuario no encontrado", 404, "USER_NOT_FOUND");
        }

        const { type } = userRes.rows[0];

        // Si es guía, activar también el perfil de guía
        if (type === 'guide') {
            await db.query(`
                UPDATE guides
                SET is_active = true
                WHERE user_id = $1
            `, [id]);
        }

        await db.query("COMMIT");

        res.json({ success: true });

    } catch (error) {
        await db.query("ROLLBACK");
        throw error;
    } finally {
        db.release();
    }
});

// Desactivar usuario
exports.deactivateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const db = await pool.connect();

    try {
        await db.query("BEGIN");

        // Desactivar user y obtener tipo
        const userRes = await db.query(`
            UPDATE users
            SET is_active = false
            WHERE id = $1
            RETURNING type
        `, [id]);

        if (!userRes.rowCount) {
            throw new AppError("Usuario no encontrado", 404, "USER_NOT_FOUND");
        }

        const { type } = userRes.rows[0];

        // Si es guía, desactivar también el perfil de guía
        if (type === 'guide') {
            await db.query(`
                UPDATE guides
                SET is_active = false
                WHERE user_id = $1
            `, [id]);
        }

        await db.query("COMMIT");

        res.json({ success: true });

    } catch (error) {
        await db.query("ROLLBACK");
        throw error;
    } finally {
        db.release();
    }
});

// Obtener todos los permisos
exports.getAllPermissions = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT id, code, description FROM permissions
    `);

    res.json({ success: true, data: rows });
});

// Obtener permisos por user_id
exports.getPermissionsByUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rows } = await pool.query(`
        SELECT p.code, p.description
        FROM user_roles ur
        JOIN role_permissions rp ON rp.role_id = ur.role_id
        JOIN permissions p ON p.id = rp.permission_id
        WHERE ur.user_id = $1
    `, [id]);

    res.json({ success: true, data: rows });
});


// Asignar permiso a un rol
exports.assignPermissionToRole = asyncHandler(async (req, res) => {
    const { role_id, permission_id } = req.body;

    await pool.query(`
        INSERT INTO role_permissions (role_id, permission_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
    `, [role_id, permission_id]);

    res.json({ success: true });
});

// Quitar permiso a un rol
exports.removePermissionFromRole = asyncHandler(async (req, res) => {
    const { role_id, permission_id } = req.body;

    if (!role_id || !permission_id) {
        throw new AppError(
            "role_id y permission_id son requeridos",
            400,
            "MISSING_FIELDS"
        );
    }

    const { rowCount } = await pool.query(`
        DELETE FROM role_permissions
        WHERE role_id = $1 AND permission_id = $2
    `, [role_id, permission_id]);

    if (!rowCount) {
        throw new AppError(
            "El permiso no estaba asignado a este rol",
            404,
            "PERMISSION_NOT_ASSIGNED"
        );
    }

    res.json({ success: true });
});

// Obtener role_id asociado a un usuario
exports.getRoleIdByUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rows } = await pool.query(`
        SELECT role_id
        FROM user_roles
        WHERE user_id = $1
        LIMIT 1
    `, [id]);

    if (!rows.length) {
        throw new AppError(
            "El usuario no tiene rol asignado",
            404,
            "ROLE_NOT_FOUND"
        );
    }

    res.json({
        success: true,
        role_id: rows[0].role_id
    });
});

// Obtener id de cliente por el user id (por el colocho que se hizo con las reservas)
exports.getClientIdByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { rows } = await pool.query(`
        SELECT
            c.id
        FROM users u
        JOIN customers c ON c.user_id = u.id
        WHERE u.id = $1 AND u.type = 'client'
    `, [id]);

    if (!rows.length) {
        throw new AppError("Cliente no encontrado", 404, "CLIENT_NOT_FOUND");
    }

    res.json({ success: true, data: rows[0] });
});