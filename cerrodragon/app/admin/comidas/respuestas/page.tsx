"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { SideBarAdmin, TopBar, PaginationControls } from "../../../components";

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

const PAGE_SIZE = 6;

export default function AdminRespuestaComidasPage() {
  const params = useParams<{ code: string }>();
  const code = decodeURIComponent(params.code);

  // Dummy data (API-ready)
  const data: ComidasResponse = useMemo(
    () => ({
      code: 'XWZ-123',
      cliente: "Carlos Alvarado",
      tour: "Cerro Dragón",
      reservaId: "RV-001",
      fechaTexto: "10 de enero de 2026",
      rows: [
        {
          nombre: "Carlos Alvarado",
          tipoComida: "Casado tradicional con filete de Pescado",
          alergias: "Ninguna",
        },
        {
          nombre: "Roxana Alvarado",
          tipoComida: "Casado tradicional con filete Cerdo",
          alergias: "Canela",
        },
    {
        nombre: "María González",
        tipoComida: "Casado tradicional con filete de Pollo",
        alergias: "Ninguna",
    },
    {
        nombre: "José Ramírez",
        tipoComida: "Casado vegetariano",
        alergias: "Gluten",
    },
    {
        nombre: "Ana Martínez",
        tipoComida: "Casado tradicional con filete de Pescado",
        alergias: "Mariscos",
    },
    {
        nombre: "Luis Fernández",
        tipoComida: "Casado tradicional con filete de Res",
        alergias: "Ninguna",
    },
    {
        nombre: "Carmen Mora",
        tipoComida: "Casado vegetariano",
        alergias: "Lácteos",
    },
    {
        nombre: "Pedro Salazar",
        tipoComida: "Casado tradicional con filete de Cerdo",
        alergias: "Ninguna",
    },
    {
        nombre: "Sofía Castro",
        tipoComida: "Casado tradicional con filete de Pollo",
        alergias: "Nueces",
    },
    {
        nombre: "Diego Vargas",
        tipoComida: "Casado tradicional con filete de Pescado",
        alergias: "Ninguna",
    },
    {
        nombre: "Laura Jiménez",
        tipoComida: "Casado vegetariano",
        alergias: "Soya",
    },
    {
        nombre: "Roberto Chaves",
        tipoComida: "Casado tradicional con filete de Res",
        alergias: "Ninguna",
    },
      ],
    }),
    [code]
  );

  // ✅ Auto count
  const respuestasCount = data.rows.length;

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = data.rows.slice(start, start + PAGE_SIZE);

  const handlePrint = () => window.print();

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarAdmin />

      <div className="flex-1 flex flex-col min-h-0">
        <TopBar />

        <main className="flex-1 overflow-y-auto ml-70 pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-serif text-black mt-4">
                Respuesta comidas
              </h1>
              <h2 className="text-2xl font-serif text-black font-semibold">
                {data.code}
              </h2>
              <div className="border-b border-black/20 mt-4" />
            </div>

            {/* Top info cards */}
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

              {/* Table */}
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
                        <div className="text-sm text-verde3">{r.tipoComida}</div>
                        <div className="text-sm text-black">{r.alergias}</div>
                      </div>
                    ))}

                    {data.rows.length === 0 && (
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
