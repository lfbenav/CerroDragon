const pool = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler.middleware");
const AppError = require("../utils/AppError");

const OCUPACION_VALUES = [
  "desocupado",
  "no-disponible",
  "poco-ocupado",
  "medio-ocupado",
  "muy-ocupado",
];

function toInt(value) {
  const n = Number(value);
  return Number.isInteger(n) ? n : NaN;
}

function assertYearMonth(year, month) {
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new AppError("year inválido", 400, "INVALID_YEAR");
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new AppError("month inválido", 400, "INVALID_MONTH");
  }
}

function assertDay(day) {
  if (!Number.isInteger(day) || day < 1 || day > 31) {
    throw new AppError("day inválido", 400, "INVALID_DAY");
  }
}

function assertOcupacion(ocupacion) {
  if (!ocupacion || !OCUPACION_VALUES.includes(ocupacion)) {
    throw new AppError("ocupacion inválida", 400, "INVALID_OCUPACION");
  }
}

// Solo para pruebas rápidas
exports.test = asyncHandler(async (req, res) => {
  res.send("API de Calendario (ocupación mensual) funcionando");
});

// GET /calendar?year=2026&month=1
exports.getCalendarMonth = asyncHandler(async (req, res) => {
  const year = toInt(req.query.year);
  const month = toInt(req.query.month);

  assertYearMonth(year, month);

  const { rows } = await pool.query(
    `
      SELECT day, ocupacion
      FROM calendar_day_occupancy
      WHERE year = $1 AND month = $2
      ORDER BY day ASC
    `,
    [year, month]
  );

  // Formato exacto para tu mock: { "1": "no-disponible", ... }
  const ocupacionData = {};
  for (const r of rows) {
    ocupacionData[String(r.day)] = r.ocupacion;
  }

  res.status(200).json({
    success: true,
    data: {
      year,
      month,
      ocupacionData,
    },
  });
});

// PUT /calendar/day
// body: { year: 2026, month: 1, day: 14, ocupacion: "medio-ocupado" }
exports.upsertCalendarDay = asyncHandler(async (req, res) => {
  const { year, month, day, ocupacion } = req.body || {};

  const y = toInt(year);
  const m = toInt(month);
  const d = toInt(day);

  assertYearMonth(y, m);
  assertDay(d);
  assertOcupacion(ocupacion);

  const { rows } = await pool.query(
    `
      INSERT INTO calendar_day_occupancy (year, month, day, ocupacion, updated_at)
      VALUES ($1, $2, $3, $4, now())
      ON CONFLICT (year, month, day)
      DO UPDATE SET
        ocupacion = EXCLUDED.ocupacion,
        updated_at = now()
      RETURNING id, year, month, day, ocupacion, updated_at
    `,
    [y, m, d, ocupacion]
  );

  res.status(200).json({
    success: true,
    data: rows[0],
    message: "Día actualizado",
  });
});

// DELETE /calendar/day?year=2026&month=1&day=14
// (Opcional) si borrás el registro, el front lo toma como "desocupado"
exports.deleteCalendarDay = asyncHandler(async (req, res) => {
  const year = toInt(req.query.year);
  const month = toInt(req.query.month);
  const day = toInt(req.query.day);

  assertYearMonth(year, month);
  assertDay(day);

  const result = await pool.query(
    `
      DELETE FROM calendar_day_occupancy
      WHERE year = $1 AND month = $2 AND day = $3
    `,
    [year, month, day]
  );

  if (!result.rowCount) {
    throw new AppError("Día no encontrado", 404, "CALENDAR_DAY_NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "Día eliminado",
  });
});

// GET /calendar/colors
// (si lo querés mantener para frontend, lo dejamos igual pero alineado a ocupación)
exports.getCalendarColors = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    colors: {
      "desocupado": "transparent",
      "no-disponible": "celeste",
      "poco-ocupado": "verde4",
      "medio-ocupado": "amarillo",
      "muy-ocupado": "rojosuave",
    },
  });
});
