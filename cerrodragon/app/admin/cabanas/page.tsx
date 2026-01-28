"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SideBarAdmin,
  TopBar,
  CardCabanaAdmin,
  Cuadro,
} from "../../components";
import Link from "next/link";

const API_URL = "http://localhost:3000";

/* =====================
   TYPES
===================== */

interface CabanaAPI {
  id: number;
  name: string;
  description: string | null;
  capacity: number;
  image_url: string | null;
  status: string | null;
  is_active: boolean;
}

/* =====================
   PAGE
===================== */

export default function Cabannas() {
  const [cabanas, setCabanas] = useState<CabanaAPI[]>([]);
  const [loading, setLoading] = useState(true);

  /* =====================
     FETCH CABANAS
  ===================== */
  useEffect(() => {
    const fetchCabanas = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await fetch(`${API_URL}/accomodations/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error cargando cabañas");

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

  /* =====================
     STATS
  ===================== */
  const totalCabanas = cabanas.length;

  const disponibles = useMemo(
    () =>
      cabanas.filter(
        (c) => c.status === "AVAILABLE" || c.status === "Disponible"
      ).length,
    [cabanas]
  );

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
            <div className="flex-shrink-0 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                  Gestión de Alojamientos
                </h1>
                <p className="mb-8 text-verde3">
                  Administra cabañas del local
                </p>
                <hr className="border-1 border-borde1 mt-4 mb-12 w-full" />
              </div>

              <div className="flex justify-end mb-4">
                <Link href="/admin/alojamientos">
                  <button className="bg-verde3 text-white px-4 py-2 mr-4 rounded-lg hover:bg-verde2 transition flex items-center">
                    <svg
                      className="w-4 h-4 ml-2 mr-2"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    Reservas
                  </button>
                </Link>

                <Link href="/admin/cabanas/crear">
                  <button className="bg-verde3 text-white px-4 py-2 rounded-lg hover:bg-verde2 transition flex items-center">
                    <PlusIcon />
                    Agregar
                  </button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-shrink-0">
              <div className="mb-6 flex space-x-4">
                <Cuadro texto="Cabañas Totales" cantidad={totalCabanas} />
                <Cuadro texto="Cabañas Disponibles" cantidad={disponibles} />
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {loading ? (
                <p className="text-verde3 p-6">Cargando cabañas...</p>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6">
                  {cabanas.map((c) => (
                    <CardCabanaAdmin
                      key={c.id}
                      id={c.id}
                      nombre={c.name}
                      descripcion={c.description ?? ""}
                      imagen={c.image_url ?? "/tour3.png"}
                      capacidad={c.capacity}
                      etiqueta={
                        c.status === "AVAILABLE"
                          ? "Disponible"
                          : c.status === "OCCUPIED"
                          ? "Ocupado"
                          : "Todos"
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

/* =====================
   ICON
===================== */

function PlusIcon() {
  return (
    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
