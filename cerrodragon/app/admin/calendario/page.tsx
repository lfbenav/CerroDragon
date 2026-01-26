"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminCalendarDay, SideBarAdmin, TopBar } from "@/app/components";

const API_URL = "http://localhost:3000";

type OcupacionType =
  | "no-disponible"
  | "muy-ocupado"
  | "medio-ocupado"
  | "poco-ocupado"
  | "desocupado";

type CalendarMonthResponse = {
  year: number;
  month: number;
  ocupacionData: Record<string, OcupacionType>;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const calendarConfig = {
  mes: "ENERO",
  año: 2026,
  monthNumber: 1, // <-- clave para backend (enero = 1)
  daysInMonth: 31,
  firstDayOfWeek: 4, // 0=Domingo, 1=Lunes ...
} as const;

function normalizeOcupacionData(input: Record<string, OcupacionType>): OcupacionData {
  const out: OcupacionData = {};
  for (const [k, v] of Object.entries(input)) {
    const day = Number(k);
    if (Number.isInteger(day)) out[day] = v;
  }
  return out;
}

export default function AdminCalendario() {
  const [ocupacionData, setOcupacionData] = useState<OcupacionData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const year = calendarConfig.año;
  const month = calendarConfig.monthNumber;

  const fetchMonth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/calendar?year=${year}&month=${month}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`, // si tu API lo requiere
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Error al cargar calendario (${res.status})`);
      }

      const json = (await res.json()) as ApiResponse<CalendarMonthResponse>;

      if (!json.success) {
        throw new Error(json.message || "Error al cargar calendario");
      }

      const normalized = normalizeOcupacionData(json.data.ocupacionData);
      setOcupacionData(normalized);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al cargar calendario";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchMonth();
  }, [fetchMonth]);

  // Optimistic update: se ve instantáneo y si falla revierte
  const handleDayUpdate = useCallback(
    async (day: number, newOcupacion: OcupacionType) => {
      // Snapshot para revertir si falla
      const prev = ocupacionData;

      // Optimistic UI
      setOcupacionData((curr) => ({ ...curr, [day]: newOcupacion }));

      try {
        const res = await fetch(`${API_URL}/calendar/day`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, // si aplica
          },
          body: JSON.stringify({
            year,
            month,
            day,
            ocupacion: newOcupacion,
          }),
        });

        if (!res.ok) {
          throw new Error(`Error al actualizar día (${res.status})`);
        }

        const json = (await res.json()) as ApiResponse<{
          year: number;
          month: number;
          day: number;
          ocupacion: OcupacionType;
        }>;

        if (!json.success) {
          throw new Error(json.message || "Error al actualizar día");
        }

        // (Opcional) asegurar que lo que quedó en DB sea lo que mostramos
        // setOcupacionData((curr) => ({ ...curr, [day]: json.data.ocupacion }));
      } catch (e) {
        // revert
        setOcupacionData(prev);

        const msg = e instanceof Error ? e.message : "Error al actualizar día";
        console.error(msg);
      }
    },
    [ocupacionData, year, month]
  );

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarAdmin />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            <div className="flex-shrink-0 mb-8">
              <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                Calendario de Disponibilidad
              </h1>
              <p className="mb-4 text-verde3">
                Haga clic en cada día para configurar su disponibilidad
              </p>

              {/* Solo feedback simple, sin cambiar diseño */}
              {loading && (
                <p className="text-sm text-verde3">Cargando calendario...</p>
              )}
              {!loading && error && (
                <div className="text-sm text-rojosuave flex items-center gap-3">
                  <span>{error}</span>
                  <button
                    onClick={fetchMonth}
                    className="px-3 py-1 rounded-md bg-gray-200 text-black hover:bg-gray-300 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 flex justify-center items-start overflow-y-auto">
              <AdminCalendarGrid
                ocupacionData={ocupacionData}
                mes={calendarConfig.mes}
                año={calendarConfig.año}
                daysInMonth={calendarConfig.daysInMonth}
                firstDayOfWeek={calendarConfig.firstDayOfWeek}
                onDayUpdate={handleDayUpdate}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


//-----------------------------------------------------------------------------------

type NivelOcupacion =
  | "no-disponible"
  | "muy-ocupado"
  | "medio-ocupado"
  | "poco-ocupado"
  | "desocupado";

type OcupacionData = Record<number, NivelOcupacion>;

type AdminCalendarGridProps = {
  ocupacionData?: OcupacionData;
  mes?: string;
  año?: number;
  daysInMonth?: number;
  firstDayOfWeek?: number;
  onDayUpdate?: (day: number, newOcupacion: NivelOcupacion) => void;
};

export function AdminCalendarGrid({
  ocupacionData = {},
  mes = "ENERO",
  año = 2025,
  daysInMonth = 31,
  firstDayOfWeek = 3,
  onDayUpdate,
}: AdminCalendarGridProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentOcupacionData, setCurrentOcupacionData] =
    useState<OcupacionData>(ocupacionData);

  // ✅ clave: si el parent trae data nueva, sincronizamos el state interno
  useEffect(() => {
    setCurrentOcupacionData(ocupacionData);
  }, [ocupacionData]);

  const weekDays = ["D", "L", "M", "X", "J", "V", "S"];

  const calendarDays = useMemo(() => {
    const days: Array<null | { day: number; ocupacion: NivelOcupacion }> = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const ocupacion = currentOcupacionData[day] || "desocupado";
      days.push({ day, ocupacion });
    }

    return days;
  }, [currentOcupacionData, daysInMonth, firstDayOfWeek]);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  const handleOcupacionChange = (newOcupacion: NivelOcupacion) => {
    if (!selectedDay) return;

    const updatedData: OcupacionData = {
      ...currentOcupacionData,
      [selectedDay]: newOcupacion,
    };

    setCurrentOcupacionData(updatedData);

    if (onDayUpdate) {
      onDayUpdate(selectedDay, newOcupacion);
    }

    setSelectedDay(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-borde1 p-6 max-w-5xl mx-auto">
      {/* Título del mes */}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-black mb-2">{mes}</h2>
        <p className="text-verde3">{año}</p>
      </div>

      {/* Encabezados de días de la semana */}
      <div className="grid grid-cols-7 gap-4 mb-4">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center font-bold text-xl text-black">
            {index === 0 ? <span className="text-rojosuave">{day}</span> : day}
          </div>
        ))}
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-4 mb-6">
        {calendarDays.map((dayData, index) => (
          <div key={index} className="text-center">
            {dayData ? (
              <AdminCalendarDay
                day={dayData.day}
                ocupacion={dayData.ocupacion}
                onClick={handleDayClick}
                isSelected={selectedDay === dayData.day}
              />
            ) : (
              <div className="h-16"></div>
            )}
          </div>
        ))}
      </div>

      {/* Controles de ocupación */}
      {selectedDay && (
        <div className="bg-beige1 border border-borde1 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-black mb-3 text-center">
            Configurar día {selectedDay}
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => handleOcupacionChange("desocupado")}
              className="px-4 py-2 border-2 border-gray-300 bg-transparent text-black rounded-lg hover:bg-gray-100 transition-colors"
            >
              Desocupado
            </button>
            <button
              onClick={() => handleOcupacionChange("no-disponible")}
              className="px-4 py-2 bg-celeste text-black rounded-lg hover:opacity-80 transition-opacity"
            >
              No disponible
            </button>
            <button
              onClick={() => handleOcupacionChange("poco-ocupado")}
              className="px-4 py-2 bg-verde4 text-black rounded-lg hover:opacity-80 transition-opacity"
            >
              Poco ocupado
            </button>
            <button
              onClick={() => handleOcupacionChange("medio-ocupado")}
              className="px-4 py-2 bg-amarillo text-black rounded-lg hover:opacity-80 transition-opacity"
            >
              Medio ocupado
            </button>
            <button
              onClick={() => handleOcupacionChange("muy-ocupado")}
              className="px-4 py-2 bg-rojosuave text-black rounded-lg hover:opacity-80 transition-opacity"
            >
              Muy ocupado
            </button>
          </div>
          <div className="text-center mt-3">
            <button
              onClick={() => setSelectedDay(null)}
              className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Clave de colores */}
      <div className="pt-6 border-t border-borde1">
        <h3 className="text-lg font-semibold text-black mb-4 text-center">
          Disponibilidad
        </h3>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-transparent"></div>
            <span className="text-sm text-verde3">Desocupado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-celeste"></div>
            <span className="text-sm text-verde3">No disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-verde4"></div>
            <span className="text-sm text-verde3">Poco ocupado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amarillo"></div>
            <span className="text-sm text-verde3">Medio ocupado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-rojosuave"></div>
            <span className="text-sm text-verde3">Muy ocupado</span>
          </div>
        </div>
      </div>
    </div>
  );
}