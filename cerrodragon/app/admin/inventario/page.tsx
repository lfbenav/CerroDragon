"use client";

import { useMemo, useState, useEffect } from "react";
import {
  SideBarAdmin,
  TopBar,
  PaginationControls,
  ConfirmModal,
  CheckIcon,
  XIcon,
  PencilIcon,
  CircleXIcon,
  FilterIcon,
  PlusIcon,
  SearchBar,
} from "../../components";

const API_URL = "http://localhost:3000";

/* =====================
   TYPES
===================== */

type Item = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
};

const PAGE_SIZE = 7;

type SortKey = "nombre" | "cantidad" | null;
type SortDir = "asc" | "desc";

/* =====================
   PAGE
===================== */

export default function AdminInventarioPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // search
  const [q, setQ] = useState("");

  // sorting
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // pagination
  const [page, setPage] = useState(1);

  // editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    nombre: "",
    cantidad: "",
    unidad: "",
  });

  // delete modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* =====================
     FETCH INVENTORY
  ===================== */

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        const res = await fetch(`${API_URL}/others/inventory`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error cargando inventario");

        const json = await res.json();
        setItems(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  /* =====================
     SORT / FILTER
  ===================== */

  const toggleSort = (key: Exclude<SortKey, null>) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const filteredItems = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return items;

    return items.filter((it) =>
      `${it.name} ${it.unit} ${it.quantity}`.toLowerCase().includes(qq)
    );
  }, [items, q]);

  const sortedItems = useMemo(() => {
    const arr = [...filteredItems];
    if (!sortKey) return arr;

    arr.sort((a, b) => {
      if (sortKey === "nombre") {
        const res = a.name.localeCompare(b.name, "es", { sensitivity: "base" });
        return sortDir === "asc" ? res : -res;
      }
      if (sortKey === "cantidad") {
        const res = a.quantity - b.quantity;
        return sortDir === "asc" ? res : -res;
      }
      return 0;
    });

    return arr;
  }, [filteredItems, sortKey, sortDir]);

  useEffect(() => {
    setPage(1);
  }, [q]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageItems = sortedItems.slice(start, start + PAGE_SIZE);

  /* =====================
     CRUD ACTIONS
  ===================== */

  const openNew = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(`${API_URL}/others/inventory`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Nuevo artículo",
          unit: "unidades",
          quantity: 0,
        }),
      });

      if (!res.ok) throw new Error("Error creando artículo");

      const json = await res.json();
      setItems((prev) => [json.data, ...prev]);
      setEditingId(json.data.id);
      setDraft({ nombre: "", cantidad: "", unidad: "" });
      setPage(1);
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (it: Item) => {
    setEditingId(it.id);
    setDraft({
      nombre: it.name,
      cantidad: String(it.quantity),
      unidad: it.unit,
    });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id: string) => {
    const name = draft.nombre.trim();
    const unit = draft.unidad.trim();
    const quantity = Number(draft.cantidad);

    if (!name || !unit || Number.isNaN(quantity)) return;

    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(`${API_URL}/others/inventory/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, unit, quantity }),
      });

      if (!res.ok) throw new Error("Error actualizando");

      const json = await res.json();

      setItems((prev) =>
        prev.map((x) => (x.id === id ? json.data : x))
      );
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const requestDelete = (id: string) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(`${API_URL}/others/inventory/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error eliminando");

      setItems((prev) => prev.filter((x) => x.id !== deleteId));
      setDeleteId(null);
      setEditingId((cur) => (cur === deleteId ? null : cur));
    } catch (err) {
      console.error(err);
    }
  };

  const deletingItem = deleteId
    ? items.find((x) => x.id === deleteId)
    : null;

  /* =====================
     RENDER
  ===================== */

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarAdmin />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            {/* Header */}
            <div className="flex-shrink-0">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-3xl font-bold mb-1 text-black mt-4">
                    Inventario
                  </h3>
                  <p className="text-verde3 mb-4 text-lg">
                    Gestión del inventario de Cerro Dragón
                  </p>
                </div>

                <button
                  onClick={openNew}
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-verde2 text-white text-sm font-medium"
                >
                  <PlusIcon />
                  Nuevo Artículo
                </button>
              </div>

              <div className="border-b border-black/20" />
            </div>

            {/* Search */}
            <div className="pt-6">
              <SearchBar texto="Buscar artículo . . ." value={q} onChange={setQ} />
            </div>

            {/* Table card */}
            <div className="flex-1 overflow-y-auto min-h-0 pb-6">
              <div className="bg-beige1 border border-default border-borde1 rounded-xl overflow-hidden w-full">
                
                {/* Header row */}
                <div className="grid grid-cols-[2fr_1fr_1fr_120px] px-6 py-3 bg-black/5 text-xs font-semibold text-black">
                  <button
                    type="button"
                    onClick={() => toggleSort("nombre")}
                    className="flex items-center gap-2 text-left hover:text-verde2"
                  >
                    <FilterIcon />
                    Nombre
                    {sortKey === "nombre" && (sortDir === "asc" ? " ▲" : " ▼")}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSort("cantidad")}
                    className="flex items-center gap-2 text-left hover:text-verde2"
                  >
                    <FilterIcon />
                    Cantidad
                    {sortKey === "cantidad" && (sortDir === "asc" ? " ▲" : " ▼")}
                  </button>

                  <div>Unidad</div>
                  <div className="text-right">Acciones</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-black/10 px-2">
                  {pageItems.map((it) => {
                    const isEditing = editingId === it.id;

                    return (
                      <div
                        key={it.id}
                        className="grid grid-cols-[2fr_1fr_1fr_120px] px-4 py-2 items-center"
                      >
                        {/* Nombre */}
                        <div className="pr-4">
                          {isEditing ? (
                            <input
                              value={draft.nombre}
                              onChange={(e) =>
                                setDraft((d) => ({
                                  ...d,
                                  nombre: e.target.value.slice(0, 40),
                                }))
                              }
                              placeholder="Ingrese Nombre"
                              className="w-full bg-beige2 border border-borde2 rounded-md px-3 py-1.5 text-sm text-black outline-none focus:ring-2 focus:ring-verde2"
                            />
                          ) : (
                            <span className="text-sm text-black">{it.name}</span>
                          )}
                        </div>

                        {/* Cantidad */}
                        <div className="pr-4">
                          {isEditing ? (
                            <input
                              value={draft.cantidad}
                              onChange={(e) =>
                                setDraft((d) => ({
                                  ...d,
                                  cantidad: e.target.value.replace(/[^\d]/g, "").slice(0, 6),
                                }))
                              }
                              placeholder="0"
                              className="w-full bg-beige2 border border-borde2 rounded-md px-3 py-1.5 text-sm text-black outline-none focus:ring-2 focus:ring-verde2"
                            />
                          ) : (
                            <span className="text-sm text-black">{it.quantity}</span>
                          )}
                        </div>

                        {/* Unidad */}
                        <div className="pr-4">
                          {isEditing ? (
                            <input
                              value={draft.unidad}
                              onChange={(e) =>
                                setDraft((d) => ({
                                  ...d,
                                  unidad: e.target.value.slice(0, 15),
                                }))
                              }
                              placeholder="Ingrese unidad"
                              className="w-full bg-beige2 border border-borde2 rounded-md px-3 py-1.5 text-sm text-black outline-none focus:ring-2 focus:ring-verde2"
                            />
                          ) : (
                            <span className="text-sm text-black">{it.unit}</span>
                          )}
                        </div>

                        {/* Acciones */}
                        <div className="flex justify-end gap-2">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => saveEdit(it.id)}
                                className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-black/5 text-black"
                                title="Guardar"
                              >
                                <CheckIcon />
                              </button>
                              <button
                                type="button"
                                onClick={cancelEdit}
                                className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-black/5 text-black"
                                title="Cancelar"
                              >
                                <XIcon />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => startEdit(it)}
                                className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-black/5 text-black"
                                title="Editar"
                              >
                                <PencilIcon />
                              </button>
                              <button
                                type="button"
                                onClick={() => requestDelete(it.id)}
                                className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-black/5 text-black"
                                title="Eliminar"
                              >
                                <CircleXIcon />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {sortedItems.length === 0 && (
                    <div className="px-6 py-6 text-sm text-black/60">
                      No se encontraron artículos.
                    </div>
                  )}
                </div>

                {/* Pagination */}
                <PaginationControls
                  page={safePage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  showCounter={false}
                />
              </div>
            </div>

          </div>
        </main>
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Eliminar artículo"
        message={
          deletingItem
            ? `¿Eliminar "${deletingItem.name}"?`
            : "¿Eliminar artículo?"
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
