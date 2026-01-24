"use client";

import { useEffect, useState } from "react";
import {
  SideBarClient,
  TopBar,
  CardTour,
  SearchBar,
} from "../../components";

interface Tour {
  id: number;
  title: string;
  description: string;
  duration_hours: number | null;
  duration_days: number | null;
  max_persons: number;
  price_person: number;
  image_url: string;
}

export default function Tours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH TOURS ACTIVOS
  ========================== */
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch("http://localhost:3000/tours/allActive");
        const json = await res.json();

        if (res.ok) {
          setTours(json.data);
          setFilteredTours(json.data);
        }
      } catch (error) {
        console.error("Error cargando tours", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  /* =========================
     FILTRO SEARCH
  ========================== */
  useEffect(() => {
    const q = search.toLowerCase();

    const filtered = tours.filter(
      (tour) =>
        tour.title.toLowerCase().includes(q) ||
        tour.description.toLowerCase().includes(q)
    );

    setFilteredTours(filtered);
  }, [search, tours]);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarClient />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            {/* Header fijo */}
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                Tours
              </h1>
              <p className="mb-8 text-verde3">
                Viva nuevas experiencias o reviva anteriores!
              </p>

              <SearchBar
                texto="Buscar tour..."
                value={search}
                onChange={setSearch}
              />
            </div>

            {/* Lista de tours */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {loading ? (
                <p className="text-verde3 mt-10">Cargando tours...</p>
              ) : filteredTours.length === 0 ? (
                <p className="text-verde3 mt-10">
                  No se encontraron tours
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-6 p-6">
                  {filteredTours.map((tour) => {
                    const duracion =
                      tour.duration_days
                        ? `${tour.duration_days} día(s)`
                        : `${tour.duration_hours} horas`;

                    return (
                      <CardTour
                        key={tour.id}
                        id={tour.id}
                        nombre={tour.title}
                        descripcion={tour.description}
                        precio={tour.price_person}
                        imagen={tour.image_url}
                        capacidad={tour.max_persons}
                        duracion={duracion}
                        etiqueta="Todos"
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
