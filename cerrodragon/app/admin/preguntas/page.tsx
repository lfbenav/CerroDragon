"use client";

import { useEffect, useState } from "react";
import { SideBarAdmin, TopBar, CardFAQAdmin } from "../../components";

const API_URL = "http://localhost:3000";

/* =====================
   TYPES
===================== */

type FAQ = {
  id: string;
  pregunta: string;
  respuesta: string;
};

/* =====================
   PAGE
===================== */

export default function AdminPreguntasFrecuentesPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* =====================
     FETCH FAQS
  ===================== */
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(`${API_URL}/others/faqs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Error al cargar FAQs");
        }

        const json = await res.json();

        const mapped: FAQ[] = json.data.map((f: any) => ({
          id: f.id,
          pregunta: f.question,
          respuesta: f.answer,
        }));

        setFaqs(mapped);
      } catch (err) {
        console.error(err);
        alert("No se pudieron cargar las preguntas frecuentes");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  /* =====================
     HANDLERS
  ===================== */

  const handleNew = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(`${API_URL}/others/faqs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: "Ingrese la nueva pregunta",
          answer: "Ingrese la respuesta a la pregunta",
        }),
      });

      if (!res.ok) throw new Error();

      const json = await res.json();

      const newFaq: FAQ = {
        id: json.data.id,
        pregunta: json.data.question,
        respuesta: json.data.answer,
      };

      setFaqs((prev) => [...prev, newFaq]);
      setEditingId(newFaq.id);
    } catch (err) {
      alert("No se pudo crear la pregunta");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(`${API_URL}/others/faqs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      setFaqs((prev) => prev.filter((f) => f.id !== id));
      setEditingId((cur) => (cur === id ? null : cur));
    } catch (err) {
      alert("No se pudo eliminar la pregunta");
    }
  };

  const handleSave = async (
    id: string,
    next: { pregunta: string; respuesta: string }
  ) => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(`${API_URL}/others/faqs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: next.pregunta,
          answer: next.respuesta,
        }),
      });

      if (!res.ok) throw new Error();

      setFaqs((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, pregunta: next.pregunta, respuesta: next.respuesta }
            : f
        )
      );
      setEditingId(null);
    } catch (err) {
      alert("No se pudo guardar la pregunta");
    }
  };

  const handleStartEdit = (id: string) => setEditingId(id);
  const handleCancelEdit = () => setEditingId(null);

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
                  <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                    Gestionar Preguntas Frecuentes
                  </h1>
                  <p className="text-verde3 mb-4 text-lg">
                    Edite las preguntas y respuestas o agregue nuevas
                  </p>
                </div>

                <button
                  onClick={handleNew}
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
                >
                  <PlusIcon />
                  Nueva Pregunta
                </button>
              </div>

              <div className="border-b border-black/20" />
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {loading ? (
                <p className="text-verde3 mt-6">Cargando preguntas...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 max-w-3xl">
                  {faqs.map((f) => (
                    <CardFAQAdmin
                      key={f.id}
                      id={f.id}
                      pregunta={f.pregunta}
                      respuesta={f.respuesta}
                      isEditing={editingId === f.id}
                      onStartEdit={() => handleStartEdit(f.id)}
                      onCancelEdit={handleCancelEdit}
                      onSave={(next) => handleSave(f.id, next)}
                      onDelete={() => handleDelete(f.id)}
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

/* =====================
   ICON
===================== */
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
