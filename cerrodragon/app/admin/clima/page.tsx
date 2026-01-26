"use client";

import { useEffect, useState } from "react";
import { SideBarAdmin, TopBar, CardIncidenciaAdmin } from "../../components";

const API_URL = "http://localhost:3000";

/* =========================
   TYPES
========================= */

type IncTipo = "leve" | "moderado" | "grave" | "critico";

type IncidenciaAPI = {
  id: string;
  title: string | null;
  message: string | null;
  level: IncTipo | null;
  date: string | null;
};

type IncidenciaUI = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  tipo: IncTipo;
};

/* =========================
   PAGE
========================= */

export default function AdminIncidenciasClimaPage() {
  const [items, setItems] = useState<IncidenciaUI[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH
  ========================== */

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/others/weather`);
        if (!res.ok) throw new Error("Error cargando incidencias");

        const json = await res.json();

        const mapped: IncidenciaUI[] = (json.data as IncidenciaAPI[]).map(
          (i) => ({
            id: i.id,
            titulo: i.title ?? "",
            descripcion: i.message ?? "",
            tipo: i.level ?? "leve",
            fecha: i.date ?? "",
          })
        );

        setItems(mapped);
      } catch (err) {
        console.error("Error cargando incidencias:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidencias();
  }, []);

  /* =========================
     ACTIONS
  ========================== */

  const handleNew = async () => {
    const todayText = new Date().toLocaleDateString("es-CR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const res = await fetch(`${API_URL}/others/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Nueva alerta",
        message: "Descripción de la alerta",
        level: "leve",
        date: todayText, // 👈 fecha texto válida
      }),
    });

    if (!res.ok) {
      console.error("Error creando alerta");
      return;
    }

    const json = await res.json();

    const newItem: IncidenciaUI = {
      id: json.data.id,
      titulo: json.data.title ?? "",
      descripcion: json.data.message ?? "",
      tipo: json.data.level ?? "leve",
      fecha: json.data.date ?? todayText,
    };

    setItems((prev) => [...prev, newItem]);
    setEditingId(newItem.id);
  };

  const handleSave = async (
    id: string,
    next: { titulo: string; descripcion: string; tipo: IncTipo }
  ) => {
    await fetch(`${API_URL}/others/weather/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: next.titulo,
        message: next.descripcion,
        level: next.tipo,
      }),
    });

    setItems((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              titulo: next.titulo,
              descripcion: next.descripcion,
              tipo: next.tipo,
            }
          : x
      )
    );

    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API_URL}/others/weather/${id}`, {
      method: "DELETE",
    });

    setItems((prev) => prev.filter((x) => x.id !== id));
    setEditingId(null);
  };

  /* =========================
     RENDER
  ========================== */

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
                    Alertas de Clima e Incidencias
                  </h3>
                  <p className="text-verde3 mb-4 text-md">
                    Edite o agregue alertas que puedan afectar las actividades.
                  </p>
                </div>

                <button
                  onClick={handleNew}
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
                >
                  <PlusIcon />
                  Nueva Alerta
                </button>
              </div>

              <div className="border-b border-black/20" />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="grid grid-cols-1 p-6 gap-6">
                {!loading &&
                  items.map((it) => (
                    <CardIncidenciaAdmin
                      key={it.id}
                      id={it.id}
                      titulo={it.titulo}
                      descripcion={it.descripcion}
                      fecha={it.fecha}
                      tipo={it.tipo}
                      isEditing={editingId === it.id}
                      onStartEdit={() => setEditingId(it.id)}
                      onCancelEdit={() => setEditingId(null)}
                      onSave={(next) => handleSave(it.id, next)}
                      onDelete={() => handleDelete(it.id)}
                    />
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================
   ICON
========================= */

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
