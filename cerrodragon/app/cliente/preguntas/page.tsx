"use client";

import { SideBarClient, TopBar, CardFAQ } from "../../components";

export default function PreguntasFrecuentes() {
  // Dummy data (swap with API later)
  const faqs = [
    {
      id: 1,
      pregunta: "¿Se pueden llevar mascotas?",
      respuesta:
        "Claro que sí pueden llevar mascotas, siempre y cuando sean responsivas para comer y jugar.",
    },
    {
      id: 2,
      pregunta: "¿Hay actividades para los niños?",
      respuesta: "Claro que sí, que caminen.",
    },
    {
      id: 3,
      pregunta: "¿Es bonito?",
      respuesta: "Sí",
    },
  ];

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarClient />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            {/* Header */}
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                Preguntas Frecuentes
              </h1>
              <p className="text-verde3 mb-4 text-lg">
                Preguntas interesantes que nos han hecho nuestros clientes
              </p>
              <div className="border-b border-black/20" />
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                {faqs.map((f) => (
                  <CardFAQ key={f.id} pregunta={f.pregunta} respuesta={f.respuesta} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
