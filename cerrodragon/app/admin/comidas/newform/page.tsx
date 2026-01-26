"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SideBarAdmin, TopBar } from "@/app/components";

const API_URL = "http://localhost:3000";

type StoredUser = {
  id: string;
  email: string;
  type: string;
  customer_id: string | null;
  full_name: string | null;
};

export default function NuevoComidaForm() {
  const [reservationId, setReservationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reservationId.trim()) {
      setError("Debe ingresar el ID de la reservación");
      return;
    }

    const rawUser = localStorage.getItem("user");
    if (!rawUser) {
      setError("No se encontró información del usuario");
      return;
    }

    const user = JSON.parse(rawUser) as StoredUser;

    if (!user.email) {
      setError("No se pudo obtener el email del usuario");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/foods/formularios`, {
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
        const err = await res.json();
        throw new Error(err.message || "Error al crear el formulario");
      }

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Error al crear el formulario");
      }

      router.push("/admin/comidas");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al generar el formulario";
      setError(msg);
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
                Nuevo Formulario de Alimentación
              </h1>
              <p className="mb-8 text-verde3">
                Pegue el ID de la reservación asociada
              </p>
            </div>

            {/* Form */}
            <div className="flex-1 flex justify-start">
              <form onSubmit={handleSubmit} className="min-w-full space-y-4">
                <div>
                  <label
                    htmlFor="reservationId"
                    className="block mb-2.5 text-md font-medium text-black"
                  >
                    ID de la reservación
                  </label>
                  <input
                    id="reservationId"
                    type="text"
                    value={reservationId}
                    onChange={(e) => setReservationId(e.target.value)}
                    placeholder="e.g. 4f1e2c9a-7b2c-4f8e-b9d4-8b6c3c2a9f11"
                    className="block w-full px-3 py-2.5 bg-tabla-header border border-verde1 text-verde1 text-sm rounded-base focus:ring-verde1 focus:border-verde1"
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
                    onClick={() => router.push("/admin/comidas")}
                    className="mt-1 text-verde3 bg-white hover:bg-gray-50 font-medium rounded-xl text-md px-5 py-2.5 border border-verde3"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-1 text-white bg-verde3 hover:bg-verde2 font-medium rounded-xl text-md px-5 py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? "Generando..." : "Generar código de alimentación"}
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
