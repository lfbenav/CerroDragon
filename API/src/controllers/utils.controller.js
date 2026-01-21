const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// Solo para hacer pruebas rápidas de funcionamiento 
exports.test = asyncHandler(async (req, res) => {
    res.send("API de Utilidades funcionando");
});

// GET /utils/comidas - Obtener todas las comidas
exports.getAllComidas = asyncHandler(async (req, res) => {
    // Por ahora simulamos datos hasta tener la tabla en la BD
    const comidasSimuladas = [
        {
            id: "XV-502",
            nombreComida: "Casado Tradicional",
            mostrar: true,
        },
        {
            id: "XV-503", 
            nombreComida: "Casado Vegano",
            mostrar: true,
        },
        {
            id: "XV-504",
            nombreComida: "Arroz con Pollo", 
            mostrar: true,
        },
        {
            id: "XV-505",
            nombreComida: "Ensalada César",
            mostrar: false,
        }
    ];

    res.status(200).json({
        success: true,
        data: comidasSimuladas
    });
});

// POST /utils/comidas - Crear nueva comida
exports.createComida = asyncHandler(async (req, res) => {
    const { nombreComida } = req.body;

    if (!nombreComida || nombreComida.trim() === "") {
        throw new AppError("El nombre de la comida es requerido", 400, "MISSING_NAME");
    }

    // TODO: Cuando tengamos la tabla comidas en la BD, usar esta query:
    // const { rows } = await pool.query(`
    //     INSERT INTO comidas (nombre, mostrar)
    //     VALUES ($1, $2)
    //     RETURNING id, nombre as nombreComida, mostrar
    // `, [nombreComida.trim(), true]);

    // Por ahora simulamos la respuesta
    const nuevaComida = {
        id: `XV-${Date.now()}`, 
        nombreComida: nombreComida.trim(),
        mostrar: true
    };

    res.status(201).json({
        success: true,
        data: nuevaComida,
        message: "Comida creada exitosamente"
    });
});

// PUT /utils/comidas/:id - Actualizar comida (principalmente el campo mostrar)
exports.updateComida = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { mostrar } = req.body;

    // TODO: Cuando tengamos la tabla comidas en la BD, usar esta query:
    // const { rows } = await pool.query(`
    //     UPDATE comidas
    //     SET mostrar = COALESCE($1, mostrar)
    //     WHERE id = $2
    //     RETURNING id, nombre as nombreComida, mostrar
    // `, [mostrar, id]);
    
    // if (!rows.length) {
    //     throw new AppError("Comida no encontrada", 404, "COMIDA_NOT_FOUND");
    // }

    // Por ahora simulamos la respuesta
    const comidaActualizada = {
        id: id,
        nombreComida: "Comida actualizada",
        mostrar: mostrar !== undefined ? mostrar : true
    };

    res.status(200).json({
        success: true,
        data: comidaActualizada,
        message: "Comida actualizada exitosamente"
    });
});

// DELETE /utils/comidas/:id - Eliminar comida
exports.deleteComida = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // TODO: Cuando tengamos la tabla comidas en la BD, usar esta query:
    // const { rows } = await pool.query(`
    //     DELETE FROM comidas
    //     WHERE id = $1
    //     RETURNING id
    // `, [id]);
    
    // if (!rows.length) {
    //     throw new AppError("Comida no encontrada", 404, "COMIDA_NOT_FOUND");
    // }

    // Por ahora simulamos la respuesta
    res.status(200).json({
        success: true,
        message: "Comida eliminada exitosamente"
    });
});