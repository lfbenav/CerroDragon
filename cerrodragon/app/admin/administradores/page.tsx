"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { AdminPageShell, SearchBar, PaginationControls } from "../../components";

type AdminUserRow = {
  id: string;
  nombre: string;
  correo: string;
};

const PAGE_SIZE = 4;

export default function AdminInternosPage() {
  const rows: AdminUserRow[] = useMemo(
    () => [
      { id: "A-001", nombre: "Alex Naranjo", correo: "sr.alex@gmail.com" },
      { id: "A-002", nombre: "Luis Benavides", correo: "wiserf@gmail.com" },
      { id: "A-003", nombre: "Kristhel Cordero", correo: "kriis@gmail.com" },
      { id: "A-004", nombre: "Admin", correo: "ad.min@gmail.com" },
      { id: "A-005", nombre: "María Pérez", correo: "maria@gmail.com" },
      { id: "A-006", nombre: "Juan Mora", correo: "juan@gmail.com" },
    { id: "A-007", nombre: "Carlos García", correo: "carlos@gmail.com" },
    { id: "A-008", nombre: "Sofia López", correo: "sofia@gmail.com" },
    { id: "A-009", nombre: "Roberto Díaz", correo: "roberto@gmail.com" },
    { id: "A-010", nombre: "Elena Rodríguez", correo: "elena@gmail.com" },
    { id: "A-011", nombre: "Diego Sánchez", correo: "diego@gmail.com" },
    ],[]
  );

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

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

  const canPrev = safePage > 1;
  const canNext = safePage < totalPages;

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
          <div className="text-xs text-verde3">Administradores Totales</div>
          <div className="text-xl font-semibold text-black">{rows.length}</div>
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
            {pageRows.map((r) => (
              <Link
                key={r.id}
                href={`/admin/administradores/${encodeURIComponent(r.id)}`}
                className="grid grid-cols-[120px_1fr] px-4 py-3 hover:bg-black/5"
              >
                <div className="text-sm text-black">{r.id}</div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-black">
                    {r.nombre}
                  </span>
                  <span className="text-xs text-verde3">{r.correo}</span>
                </div>
              </Link>
            ))}

            {filtered.length === 0 && (
              <div className="px-4 py-6 text-sm text-black/60">
                No se encontraron usuarios.
              </div>
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
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
