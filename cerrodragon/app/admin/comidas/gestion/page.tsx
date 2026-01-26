"use client";

import { useCallback, useEffect, useState } from "react";
import { TopBar, TablaComidas, SideBarAdmin } from "@/app/components";
import Link from "next/link";

const API_URL = "http://localhost:3000";

type MealOption = {
  id: string;
  option_name: string;
  is_active: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type TablaComidaRow = {
  id: string;
  nombreComida: string;
  mostrar: boolean;
};

export default function ComidasAdmin() {
  const [comidas, setComidas] = useState<TablaComidaRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ======================
  // FETCH LIST
  // ======================
  const fetchComidas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/foods/comidas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Error al cargar comidas (${res.status})`);
      }

      const json = (await res.json()) as ApiResponse<MealOption[]>;

      if (!json.success) {
        throw new Error(json.message || "Error al cargar comidas");
      }

      const mapped: TablaComidaRow[] = json.data.map((item) => ({
        id: item.id,
        nombreComida: item.option_name,
        mostrar: item.is_active,
      }));

      setComidas(mapped);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al cargar comidas";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComidas();
  }, [fetchComidas]);

  // ======================
  // TOGGLE ACTIVE
  // ======================
  const handleToggle = async (id: string, newValue: boolean) => {
    // optimistic
    setComidas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, mostrar: newValue } : c))
    );

    try {
      const res = await fetch(`${API_URL}/foods/comidas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: newValue }),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar comida");
      }
    } catch (err) {
      console.error(err);
      // revert
      setComidas((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, mostrar: !newValue } : c
        )
      );
    }
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = async (id: string) => {
    const prev = comidas;
    setComidas((curr) => curr.filter((c) => c.id !== id));

    try {
      const res = await fetch(`${API_URL}/foods/comidas/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error al eliminar comida");
      }
    } catch (err) {
      console.error(err);
      setComidas(prev);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarAdmin />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            <div className="flex-shrink-0 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1 text-black">
                    Comidas
                  </h1>
                  <p className="text-verde3">
                    Respuestas al formulario de comidas para tours
                  </p>

                  {loading && (
                    <p className="text-sm text-verde3 mt-2">
                      Cargando comidas...
                    </p>
                  )}
                  {!loading && error && (
                    <p className="text-sm text-rojosuave mt-2">
                      {error}
                    </p>
                  )}
                </div>

                <Link href="/admin/comidas/new">
                  <button className="rounded-lg flex items-center justify-center gap-2 mt-1 py-2 px-4 text-white bg-verde3 hover:bg-verde2">
                    {/* icon intacto */}
                    <svg
                      className="w-6 h-6 text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    Agregar
                  </button>
                </Link>
              </div>
              <hr className="border-1 border-borde1 w-full" />
            </div>

            <TablaComidas
              comidas={comidas}
              onToggleMostrar={handleToggle}
              onEliminar={handleDelete}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
