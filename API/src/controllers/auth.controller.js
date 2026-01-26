const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { signAccessToken } = require("../utils/jwt");

// Solo para hacer pruebas rápidas de funcionamiento 
exports.test = asyncHandler(async (req, res) => {
    res.send("API de Auth funcionando");
});

// POST /auth/register/client
exports.registerClient = asyncHandler(async (req, res) => {
    const { email, password, full_name, phone } = req.body || {};

    // Validaciones de parámetros
    if (!email || !password || !full_name) {
        throw new AppError(
            "email, password y full_name son requeridos",
            400,
            "MISSING_FIELDS"
        );
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Verificar email duplicado
        const exists = await client.query(`
            SELECT 1 FROM users WHERE email = $1
        `, [email]);

        if (exists.rows.length) {
            throw new AppError("Email ya registrado", 409, "EMAIL_EXISTS");
        }

        // Hash de password
        const password_hash = await bcrypt.hash(password, 12);

        // Crear user
        const userRes = await client.query(`
            INSERT INTO users (email, password_hash, type)
            VALUES ($1, $2, $3)
            RETURNING id, email
        `, [email, password_hash, 'client']);

        const user = userRes.rows[0];

        // Crear perfil de customer
        await client.query(`
            INSERT INTO customers (user_id, full_name, phone)
            VALUES ($1, $2, $3)
        `, [user.id, full_name, phone || null]);

        // Asignar rol client (COMPARTIDO)
        const roleAssign = await client.query(`
            INSERT INTO user_roles (user_id, role_id)
            SELECT $1, r.id
            FROM roles r
            WHERE r.name = 'client'
        `, [user.id]);

        if (!roleAssign.rowCount) {
            throw new AppError("Rol 'client' no existe", 500, "ROLE_NOT_FOUND");
        }

        await client.query("COMMIT");

        // Retornar datos
        res.status(201).json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                type: "client",
            },
        });

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
});

// POST /auth/register/admin
exports.registerAdmin = asyncHandler(async (req, res) => {
    const { email, password, full_name, phone } = req.body || {};

    // Validaciones
    if (!email || !password || !full_name) {
        throw new AppError(
            "email, password y full_name son requeridos",
            400,
            "MISSING_FIELDS"
        );
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Verificar email duplicado
        const exists = await client.query(`
            SELECT 1 FROM users WHERE email = $1
        `, [email]);

        if (exists.rows.length) {
            throw new AppError("Email ya registrado", 409, "EMAIL_EXISTS");
        }

        // Hash de password
        const password_hash = await bcrypt.hash(password, 12);

        // Crear user
        const userRes = await client.query(`
            INSERT INTO users (email, password_hash, type)
            VALUES ($1, $2, 'admin')
            RETURNING id, email
        `, [email, password_hash]);

        const user = userRes.rows[0];

        // Crear perfil de admin
        await client.query(`
            INSERT INTO admins (user_id, full_name, phone)
            VALUES ($1, $2, $3)
        `, [user.id, full_name, phone || null]);

        // Crear rol exclusivo del admin
        const roleRes = await client.query(`
            INSERT INTO roles (name, description)
            VALUES ($1, $2)
            RETURNING id
        `, [
            `admin:${user.id}`,
            `Rol admin del usuario ${user.id}`
        ]);

        const roleId = roleRes.rows[0].id;

        // Asignar TODOS los permisos al rol del admin
        await client.query(`
            INSERT INTO role_permissions (role_id, permission_id)
            SELECT $1, id FROM permissions
        `, [roleId]);

        // Asignar rol al user
        await client.query(`
            INSERT INTO user_roles (user_id, role_id)
            VALUES ($1, $2)
        `, [user.id, roleId]);

        await client.query("COMMIT");

        res.status(201).json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                type: "admin",
            },
        });

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
});

// POST /auth/register/guide
exports.registerGuide = asyncHandler(async (req, res) => {
    const { email, password, full_name, phone, bio, image_url } = req.body || {};

    // Validaciones de parámetros
    if (!email || !password || !full_name) {
        throw new AppError(
            "email, password y full_name son requeridos",
            400,
            "MISSING_FIELDS"
        );
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Verificar email duplicado
        const exists = await client.query(`
            SELECT 1
            FROM users
            WHERE email = $1
        `, [email]);

        if (exists.rows.length) {
            throw new AppError("Email ya registrado", 409, "EMAIL_EXISTS");
        }

        // Hash de password
        const password_hash = await bcrypt.hash(password, 12);

        // Crear user
        const userRes = await client.query(`
            INSERT INTO users (email, password_hash, type)
            VALUES ($1, $2, $3)
            RETURNING id, email
        `, [email, password_hash, 'guide']);

        const user = userRes.rows[0];

        // Crear perfil de guía
        await client.query(`
            INSERT INTO guides (user_id, full_name, phone, bio, image_url)
            VALUES ($1, $2, $3, $4, $5)
        `, [user.id, full_name, phone || null, bio || null, image_url || null]);

        // Asignar rol guide (COMPARTIDO)
        const roleAssign = await client.query(`
            INSERT INTO user_roles (user_id, role_id)
            SELECT $1, r.id
            FROM roles r
            WHERE r.name = 'guide'
        `, [user.id]);

        if (!roleAssign.rowCount) {
            throw new AppError("Rol 'guide' no existe", 500, "ROLE_NOT_FOUND");
        }

        await client.query("COMMIT");

        res.status(201).json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                type: "guide",
            },
        });

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
});

