"use client";

import { useCallback, useEffect, useState } from "react";
import { TopBar, TablaFormsComidas, SideBarAdmin } from "@/app/components";
import Link from "next/link";

const API_URL = "http://localhost:3000";

type ComidaFormRow = {
  id: string; // XV-502 (code)
  clienteNombre: string;
  clienteEmail: string;
  tour: string;
  fecha: string;
  registros: number;
  reservaAsociada: string;
  isActive?: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export default function ComidasAdmin() {
  const [comidas, setComidas] = useState<ComidaFormRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForms = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/foods/formularios`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`, // si luego lo protegés
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Error al cargar formularios (${res.status})`);
      }

      const json = (await res.json()) as ApiResponse<ComidaFormRow[]>;

      if (!json.success) {
        throw new Error(json.message || "Error al cargar formularios");
      }

      setComidas(json.data);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Error al cargar formularios";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

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
                    <p className="text-sm text-verde3 mt-1">
                      Cargando formularios...
                    </p>
                  )}

                  {!loading && error && (
                    <div className="text-sm text-rojosuave flex items-center gap-3 mt-1">
                      <span>{error}</span>
                      <button
                        onClick={fetchForms}
                        className="px-3 py-1 rounded-md bg-gray-200 text-black hover:bg-gray-300 transition-colors"
                      >
                        Reintentar
                      </button>
                    </div>
                  )}
                </div>

                <Link href={"/admin/comidas/newform"}>
                  <button className="rounded-lg flex items-center justify-center gap-2 mt-1 py-2 px-4 text-white bg-verde3 hover:bg-verde2">
                    <svg
                      className="w-6 h-6 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 9h6m-6 3h6m-6 3h6M6.996 9h.01m-.01 3h.01m-.01 3h.01M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                      />
                    </svg>
                    Nuevo Formulario
                  </button>
                </Link>
              </div>
              <hr className="border-1 border-borde1 w-full" />
            </div>

            {/* Tabla */}
            <TablaFormsComidas comidas={comidas} />

            <div className="flex justify-end">
              <Link href="/admin/comidas/gestion">
                <button className="flex rounded-lg items-center justify-center gap-2 mt-1 py-2 px-4 text-white bg-verde3 hover:bg-verde2 mb-6">
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth={2}
                      d="M6 4v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2m6-16v2m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v10m6-16v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2"
                    />
                  </svg>
                  Gestionar comidas
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
