"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  AdminPageShell,
  SearchBar,
  PaginationControls,
} from "../../components";

type AdminUserRow = {
  id: string;
  nombre: string;
  correo: string;
};

type AdminAPI = {
  user_id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
};

const API_URL = "http://localhost:3000";
const PAGE_SIZE = 4;

export default function AdminInternosPage() {
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  /* =========================
     FETCH ADMINS
  ========================== */
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch(`${API_URL}/users/admins`);
        const json = await res.json();

        if (res.ok) {
          const mapped: AdminUserRow[] = json.data.map((a: AdminAPI) => ({
            id: a.user_id,
            nombre: a.full_name,
            correo: a.email,
          }));

          setRows(mapped);
        }
      } catch (err) {
        console.error("Error cargando administradores", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  /* =========================
     FILTRO
  ========================== */
  const filtered = useMemo(() => {
    const qq = q.toLowerCase();
    return rows.filter((r) => {
      const s = (r.id + " " + r.nombre + " " + r.correo).toLowerCase();
      return s.includes(qq);
    });
  }, [rows, q]);

  useEffect(() => {
    setPage(1);
  }, [q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pageRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  return (
    <AdminPageShell
      title="Gestión de Usuarios Internos"
      subtitle="Consulta los administradores de Cerro Dragón"
      actions={
        <Link
          href="/admin/administradores/crear"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
        >
          <PlusIcon />
          Crear Usuario
        </Link>
      }
    >
      <div className="py-6 flex flex-col gap-4 w-full">
        {/* Stat box */}
        <div className="bg-beige1 border border-default border-borde1 rounded-xl px-4 py-3 w-[280px]">
          <div className="text-xs text-verde3">
            Administradores Totales
          </div>
          <div className="text-xl font-semibold text-black">
            {rows.length}
          </div>
        </div>

        {/* Search */}
        <SearchBar texto="Buscar usuario . . ." value={q} onChange={setQ} />

        {/* Table */}
        <div className="bg-beige1 border border-default border-borde1 rounded-xl overflow-hidden w-full">
          <div className="grid grid-cols-[120px_1fr] px-4 py-2 bg-black/5 text-xs font-semibold text-black">
            <div>ID</div>
            <div>Usuario</div>
          </div>

          <div className="divide-y divide-black/10">
            {loading ? (
              <div className="px-4 py-6 text-sm text-verde3">
                Cargando administradores...
              </div>
            ) : pageRows.length === 0 ? (
              <div className="px-4 py-6 text-sm text-black/60">
                No se encontraron usuarios.
              </div>
            ) : (
              pageRows.map((r) => (
                <Link
                  key={r.id}
                  href={`/admin/administradores/${encodeURIComponent(
                    r.id
                  )}`}
                  className="grid grid-cols-[120px_1fr] px-4 py-3 hover:bg-black/5"
                >
                  <div className="text-sm text-black">{r.id}</div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-black">
                      {r.nombre}
                    </span>
                    <span className="text-xs text-verde3">
                      {r.correo}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Pagination */}
          <PaginationControls
            page={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
            showCounter={true}
          />
        </div>
      </div>
    </AdminPageShell>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
