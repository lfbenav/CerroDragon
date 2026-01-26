"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  SideBarAdmin,
  TopBar,
  PaginationControls,
} from "../../../components";

const API_URL = "http://localhost:3000";
const PAGE_SIZE = 5;

// =========================
// TYPES
// =========================
type CheckinRow = {
  nombre: string;
  telefono: string | null;
  checkinAt: string;
};

type CheckinResponse = {
  code: string;
  cliente: string;
  tour: string;
  reservaId: string;
  fechaTexto: string | null;
  registros: number;
  rows: CheckinRow[];
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export default function AdminCheckinRespuestaPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("id");

  const [data, setData] = useState<CheckinResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // =========================
  // FETCH
  // =========================
  useEffect(() => {
    if (!code) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${API_URL}/checkin/formularios/${code}/entries`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(`Error (${res.status})`);
        }

        const json = (await res.json()) as ApiResponse<CheckinResponse>;

        if (!json.success) {
          throw new Error(json.message || "Error al cargar respuestas");
        }

        setData(json.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar respuestas"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

  // =========================
  // PAGINACIÓN
  // =========================
  const rows = data?.rows ?? [];
  const respuestasCount = rows.length;

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;

  const pageRows = useMemo(
    () => rows.slice(start, start + PAGE_SIZE),
    [rows, start]
  );

  const handlePrint = () => window.print();

  // =========================
  // RENDER
  // =========================
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarAdmin />

      <div className="flex-1 flex flex-col min-h-0">
        <TopBar />

        <main className="flex-1 overflow-y-auto pt-20 ml-70 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col">
            {loading && (
              <p className="text-sm text-verde3 mt-6">
                Cargando respuestas…
              </p>
            )}

            {!loading && error && (
              <p className="text-sm text-rojosuave mt-6">{error}</p>
            )}

            {!loading && data && (
              <>
                {/* Header */}
                <div className="flex-shrink-0">
                  <h1 className="text-3xl font-serif text-black mt-4">
                    Respuesta de Check-in
                  </h1>
                  <h2 className="text-2xl font-serif text-black font-semibold">
                    {data.code}
                  </h2>
                  <div className="border-b border-black/20 mt-4" />
                </div>

                {/* Info cards */}
                <div className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
                    <InfoCard label="Cliente" value={data.cliente} />
                    <InfoCard label="Tour" value={data.tour} />
                    <InfoCard
                      label="Reserva asociada"
                      value={data.reservaId}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mt-4">
                    <InfoCard
                      label="Fecha"
                      value={data.fechaTexto ?? "—"}
                    />
                    <InfoCard
                      label="Respuestas:"
                      value={String(respuestasCount)}
                      valueClassName="text-amarillo font-bold"
                    />
                  </div>

                  {/* Tabla */}
                  <div className="mt-10 flex justify-center">
                    <div className="w-full max-w-md bg-beige1 border border-borde1 rounded-xl overflow-hidden">
                      <div className="px-4 py-2 bg-black/5 text-xs font-semibold text-black text-center">
                        Nombre
                      </div>

                      <div className="divide-y divide-black/10">
                        {pageRows.map((r, idx) => (
                          <div
                            key={`${r.nombre}-${idx}`}
                            className="px-5 py-3 text-sm text-black"
                          >
                            {r.nombre}
                          </div>
                        ))}

                        {rows.length === 0 && (
                          <div className="px-5 py-6 text-sm text-black/60 text-center">
                            Sin respuestas
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="mt-2 flex justify-center">
                    <PaginationControls
                      page={safePage}
                      totalPages={totalPages}
                      onPageChange={setPage}
                      showCounter
                    />
                  </div>

                  {/* Print */}
                  <div className="mt-8 flex justify-end pb-8">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
                    >
                      <PrintIcon />
                      Imprimir
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// =========================
// AUX
// =========================
function InfoCard({
  label,
  value,
  valueClassName = "text-black",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="bg-beige1 border border-borde1 rounded-xl px-4 py-3">
      <div className="text-xs text-verde3">{label}</div>
      <div className={`text-lg ${valueClassName}`}>{value}</div>
    </div>
  );
}

function PrintIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 8V3h10v5M7 17h10v4H7v-4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M6 10h12a2 2 0 0 1 2 2v4H4v-4a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 14h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
