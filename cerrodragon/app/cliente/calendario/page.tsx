"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarGrid, SideBarClient, TopBar } from "@/app/components";

const API_URL = "http://localhost:3000";

type OcupacionType =
  | "no-disponible"
  | "muy-ocupado"
  | "medio-ocupado"
  | "poco-ocupado"
  | "desocupado";

type OcupacionData = Record<number, OcupacionType>;

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

// Configuración del calendario (por ahora fijo; luego lo podés hacer dinámico)
const calendarConfig = {
  mes: "ENERO",
  año: 2026,
  monthNumber: 1, // backend (enero = 1)
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

export default function Calendario() {
  const [ocupacionData, setOcupacionData] = useState<OcupacionData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // (Opcional) evita doble fetch en dev por StrictMode
  const didFetchRef = useRef(false);

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
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    fetchMonth();
  }, [fetchMonth]);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarClient />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            <div className="flex-shrink-0 mb-8">
              <h1 className="text-3xl font-bold mb-1 text-black mt-4">Calendario</h1>
              <p className="mb-4 text-verde3">
                Consulte qué tan saturadas se encuentran nuestras fechas este mes
              </p>

              {loading && <p className="text-sm text-verde3">Cargando calendario...</p>}

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
              <CalendarGrid
                ocupacionData={ocupacionData}
                mes={calendarConfig.mes}
                año={calendarConfig.año}
                daysInMonth={calendarConfig.daysInMonth}
                firstDayOfWeek={calendarConfig.firstDayOfWeek}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
