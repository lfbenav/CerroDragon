"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AdminPageShell } from "../../components";

type AdminUserRow = {
  id: string;      // A-001
  nombre: string;  // Alex Naranjo
  correo: string;  // sr.alex@gmail.com
};

export default function AdminInternosPage() {
  const rows: AdminUserRow[] = useMemo(
    () => [
      { id: "A-001", nombre: "Alex Naranjo", correo: "sr.alex@gmail.com" },
      { id: "A-002", nombre: "Luis Benavides", correo: "wiserf@gmail.com" },
      { id: "A-003", nombre: "Kristhel Cordero", correo: "kriis@gmail.com" },
      { id: "A-004", nombre: "Admin", correo: "ad.min@gmail.com" },
    ],
    []
  );

  const [q, setQ] = useState("");

  const filtered = rows.filter((r) => {
    const s = (r.id + " " + r.nombre + " " + r.correo).toLowerCase();
    return s.includes(q.toLowerCase());
  });

  return (
    <AdminPageShell
      title="Gestión de Usuarios Internos"
      subtitle="Consulta los administradores de Cerro Dragón"
      actions={
        <Link
          href="/admin/internos/crear"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
        >
          <PlusIcon />
          Crear Usuario
        </Link>
      }
    >
      <div className="py-6 flex flex-col gap-4 max-w-4xl">
        {/* Stat box */}
        <div className="bg-beige1 border border-default border-borde1 rounded-xl px-4 py-3 w-[280px]">
          <div className="text-xs text-verde3">Administradores Totales</div>
          <div className="text-xl font-semibold text-black">{rows.length}</div>
        </div>

        {/* Search */}
        <div className="bg-beige1 border border-default border-borde1 rounded-xl px-4 py-2">
          <div className="flex items-center gap-2">
            <SearchIcon />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar usuario . . ."
              className="w-full bg-transparent outline-none text-sm text-black placeholder:text-black/40"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-beige1 border border-default border-borde1 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[120px_1fr] px-4 py-2 bg-black/5 text-xs font-semibold text-black">
            <div>ID</div>
            <div>Usuario</div>
          </div>

          <div className="divide-y divide-black/10">
            {filtered.map((r) => (
              <Link
                key={r.id}
                href={`/admin/internos/${encodeURIComponent(r.id)}`}
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

          {/* Fake pagination indicator like screenshot (optional visual) */}
          <div className="flex justify-center gap-4 py-2 text-black/40">
            <span>{"◀"}</span>
            <span>{"▶"}</span>
          </div>
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

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-verde3" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 21l-4.3-4.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
