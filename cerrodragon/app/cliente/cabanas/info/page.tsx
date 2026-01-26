"use client";
import { SideBarClient, TopBar } from "@/app/components";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "http://localhost:3000";

/* =====================
   TYPES
===================== */

interface AccommodationAPI {
  id: number;
  name: string;
  description: string | null;
  capacity: number;
  price: number | null;
  image_url: string | null;
}

/* =====================
   PAGE
===================== */

export default function InfoAlojamiento() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [alojamiento, setAlojamiento] =
    useState<AccommodationAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================
     FETCH ALOJAMIENTO
  ===================== */
  useEffect(() => {
    if (!id) return;

    const fetchAlojamiento = async () => {
      try {
        const res = await fetch(`${API_URL}/accomodations/${id}`);

        if (!res.ok) {
          throw new Error("Error cargando alojamiento");
        }

        const json = await res.json();
        setAlojamiento(json.data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información del alojamiento.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlojamiento();
  }, [id]);

  /* =====================
     LOADING / ERROR
  ===================== */
  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <SideBarClient />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 ml-72 pt-20 px-8">
            <p className="text-verde3">Cargando alojamiento...</p>
          </main>
        </div>
      </div>
    );
  }

  if (error || !alojamiento) {
    return (
      <div className="h-screen bg-gray-50 flex overflow-hidden">
        <SideBarClient />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 ml-72 pt-20 px-8">
            <p className="text-red-500">{error}</p>
          </main>
        </div>
      </div>
    );
  }

  /* =====================
     IMAGE SRC (MISMA LÓGICA QUE EL GRID)
  ===================== */
  const imageSrc = alojamiento.image_url ?? "/tour3.png";

  /* =====================
     RENDER
  ===================== */
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarClient />
      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                    Información del Alojamiento
                  </h1>
                  <p className="mb-4 text-verde3">
                    Información actualizada sobre las cabañas disponibles en Cerro Dragón
                  </p>
                </div>

                <div className="flex justify-end">
                  <Link href={`/cliente/cabanas/reservar?id=${alojamiento.id}`}>
                    <button
                      type="button"
                      className="mt-1 text-white bg-verde3 hover:bg-verde2 font-medium rounded-xl 
                      text-md px-5 py-2.5 text-center flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-6 h-6 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
                        />
                      </svg>
                      ¡Reservar!
                    </button>
                  </Link>
                </div>
              </div>

              <hr className="border-1 border-borde1 my-4 w-full" />
            </div>

            {/* Content */}
            <div className="ml-12 mt-4 mb-4 flex flex-row gap-8">
              <div className="flex-1">
                <h2 className="text-5xl font-serif font-normal mb-6 text-black mt-4">
                  {alojamiento.name}
                </h2>

                <p className="mb-6 text-verde2">
                  {alojamiento.description || "Sin descripción disponible"}
                </p>

                <div className="mb-6">
                  <p className="text-md font-medium text-black mb-4">
                    <span className="text-verde3 font-bold">
                      Capacidad de personas:
                    </span>{" "}
                    {alojamiento.capacity} personas
                  </p>

                  <p className="text-md font-medium text-black">
                    <span className="text-verde3 font-bold">
                      Costo por persona por noche:
                    </span>{" "}
                    ₡ {alojamiento.price ?? 0}
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0">
                <img
                  src={imageSrc}
                  alt={`Imagen de ${alojamiento.name}`}
                  className="rounded-xl mt-2 mr-8 w-[500px] h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
