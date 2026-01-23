"use client";

import { useMemo, useState } from "react";
import {
  SideBarAdmin,
  TopBar,
  PaginationControls,
  FilterIcon,
  ConfirmModal,
  PlusIcon,
} from "../../components";

type LogTipo = "Automática" | "Manual";

type AuditRow = {
  id: string;
  nombre: string;
  tipo: LogTipo;
  detalle: string;
  fechaISO: string;
  fechaTexto: string;
  usuario: string;
};

const PAGE_SIZE = 6;
const NOMBRE_MAX = 60;
const DETALLE_MAX = 90;

export default function AdminAuditoriaPage() {
  const rows: AuditRow[] = useMemo(
    () => [
      {
        id: "1",
        nombre: "Modificación de Inventario",
        tipo: "Automática",
        detalle: "Se actualizó la cantidad de papas en el local (0kg → 3kg)",
        fechaISO: "2026-01-01",
        fechaTexto: "01/01/2026",
        usuario: "Luis Benavides",
      },
      {
        id: "2",
        nombre: "Desactivación de Cabaña",
        tipo: "Automática",
        detalle: "La cabaña A fue desactivada",
        fechaISO: "2026-01-07",
        fechaTexto: "07/01/2026",
        usuario: "Alex Naranjo",
      },
      {
        id: "3",
        nombre: "Reembolso Aprobado",
        tipo: "Automática",
        detalle: "Se aprobó el reembolso de Carlos Alvarado en RV-009",
        fechaISO: "2026-01-10",
        fechaTexto: "10/01/2026",
        usuario: "Admin",
      },
      {
        id: "4",
        nombre: "Modificación de Inventario",
        tipo: "Automática",
        detalle: "Se actualizó la cantidad de palas en el local (2 → 3)",
        fechaISO: "2026-01-09",
        fechaTexto: "09/01/2026",
        usuario: "Alex Naranjo",
      },
      {
        id: "5",
        nombre: "Activación de Cabaña",
        tipo: "Automática",
        detalle: "La cabaña A fue reactivada",
        fechaISO: "2026-01-09",
        fechaTexto: "09/01/2026",
        usuario: "Kristhel Cordero",
      },
      {
        id: "6",
        nombre: "Celebración de Cumpleaños",
        tipo: "Manual",
        detalle: "Lo pasamos muy bonito con el cumpleaños alex :D",
        fechaISO: "2026-01-08",
        fechaTexto: "08/01/2026",
        usuario: "Luis Benavides",
      },
      {
        id: "7",
        nombre: "Reserva",
        tipo: "Automática",
        detalle: "El cliente Carlos Alvarado hizo la reserva RV-009",
        fechaISO: "2026-01-04",
        fechaTexto: "04/01/2026",
        usuario: "Luis Benavides",
      },
      {
        id: "8",
        nombre: "Modificación de Inventario",
        tipo: "Automática",
        detalle: "Se actualizó la cantidad de café en el local (1kg → 7kg)",
        fechaISO: "2026-01-05",
        fechaTexto: "05/01/2026",
        usuario: "Luis Benavides",
      },
    ],
    []
  );

  // pagination
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, safePage]);

  // form state
  const [nombre, setNombre] = useState("");
  const [detalle, setDetalle] = useState("");

  // confirm modal
  const [confirmOpen, setConfirmOpen] = useState(false);
  const canSubmit = nombre.trim().length > 0 && detalle.trim().length > 0;

  const requestAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setConfirmOpen(true);
  };

  const cancelAdd = () => setConfirmOpen(false);

  const confirmAdd = () => {
    setConfirmOpen(false);

    // TODO: POST /auditoria { nombre, detalle }
    alert("Entrada agregada (placeholder)");

    setNombre("");
    setDetalle("");
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarAdmin />

      <div className="flex-1 flex flex-col min-h-0">
        <TopBar />

        {/* ✅ main is the ONLY scroll container, keeps ml-70 */}
        <main className="flex-1 overflow-y-auto pt-20 px-8 ml-70 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0">
              <h3 className="text-3xl font-bold mb-1 text-black mt-4">
                Auditoría y Bitácora
              </h3>
              <p className="text-verde3 mb-4 text-md">
                Visualizar las acciones administrativas y detalles
              </p>
              <div className="border-b border-black/20" />
            </div>

            {/* Table */}
            <div className="pt-6">
              <div className="bg-beige1 border border-default border-borde1 rounded-xl overflow-hidden w-full">
                <div className="grid grid-cols-[220px_140px_1fr_140px_160px] px-4 py-2 bg-black/5 text-xs font-semibold text-black">
                  <div className="flex items-center gap-2">
                    <FilterIcon />
                    Nombre
                  </div>
                  <div className="flex items-center gap-2">
                    <FilterIcon />
                    Tipo
                  </div>
                  <div>Detalle</div>
                  <div className="flex items-center gap-2">
                    <FilterIcon />
                    Fecha
                  </div>
                  <div className="flex items-center gap-2">
                    <FilterIcon />
                    Usuario
                  </div>
                </div>

                <div className="divide-y divide-black/10">
                  {pageRows.map((r) => (
                    <div
                      key={r.id}
                      className="grid grid-cols-[220px_140px_1fr_140px_160px] px-4 py-2 items-center"
                    >
                      <div className="text-sm text-black">{r.nombre}</div>
                      <div className="text-sm text-black">{r.tipo}</div>
                      <div className="text-sm text-verde3">{r.detalle}</div>
                      <div className="text-sm text-black">{r.fechaTexto}</div>
                      <div className="text-sm text-black">{r.usuario}</div>
                    </div>
                  ))}
                </div>

                <PaginationControls
                  page={safePage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  showCounter={true}
                />
              </div>
            </div>

            {/* Form section */}
            <div className="pt-10 pb-10">
              <h2 className="text-2xl font-bold text-black">
                Agregar Entrada a la Bitácora
              </h2>
              <p className="text-verde3 mt-1">
                Una vez registra algo en la bitácora, no puede ser modificado y se guardará con su usuario actual
              </p>
              <div className="border-b border-black/20 mt-4" />

              <form onSubmit={requestAdd} className="mt-6 max-w-xl">
                <div className="mb-4">
                  <label className="block text-xs text-black mb-1">Nombre</label>
                  <input
                    value={nombre}
                    maxLength={NOMBRE_MAX}
                    onChange={(e) => setNombre(e.target.value.slice(0, NOMBRE_MAX))}
                    placeholder="Ingrese el nombre de la entrada de la bitácora"
                    className="w-full bg-beige2 border border-borde2 rounded-md px-3 py-2 text-sm text-black placeholder:text-black/40 outline-none focus:ring-2 focus:ring-verde2"
                  />
                </div>
                <div className="mt-1 text-right text-xs text-verde3">
                  {nombre.length}/{NOMBRE_MAX}
                </div>

                <div className="mb-6">
                  <label className="block text-xs text-black mb-1">Detalle</label>
                  <input
                    value={detalle}
                    maxLength={DETALLE_MAX}
                    onChange={(e) => setDetalle(e.target.value.slice(0, DETALLE_MAX))}
                    placeholder="Ingrese la descripción de la entrada de la bitácora"
                    className="w-full bg-beige2 border border-borde2 rounded-md px-3 py-2 text-sm text-black placeholder:text-black/40 outline-none focus:ring-2 focus:ring-verde2"
                  />
                </div>
                <div className="mt-1 text-right text-xs text-verde3">
                  {detalle.length}/{DETALLE_MAX}
                </div>


                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={[
                    "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition",
                    canSubmit
                      ? "bg-verde2 text-white hover:opacity-95"
                      : "bg-black/20 text-black/50 cursor-not-allowed",
                  ].join(" ")}
                >
                  <PlusIcon />
                  Agregar Entrada
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Agregar entrada"
        message={`¿Desea agregar esta entrada a la bitácora?\n\nNombre: ${nombre}\nDetalle: ${detalle}`}
        confirmText="Agregar"
        cancelText="Cancelar"
        confirmVariant="primary"
        onConfirm={confirmAdd}
        onCancel={cancelAdd}
      />
    </div>
  );
}
