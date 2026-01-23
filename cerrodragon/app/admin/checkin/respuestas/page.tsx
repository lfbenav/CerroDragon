"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { SideBarAdmin, TopBar, PaginationControls } from "../../../components";

type CheckinResponse = {
  code: string;
  cliente: string;
  tour: string;
  reservaId: string;
  fechaTexto: string;
  respuestasCount: number;
  nombres: string[];
};

const PAGE_SIZE = 5;

export default function AdminCheckinRespuestaPage() {
  const params = useParams<{ code: string }>();
  const code = decodeURIComponent(params.code);

  const data: CheckinResponse = useMemo(
    () => ({
      code: 'fbjds -2026-01-10-cerrodragon-rv001',
      cliente: "Carlos Alvarado",
      tour: "Cerro Dragón",
      reservaId: "RV-001",
      fechaTexto: "10 de enero de 2026",
      respuestasCount: 2,
      nombres: ["Carlos Alvarado", "Roxana Alvarado", "Ana Gómez", "Luis Pérez", "María Rodríguez", "Juan López", "Sofía Fernández", "Miguel Torres", "Lucía Ramírez", "Diego Sánchez", "Valentina Cruz", "Javier Morales", "Camila Flores"],
    }),
    [code]
  );

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.nombres.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageNames = data.nombres.slice(start, start + PAGE_SIZE);

  const handlePrint = () => window.print();

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarAdmin />
      <div className="flex-1 flex flex-col min-h-0">
        <TopBar />

        <main className="flex-1 overflow-y-auto pt-20 ml-70 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-serif text-black mt-4">
                Respuesta De Check In
              </h1>
              <h2 className="text-2xl font-serif text-black font-semibold">
                {data.code}
              </h2>
              <div className="border-b border-black/20 mt-4" />
            </div>

            {/* Content */}
            <div className="pt-6">
              {/* Top info cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
                <InfoCard label="Cliente" value={data.cliente} />
                <InfoCard label="Tour" value={data.tour} />
                <InfoCard label="Reserva asociada" value={data.reservaId} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mt-4">
                <InfoCard label="Fecha" value={data.fechaTexto} />
                <InfoCard
                  label="Respuestas:"
                  value={String(data.respuestasCount)}
                  valueClassName="text-amarillo font-bold"
                />
              </div>

              {/* Names table centered */}
              <div className="mt-10 flex justify-center">
                <div className="w-full max-w-md bg-beige1 border border-default border-borde1 rounded-xl overflow-hidden">
                  <div className="px-4 py-2 bg-black/5 text-xs font-semibold text-black text-center">
                    Nombre
                  </div>

                  <div className="divide-y divide-black/10">
                    {pageNames.map((n, idx) => (
                      <div
                        key={`${n}-${idx}`}
                        className="px-5 py-3 text-sm text-black"
                      >
                        {n}
                      </div>
                    ))}

                    {data.nombres.length === 0 && (
                      <div className="px-5 py-6 text-sm text-black/60 text-center">
                        Sin respuestas
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pagination under the names box */}
              <div className="mt-2 flex justify-center">
                <PaginationControls
                  page={safePage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  showCounter={true}
                />
              </div>

              {/* Print button aligned bottom-right but inside scroll */}
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
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
