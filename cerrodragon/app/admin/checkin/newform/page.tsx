"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SideBarAdmin, TopBar } from "@/app/components";

const API_URL = "http://localhost:3000";

type StoredUser = {
  id: string;
  email: string;
  type: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export default function NuevoCheckinForm() {
  const [reservationId, setReservationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reservationId.trim()) {
      setError("Debe ingresar el ID de la reservación");
      return;
    }

    const rawUser = localStorage.getItem("user");
    if (!rawUser) {
      setError("Usuario no autenticado");
      return;
    }

    const user = JSON.parse(rawUser) as StoredUser;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/checkin/formularios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservation_id: reservationId.trim(),
          responsible_name: user.email,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error al crear formulario");
      }

      const json = (await res.json()) as ApiResponse<unknown>;

      if (!json.success) {
        throw new Error(json.message || "Error al crear formulario");
      }

      router.push("/admin/checkin");
    } catch (err) {
      setError("Error al generar el formulario");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarAdmin />
      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                Nuevo Formulario de Check In
              </h1>
              <p className="mb-8 text-verde3">Complete la información</p>
            </div>

            {/* Form */}
            <div className="flex-1 flex justify-start">
              <form onSubmit={handleSubmit} className="min-w-full space-y-4">
                <div>
                  <label
                    htmlFor="reservation_id"
                    className="block mb-2.5 text-md font-medium text-black"
                  >
                    ID de la reservación
                  </label>
                  <input
                    id="reservation_id"
                    type="text"
                    value={reservationId}
                    onChange={(e) => setReservationId(e.target.value)}
                    className="bg-tabla-header border border-borde1 text-black text-sm 
                    rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                    shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                    placeholder="UUID de la reservación"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm font-medium">
                    {error}
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => router.push("/admin/checkin")}
                    className="mt-1 text-verde3 bg-white hover:bg-gray-50 font-medium rounded-xl 
                    text-md px-5 py-2.5 text-center border border-verde3"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-1 text-white bg-verde3 hover:bg-verde2 font-medium rounded-xl 
                    text-md px-5 py-2.5 text-center flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Generando...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-6 h-6"
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
                        Generar código de check in
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
