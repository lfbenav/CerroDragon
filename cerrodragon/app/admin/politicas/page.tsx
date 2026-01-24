"use client";

import { useEffect, useState } from "react";
import { SideBarAdmin, TopBar, CardPoliticaAdmin } from "../../components";

type Politica = {
  id: string;
  titulo: string;
  descripcion: string;
};

const API_URL = "http://localhost:3000";

type PolicyAPI = {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
};

export default function AdminPoliticasPage() {
  const [items, setItems] = useState<Politica[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH POLICIES
  ========================== */
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await fetch(`${API_URL}/others/policies`);
        const json = await res.json();

        if (res.ok) {
          const mapped: Politica[] = json.data.map((p: PolicyAPI) => ({
            id: p.id,
            titulo: p.title,
            descripcion: p.content,
          }));

          setItems(mapped);
        }
      } catch (err) {
        console.error("Error cargando políticas", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  /* =========================
     NUEVA POLÍTICA
  ========================== */
  const handleNew = () => {
    const newId = `new-${Date.now()}`;

    setItems((prev) => [
      {
        id: newId,
        titulo: "Ingrese el título",
        descripcion: "Ingrese la descripción",
      },
      ...prev,
    ]);

    setEditingId(newId);
  };

  /* =========================
     GUARDAR (CREATE / UPDATE)
  ========================== */
  const handleSave = async (
    id: string,
    next: { titulo: string; descripcion: string }
  ) => {
    try {
      const isNew = id.startsWith("new-");

      if (isNew) {
        const res = await fetch(`${API_URL}/others/policies`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: next.titulo,
            content: next.descripcion,
          }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message);

        setItems((prev) =>
          prev.map((x) =>
            x.id === id
              ? {
                  id: String(json.data.id),
                  titulo: json.data.title,
                  descripcion: json.data.content,
                }
              : x
          )
        );
      } else {
        const res = await fetch(`${API_URL}/others/policies/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: next.titulo,
            content: next.descripcion,
          }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message);

        setItems((prev) =>
          prev.map((x) =>
            x.id === id
              ? { ...x, titulo: next.titulo, descripcion: next.descripcion }
              : x
          )
        );
      }

      setEditingId(null);
    } catch (err) {
      console.error("Error guardando política", err);
      alert("Error al guardar la política");
    }
  };

  /* =========================
     ELIMINAR
  ========================== */
  const handleDelete = async (id: string) => {
    try {
      const isNew = id.startsWith("new-");

      if (!isNew) {
        const res = await fetch(`${API_URL}/others/policies/${id}`, {
          method: "DELETE",
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message);
      }

      setItems((prev) => prev.filter((x) => x.id !== id));
      setEditingId(null);
    } catch (err) {
      console.error("Error eliminando política", err);
      alert("Error al eliminar la política");
    }
  };

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
                  <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                    Editar Políticas e Información
                  </h1>
                  <p className="text-verde3 mb-4 text-lg">
                    Gestionar la información que se muestra en la sección de
                    políticas e información.
                  </p>
                </div>

                <button
                  onClick={handleNew}
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
                >
                  <PlusIcon />
                  Nueva Entrada
                </button>
              </div>

              <div className="border-b border-black/20" />
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {loading ? (
                <p className="p-6 text-verde3">Cargando políticas...</p>
              ) : (
                <div className="grid grid-cols-1 p-6 gap-6 w-full">
                  {items.map((it) => (
                    <CardPoliticaAdmin
                      key={it.id}
                      id={it.id}
                      titulo={it.titulo}
                      descripcion={it.descripcion}
                      isEditing={editingId === it.id}
                      onStartEdit={() => setEditingId(it.id)}
                      onCancelEdit={() => setEditingId(null)}
                      onSave={(next) => handleSave(it.id, next)}
                      onDelete={() => handleDelete(it.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
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
