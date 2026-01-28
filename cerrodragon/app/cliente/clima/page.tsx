"use client";

import { useEffect, useState } from "react";
import { CardIncidencia, SideBarClient, TopBar } from "@/app/components";

const API_URL = "http://localhost:3000";

/* =========================
   TYPES
========================= */

type IncTipo = "leve" | "moderado" | "grave" | "critico";

type IncidenciaAPI = {
  id: string;
  title: string | null;
  message: string | null;
  date: string | null;
  level: IncTipo | null;
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

export default function Clima() {
  const [items, setItems] = useState<IncidenciaUI[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH ACTIVE WEATHER
  ========================== */

  useEffect(() => {
    const fetchClima = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/others/weather`);
        if (!res.ok) throw new Error("Error cargando alertas");

        const json = await res.json();

        const mapped: IncidenciaUI[] = (json.data as IncidenciaAPI[]).map(
          (i) => ({
            id: i.id,
            titulo: i.title ?? "",
            descripcion: i.message ?? "",
            fecha: i.date ?? "",
            tipo: i.level ?? "leve",
          })
        );

        setItems(mapped);
      } catch (err) {
        console.error("Error cargando clima:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClima();
  }, []);

  /* =========================
     RENDER
  ========================== */

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarClient />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            {/* Header */}
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                Alertas de Clima e Incidencias
              </h1>
              <p className="mb-4 text-verde3">
                Cuando hay alguna alerta es posible que se cancelen o reasignen
                los tours programados
              </p>
              <hr className="border-1 border-borde1 my-4 w-full" />
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="grid grid-cols-1 p-6 gap-6">
                {loading ? (
                  <p className="text-verde3 text-lg">
                    Cargando alertas de clima...
                  </p>
                ) : items.length === 0 ? (
                  <p className="text-verde3 text-lg">
                    No hay alertas activas en este momento.
                  </p>
                ) : (
                  items.map((it) => (
                    <CardIncidencia
                      key={it.id}
                      titulo={it.titulo}
                      descripcion={it.descripcion}
                      fecha={it.fecha}
                      tipo={it.tipo}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
