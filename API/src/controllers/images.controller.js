const path = require("path");
const fs = require("fs");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

// Solo para hacer pruebas rápidas de funcionamiento 
exports.test = asyncHandler(async (req, res) => {
    res.send("API de Imagenes funcionando");
});

// Obtener una imagen por carpeta y nombre
exports.getImage = asyncHandler(async (req, res) => {
    const { folder, filename } = req.params;

    // Ruta ABSOLUTA al folder de imágenes
    const imagesBasePath = path.join(
        __dirname,
        "..",
        "uploads",
        "images"
    );

    const imagePath = path.join(imagesBasePath, folder, filename);

    // Seguridad básica: evitar ../
    if (!imagePath.startsWith(imagesBasePath)) {
        throw new AppError("Ruta inválida", 400);
    }

    // Verificar que exista
    if (!fs.existsSync(imagePath)) {
        throw new AppError("Imagen no encontrada", 404);
    }

    res.sendFile(imagePath);
});

// Subir imagen
exports.uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new AppError("No se envió ninguna imagen", 400);
    }

    const { folder } = req.params;

    res.status(201).json({
        success: true,
        message: "Imagen subida correctamente",
        file: {
            filename: req.file.filename,
            path: `/images/${folder}/${req.file.filename}`
        }
    });
});