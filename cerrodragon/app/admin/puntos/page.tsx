"use client";
import {
  CardPuntoAdmin,
  SideBarAdmin,
  TopBar,
} from "@/app/components";
import Link from "next/link";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000";

/* =====================
   TYPES
===================== */

interface PuntoAPI {
  id: number;
  name: string;
  description: string | null;
  link: string | null;
  image_url: string | null;
  is_active: boolean;
}

interface PuntoUI {
  id: number;
  nombre: string;
  ubicacion: string;
  direccion: string;
  activo: boolean;
  imagen: string;
}

/* =====================
   PAGE
===================== */

export default function PuntosAdmin() {
  const [puntos, setPuntos] = useState<PuntoUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =====================
     FETCH PUNTOS
  ===================== */
  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/others/meeting-points`);

        if (!res.ok) {
          throw new Error("Error cargando puntos de encuentro");
        }

        const json = await res.json();

        const mapped: PuntoUI[] = (json.data as PuntoAPI[]).map(
          (p) => ({
            id: p.id,
            nombre: p.name,
            direccion: p.description ?? "Sin descripción",
            ubicacion: p.link ?? "#",
            activo: p.is_active,
            imagen: p.image_url ?? "/punto1.png",
          })
        );

        setPuntos(mapped);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Error cargando puntos de encuentro"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPuntos();
  }, []);

  const handleDeletePunto = async (id: number) => {
    const confirm = window.confirm(
        "¿Está seguro de que desea eliminar este punto de encuentro?"
    );

    if (!confirm) return;

    try {
        const res = await fetch(
        `${API_URL}/others/meeting-points/${id}`,
        {
            method: "DELETE",
        }
        );

        if (!res.ok) {
        throw new Error("Error al eliminar el punto");
        }

        // Actualizar UI sin recargar
        setPuntos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
        console.error(err);
        alert(
        err instanceof Error
            ? err.message
            : "Error eliminando el punto"
        );
    }
    };


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
                  Puntos de encuentro
                </h1>
                <p className="mb-4 text-verde3">
                  Coloque los puntos destinados a encuentro
                </p>
              </div>

              <div className="flex justify-end my-2">
                <Link href="/admin/puntos/new">
                  <button className="flex justify-center items-center bg-verde2 text-white px-4 py-2 rounded-lg gap-4">
                    <svg
                      className="w-6 h-6 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Nuevo Punto
                  </button>
                </Link>
              </div>
            </div>

            <hr className="border-1 border-borde1 w-full mt-1 mb-4" />

            {/* Scrollable puntos */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-verde3 text-lg">
                    Cargando puntos de encuentro...
                  </p>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-red-500 text-lg">{error}</p>
                </div>
              ) : puntos.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500 text-lg">
                    No hay puntos de encuentro registrados
                  </p>
                </div>
              ) : (
                <div className="flex gap-12 p-6 flex-wrap">
                  {puntos.map((punto) => (
                    <CardPuntoAdmin
                      key={punto.id}
                      id={punto.id}
                      nombre={punto.nombre}
                      direccion={punto.direccion}
                      ubicacion={punto.ubicacion}
                      imagen={punto.imagen}
                      onDelete={handleDeletePunto}
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
