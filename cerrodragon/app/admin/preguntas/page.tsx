"use client";

import { useMemo, useState } from "react";
import { SideBarAdmin, TopBar, CardFAQAdmin } from "../../components";

type FAQ = {
  id: string;
  pregunta: string;
  respuesta: string;
};

export default function AdminPreguntasFrecuentesPage() {
  const initialFaqs: FAQ[] = useMemo(
    () => [
      {
        id: "1",
        pregunta: "¿Se pueden llevar mascotas?",
        respuesta:
          "Claro que se pueden llevar mascotas, siempre y cuando lleven sus respectivas correas y/o bozales de ser necesario",
      },
      {
        id: "2",
        pregunta: "¿Hay actividades para los niños?",
        respuesta: "Claro que sí, que caminen",
      },
      {
        id: "3",
        pregunta: "¿Es bonito?",
        respuesta: "Sí",
      },
    ],
    []
  );

  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleNew = () => {
    const newId = `new-${Date.now()}`;
    setFaqs((prev) => [
      ...prev,
      { id: newId, pregunta: "Ingrese la nueva pregunta", respuesta: "Ingrese la respuesta a la pregunta" },
    ]);
    setEditingId(newId);
  };

  const handleDelete = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    setEditingId((cur) => (cur === id ? null : cur));
  };

  const handleSave = (id: string, next: { pregunta: string; respuesta: string }) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, pregunta: next.pregunta, respuesta: next.respuesta } : f))
    );
    setEditingId(null);
  };

  const handleStartEdit = (id: string) => setEditingId(id);
  const handleCancelEdit = () => setEditingId(null);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarAdmin />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0">
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

            {/* Cards grid */}
            <div className="flex-1 overflow-y-auto min-h-0">
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
