"use client";

import { useEffect, useState } from "react";
import { CardPolitica, SideBarClient, TopBar } from "@/app/components";

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
};

export default function Politicas() {
  const [items, setItems] = useState<Politica[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH POLÍTICAS (CLIENTE)
  ========================== */
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await fetch(`${API_URL}/others/policies`);
        const json = await res.json();

        if (res.ok) {
          const mapped: Politica[] = json.data
            .filter((p: PolicyAPI) => p.is_active !== false)
            .map((p: PolicyAPI) => ({
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

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarClient />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            {/* Fixed header section */}
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                Políticas de la empresa
              </h1>
              <p className="mb-4 text-verde3">
                Políticas, condiciones e información general de Cerro Dragón Tours
              </p>
              <hr className="border-1 border-borde1 my-4 w-full" />
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="grid grid-cols-1 p-6">
                {loading ? (
                  <p className="text-verde3">Cargando políticas...</p>
                ) : items.length === 0 ? (
                  <p className="text-verde3">
                    No hay políticas disponibles
                  </p>
                ) : (
                  items.map((p) => (
                    <CardPolitica
                      key={p.id}
                      titulo={p.titulo}
                      descripcion={p.descripcion}
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
