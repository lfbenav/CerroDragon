"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminPageShell, PaginationControls, ConfirmModal, FilterIcon } from "../../../components";

type ReservaEstado = "Pendiente" | "Confirmado" | "Cancelado" | "Reembolsado";

type ReservaRow = {
  id: string;
  tour: string;
  monto: number;
  fechaISO: string;   // YYYY-MM-DD (for sorting/filtering)
  fechaTexto: string; // display
  personas: number;
  estado: ReservaEstado;
};

type ClienteDetail = {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  reservas: ReservaRow[];
};

const PAGE_SIZE = 4;

type SortKey = "monto" | "fecha" | null;
type SortDir = "asc" | "desc";

export default function AdminClienteDetallePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);

  // ✅ Placeholder (API-ready)
  const initialData: ClienteDetail = useMemo(() => {
    const nombre = id === "C-001" ? "Carlos Alvarado" : "Cliente";
    const correo = id === "C-001" ? "alvarado.c@gmail.com" : "cliente@gmail.com";
    const telefono = id === "C-001" ? "8888-8882" : "8888-0000";

    const reservas: ReservaRow[] = [
      {
        id: "RV-001",
        tour: "Cerro Dragón",
        monto: 30000,
        fechaISO: "2026-01-10",
        fechaTexto: "10 de enero de 2026",
        personas: 2,
        estado: "Confirmado",
      },
      {
        id: "RV-002",
        tour: "Mirador Dragón",
        monto: 50000,
        fechaISO: "2026-01-01",
        fechaTexto: "1 de enero de 2026",
        personas: 2,
        estado: "Cancelado",
      },
      {
        id: "RV-003",
        tour: "Cataratas",
        monto: 45000,
        fechaISO: "2025-08-04",
        fechaTexto: "4 de agosto de 2025",
        personas: 4,
        estado: "Confirmado",
      },
      {
        id: "RV-004",
        tour: "3 Cerros",
        monto: 30000,
        fechaISO: "2025-03-03",
        fechaTexto: "3 de marzo de 2025",
        personas: 3,
        estado: "Pendiente",
      },
      {
        id: "RV-009",
        tour: "Cerro Dragón",
        monto: 75000,
        fechaISO: "2026-01-22",
        fechaTexto: "22 de enero de 2026",
        personas: 6,
        estado: "Confirmado",
      },
    ];

    return { id, nombre, correo, telefono, reservas };
  }, [id]);

  // ✅ make it mutable so we can update status
  const [cliente, setCliente] = useState<ClienteDetail>(initialData);

  // filters
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [minMonto, setMinMonto] = useState<string>("");
  const [maxMonto, setMaxMonto] = useState<string>("");

  // sorting
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (key: Exclude<SortKey, null>) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  // pagination
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [dateFrom, dateTo, minMonto, maxMonto, sortKey, sortDir, cliente.id]);

  // ✅ filter
  const filteredReservas = useMemo(() => {
    const min = minMonto.trim() === "" ? null : Number(minMonto);
    const max = maxMonto.trim() === "" ? null : Number(maxMonto);

    return cliente.reservas.filter((r) => {
      if (dateFrom && r.fechaISO < dateFrom) return false;
      if (dateTo && r.fechaISO > dateTo) return false;

      if (min !== null && !Number.isNaN(min) && r.monto < min) return false;
      if (max !== null && !Number.isNaN(max) && r.monto > max) return false;

      return true;
    });
  }, [cliente.reservas, dateFrom, dateTo, minMonto, maxMonto]);

  // ✅ sort after filtering
  const sortedReservas = useMemo(() => {
    const arr = [...filteredReservas];
    if (!sortKey) return arr;

    arr.sort((a, b) => {
      if (sortKey === "monto") {
        const res = a.monto - b.monto;
        return sortDir === "asc" ? res : -res;
      }
      // fecha sort using ISO string
      const res = a.fechaISO.localeCompare(b.fechaISO);
      return sortDir === "asc" ? res : -res;
    });

    return arr;
  }, [filteredReservas, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedReservas.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return sortedReservas.slice(start, start + PAGE_SIZE);
  }, [sortedReservas, safePage]);

  // actions (API-ready)
  const handleBack = () => router.back();

  const handleComprobante = async (reservaId: string) => {
    // TODO: GET /reservas/{id}/comprobante
    alert(`Comprobante (placeholder) para ${reservaId}`);
  };

  // ✅ ConfirmModal for refund
    const [refundConfirmOpen, setRefundConfirmOpen] = useState(false);
    const [refundTargetId, setRefundTargetId] = useState<string | null>(null);

    const [comprobanteConfirmOpen, setComprobanteConfirmOpen] = useState(false);
    const [comprobanteTargetId, setComprobanteTargetId] = useState<string | null>(null);

    const requestComprobante = (reservaId: string) => {
    setComprobanteTargetId(reservaId);
    setComprobanteConfirmOpen(true);
    };

    const cancelComprobante = () => {
    setComprobanteConfirmOpen(false);
    setComprobanteTargetId(null);
    };

    const confirmComprobante = async () => {
    if (!comprobanteTargetId) return;

    await handleComprobante(comprobanteTargetId);

    setComprobanteConfirmOpen(false);
    setComprobanteTargetId(null);
    };

    const comprobanteTarget = comprobanteTargetId
  ? cliente.reservas.find((r) => r.id === comprobanteTargetId)
  : null;

  const requestRefund = (reservaId: string) => {
    setRefundTargetId(reservaId);
    setRefundConfirmOpen(true);
  };

  const cancelRefund = () => {
    setRefundConfirmOpen(false);
    setRefundTargetId(null);
  };

  const confirmRefund = async () => {
    if (!refundTargetId) return;

    // TODO: POST /reservas/{id}/reembolso
    // await fetch(...)

    // ✅ Update UI immediately
    setCliente((prev) => ({
      ...prev,
      reservas: prev.reservas.map((r) =>
        r.id === refundTargetId ? { ...r, estado: "Reembolsado" } : r
      ),
    }));

    setRefundConfirmOpen(false);
    setRefundTargetId(null);
  };

  const refundTarget = refundTargetId
    ? cliente.reservas.find((r) => r.id === refundTargetId)
    : null;

  return (
    <AdminPageShell
      title="Información del Cliente"
      subtitle="Información personal del cliente"
      actions={
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
        >
          <BackIcon />
          Volver
        </button>
      }
    >
      <div className="py-4 w-full max-w-7xl">
        <h3 className="text-xl font-serif text-black mb-3">
        {cliente.nombre} <span className="text-black/60">- {cliente.id}</span>
        </h3>

        <div className="space-y-3 mb-6">
          <p className="text-black">
            <span className="font-bold">Correo electrónico:</span>{" "}
            <span>{cliente.correo}</span>
          </p>
          <p className="text-black">
            <span className="font-bold">Teléfono:</span>{" "}
            <span>{cliente.telefono}</span>
          </p>
        </div>

        <h3 className="font-semibold text-black mb-2 text-md tracking-wide"> 
        Historial de Reservas
    </h3>

        {/* Filters */}
        <div className="bg-beige1 border border-default border-borde1 rounded-xl p-3 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-black mb-1">Desde</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-beige2 border border-borde2 rounded-md px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-verde2"
              />
            </div>

            <div>
              <label className="block text-xs text-black mb-1">Hasta</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full bg-beige2 border border-borde2 rounded-md px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-verde2"
              />
            </div>

            <div>
              <label className="block text-xs text-black mb-1">Monto mín.</label>
              <input
                inputMode="numeric"
                value={minMonto}
                onChange={(e) => setMinMonto(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="0"
                className="w-full bg-beige2 border border-borde2 rounded-md px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-verde2"
              />
            </div>

            <div>
              <label className="block text-xs text-black mb-1">Monto máx.</label>
              <input
                inputMode="numeric"
                value={maxMonto}
                onChange={(e) => setMaxMonto(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="999999"
                className="w-full bg-beige2 border border-borde2 rounded-md px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-verde2"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-beige1 border border-default border-borde1 rounded-xl overflow-hidden w-full">
          {/* Header row (sortable Monto + Fecha) */}
          <div className="grid grid-cols-[90px_1fr_120px_160px_90px_130px_280px] px-4 py-2 bg-black/5 text-xs font-semibold text-black">
            <div>ID</div>
            <div>Tour</div>

            <button
            type="button"
            onClick={() => toggleSort("monto")}
            className="flex items-center gap-2 text-left hover:text-verde2"
            title="Ordenar por monto"
            >
            <FilterIcon />
            Monto
            <span className="text-xs">
                {sortKey === "monto"
                ? sortDir === "asc"
                    ? " ▲"
                    : " ▼"
                : " ⇅"}
            </span>
            </button>

            <button
            type="button"
            onClick={() => toggleSort("fecha")}
            className="flex items-center gap-2 text-left hover:text-verde2"
            title="Ordenar por fecha"
            >
            <FilterIcon />
            Fecha
            <span className="text-xs">
                {sortKey === "fecha"
                ? sortDir === "asc"
                    ? " ▲"
                    : " ▼"
                : " ⇅"}
            </span>
            </button>

            <div>Personas</div>
            <div>Estado</div>
            <div className="text-right">Acciones</div>
          </div>

          <div className="divide-y divide-black/10">
            {pageRows.map((r) => {
              const refundDisabledReason = getRefundDisabledReason(r);
              const canRefund = refundDisabledReason === null;

              return (
                <div
                  key={r.id}
                  className="grid grid-cols-[90px_1fr_120px_160px_90px_130px_280px] px-4 py-2 items-center"
                >
                  <div className="text-sm text-black">{r.id}</div>
                  <div className="text-sm text-black">{r.tour}</div>

                  <div className="text-sm text-verde3 font-medium">
                    {formatCRC(r.monto)}
                  </div>

                  <div className="text-sm text-black">{r.fechaTexto}</div>

                  <div className="text-sm text-rojoalerta font-medium">
                    {r.personas}
                  </div>

                  <div>
                    <EstadoBadge estado={r.estado} />
                  </div>

                  <div className="flex justify-end gap-2 items-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => requestRefund(r.id)}
                      disabled={!canRefund}
                      title={canRefund ? "Reembolso" : refundDisabledReason ?? "No disponible"}
                      className={[
                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold",
                        canRefund
                          ? "bg-red-500 text-white hover:opacity-95"
                          : "bg-black/10 text-black/40 cursor-not-allowed",
                      ].join(" ")}
                    >
                      <RefundIcon />
                      Reembolso
                    </button>

                    <button
                      type="button"
                      onClick={() => requestComprobante(r.id)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-verde2 text-white hover:opacity-95"
                      title="Comprobante"
                    >
                      <ReceiptIcon />
                      Comprobante
                    </button>
                  </div>
                </div>
              );
            })}

            {sortedReservas.length === 0 && (
              <div className="px-4 py-6 text-sm text-black/60">
                No hay reservas que coincidan con los filtros.
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

        {/* Confirm before refund */}
        <ConfirmModal
          open={refundConfirmOpen}
          title="Confirmar reembolso"
          message={
            refundTarget
              ? `¿Desea realizar el reembolso de la reserva "${refundTarget.id}"?\n\nTour: ${refundTarget.tour}\nMonto: ${formatCRC(refundTarget.monto)}\nFecha: ${refundTarget.fechaTexto}`
              : "¿Desea realizar el reembolso?"
          }
          confirmText="Reembolsar"
          cancelText="Cancelar"
          confirmVariant="danger"
          onConfirm={confirmRefund}
          onCancel={cancelRefund}
        />
        <ConfirmModal
        open={comprobanteConfirmOpen}
        title="Enviar comprobante"
        message={
            comprobanteTarget
            ? `¿Desea enviar/abrir el comprobante de la reserva "${comprobanteTarget.id}"?\n\nTour: ${comprobanteTarget.tour}\nMonto: ${formatCRC(comprobanteTarget.monto)}\nFecha: ${comprobanteTarget.fechaTexto}`
            : "¿Desea enviar/abrir el comprobante?"
        }
        confirmText="Sí"
        cancelText="Cancelar"
        confirmVariant="primary"
        onConfirm={confirmComprobante}
        onCancel={cancelComprobante}
        />

      </div>
    </AdminPageShell>
  );
}

/* ===== Rules ===== */
function getRefundDisabledReason(r: ReservaRow): string | null {
  if (r.estado === "Reembolsado") return "Ya fue reembolsado";
  if (r.estado !== "Confirmado") return "Solo se puede reembolsar si está Confirmado";

  const daysPast = daysSince(r.fechaISO);
  if (daysPast > 10) return "Han pasado más de 10 días desde la fecha";

  return null;
}

function daysSince(isoDate: string) {
  const now = new Date();
  const date = new Date(`${isoDate}T00:00:00`);
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/* ===== Helpers ===== */
function formatCRC(n: number) {
  const s = Math.round(n).toString();
  const withDots = s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `₡ ${withDots}`;
}

function EstadoBadge({ estado }: { estado: ReservaEstado }) {
  if (estado === "Pendiente") {
    return (
      <span className="inline-flex items-center px-3 py-0.5 text-xs font-bold rounded bg-amarillotrans text-amarillo">
        Pendiente
      </span>
    );
  }
  if (estado === "Confirmado") {
    return (
      <span className="inline-flex items-center px-3 py-0.5 text-xs font-bold rounded bg-verdetrans text-verde3">
        Confirmado
      </span>
    );
  }
  if (estado === "Cancelado") {
    return (
      <span className="inline-flex items-center px-3 py-0.5 text-xs font-bold rounded bg-red-100 text-rojoalerta">
        Cancelado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-0.5 text-xs font-bold rounded bg-azultrans text-azul1">
      Reembolsado
    </span>
  );
}

/* ===== Icons ===== */
function BackIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RefundIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12h12m0 0-4-4m4 4-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3h10v18l-2-1-2 1-2-1-2 1-2-1-2 1V3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 7h6M9 11h6M9 15h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