// POST /auth/login
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        throw new AppError("email y password son requeridos", 400, "MISSING_FIELDS");
    }

    const { rows } = await pool.query(`
        SELECT id, email, password_hash, is_active, type
        FROM users
        WHERE email = $1
    `, [email]);

    if (!rows.length) {
        throw new AppError("Credenciales inválidas", 401, "INVALID_CREDENTIALS");
    }

    const user = rows[0];

    if (!user.is_active) {
        throw new AppError("Usuario inactivo", 403, "USER_INACTIVE");
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
        throw new AppError("Credenciales inválidas", 401, "INVALID_CREDENTIALS");
    }

    const token = signAccessToken({
        userId: user.id,
        type: user.type,
    });

    await pool.query(`
        UPDATE users SET last_login_at = now() WHERE id = $1
    `, [user.id]);

    // Get customer_id and full_name if user is a client
    let customerId = null;
    let fullName = null;
    if (user.type === 'client') {
        const customerRes = await pool.query(`
            SELECT id, full_name FROM customers WHERE user_id = $1
        `, [user.id]);
        if (customerRes.rows.length) {
            customerId = customerRes.rows[0].id;
            fullName = customerRes.rows[0].full_name;
        }
    }

    res.status(200).json({
        success: true,
        token,
        user: {
            id: user.id,
            email: user.email,
            type: user.type,
            customer_id: customerId,
            full_name: fullName,
        },
    });
});

// POST /auth/logout
exports.logout = asyncHandler(async (req, res) => {
    // JWT stateless → el frontend elimina el token
    res.status(200).json({
        success: true,
        message: "Sesión cerrada correctamente"
    });
});

// GET /auth/me
exports.me = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError("No autenticado", 401, "UNAUTHENTICATED");
    }

    const { rows } = await pool.query(`
        SELECT id, email, type, is_active, last_login_at
        FROM users
        WHERE id = $1
    `, [userId]);

    if (!rows.length) {
        throw new AppError("Usuario no encontrado", 404, "USER_NOT_FOUND");
    }

    res.status(200).json({
        success: true,
        user: rows[0]
    });
});

// POST /auth/refresh-token
exports.refreshToken = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const type = req.user?.type;

    if (!userId) {
        throw new AppError("Token inválido", 401, "INVALID_TOKEN");
    }

    const token = signAccessToken({ userId, type });

    res.status(200).json({
        success: true,
        token
    });
});

// POST /auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body || {};

    if (!email) {
        throw new AppError("email es requerido", 400, "MISSING_EMAIL");
    }

    const { rows } = await pool.query(`
        SELECT id FROM users WHERE email = $1
    `, [email]);

    if (!rows.length) {
        return res.status(200).json({
            success: true,
            message: "Si el correo existe, se enviará un código"
        });
    }

    const userId = rows[0].id;

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    await pool.query(`
        INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
        VALUES ($1, $2, now() + interval '15 minutes')
    `, [userId, tokenHash]);

    await sendEmail({
        to: email,
        subject: "Recuperación de contraseña Cerro Dragón Tours",
        html: `
            <p>Solicitaste restablecer tu contraseña de Cerro Dragón Tours.</p>
            <p>Tu código de recuperación es:</p>
            <h2>${rawToken}</h2>
            <p>Este código expira en 15 minutos.</p>
        `
    });

    res.status(200).json({
        success: true,
        message: "Código de recuperación enviado"
    });
});

// POST /auth/reset-password
exports.resetPassword = asyncHandler(async (req, res) => {
    const { token, new_password } = req.body || {};

    if (!token || !new_password) {
        throw new AppError("token y new_password son requeridos", 400, "MISSING_FIELDS");
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const { rows } = await pool.query(`
        SELECT id, user_id
        FROM password_reset_tokens
        WHERE token_hash = $1
          AND used_at IS NULL
          AND expires_at > now()
    `, [tokenHash]);

    if (!rows.length) {
        throw new AppError("Token inválido o expirado", 400, "INVALID_TOKEN");
    }

    const resetToken = rows[0];
    const password_hash = await bcrypt.hash(new_password, 12);

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        await client.query(`
            UPDATE users
            SET password_hash = $1
            WHERE id = $2
        `, [password_hash, resetToken.user_id]);

        await client.query(`
            UPDATE password_reset_tokens
            SET used_at = now()
            WHERE id = $1
        `, [resetToken.id]);

        await client.query("COMMIT");

        res.status(200).json({
            success: true,
            message: "Contraseña actualizada correctamente"
        });

    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
});
