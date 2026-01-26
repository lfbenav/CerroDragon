"use client";

import { useMemo, useState, useEffect } from "react";
import {
  SideBarAdmin,
  TopBar,
  PaginationControls,
  FilterIcon,
  ConfirmModal,
  PlusIcon,
} from "../../components";

const API_URL = "http://localhost:3000";

/* =====================
   TYPES
===================== */

interface AuditAPI {
  id: string;
  actor_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: string | null;
  created_at: string;
}

type AuditRow = {
  id: string;
  nombre: string;
  detalle: string;
  fechaISO: string;
  fechaTexto: string;
  usuario: string; // email
};

/* =====================
   CONSTS
===================== */

const PAGE_SIZE = 6;
const NOMBRE_MAX = 60;
const DETALLE_MAX = 90;

/* =====================
   PAGE
===================== */

export default function AdminAuditoriaPage() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);

  // cache userId -> email
  const [userEmailCache, setUserEmailCache] = useState<Record<string, string>>(
    {}
  );

  /* =====================
     FETCH AUDIT LOGS
  ===================== */
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(`${API_URL}/others/audit`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error cargando auditoría");

        const json = await res.json();
        const logs: AuditAPI[] = json.data;

        const emailCache: Record<string, string> = { ...userEmailCache };

        // fetch missing users
        await Promise.all(
          logs.map(async (l) => {
            if (!l.actor_user_id) return;
            if (emailCache[l.actor_user_id]) return;

            try {
              const uRes = await fetch(
                `${API_URL}/users/${l.actor_user_id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              if (uRes.ok) {
                const uJson = await uRes.json();
                emailCache[l.actor_user_id] = uJson.data.email;
              }
            } catch {
              emailCache[l.actor_user_id] = "Usuario desconocido";
            }
          })
        );

        setUserEmailCache(emailCache);

        const mapped: AuditRow[] = logs.map((l) => ({
          id: l.id,
          nombre: l.action,
          detalle: l.details ?? "",
          fechaISO: l.created_at.split("T")[0],
          fechaTexto: new Date(l.created_at).toLocaleDateString("es-CR"),
          usuario: l.actor_user_id
            ? emailCache[l.actor_user_id] ?? "Usuario"
            : "Sistema",
        }));

        setRows(mapped);
      } catch (err) {
        console.error("Error cargando auditoría", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  /* =====================
     PAGINATION
  ===================== */
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, safePage]);

  /* =====================
     FORM STATE
  ===================== */
  const [nombre, setNombre] = useState("");
  const [detalle, setDetalle] = useState("");

  const canSubmit =
    nombre.trim().length > 0 && detalle.trim().length > 0;

  /* =====================
     CONFIRM MODAL
  ===================== */
  const [confirmOpen, setConfirmOpen] = useState(false);

  const requestAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setConfirmOpen(true);
  };

  const cancelAdd = () => setConfirmOpen(false);

  const confirmAdd = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const userRaw = localStorage.getItem("user");
      const user = userRaw ? JSON.parse(userRaw) : null;

      await fetch(`${API_URL}/others/audit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          actor_user_id: user?.id ?? null,
          action: nombre,
          entity_type: "manual",
          details: detalle,
        }),
      });

      setNombre("");
      setDetalle("");
      setConfirmOpen(false);
      setLoading(true);

      // refetch
      const res = await fetch(`${API_URL}/others/audit`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setRows(
        json.data.map((l: AuditAPI) => ({
          id: l.id,
          nombre: l.action,
          detalle: l.details ?? "",
          fechaISO: l.created_at.split("T")[0],
          fechaTexto: new Date(l.created_at).toLocaleDateString("es-CR"),
          usuario: l.actor_user_id
            ? userEmailCache[l.actor_user_id] ?? "Usuario"
            : "Sistema",
        }))
      );
    } catch (err) {
      console.error("Error creando entrada de auditoría", err);
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarAdmin />

      <div className="flex-1 flex flex-col min-h-0">
        <TopBar />

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
                <div className="grid grid-cols-[220px_1fr_140px_200px] px-4 py-2 bg-black/5 text-xs font-semibold text-black">
                  <div className="flex items-center gap-2">
                    <FilterIcon />
                    Nombre
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
                  {loading ? (
                    <div className="px-4 py-6 text-sm text-verde3">
                      Cargando auditoría...
                    </div>
                  ) : (
                    pageRows.map((r) => (
                      <div
                        key={r.id}
                        className="grid grid-cols-[220px_1fr_140px_200px] px-4 py-2 items-center"
                      >
                        <div className="text-sm text-black">
                          {r.nombre}
                        </div>
                        <div className="text-sm text-verde3">
                          {r.detalle}
                        </div>
                        <div className="text-sm text-black">
                          {r.fechaTexto}
                        </div>
                        <div className="text-sm text-black">
                          {r.usuario}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <PaginationControls
                  page={safePage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  showCounter={true}
                />
              </div>
            </div>

            {/* Form */}
            <div className="pt-10 pb-10">
              <h2 className="text-2xl font-bold text-black">
                Agregar Entrada a la Bitácora
              </h2>
              <p className="text-verde3 mt-1">
                Una vez registra algo en la bitácora, no puede ser modificado y
                se guardará con su usuario actual
              </p>
              <div className="border-b border-black/20 mt-4" />

              <form onSubmit={requestAdd} className="mt-6 max-w-xl">
                <div className="mb-4">
                  <label className="block text-xs text-black mb-1">
                    Nombre
                  </label>
                  <input
                    value={nombre}
                    maxLength={NOMBRE_MAX}
                    onChange={(e) =>
                      setNombre(e.target.value.slice(0, NOMBRE_MAX))
                    }
                    className="w-full bg-beige2 border border-borde2 rounded-md px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-verde2"
                  />
                  <div className="mt-1 text-right text-xs text-verde3">
                    {nombre.length}/{NOMBRE_MAX}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs text-black mb-1">
                    Detalle
                  </label>
                  <input
                    value={detalle}
                    maxLength={DETALLE_MAX}
                    onChange={(e) =>
                      setDetalle(e.target.value.slice(0, DETALLE_MAX))
                    }
                    className="w-full bg-beige2 border border-borde2 rounded-md px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-verde2"
                  />
                  <div className="mt-1 text-right text-xs text-verde3">
                    {detalle.length}/{DETALLE_MAX}
                  </div>
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
