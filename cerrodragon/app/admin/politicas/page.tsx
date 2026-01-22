"use client";

import { useMemo, useState } from "react";
import { SideBarAdmin, TopBar, CardPoliticaAdmin } from "../../components";

type Politica = {
  id: string;
  titulo: string;
  descripcion: string;
};

export default function AdminPoliticasPage() {
  const initial: Politica[] = useMemo(
    () => [
      {
        id: "1",
        titulo: "¿Quiénes Somos?",
        descripcion:
          "En Cerro Dragón Tours trabajamos para ofrecer experiencias turísticas seguras, organizadas y transparentes. Las siguientes políticas y condiciones establecen las reglas generales que rigen el uso de nuestra plataforma, la realización de reservas, los pagos y la participación en nuestros tours. Su objetivo es proteger tanto a nuestros clientes como a la empresa, garantizando una operación clara, ordenada y confiable.",
      },
      {
        id: "2",
        titulo: "Política de Reservas",
        descripcion:
          "Las reservas realizadas a través de la plataforma están sujetas a validación administrativa y disponibilidad operativa. Ninguna reserva se considera confirmada hasta que haya sido aprobada por Cerro Dragón Tours.",
      },
      {
        id: "3",
        titulo: "Política de Pagos",
        descripcion:
          "Todos los pagos deben realizarse mediante los métodos autorizados por la empresa y deben contar con un comprobante válido. La confirmación del servicio depende de la verificación manual del pago por parte del personal administrativo.",
      },
      {
        id: "4",
        titulo: "Política de Cancelaciones",
        descripcion:
          "Las cancelaciones de reservas estarán sujetas a las condiciones y plazos definidos por Cerro Dragón Tours. Las solicitudes fuera de los plazos establecidos podrán no ser elegibles para reembolso.",
      },
      {
        id: "5",
        titulo: "Política de Reembolsos",
        descripcion:
          "Los reembolsos se evaluarán conforme a las políticas vigentes al momento de la reserva y únicamente aplicarán a reservas futuras según las condiciones definidas por la empresa.",
      },
    ],
    []
  );

  const [items, setItems] = useState<Politica[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleNew = () => {
    const newId = `new-${Date.now()}`;
    setItems((prev) => [
      ...prev,
      {
        id: newId,
        titulo: "Ingrese el título",
        descripcion: "Ingrese la descripción",
      },
    ]);
    setEditingId(newId);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    setEditingId((cur) => (cur === id ? null : cur));
  };

  const handleSave = (id: string, next: { titulo: string; descripcion: string }) => {
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
            {/* Header */}
            <div className="flex-shrink-0">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                    Editar Políticas e Información
                  </h1>
                  <p className="text-verde3 mb-4 text-lg">
                    Gestionar la información que se muestra en la sección de políticas e información de la
                    página principal.
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
              <div className="grid grid-cols-1 p-6 gap-6 w-full">
                {items.map((it) => (
                  <CardPoliticaAdmin
                    key={it.id}
                    id={it.id}
                    titulo={it.titulo}
                    descripcion={it.descripcion}
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
