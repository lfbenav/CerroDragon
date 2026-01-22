"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { AdminPageShell, SearchBar, PaginationControls } from "../../components";

type ClientRow = {
  id: string;        // C-001
  nombre: string;    // Carlos Alvarado
  correo: string;    // alvarado.c@gmail.com
};

const PAGE_SIZE = 4;

export default function AdminClientesPage() {
  const rows: ClientRow[] = useMemo(
    () => [
      { id: "C-001", nombre: "Carlos Alvarado", correo: "alvarado.c@gmail.com" },
      { id: "C-002", nombre: "Armando Castillos", correo: "armando.c@gmail.com" },
      { id: "C-003", nombre: "Freddy Fazbear", correo: "jurjurjur.jr@gmail.com" },
      { id: "C-004", nombre: "Mario Mario", correo: "spaghetti@gmail.com" },
      { id: "C-005", nombre: "Carlos Carrazo", correo: "brummm@gmail.com" },
      { id: "C-006", nombre: "Alexis Alexander", correo: "a.alexander@gmail.com" },
      { id: "C-007", nombre: "John Jonson", correo: "jonnyj@gmail.com" },
      { id: "C-008", nombre: "Roy Rodríguez", correo: "rrodriguez@gmail.com" },
      { id: "C-009", nombre: "William Wilsons", correo: "willy@gmail.com" },
    ],
    []
  );

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return rows;
    return rows.filter((r) => {
      const s = `${r.id} ${r.nombre} ${r.correo}`.toLowerCase();
      return s.includes(qq);
    });
  }, [rows, q]);

  useEffect(() => {
    setPage(1);
  }, [q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  return (
    <AdminPageShell
      title="Gestión de Clientes"
      subtitle="Consulta los clientes de Cerro Dragón"
    >
      <div className="py-6 flex flex-col gap-4 w-full">
        {/* Stat box */}
        <div className="bg-beige1 border border-default border-borde1 rounded-xl px-4 py-3 w-[340px]">
          <div className="text-xs text-verde3">Clientes Totales</div>
          <div className="text-xl font-semibold text-black">{rows.length}</div>
        </div>

        {/* Search */}
        <SearchBar texto="Buscar cliente . . ." value={q} onChange={setQ} />

        {/* Table */}
        <div className="bg-beige1 border border-default border-borde1 rounded-xl overflow-hidden w-full">
          <div className="grid grid-cols-[120px_1fr] px-4 py-2 bg-black/5 text-xs font-semibold text-black">
            <div>ID</div>
            <div>Cliente</div>
          </div>

          <div className="divide-y divide-black/10">
            {pageRows.map((r) => (
              <Link
                key={r.id}
                href={`/admin/clientes/${encodeURIComponent(r.id)}`}
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
                No se encontraron clientes.
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
      </div>
    </AdminPageShell>
  );
}
