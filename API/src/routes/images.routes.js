const router = require("express").Router();
const controller = require("../controllers/images.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { folder } = req.params;

        const uploadPath = path.join(
            __dirname,
            "..",
            "uploads",
            "images",
            folder
        );

        // Crear carpeta si no existe
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    }
});

// Filtrar por solo imágenes
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Solo se permiten imágenes"), false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

router.get("/test", controller.test);

// Subir imagen
// POST /images/upload/:folder
router.post("/upload/:folder", upload.single("image"), controller.uploadImage);

// Obtener imagen
// Ej: /images/cabanas/cabana1.jpg
router.get("/:folder/:filename", controller.getImage);

module.exports = router;
