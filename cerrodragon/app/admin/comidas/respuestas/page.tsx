"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  SideBarAdmin,
  TopBar,
  PaginationControls,
} from "../../../components";

const API_URL = "http://localhost:3000";
const PAGE_SIZE = 6;

type ComidaRow = {
  nombre: string;
  tipoComida: string;
  alergias: string;
};

type ComidasResponse = {
  code: string;
  cliente: string;
  tour: string;
  reservaId: string;
  fechaTexto: string;
  rows: ComidaRow[];
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export default function AdminRespuestaComidasPage() {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get("id"); // <-- viene de ?id=XV-101
  const code = codeParam ? decodeURIComponent(codeParam) : "";

  const [data, setData] = useState<ComidasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (!code) {
        setError("Código de formulario inválido");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${API_URL}/foods/formularios/${encodeURIComponent(code)}/respuestas`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(`Error (${res.status})`);
        }

        const json = (await res.json()) as ApiResponse<ComidasResponse>;

        if (!json.success) {
          throw new Error(json.message || "Error al cargar respuestas");
        }

        setData(json.data);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Error al cargar respuestas";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

  // PAGINACIÓN
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

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarAdmin />

      <div className="flex-1 flex flex-col min-h-0">
        <TopBar />

        <main className="flex-1 overflow-y-auto ml-70 pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col">
            {loading && (
              <p className="text-sm text-verde3 mt-6">Cargando respuestas…</p>
            )}

            {!loading && error && (
              <p className="text-sm text-rojosuave mt-6">{error}</p>
            )}

            {!loading && data && (
              <>
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-serif text-black mt-4">
                    Respuesta comidas
                  </h1>
                  <h2 className="text-2xl font-serif text-black font-semibold">
                    {data.code}
                  </h2>
                  <div className="border-b border-black/20 mt-4" />
                </div>

                <div className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
                    <InfoCard label="Cliente" value={data.cliente} />
                    <InfoCard label="Tour" value={data.tour} />
                    <InfoCard label="Reserva asociada" value={data.reservaId} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mt-4">
                    <InfoCard label="Fecha" value={data.fechaTexto} />
                    <InfoCard
                      label="Respuestas:"
                      value={String(respuestasCount)}
                      valueClassName="text-amarillo font-bold"
                    />
                  </div>

                  <div className="mt-6 max-w-5xl">
                    <div className="bg-beige1 border border-default border-borde1 rounded-xl overflow-hidden w-full">
                      <div className="grid grid-cols-[220px_1fr_180px] px-4 py-2 bg-black/5 text-xs font-semibold text-black">
                        <div>Nombre</div>
                        <div>Tipo de comida</div>
                        <div>Alergias</div>
                      </div>

                      <div className="divide-y divide-black/10">
                        {pageRows.map((r, idx) => (
                          <div
                            key={`${r.nombre}-${idx}`}
                            className="grid grid-cols-[220px_1fr_180px] px-4 py-2 items-center"
                          >
                            <div className="text-sm text-black">{r.nombre}</div>
                            <div className="text-sm text-verde3">
                              {r.tipoComida}
                            </div>
                            <div className="text-sm text-black">
                              {r.alergias}
                            </div>
                          </div>
                        ))}

                        {rows.length === 0 && (
                          <div className="px-4 py-6 text-sm text-black/60 text-center">
                            Sin respuestas
                          </div>
                        )}
                      </div>

                      <PaginationControls
                        page={safePage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        showCounter={true}
                      />
                    </div>

                    <div className="mt-4 flex justify-center pb-8">
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
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

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
    <div className="bg-beige1 border border-default border-borde1 rounded-xl px-4 py-3">
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
