const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

const bcrypt = require("bcrypt");
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
    const { email, password } = req.body || {};

    // Validaciones de parámetros
    if (!email || !password) {
        throw new AppError(
            "email y password son requeridos",
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
        `, [email, password_hash, 'admin']);

        const user = userRes.rows[0];

        // Crear rol exclusivo del admin
        const roleRes = await client.query(`
            INSERT INTO roles (name, description)
            VALUES ($1, $2)
            RETURNING id
        `, [`admin:${user.id}`, `Rol admin del usuario ${user.id}`]);

        const roleId = roleRes.rows[0].id;

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

    res.status(200).json({
        success: true,
        token,
        user: {
            id: user.id,
            email: user.email,
            type: user.type,
        },
    });
});