"use client";

import { useMemo, useState } from "react";
import { SideBarAdmin, TopBar, CardIncidenciaAdmin } from "../../components";

type IncTipo = "leve" | "moderado" | "grave" | "critico";

type Incidencia = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  tipo: IncTipo;
};

export default function AdminIncidenciasClimaPage() {
  const initial: Incidencia[] = useMemo(
    () => [
      {
        id: "1",
        titulo: "Fuertes vientos en la zona",
        descripcion:
          "Se esperan ráfagas de viento que podrían afectar la seguridad de los tours al aire libre. Recomendamos a los clientes estar atentos a las actualizaciones y seguir las indicaciones del personal.",
        fecha: "25 de noviembre de 2025",
        tipo: "leve",
      },
      {
        id: "2",
        titulo: "Lluvia torrencial prevista",
        descripcion:
          "Se pronostica lluvia intensa para las próximas 6 horas. Todos los tours programados para hoy han sido suspendidos por motivos de seguridad. Contacte con nuestro personal para reprogramar.",
        fecha: "26 de noviembre de 2025",
        tipo: "critico",
      },
      {
        id: "3",
        titulo: "Temperatura extrema",
        descripcion:
          "Las temperaturas alcanzarán los 38°C durante el mediodía. Se recomienda a los visitantes hidratarse constantemente y evitar la exposición prolongada al sol.",
        fecha: "24 de noviembre de 2025",
        tipo: "grave",
      },
      {
        id: "4",
        titulo: "Cierre temporal del sendero norte",
        descripcion:
          "Debido a trabajos de mantenimiento en el sendero norte, esta ruta permanecerá cerrada hasta nuevo aviso. Los tours han sido redirigidos al sendero sur sin costo adicional.",
        fecha: "23 de noviembre de 2025",
        tipo: "moderado",
      },
    ],
    []
  );

  const [items, setItems] = useState<Incidencia[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleNew = () => {
    const newId = `new-${Date.now()}`;
    setItems((prev) => [
      ...prev,
      {
        id: newId,
        titulo: "Ingrese el título",
        descripcion: "Ingrese la descripción de la alerta",
        fecha: "Ingrese la fecha",
        tipo: "leve",
      },
    ]);
    setEditingId(newId);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    setEditingId((cur) => (cur === id ? null : cur));
  };

  const handleSave = (
    id: string,
    next: { titulo: string; descripcion: string; fecha: string; tipo: IncTipo }
  ) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...next } : x)));
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
            <div className="flex-shrink-0">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-3xl font-bold mb-1 text-black mt-4">
                    Alertas de Clima e Incidencias
                  </h3>
                  <p className="text-verde3 mb-4 text-md">
                    Edite las alertas o agregue nuevas alertas de clima e
                    incidencias que puedan afectar las actividades en Cerro
                    Dragón.
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

            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="grid grid-cols-1 p-6 gap-6">
                {items.map((it) => (
                  <CardIncidenciaAdmin
                    key={it.id}
                    id={it.id}
                    titulo={it.titulo}
                    descripcion={it.descripcion}
                    fecha={it.fecha}
                    tipo={it.tipo}
                    isEditing={editingId === it.id}
                    onStartEdit={() => handleStartEdit(it.id)}
                    onCancelEdit={handleCancelEdit}
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
