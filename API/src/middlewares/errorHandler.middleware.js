module.exports = (err, req, res, next) => {
    console.error("Error:", err);

    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || "Error interno del servidor",
        code: err.code || "INTERNAL_ERROR"
    });
};