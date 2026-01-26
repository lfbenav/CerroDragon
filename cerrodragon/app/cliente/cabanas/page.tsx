"use client";
import { useEffect, useState } from "react";
import {
  SideBarClient,
  TopBar,
  CardCabana,
  Cuadro,
} from "../../components";

const API_URL = "http://localhost:3000";

/* =====================
   TYPES
===================== */

interface AccommodationAPI {
  id: number;
  name: string;
  description: string | null;
  capacity: number;
  image_url: string | null;
  status?: string;
}

/* =====================
   PAGE
===================== */

export default function Cabannas() {
  const [cabanas, setCabanas] = useState<AccommodationAPI[]>([]);
  const [loading, setLoading] = useState(true);

  /* =====================
     FETCH ALOJAMIENTOS
  ===================== */
  useEffect(() => {
    const fetchCabanas = async () => {
      try {
        const res = await fetch(`${API_URL}/accomodations`);

        if (!res.ok) {
          throw new Error("Error cargando alojamientos");
        }

        const json = await res.json();
        setCabanas(json.data);
      } catch (err) {
        console.error("Error cargando cabañas", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCabanas();
  }, []);

  const total = cabanas.length;

  const disponibles = cabanas.filter(
    (c) => c.status !== "OCCUPIED"
  ).length;

  /* =====================
     RENDER
  ===================== */
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
                Alojamientos
              </h1>
              <p className="mb-8 text-verde3">
                Reserve una cabina para su estadía en Cerro Dragón
              </p>

              <div className="mb-6 flex space-x-4">
                <Cuadro texto="Cabañas Totales" cantidad={total} />
                <Cuadro texto="Cabañas Disponibles" cantidad={disponibles} />
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {loading ? (
                <p className="text-verde3 p-6">
                  Cargando alojamientos...
                </p>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6">
                  {cabanas.map((c) => (
                    <CardCabana
                      key={c.id}
                      id={c.id}
                      nombre={c.name}
                      descripcion={c.description ?? "Sin descripción"}
                      imagen={c.image_url ?? "/tour3.png"}
                      capacidad={c.capacity}
                      etiqueta={
                        c.status === "OCCUPIED"
                          ? "Ocupado"
                          : "Disponible"
                      }
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
