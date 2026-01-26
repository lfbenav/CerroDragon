"use client";
import {
  CardPunto,
  SideBarClient,
  TopBar,
  WhatsAppButton,
} from "@/app/components";
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
  imagen: string;
}

/* =====================
   PAGE
===================== */

export default function Puntos() {
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

        const activos: PuntoUI[] = (json.data as PuntoAPI[])
          .filter((p) => p.is_active)
          .map((p) => ({
            id: p.id,
            nombre: p.name,
            direccion: p.description ?? "Sin descripción",
            ubicacion: p.link ?? "#",
            imagen: p.image_url ?? "/punto1.png",
          }));

        setPuntos(activos);
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
            <div className="flex-shrink-0 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                  Puntos de encuentro
                </h1>
                <p className="mb-4 text-verde3">
                  Le ofrecemos transporte desde estos puntos estratégicos.
                </p>
                <hr className="border-1 border-borde1 my-4" />
              </div>

              <div className="flex justify-end mb-4">
                <WhatsAppButton />
              </div>
            </div>

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
                    No hay puntos de encuentro disponibles
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-12 p-6">
                  {puntos.map((punto) => (
                    <CardPunto
                      key={punto.id}
                      nombre={punto.nombre}
                      direccion={punto.direccion}
                      ubicacion={punto.ubicacion}
                      imagen={punto.imagen}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info WhatsApp */}
            <div className="mt-6">
              <p className="text-md text-verde3 mb-6 font-medium">
                Si desea solicitar un servicio de trasbordo en alguno de los
                puntos de encuentro debe enviar un mensaje de WhatsApp con la
                siguiente información:
                <span className="font-bold text-black block mt-4">
                  Nombre del Cliente
                  <br />
                  Identificador de Reserva
                  <br />
                  Solicita transporte desde
                </span>
              </p>

              <h2 className="text-2xl font-bold mb-2 text-black">
                Ejemplo
              </h2>
              <hr className="border-1 border-borde1" />

              <p className="text-md text-verde3 mb-1 font-medium mt-4">
                <span className="font-bold text-black">
                  Nombre del Cliente:{" "}
                  <span className="text-amarillo">Juan Pérez</span>
                  <br />
                  Identificador de Reserva:{" "}
                  <span className="text-amarillo">RV-2345</span>
                  <br />
                  Solicita transporte desde:{" "}
                  <span className="text-amarillo">Uruca</span>
                </span>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
