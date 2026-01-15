const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const { signAccessToken } = require("../utils/jwt");

// Solo para hacer pruebas rápidas de funcionamiento 
exports.test = asyncHandler(async (req, res) => {
    res.send("API de Auth funcionando");
});

// Obtener todos los usuarios registrados
exports.getAll = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT id, email, is_active
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

// POST /auth/register/client
exports.registerClient = asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        throw new AppError("email y password son requeridos", 400, "MISSING_FIELDS");
    }

    // Verificar email
    const exists = await pool.query(
        `SELECT 1 FROM users WHERE email = $1`,
        [email]
    );
    if (exists.rows.length) {
        throw new AppError("Email ya registrado", 409, "EMAIL_EXISTS");
    }

    const password_hash = await bcrypt.hash(password, 12);

    // Crear user
    const userRes = await pool.query(
        `INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING id, email`,
        [email, password_hash]
    );

    const user = userRes.rows[0];

    // Asignar rol client (COMPARTIDO)
    await pool.query(
        `
        INSERT INTO user_roles (user_id, role_id)
        SELECT $1, r.id
        FROM roles r
        WHERE r.name = 'client'
        `,
        [user.id]
    );

    res.status(201).json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            type: "client",
        },
    });
});

// POST /auth/register/admin
exports.registerAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        throw new AppError("email y password son requeridos", 400, "MISSING_FIELDS");
    }

    // Verificar email
    const exists = await pool.query(
        `SELECT 1 FROM users WHERE email = $1`,
        [email]
    );
    if (exists.rows.length) {
        throw new AppError("Email ya registrado", 409, "EMAIL_EXISTS");
    }

    const password_hash = await bcrypt.hash(password, 12);

    // Crear user
    const userRes = await pool.query(
        `INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING id, email`,
        [email, password_hash]
    );

    const user = userRes.rows[0];

    // Crear rol exclusivo del admin
    const roleRes = await pool.query(
        `
        INSERT INTO roles (name, description)
        VALUES ($1, $2)
        RETURNING id
        `,
        [`admin:${user.id}`, `Rol admin del usuario ${user.id}`]
    );

    const roleId = roleRes.rows[0].id;

    // Asignar rol al user
    await pool.query(
        `
        INSERT INTO user_roles (user_id, role_id)
        VALUES ($1, $2)
        `,
        [user.id, roleId]
    );

    res.status(201).json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            type: "admin",
        },
    });
});

// POST /auth/login
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        throw new AppError("email y password son requeridos", 400, "MISSING_FIELDS");
    }

    const { rows } = await pool.query(
        `
        SELECT id, email, password_hash, is_active
        FROM users
        WHERE email = $1
        `,
        [email]
    );

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

    // Detectar tipo de usuario por rol
    const roleRes = await pool.query(
        `
        SELECT r.name
        FROM roles r
        JOIN user_roles ur ON ur.role_id = r.id
        WHERE ur.user_id = $1
        `,
        [user.id]
    );

    const roleNames = roleRes.rows.map(r => r.name);

    const isAdmin = roleNames.some(name => name.startsWith("admin:"));

    const userType = isAdmin ? "admin" : "client";

    const token = signAccessToken({
        userId: user.id,
        type: userType,
    });

    await pool.query(
        `UPDATE users SET last_login_at = now() WHERE id = $1`,
        [user.id]
    );

    res.status(200).json({
        success: true,
        token,
        user: {
            id: user.id,
            email: user.email,
            type: userType,
        },
    });
});